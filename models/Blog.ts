import mongoose from "mongoose";

interface IBlog {
  title: string;
  content: string;
  authorId: mongoose.Types.ObjectId;
  categoryId?: mongoose.Types.ObjectId;
  tags?: mongoose.Types.ObjectId[];
  status: "draft" | "published";
  featuredImage?: {
    url?: string;
    alt?: string;
    photographer?: string;
    photographerUrl?: string;
  };
}

const BlogSchema = new mongoose.Schema<IBlog>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  featuredImage: {
    url: { type: String },
    alt: { type: String },
    photographer: { type: String },
    photographerUrl: { type: String }
  }
}, { timestamps: true, collection: "blogs" });

const Blog = (mongoose.models?.Blog as mongoose.Model<IBlog>) || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
