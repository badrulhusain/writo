import mongoose from "mongoose";

interface ISettings {
  key: string;
  value: string;
  category: string;
  description?: string;
}

const SettingsSchema = new mongoose.Schema<ISettings>({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String }
}, { timestamps: true, collection: "settings" });

const Settings = (mongoose.models?.Settings as mongoose.Model<ISettings>) || mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
