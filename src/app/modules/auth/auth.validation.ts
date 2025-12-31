import z from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    rollOrEmail: z.string("this field is required."),
    password: z.string("Password is required"),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string("Refresh Token is required"),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string("Old password is required."),
    newPassword: z.string("New Password is required"),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  refreshTokenValidationSchema,
  changePasswordValidationSchema,
};
