import mongoose from "mongoose";

interface IComment {
  content: string;
  authorId: mongoose.Types.ObjectId;
  blogId: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId; // For threaded replies
  status: "pending" | "approved" | "rejected";
}

const CommentSchema = new mongoose.Schema<IComment>({
  content: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "approved" }
}, { timestamps: true, collection: "comments" });

const Comment = (mongoose.models?.Comment as mongoose.Model<IComment>) || mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;