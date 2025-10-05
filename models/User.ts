import mongoose, { Document } from "mongoose";

interface IUser extends Document {
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  role?: "ADMIN" | "USER";
  isTwoFactorEnabled?: boolean;
  accounts?: mongoose.Types.ObjectId[];
  twoFactorConfirmation?: mongoose.Types.ObjectId;
  blogs?: mongoose.Types.ObjectId[];
}

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String },
  email: { type: String, unique: true, sparse: true },
  emailVerified: { type: Date },
  image: { type: String },
  password: { type: String },
  role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
  isTwoFactorEnabled: { type: Boolean, default: false },
  accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Account" }],
  twoFactorConfirmation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TwoFactorConfirmation",
  },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
}, { timestamps: true, collection: "users" });

let User;
try {
  User = mongoose.model<IUser>("User");
} catch {
  User = mongoose.model<IUser>("User", UserSchema);
}

export default User;
