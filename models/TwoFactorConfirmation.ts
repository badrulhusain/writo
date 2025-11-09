import mongoose from "mongoose";

interface ITwoFactorConfirmation {
  userId: mongoose.Types.ObjectId;
}

const TwoFactorConfirmationSchema = new mongoose.Schema<ITwoFactorConfirmation>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
}, { collection: "two_factor_confirmations" });

const TwoFactorConfirmation = (mongoose.models?.TwoFactorConfirmation as mongoose.Model<ITwoFactorConfirmation>) || mongoose.model<ITwoFactorConfirmation>("TwoFactorConfirmation", TwoFactorConfirmationSchema);

export default TwoFactorConfirmation;
