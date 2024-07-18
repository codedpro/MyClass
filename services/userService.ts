import Cookies from 'js-cookie';

interface User {
  _id: string;
  name: string;
  family_name: string;
  email: string;
  phone_number: string;
  student_number: string;
}

export class UserService {
  private userInfo: User | null = null;

  constructor() {
    this.userInfo = this.getUserFromCookie();
  }

  private getUserFromCookie(): User | null {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      try {
        return JSON.parse(userCookie) as User;
      } catch (error) {
        console.error('Failed to parse user cookie:', error);
        return null;
      }
    }
    return null;
  }

  public getUserInfo(): User | null {
    return this.userInfo;
  }

  public getName(): string | null {
    return this.userInfo ? this.userInfo.name : null;
  }

  public getFamilyName(): string | null {
    return this.userInfo ? this.userInfo.family_name : null;
  }

  public getEmail(): string | null {
    return this.userInfo ? this.userInfo.email : null;
  }

  public getPhoneNumber(): string | null {
    return this.userInfo ? this.userInfo.phone_number : null;
  }

  public getStudentNumber(): string | null {
    return this.userInfo ? this.userInfo.student_number : null;
  }
}
