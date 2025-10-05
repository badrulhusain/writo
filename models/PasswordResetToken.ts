import mongoose from "mongoose";

const PasswordResetTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, unique: true, required: true },
  expires: { type: Date, required: true },
}, { collection: "password_reset_tokens" });

PasswordResetTokenSchema.index({ email: 1, token: 1 }, { unique: true });

let PasswordResetToken;
try {
  PasswordResetToken = mongoose.model("PasswordResetToken");
} catch {
  PasswordResetToken = mongoose.model("PasswordResetToken", PasswordResetTokenSchema);
}
export default PasswordResetToken;
