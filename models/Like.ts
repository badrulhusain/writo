import mongoose from "mongoose";

interface ILike {
  userId: mongoose.Types.ObjectId;
  blogId: mongoose.Types.ObjectId;
}

const LikeSchema = new mongoose.Schema<ILike>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
}, { timestamps: true, collection: "likes" });

// Ensure a user can only like a blog once
LikeSchema.index({ userId: 1, blogId: 1 }, { unique: true });

const Like = (mongoose.models?.Like as mongoose.Model<ILike>) || mongoose.model<ILike>("Like", LikeSchema);

export default Like;
