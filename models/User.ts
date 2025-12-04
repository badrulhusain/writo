import mongoose, { Document } from "mongoose";

interface IUser extends Document {
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  role?: "ADMIN" | "USER";
  isTwoFactorEnabled?: boolean;
  bio?: string;
  location?: string;
  website?: string;
  accounts?: mongoose.Types.ObjectId[];
  twoFactorConfirmation?: mongoose.Types.ObjectId;
  blogs?: mongoose.Types.ObjectId[];
}

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String },
  email: { type: String, unique: true, sparse: true },
  emailVerified: { type: Date },
  image: { type: String },
  password: { type: String, select: false },
  role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
  isTwoFactorEnabled: { type: Boolean, default: false },
  bio: { type: String },
  location: { type: String },
  website: { type: String },
  accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Account" }],
  twoFactorConfirmation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TwoFactorConfirmation",
  },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
}, { timestamps: true, collection: "users" });

const User = (mongoose.models?.User as mongoose.Model<IUser>) || mongoose.model<IUser>("User", UserSchema);

export default User;
