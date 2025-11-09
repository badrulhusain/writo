import mongoose from "mongoose";

interface ITag {
  name: string;
  blogs?: mongoose.Types.ObjectId[];
}

const TagSchema = new mongoose.Schema<ITag>({
  name: { type: String, unique: true, required: true },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
}, { collection: "tags" });

const Tag = (mongoose.models?.Tag as mongoose.Model<ITag>) || mongoose.model<ITag>("Tag", TagSchema);

export default Tag;
