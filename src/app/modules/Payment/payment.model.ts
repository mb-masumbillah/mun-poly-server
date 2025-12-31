import { model, Schema } from "mongoose";

const PaymentSchema = new Schema(
  {
    roll: { type: String, required: true, unique: true },
    amount: { type: String, required: true },
    txnId: { type: String, required: true },
    number: { type: String, required: true },
    semester: { type: String, required: true },
    repeat: [
      {
        semester: { type: String },
        subject: [String],
      },
    ],
    image: { type: String },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const Payment = model("Payment", PaymentSchema);
export default Payment;
