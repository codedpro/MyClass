import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { LRUCache } from "lru-cache";
import { ObjectId } from "mongodb";
import { JwtPayload } from "jsonwebtoken";
// Rate limiting setup
const rateLimit = new LRUCache<string, number>({
  max: 100,
  ttl: 5 * 60 * 1000,
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

const checkAdminRole = (req: NextRequest) => {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return { isValid: false, message: "Unauthorized request" };
  }

  const decoded = verifyToken(token);
  if (
    !decoded ||
    (typeof decoded === "object" &&
      "role" in decoded &&
      (decoded as JwtPayload).role !== "Admin")
  ) {
    return { isValid: false, message: "Forbidden: Admins only" };
  }

  return { isValid: true };
};
export async function GET(req: NextRequest) {
    if (!rateLimitMiddleware(req)) {
      return NextResponse.json({ message: "Too many requests, please try again later." }, { status: 429 });
    }
  
    const token = req.headers.get("Authorization")?.split(" ")[1];
    const { classID, date } = req.nextUrl.searchParams;
  
    try {
      const db = await connectToDatabase();
      const activitiesCollection = db.collection("classActivities");
      const activity = await activitiesCollection.findOne({
        _id: new ObjectId(classID),
        date: new Date(date),
      });
  
      if (!activity) {
        return NextResponse.json({ message: "Activity not found" }, { status: 404 });
      }
  
      const decodedToken = verifyToken(token);
      const isAdmin = decodedToken && (decodedToken as JwtPayload).role === "Admin";
  
      if (!isAdmin) {
        activity.students = activity.students.map((student: any) => ({
          id: student.id,
          score: student.Comment,
        }));
      }
  
      return NextResponse.json(activity, { status: 200 });
    } catch (error: any) {
      return NextResponse.json(
        { message: "Failed to fetch class activities", error: error.message },
        { status: 500 }
      );
    }
  }

export async function POST(req: NextRequest) {
  const rateLimitCheck = rateLimitMiddleware(req);
  if (!rateLimitCheck) {
    return NextResponse.json(
      { message: "Too many requests, please try again later." },
      { status: 429 }
    );
  }

  const roleCheck = checkAdminRole(req);
  if (!roleCheck.isValid) {
    return NextResponse.json({ message: roleCheck.message }, { status: 403 });
  }

  const { classID, date, students, alert, note, presentEnable, classExercises } =
    await req.json();

  if (!classID || !date || !students || presentEnable === undefined) {
    return NextResponse.json(
      { message: "All required fields must be filled" },
      { status: 400 }
    );
  }

  try {
    const db = await connectToDatabase();
    const activitiesCollection = db.collection("activities");

    const result = await activitiesCollection.insertOne({
      classID,
      date: new Date(date),
      students,
      alert,
      note,
      presentEnable,
      classExercises,
    });

    return NextResponse.json(
      { insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to add class activity", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const rateLimitCheck = rateLimitMiddleware(req);
  if (!rateLimitCheck) {
    return NextResponse.json(
      { message: "Too many requests, please try again later." },
      { status: 429 }
    );
  }

  const roleCheck = checkAdminRole(req);
  if (!roleCheck.isValid) {
    return NextResponse.json({ message: roleCheck.message }, { status: 403 });
  }

  const { id, classID, date, students, alert, note, presentEnable, classExercises } =
    await req.json();

  if (!id || !classID || !date || !students || presentEnable === undefined) {
    return NextResponse.json(
      { message: "All required fields must be filled" },
      { status: 400 }
    );
  }

  try {
    const db = await connectToDatabase();
    const activitiesCollection = db.collection("classActivities");
    const objectId = new ObjectId(id);

    const result = await activitiesCollection.updateOne(
      { _id: objectId },
      {
        $set: {
          classID,
          date: new Date(date),
          students,
          alert,
          note,
          presentEnable,
          classExercises,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Activity not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Class activity updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update class activity", error: error.message },
      { status: 500 }
    );
  }
}
