import mongoose from "mongoose";

const TwoFactorConfirmationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
}, { collection: "two_factor_confirmations" });

let TwoFactorConfirmation;
try {
  TwoFactorConfirmation = mongoose.model("TwoFactorConfirmation");
} catch {
  TwoFactorConfirmation = mongoose.model("TwoFactorConfirmation", TwoFactorConfirmationSchema);
}
export default TwoFactorConfirmation;
