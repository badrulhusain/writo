import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
}, { timestamps: true, collection: "likes" });

// Ensure a user can only like a blog once
LikeSchema.index({ userId: 1, blogId: 1 }, { unique: true });

let Like;
try {
  Like = mongoose.model("Like");
} catch {
  Like = mongoose.model("Like", LikeSchema);
}
export default Like;