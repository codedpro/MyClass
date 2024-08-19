import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { ClassActivity } from "@/types/ClassActivity";

export async function fetchClassActivity(id: string): Promise<ClassActivity | null> {
  const db = await connectToDatabase();
  const activitiesCollection = db.collection("activities");

  const activity = await activitiesCollection.findOne({ _id: new ObjectId(id) });

  if (!activity) return null;

  return {
    ...activity,
    _id: activity._id.toString(),
    classId: activity.classId?.toString(),
  } as ClassActivity;
}
