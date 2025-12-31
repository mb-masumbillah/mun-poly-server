import mongoose from "mongoose";
import config from "../app/config";
import app from "..";

let cached = false;

export default async function handler(req: any, res: any) {
  try {
    if (!cached) {
      await mongoose.connect(config.db_url as string);
      cached = true;
    }
    return app(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
}
