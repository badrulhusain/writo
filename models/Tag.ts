import mongoose from "mongoose";

const TagSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
}, { collection: "tags" });

let Tag;
try {
  Tag = mongoose.model("Tag");
} catch {
  Tag = mongoose.model("Tag", TagSchema);
}
export default Tag;
