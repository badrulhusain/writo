import mongoose from "mongoose";

interface ICategory {
  name: string;
  blogs?: mongoose.Types.ObjectId[];
}

const CategorySchema = new mongoose.Schema<ICategory>({
  name: { type: String, unique: true, required: true },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
}, { collection: "categories" });

const Category = (mongoose.models?.Category as mongoose.Model<ICategory>) || mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
