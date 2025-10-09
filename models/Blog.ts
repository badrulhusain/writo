import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
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

let Blog;
try {
  Blog = mongoose.model("Blog");
} catch {
  Blog = mongoose.model("Blog", BlogSchema);
}
export default Blog;
