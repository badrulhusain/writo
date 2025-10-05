import { connectDB } from "@/lib/db";
import Category from "@/models/Category";

const CategoryModel = Category as any;

const categories = [
  "technology",
  "design",
  "business",
  "lifestyle",
  "tutorial"
];

async function seedCategories() {
  try {
    await connectDB();

    for (const categoryName of categories) {
      const existingCategory = await CategoryModel.findOne({ name: categoryName });
      if (!existingCategory) {
        await CategoryModel.create({ name: categoryName });
        console.log(`Created category: ${categoryName}`);
      } else {
        console.log(`Category already exists: ${categoryName}`);
      }
    }

    console.log("Categories seeding completed");
  } catch (error) {
    console.error("Error seeding categories:", error);
  } finally {
    process.exit(0);
  }
}

seedCategories();