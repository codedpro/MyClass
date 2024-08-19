import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const formData = await req.formData();
  const classId = formData.get("classId") as string;
  const file = formData.get("file") as File;
  console.log(classId, file)
  if (!classId || !file) {
    return NextResponse.json(
      { message: "Class ID and file are required" },
      { status: 400 }
    );
  }

  const db = await connectToDatabase();
  const activitiesCollection = db.collection("activities");

  try {
    const objectIdClassId = new ObjectId(classId);

    const activity = await activitiesCollection.findOne({
      _id: objectIdClassId,
    });

    if (!activity) {
      return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }

    // Example: Save the file to the file system or a cloud storage service like AWS S3, and get the URL
    // Here, we are simulating saving and getting a URL
    const fileUrl = `https://yourstorage.com/path/to/${file.name}`; // Replace with actual file upload logic

    // Update the activity document with the new file information
    const result = await activitiesCollection.updateOne(
      { _id: objectIdClassId },
      {
        $push: {
          classExercises: {
            exerciseID: new ObjectId().toString(),
            title: file.name,
            description: "Uploaded assignment",
            attachedFilesUrl: fileUrl,
          },
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Failed to upload assignment" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Assignment uploaded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload assignment error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
