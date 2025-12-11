import mongoose from "mongoose";

interface IBookmark {
  userId: mongoose.Types.ObjectId;
  blogId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const BookmarkSchema = new mongoose.Schema<IBookmark>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true }
}, { timestamps: true, collection: "bookmarks" });

// Ensure a user can only bookmark a blog post once
BookmarkSchema.index({ userId: 1, blogId: 1 }, { unique: true });

const Bookmark = (mongoose.models?.Bookmark as mongoose.Model<IBookmark>) || mongoose.model<IBookmark>("Bookmark", BookmarkSchema);

export default Bookmark;