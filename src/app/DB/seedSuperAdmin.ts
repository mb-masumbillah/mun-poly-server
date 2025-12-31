import config from "../config";
import { USER_ROLE } from "../interface/constant";
import { User } from "../modules/user/user.model";
import bcrypt from "bcrypt";

const seedSuperAdmin = async () => {
  const isSuperAdminExists = await User.findOne({ role: USER_ROLE.superAdmin });
  if (isSuperAdminExists) {
    console.log("Super admin already exists!");
    return;
  }

  if (!config.super_admin_password) {
    throw new Error("Super admin password not set in config!");
  }


  const superUser = {
    email: "masum.stack.dev@gmail.com",
    password: "123456",
    passwordChangedAt: new Date(),
    role: USER_ROLE.superAdmin,
    status: "approved" as const,
    isDeleted: false,
    roll: "000",
    clientInfo: {
      device: "pc" as const,
      browser: "unknown",
      ipAddress: "127.0.0.1",
    },
    lastLogin: new Date(),
  };

  await User.create(superUser);
};

export default seedSuperAdmin;
