import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your Nexora workspace">
      <LoginForm callbackUrl={callbackUrl} />
    </AuthShell>
  );
}
