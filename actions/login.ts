"use server";

import * as z from "zod";
import { AuthError } from "next-auth";

import { connectDB, User, TwoFactorToken, TwoFactorConfirmation } from "@/lib/db";
import { signIn } from "@/Auth";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { 
  sendVerificationEmail,
  sendTwoFactorTokenEmail,
} from "@/lib/mail";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { 
  generateVerificationToken,
  generateTwoFactorToken
} from "@/lib/tokens";
import { 
  getTwoFactorConfirmationByUserId
} from "@/data/two-factor-confirmation";

const verifyTwoFactorCode = async (user: any, code: string): Promise<{ error?: string; success?: string }> => {
  const twoFactorToken = await getTwoFactorTokenByEmail(user.email);

  if (!twoFactorToken) {
    return { error: "Invalid code!" };
  }

  if (twoFactorToken.token !== code) {
    return { error: "Invalid code!" };
  }

  const hasExpired = new Date(twoFactorToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Code expired!" };
  }

  await connectDB();

  await TwoFactorToken.deleteOne({ email: user.email });

  const existingConfirmation = await getTwoFactorConfirmationByUserId(user.id);

  if (existingConfirmation) {
    await TwoFactorConfirmation.deleteOne({ userId: user.id });
  }

  await TwoFactorConfirmation.create({
    userId: user.id,
  });

  return { success: "Two factor successful!" };
};

const sendTwoFactorToken = async (email: string): Promise<{ twoFactor?: boolean; error?: string }> => {
  const twoFactorToken = await generateTwoFactorToken(email);
  await sendTwoFactorTokenEmail(
    twoFactorToken.email,
    twoFactorToken.token,
  );

  return { twoFactor: true };
};
export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
): Promise<{ error?: string; success?: string; twoFactor?: boolean } | undefined> => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" }
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const result = await verifyTwoFactorCode(existingUser, code);
      if (result.error) {
        return result;
      }
    } else {
      return await sendTwoFactorToken(existingUser.email);
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      // Option 1: Use callbackUrl if provided, otherwise default to /home
      redirectTo:  "/home",
      
      // Option 2: Always redirect to /home (uncomment this line and comment above)
      // redirectTo: "/home",
    })
    console.log(email, password)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" }
        default:
          return { error: "Something went wrong!" }
      }
    }

    throw error;
  }
};