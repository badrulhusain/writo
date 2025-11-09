import mongoose from "mongoose";

interface IVerificationToken {
  email: string;
  token: string;
  expires: Date;
}

const VerificationTokenSchema = new mongoose.Schema<IVerificationToken>({
  email: { type: String, required: true },
  token: { type: String, unique: true, required: true },
  expires: { type: Date, required: true },
}, { collection: "verification_tokens" });

VerificationTokenSchema.index({ email: 1, token: 1 }, { unique: true });

const VerificationToken = (mongoose.models?.VerificationToken as mongoose.Model<IVerificationToken>) || mongoose.model<IVerificationToken>("VerificationToken", VerificationTokenSchema);

export default VerificationToken;
