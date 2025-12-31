import { Request, Response } from "express";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import Payment from "./payment.model";

export const createPayment = async (req:Request, res:Response) => {
  try {
    const payment = JSON.parse(req.body.data); // text object

    let payload = { ...payment };

    const file = req.file;
    if (file) {
      const imageName = `${payload.roll}_${payload.fullName}`;
      const path = file.path;

      const { secure_url }: any = await sendImageToCloudinary(imageName, path);
      payload.image = secure_url;
    }

    const result = await Payment.create(payload);

    res.status(201).json({
      success: true,
      message: "payment payment submitted! Please wait for email verification.",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

export const getAllPayments = async (req:Request, res:Response) => {
  try {
    const payments = await Payment.find();
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

export const getSinglePayment = async (req:Request, res:Response) => {
  try {
    const { roll } = req.params;
    const payment = await Payment.findOne({ roll });

    if (!payment) return res.status(404).json({ success: false, message: "payment not found" });

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};


export const updatePayment = async (req:Request, res:Response) => {
  try {
    const { roll } = req.params;
    const updateData = JSON.parse(req.body.data);

    let payload = { ...updateData };

    const file = req.file;
    if (file) {
      const imageName = `${payload.roll}_${payload.fullName}`;
      const path = file.path;

      const { secure_url }:any = await sendImageToCloudinary(imageName, path);
      payload.image = secure_url;
    }

    const updatedPayment = await Payment.findOneAndUpdate({ roll }, payload, { new: true });

    if (!updatedPayment) return res.status(404).json({ success: false, message: "Payment not found" });

    res.status(200).json({ success: true, message: "Payment updated successfully", data: updatedPayment });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

export const deletePayment = async (req:Request, res:Response) => {
  try {
    const { roll } = req.params;
    const deleted = await Payment.findOneAndDelete({ roll });

    if (!deleted) return res.status(404).json({ success: false, message: "Payment not found" });

    res.status(200).json({ success: true, message: "Payment deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, });
  }
};
