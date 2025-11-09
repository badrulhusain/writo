import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlogTag extends Document {
  blogId: mongoose.Types.ObjectId;
  tagId: mongoose.Types.ObjectId;
}

const BlogTagSchema: Schema<IBlogTag> = new mongoose.Schema(
  {
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
    tagId: { type: mongoose.Schema.Types.ObjectId, ref: "Tag", required: true },
  },
  {
    collection: "blog_tags",
  }
);

// Ensure a blogId + tagId pair is unique
BlogTagSchema.index({ blogId: 1, tagId: 1 }, { unique: true });

const BlogTag = (mongoose.models?.BlogTag as Model<IBlogTag>) || mongoose.model<IBlogTag>("BlogTag", BlogTagSchema);

export default BlogTag;
