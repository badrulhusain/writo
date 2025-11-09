import mongoose from "mongoose";

interface ITwoFactorToken {
  email: string;
  token: string;
  expires: Date;
}

const TwoFactorTokenSchema = new mongoose.Schema<ITwoFactorToken>({
  email: { type: String, required: true },
  token: { type: String, unique: true, required: true },
  expires: { type: Date, required: true },
}, { collection: "two_factor_tokens" });

TwoFactorTokenSchema.index({ email: 1, token: 1 }, { unique: true });

const TwoFactorToken = (mongoose.models?.TwoFactorToken as mongoose.Model<ITwoFactorToken>) || mongoose.model<ITwoFactorToken>("TwoFactorToken", TwoFactorTokenSchema);

export default TwoFactorToken;
