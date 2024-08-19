import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { LRUCache } from "lru-cache";
import { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongodb";

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

  try {
    const db = await connectToDatabase();
    const classesCollection = db.collection("classes");
    const classes = await classesCollection.find().toArray();

    return NextResponse.json(classes, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch classes", error: error.message },
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

  const {
    name,
    description,
    classID,
    professor,
    admins,
    students,
    isActive,
    startDate,
    endDate,
    day1,
    day2,
    day3,
    day4,
    day5,
    day6,
    day7,
    examDate,
  } = await req.json();

  if (
    !name ||
    !description ||
    !classID ||
    !professor ||
    !admins ||
    !students ||
    isActive === undefined ||
    !startDate ||
    !endDate ||
    !examDate
  ) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    const db = await connectToDatabase();
    const classesCollection = db.collection("classes");

    const existingClass = await classesCollection.findOne({ classID });

    if (existingClass) {
      return NextResponse.json(
        { message: "Class with given ID already exists" },
        { status: 409 }
      );
    }

    const result = await classesCollection.insertOne({
      name,
      description,
      classID,
      professor,
      admins,
      students,
      isActive,
      startDate,
      endDate,
      schedule: {
        day1,
        day2,
        day3,
        day4,
        day5,
        day6,
        day7,
      },
      examDate,
    });

    const classId = result.insertedId;

    const daysOfWeek = [day1, day2, day3, day4, day5, day6, day7];
    const start = new Date(startDate);
    const end = new Date(endDate);

    const activities = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      const classDayIndex = (dayOfWeek + 6) % 7;

      if (daysOfWeek[classDayIndex]) {
        activities.push({
          classId,
          date: new Date(currentDate),
          time: daysOfWeek[classDayIndex],
          presentEnable: false,
          students: [],
          alerts: [], 
          notes: [],  
          exercises: []
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (activities.length > 0) {
      const activitiesCollection = db.collection("activities");
      await activitiesCollection.insertMany(activities);
    }

    return NextResponse.json(
      { insertedId: classId, activityCount: activities.length },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create class", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

  const { id } = params;
  const {
    name,
    description,
    classID,
    professor,
    admins,
    students,
    isActive,
    startDate,
    endDate,
    day1,
    day2,
    day3,
    day4,
    day5,
    day6,
    day7,
    examDate,
  } = await req.json();

  if (
    !id ||
    !name ||
    !description ||
    !classID ||
    !professor ||
    !admins ||
    !students ||
    isActive === undefined ||
    !startDate ||
    !endDate ||
    !examDate
  ) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    const db = await connectToDatabase();
    const classesCollection = db.collection("classes");
    const objectId = new ObjectId(id);

    const result = await classesCollection.updateOne(
      { _id: objectId },
      {
        $set: {
          name,
          description,
          classID,
          professor,
          admins,
          students,
          isActive,
          startDate,
          endDate,
          schedule: {
            day1,
            day2,
            day3,
            day4,
            day5,
            day6,
            day7,
          },
          examDate,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Class updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update class", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: "Class ID is required" },
      { status: 400 }
    );
  }

  try {
    const db = await connectToDatabase();
    const classesCollection = db.collection("classes");
    const objectId = new ObjectId(id);
    const result = await classesCollection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Class deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete class", error: error.message },
      { status: 500 }
    );
  }
}
