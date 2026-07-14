"use server";

import { randomBytes } from "crypto";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";
import { slugify, escapeHtml } from "@/lib/utils";
import { sendMail, verificationEmailLink, resetPasswordLink } from "@/lib/mail";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  profileSchema,
  type LoginInput,
  type RegisterInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type ChangePasswordInput,
  type ProfileInput,
} from "@/lib/validations";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function register(values: RegisterInput) {
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, email, password, business } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) {
    return { error: "An account with this email already exists" };
  }

  const slugBase = slugify(business);
  let slug = slugBase;
  let n = 1;
  while (await prisma.business.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${n++}`;
  }

  const hashed = await bcrypt.hash(password, 12);

  const created = await prisma.$transaction(async (tx) => {
    const biz = await tx.business.create({
      data: { name: business, slug,       description: `${escapeHtml(business)} on Nexora` },
    });
    const user = await tx.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash: hashed,
        role: "OWNER",
        businessId: biz.id,
      },
    });
    return { biz, user };
  });

  const token = randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: {
      identifier: normalizedEmail,
      token,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });

  await sendMail({
    to: normalizedEmail,
    subject: "Verify your Nexora account",
      html: `<p style="color:#e5e7eb;">Welcome to Nexora, ${escapeHtml(name)}!</p>
      <p style="color:#aab2c5;">Confirm your email to activate your workspace.</p>
      <p style="margin:24px 0;">
        <a href="${verificationEmailLink(token)}"
          style="background:#6366f1;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;display:inline-block;">
          Verify Email
        </a>
      </p>`,
  });

  try {
    await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirect: false,
    });
  } catch (error) {
    console.error("Register auto sign-in error:", error);
  }

  redirect("/dashboard");
}

export async function login(values: LoginInput & { callbackUrl?: string }) {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  let res;
  try {
    res = await signIn("credentials", {
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
      redirect: false,
    });
  } catch (error) {
    console.error("Login signIn error:", error);
    return { error: "Invalid email or password" };
  }

  if (!res || res.error) {
    return { error: "Invalid email or password" };
  }

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const h = await headers();
    await prisma.session.create({
      data: {
        userId: user.id,
        businessId: user.businessId,
        sessionToken: randomBytes(32).toString("hex"),
        userAgent: h.get("user-agent") ?? null,
        ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    });
  }

  redirect(values.callbackUrl || "/dashboard");
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}

export async function forgotPassword(values: ForgotPasswordInput) {
  const parsed = forgotPasswordSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to avoid leaking account existence.
  if (user) {
    const token = randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60),
      },
    });
    await sendMail({
      to: email,
      subject: "Reset your Nexora password",
      html: `<p style="color:#e5e7eb;">Hi ${user.name ?? "there"},</p>
        <p style="color:#aab2c5;">We received a request to reset your password.</p>
        <p style="margin:24px 0;">
          <a href="${resetPasswordLink(token)}"
            style="background:#6366f1;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;display:inline-block;">
            Reset Password
          </a>
        </p>
        <p style="color:#6b7280;font-size:12px;">This link expires in 1 hour.</p>`,
    });
  }

  return { success: true };
}

export async function resetPassword(values: ResetPasswordInput) {
  const parsed = resetPasswordSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { token, password } = parsed.data;
  const record = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!record || record.expires < new Date()) {
    return { error: "This reset link is invalid or has expired" };
  }

  const hashed = await bcrypt.hash(password, 12);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash: hashed },
    }),
    prisma.passwordResetToken.delete({ where: { token } }),
  ]);

  return { success: true };
}

export async function changePassword(values: ChangePasswordInput) {
  const parsed = changePasswordSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in" };
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.passwordHash) return { error: "Account not found" };

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!valid) return { error: "Current password is incorrect" };

  const hashed = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: hashed },
  });

  return { success: true };
}

export async function updateProfile(values: ProfileInput) {
  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const session = await auth();
  if (!session?.user?.id) return { error: "You must be signed in" };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name, email: parsed.data.email.toLowerCase() },
  });

  return { success: true };
}

export async function verifyEmail(token: string) {
  const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record || record.expires < new Date()) {
    return { error: "This verification link is invalid or has expired" };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { email: record.identifier },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.delete({ where: { token } }),
  ]);

  return { success: true };
}

export async function updateTwoFactor(enabled: boolean) {
  const session = await auth();
  if (!session?.user?.id) return { error: "You must be signed in" };
  await prisma.user.update({
    where: { id: session.user.id },
    data: { twoFactorEnabled: enabled },
  });
  return { success: true };
}

export async function resendVerification(
  email: string,
): Promise<{ success: boolean; error?: string }> {
  const normalized = email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user || user.emailVerified) return { success: true };

  const token = randomBytes(32).toString("hex");
  await prisma.verificationToken.deleteMany({ where: { identifier: normalized } });
  await prisma.verificationToken.create({
    data: {
      identifier: normalized,
      token,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });

  await sendMail({
    to: normalized,
    subject: "Verify your Nexora account",
    html: `<p style="color:#e5e7eb;">Confirm your email to activate your workspace.</p>
      <p style="margin:24px 0;">
        <a href="${verificationEmailLink(token)}"
          style="background:#6366f1;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;display:inline-block;">
          Verify Email
        </a>
      </p>`,
  });

  return { success: true };
}

export async function revokeSession(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "You must be signed in" };
  await prisma.session.deleteMany({ where: { id, userId: session.user.id } });
  return { success: true };
}
