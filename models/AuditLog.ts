import mongoose from "mongoose";

interface IAuditLog {
  userId: mongoose.Types.ObjectId;
  action: string;
  resourceType: string;
  resourceId?: mongoose.Types.ObjectId;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AuditLogSchema = new mongoose.Schema<IAuditLog>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  resourceType: { type: String, required: true },
  resourceId: { type: mongoose.Schema.Types.ObjectId },
  details: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String }
}, { timestamps: true, collection: "auditlogs" });

const AuditLog = (mongoose.models?.AuditLog as mongoose.Model<IAuditLog>) || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

export default AuditLog;
