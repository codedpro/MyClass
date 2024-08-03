import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { hashPassword, verifyToken } from "@/lib/auth";
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
  console.log(token);
  if (!token) {
    return { isValid: false, message: "Unauthorized request" };
  }

  const decoded = verifyToken(token);
  console.log(decoded);
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
    const usersCollection = db.collection("users");
    const users = await usersCollection.find().toArray();

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch users", error: error.message },
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
    family_name,
    email,
    student_number,
    password,
    usertype,
    role,
    profile,
  } = await req.json();

  if (
    !name ||
    !family_name ||
    !email ||
    !student_number ||
    !password ||
    !usertype ||
    !role ||
    !profile
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
      $or: [{ email }, { student_number }],
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with given email or student number already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const result = await usersCollection.insertOne({
      name,
      family_name,
      email,
      student_number,
      password: hashedPassword,
      isActive: true,
      usertype,
      role,
      profile: profile,
    });

    return NextResponse.json(
      { insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create user", error: error.message },
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
    family_name,
    email,
    student_number,
    isActive,
    usertype,
    role,
    profile,
  } = await req.json();

  if (
    !id ||
    !name ||
    !family_name ||
    !email ||
    !student_number ||
    !usertype ||
    !role ||
    !profile
  ) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");
    const objectId = new ObjectId(id);

    const result = await usersCollection.updateOne(
      { _id: objectId },
      {
        $set: {
          name,
          family_name,
          email,
          student_number,
          isActive,
          usertype,
          role,
          profile,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update user", error: error.message },
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
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");
    const objectId = new ObjectId(id);
    const result = await usersCollection.deleteOne({ _id: objectId });
    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 403 });
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete user", error: error.message },
      { status: 500 }
    );
  }
}
