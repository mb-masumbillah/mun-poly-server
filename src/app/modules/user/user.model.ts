import { model, Schema } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import { UserStatus } from "./user.constant";
import { USER_ROLE } from "../../interface/constant";
import bcrypt from "bcrypt";
import config from "../../config";

const userSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    needsPasswordChange: {
      type: Boolean,
      required: true,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: [
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.student,
        USER_ROLE.instructor,
      ],
    },
    status: {
      type: String,
      enum: [...UserStatus],
      default: "in-progress",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
});

userSchema.post("save", function (doc, next) {
  doc.password = " ";
  next();
});

userSchema.statics.isUserExist = async function (id: string) {
  return await User.findOne({ id }).select("+password");
};

export const User = model<TUser, UserModel>("User", userSchema);
