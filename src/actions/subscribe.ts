"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const emailSchema = z.string().email("Enter a valid email address");

export async function subscribe(formData: FormData) {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) return { error: "Enter a valid email address" };

  await prisma.subscriber.upsert({
    where: { email: parsed.data.toLowerCase() },
    update: {},
    create: { email: parsed.data.toLowerCase() },
  });

  return { success: true };
}
