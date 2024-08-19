import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { JwtPayload } from "jsonwebtoken";
import { LRUCache } from "lru-cache";

// Rate limiting setup
const rateLimit = new LRUCache<string, number>({
  max: 100,
  ttl: 5 * 60 * 1000, // 5 minutes
});

const rateLimitMiddleware = (req: any) => {
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("remote-addr") ||
    req.connection.remoteAddress;
  if (!ip) {
    return false;
  }

  const hits = rateLimit.get(ip) || 0;

  if (hits >= 10) {
    return false;
  }

  rateLimit.set(ip, hits + 1);
  return true;
};

const checkUserRole = (req: NextRequest) => {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return { isValid: false, message: "Unauthorized request" };
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return { isValid: false, message: "Forbidden: Invalid token" };
  }

  return { isValid: true, decoded };
};

export async function POST(req: NextRequest) {
  if (!rateLimitMiddleware(req)) {
    return NextResponse.json(
      { message: "Too many requests, please try again later." },
      { status: 429 }
    );
  }

  const roleCheck = checkUserRole(req);
  if (!roleCheck.isValid) {
    return NextResponse.json({ message: roleCheck.message }, { status: 403 });
  }

  const { decoded } = roleCheck;
  const { classId, file, studentId } = await req.json();

  if (!classId || !studentId || !file) {
    return NextResponse.json(
      { message: "Class ID, Student ID, and file are required" },
      { status: 400 }
    );
  }

  if ((decoded as JwtPayload).id !== studentId) {
    return NextResponse.json(
      { message: "You are not authorized to upload for this student" },
      { status: 403 }
    );
  }

  try {
    const db = await connectToDatabase();
    const activitiesCollection = db.collection("activities");

    const objectIdClassId = new ObjectId(classId);

    const activity = await activitiesCollection.findOne({
      _id: objectIdClassId,
    });

    if (!activity) {
      return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }

    const studentExists = activity.students?.some(
      (student) => student.studentId === studentId
    );

    if (!studentExists) {
      return NextResponse.json(
        { message: "Student not found in this class" },
        { status: 404 }
      );
    }

    // Example: Save the file to the file system or a cloud storage service like AWS S3, and get the URL
    // Here, we are simulating saving and getting a URL
    const fileUrl = `https://yourstorage.com/path/to/${file.name}`; // Replace with actual file upload logic

    // Update the activity document with the new exercise information for the student
    const result = await activitiesCollection.updateOne(
      { _id: objectIdClassId, "students.studentId": studentId },
      {
        $push: {
          "students.$.exercises": {
            exerciseID: new ObjectId().toString(),
            answer: "Uploaded exercise",
            attachedFilesUrl: fileUrl,
          },
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Failed to upload exercise" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Exercise uploaded successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Upload exercise error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
