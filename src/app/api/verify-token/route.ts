import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.json({ message: 'No token provided' }, { status: 404 });
    }

    const user = verifyToken(token);

    if (!user) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({ user }, { status: 200 });
}
