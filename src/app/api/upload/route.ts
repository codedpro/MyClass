import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { verify } from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { LRUCache } from "lru-cache";

const uploadDir = join(process.cwd(), "uploads");

const rateLimit = new LRUCache<string, number>({
  max: 100, 
  ttl: 5 * 60 * 1000, 
});

const rateLimitMiddleware = (req: any) => {
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("remote-addr") ||
    req.connection?.remoteAddress;
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

  try {
    const decoded = verify(token, process.env.JWT_SECRET || "your-secret-key") as JwtPayload;
    if (decoded?.role !== "Admin") {
      return { isValid: false, message: "Forbidden: Admins only" };
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, message: "Invalid token" };
  }
};

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

  try {
    await fs.mkdir(uploadDir, { recursive: true });

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    const fileUrls: string[] = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName = `${uuidv4()}-${file.name}`;
      const filePath = join(uploadDir, fileName);

      await fs.writeFile(filePath, buffer);

      const fileUrl = `/uploads/${fileName}`;
      fileUrls.push(fileUrl);
    }

    return NextResponse.json({ urls: fileUrls }, { status: 200 });
  } catch (error: any) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { message: "Failed to upload files", error: error.message },
      { status: 500 }
    );
  }
}
