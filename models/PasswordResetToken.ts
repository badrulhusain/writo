import mongoose from "mongoose";

interface IPasswordResetToken {
  email: string;
  token: string;
  expires: Date;
}

const PasswordResetTokenSchema = new mongoose.Schema<IPasswordResetToken>({
  email: { type: String, required: true },
  token: { type: String, unique: true, required: true },
  expires: { type: Date, required: true },
}, { collection: "password_reset_tokens" });

PasswordResetTokenSchema.index({ email: 1, token: 1 }, { unique: true });

const PasswordResetToken = (mongoose.models?.PasswordResetToken as mongoose.Model<IPasswordResetToken>) || mongoose.model<IPasswordResetToken>("PasswordResetToken", PasswordResetTokenSchema);

export default PasswordResetToken;
