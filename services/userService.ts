import { connectToDatabase } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

interface User {
    _id: ObjectId;
    name: string;
    family_name: string;
    email: string;
    phone_number: string;
    student_number: string;
}

export class UserService {
    private token: string;
    private userInfo: User | null = null;

    constructor(token: string) {
        this.token = token;
    }

    private async fetchUserInfo(): Promise<void> {
        const decoded = verifyToken(this.token);

        if (!decoded || typeof decoded === 'string') {
            this.userInfo = null;
            return;
        }

        const db = await connectToDatabase();
        const usersCollection = db.collection<User>('users');

        this.userInfo = await usersCollection.findOne({ _id: new ObjectId(decoded.id) });
    }

    public async getUserInfo(): Promise<User | null> {
        if (!this.userInfo) {
            await this.fetchUserInfo();
        }
        return this.userInfo;
    }

    public async getName(): Promise<string | null> {
        const user = await this.getUserInfo();
        return user ? user.name : null;
    }

    public async getFamilyName(): Promise<string | null> {
        const user = await this.getUserInfo();
        return user ? user.family_name : null;
    }

    public async getEmail(): Promise<string | null> {
        const user = await this.getUserInfo();
        return user ? user.email : null;
    }

    public async getPhoneNumber(): Promise<string | null> {
        const user = await this.getUserInfo();
        return user ? user.phone_number : null;
    }

    public async getStudentNumber(): Promise<string | null> {
        const user = await this.getUserInfo();
        return user ? user.student_number : null;
    }
}
