import Cookies from "js-cookie";

interface User {
  _id: string;
  name: string;
  family_name: string;
  email: string;
  phone_number: string;
  student_number: string;
  profile: string;
  usertype: string;
  role: string;
}

export class UserService {
  private userInfo: User | null = null;

  constructor() {
    this.userInfo = this.getUserFromCookie();
  }

  private getUserFromCookie(): User | null {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        return JSON.parse(userCookie) as User;
      } catch (error) {
        console.error("Failed to parse user cookie:", error);
        return null;
      }
    }
    return null;
  }

  public getToken() {
    return Cookies.get("token");
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

  public getstudent_number(): string | null {
    return this.userInfo ? this.userInfo.student_number : null;
  }
  public getProfile(): string | null {
    return this.userInfo ? this.userInfo.profile : null;
  }
  public getRole(): string | null {
    return this.userInfo ? this.userInfo.role : null;
  }
  public getUserType(): string | null {
    return this.userInfo ? this.userInfo.role : null;
  }

  public logout(): void {
    Cookies.remove("user");
    Cookies.remove("token");
    this.userInfo = null;
  }
}
