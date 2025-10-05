import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
}, { collection: "categories" });

let Category;
try {
  Category = mongoose.model("Category");
} catch {
  Category = mongoose.model("Category", CategorySchema);
}
export default Category;
