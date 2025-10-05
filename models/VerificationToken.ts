import mongoose from "mongoose";

const VerificationTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, unique: true, required: true },
  expires: { type: Date, required: true },
}, { collection: "verification_tokens" });

VerificationTokenSchema.index({ email: 1, token: 1 }, { unique: true });

let VerificationToken;
try {
  VerificationToken = mongoose.model("VerificationToken");
} catch {
  VerificationToken = mongoose.model("VerificationToken", VerificationTokenSchema);
}
export default VerificationToken;
