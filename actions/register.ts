"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // 1. Validate input
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;

  // 2. Check for existing user
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email already in use!" };
  }

  // 3. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Create user
  let newUser;
  try {
    newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  } catch (err) {
    console.error("Database error during user creation:", err);
    return { error: "Failed to create user" };
  }

  // 5. Decide flow: Verification OR Direct redirect
  const requireVerification = process.env.NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION === "true";

  if (requireVerification) {
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);
    return { success: "Confirmation email sent!" };
  }

  // No verification → send user directly to home
  redirect("/home");
};
