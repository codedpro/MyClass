import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { LRUCache } from "lru-cache";

const SECRET_TOKEN = "Too many requests, please try again later.";

const rateLimit = new LRUCache<string, number>({
  max: 10,
  ttl: 15 * 60 * 1000,
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

export async function POST(req: NextRequest) {
  if (!rateLimitMiddleware(req)) {
    return NextResponse.json(
      { message: "Too many requests, please try again later." },
      { status: 429 }
    );
  }

  const token = req.headers.get("x-secret-token");
  if (token !== SECRET_TOKEN) {
    return NextResponse.json(
      { message: "Unauthorized request" },
      { status: 401 }
    );
  }

  const { name, familyName, email, phoneNumber, password, student_number } =
    await req.json();

  if (
    !name ||
    !familyName ||
    !email ||
    !phoneNumber ||
    !password ||
    !student_number
  ) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({
      $or: [
        { email: email },
        { phone_number: phoneNumber },
        { student_number: student_number },
      ],
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message:
            "User with given email, phone number, or student number already exists",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const result = await usersCollection.insertOne({
      name,
      family_name: familyName,
      email,
      phone_number: phoneNumber,
      password: hashedPassword,
      student_number: student_number,
      isActive: true,
      role: "Student",
      usertype: "Normal",
      profile: "/images/user/user-03.png",
    });

    return NextResponse.json(
      { insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (e: any) {
    console.log(e);
    return NextResponse.json(
      { message: "Failed to register user", error: e.message },
      { status: 500 }
    );
  }
}
