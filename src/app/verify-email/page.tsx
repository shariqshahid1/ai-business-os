import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResendVerification } from "@/components/auth/resend-verification";
import { verifyEmail } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export const metadata: Metadata = { title: "Verify email" };

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <AuthShell title="Verify your email" subtitle="Enter your email to resend the verification link">
        <ResendVerification />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </AuthShell>
    );
  }

  const result = await verifyEmail(token);

  return (
    <AuthShell title="Email verification" subtitle="Confirming your Nexora account">
      {result.success ? (
        <div className="space-y-4 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <Alert variant="success">Your email is verified. You&apos;re all set!</Alert>
          <Button variant="gradient" className="w-full" asChild>
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <Alert variant="error">{result.error}</Alert>
          <ResendVerification />
        </div>
      )}
    </AuthShell>
  );
}
