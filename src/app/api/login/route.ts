import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';
import { LRUCache } from 'lru-cache';

const SECRET_TOKEN = 'Too many requests, please try again later.';

const rateLimit = new LRUCache<string, number>({
  max: 10,
  ttl: 15 * 60 * 1000 
});

const rateLimitMiddleware = (req: any) => {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('remote-addr') || req.connection.remoteAddress;
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
    return NextResponse.json({ message: 'Too many requests, please try again later.' }, { status: 429 });
  }

  const token = req.headers.get('x-secret-token');
  if (token !== SECRET_TOKEN) {
    return NextResponse.json({ message: 'Unauthorized request' }, { status: 401 });
  }

  const { emailOrPhone, password } = await req.json();

  if (!emailOrPhone || !password) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
  }

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({
      $or: [{ email: emailOrPhone }, { phone_number: emailOrPhone }],
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }
 const authToken = generateToken(user);
    const response = NextResponse.json({ token: authToken, user }, { status: 200 });
    response.cookies.set('token', authToken, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 });      
    return response;
  } catch (e: any) {
    console.log(e)
    return NextResponse.json({ message: 'Failed to log in', error: e.message }, { status: 500 });
  }
}
