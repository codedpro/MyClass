import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const { classId, studentId } = await req.json();

  if (!classId || !studentId) {
    return NextResponse.json(
      { message: "Class ID and Student ID are required" },
      { status: 400 }
    );
  }

  const db = await connectToDatabase();
  const activitiesCollection = db.collection("activities");

  try {
    const objectIdClassId = new ObjectId(classId);
    console.log(objectIdClassId);
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
      await activitiesCollection.updateOne(
        { _id: objectIdClassId },
        {
          $push: {
            students: {
              studentId,
              score: 0,
              comment: "",
              exercises: [],
            },
          },
        }
      );
    }

    const result = await activitiesCollection.updateOne(
      { _id: objectIdClassId, "students.studentId": studentId },
      { $set: { "students.$.present": true } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Failed to mark student as present" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Student marked as present" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
