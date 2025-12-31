import { UserRole } from "../user/user.interface";

export type TLoginUser = {
  rollOrEmail: string;
  password: string;
  clientInfo: {
    device: "pc" | "mobile"; // Device type
    browser: string; // Browser name
    ipAddress: string; // User IP address
    pcName?: string; // Optional PC name
    os?: string; // Optional OS name (Windows, MacOS, etc.)
    userAgent?: string; // Optional user agent string
  };
};

export interface IJwtPayload {
  userId: string;
  role: UserRole;
  email: string;
  status: "pending" | "approved";
  isDeleted: boolean;
}
