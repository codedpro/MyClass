import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { checkAdminRole, rateLimitMiddleware } from "@/lib/middleware"; // Assuming you refactor these into a middleware module

export async function GET(
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

    const classData = await classesCollection.findOne({ _id: objectId });

    if (!classData) {
      return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }

    return NextResponse.json(classData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch class data", error: error.message },
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
