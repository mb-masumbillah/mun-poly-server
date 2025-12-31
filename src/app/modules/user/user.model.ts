import { model, Schema } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import { UserStatus } from "./user.constant";
import { USER_ROLE } from "../../interface/constant";
import bcrypt from "bcrypt";
import config from "../../config";

const userSchema = new Schema<TUser, UserModel>(
  {
    roll: {
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
      default: "pending",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    clientInfo: {
      device: {
        type: String,
        enum: ["pc", "mobile"],
        required: true,
      },
      browser: {
        type: String,
        required: true,
      },
      ipAddress: {
        type: String,
        required: true,
      },
      pcName: {
        type: String,
      },
      os: {
        type: String,
      },
      userAgent: {
        type: String,
      },
    },
    lastLogin: {
      type: Date,
      default: Date.now(),
    },
    otpToken: {
      type: String,
      default: null,
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

userSchema.statics.isUserExist = async function (value: string) {
  let query = {};

  if (value.includes("@")) {
    query = { email: value };
  } else if (/^\d+$/.test(value)) {
    query = { roll: value };
  } else {
    throw new Error("Invalid roll or email");
  }
  return await this.findOne(query).select("+password");
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string
) {

  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>("User", userSchema);
