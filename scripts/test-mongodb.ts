import { connectDB, User } from "@/lib/db";

async function testMongoDB() {
  try {
    // Connect to the database
    await connectDB();
    console.log("✅ Connected to MongoDB successfully!");
    
    // Test creating a user
    const testUser = new User({
      name: "Test User",
      email: "test@example.com",
      role: "USER",
      isTwoFactorEnabled: false
    });
    
    // Save the user
    const savedUser = await testUser.save();
    console.log("✅ Created test user:", savedUser.id.toString());
    
    // Test finding the user
    const foundUser = await User.findOne({ email: "test@example.com" });
    console.log("✅ Found user:", foundUser?.id.toString());
    
    // Test updating the user
    const updatedUser = await User.findByIdAndUpdate(
      savedUser.id,
      { name: "Updated Test User" },
      { new: true }
    );
    console.log("✅ Updated user:", updatedUser?.name);
    
    // Test deleting the user
    await User.findByIdAndDelete(savedUser.id);
    console.log("✅ Deleted test user");
    
    console.log("🎉 All MongoDB tests passed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ MongoDB test failed:", error);
    process.exit(1);
  }
}

testMongoDB();