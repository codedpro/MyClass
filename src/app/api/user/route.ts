import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/services/userService';
export async function GET(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userService = new UserService();
    const userInfo = await userService.getUserInfo();

    if (!userInfo) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
        name: userInfo.name,
        family_name: userInfo.family_name,
        email: userInfo.email,
        phone_number: userInfo.phone_number,
        student_number: userInfo.student_number,
    }, { status: 200 });
}
