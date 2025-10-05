import mongoose from "mongoose";

const TwoFactorTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, unique: true, required: true },
  expires: { type: Date, required: true },
}, { collection: "two_factor_tokens" });

TwoFactorTokenSchema.index({ email: 1, token: 1 }, { unique: true });

let TwoFactorToken;
try {
  TwoFactorToken = mongoose.model("TwoFactorToken");
} catch {
  TwoFactorToken = mongoose.model("TwoFactorToken", TwoFactorTokenSchema);
}
export default TwoFactorToken;
