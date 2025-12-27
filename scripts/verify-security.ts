import { connectDB, User } from '../lib/db';

async function test() {
  console.log('Testing database connection and security...');

  try {
    await connectDB();
    console.log('✅ Database connected successfully');

    // Create a dummy user
    const email = `test-${Date.now()}@example.com`;
    const password = 'password123';
    await User.create({
      name: 'Test User',
      email,
      password,
    });
    console.log('✅ Dummy user created');

    // Fetch user without password selection
    const userWithoutPassword = await User.findOne({ email });
    if (!userWithoutPassword) throw new Error('User not found');
    
    if (userWithoutPassword.password) {
      console.error('❌ Security Check Failed: Password hash exposed by default');
      process.exit(1);
    } else {
      console.log('✅ Security Check Passed: Password hash hidden by default');
    }

    // Fetch user WITH password selection
    const userWithPassword = await User.findOne({ email }).select('+password');
    if (!userWithPassword) throw new Error('User not found');

    if (userWithPassword.password) {
      console.log('✅ Security Check Passed: Password hash retrievable when explicitly selected');
    } else {
      console.error('❌ Security Check Failed: Password hash not retrievable even when selected');
      process.exit(1);
    }

    // Clean up
    await User.deleteOne({ email });
    console.log('✅ Cleanup successful');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

test();
