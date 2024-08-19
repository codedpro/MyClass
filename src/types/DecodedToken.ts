import { JwtPayload } from "jsonwebtoken";

export interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
  role: string;
  usertype?: string;
}
