import mongoose from "mongoose";

interface IView {
  blogId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId; // Optional for authenticated users
  ipAddress?: string; // For anonymous users
  userAgent?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ViewSchema = new mongoose.Schema<IView>({
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ipAddress: { type: String },
  userAgent: { type: String }
}, { timestamps: true, collection: "views" });

// Index for efficient querying
ViewSchema.index({ blogId: 1 });
ViewSchema.index({ userId: 1 });
ViewSchema.index({ ipAddress: 1 });

const View = (mongoose.models?.View as mongoose.Model<IView>) || mongoose.model<IView>("View", ViewSchema);

export default View;