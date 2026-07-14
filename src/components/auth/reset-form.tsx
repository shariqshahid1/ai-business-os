"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations";
import { resetPassword } from "@/actions/auth";
import { PasswordInput } from "@/components/auth/password-input";

export function ResetPasswordForm({ token }: { token: string }) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: "", confirm: "" },
  });

  async function onSubmit(values: ResetPasswordInput) {
    setServerError(null);
    const res = await resetPassword(values);
    if (res?.error) setServerError(res.error);
    else setSuccess(true);
  }

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <Alert variant="success">Password updated. You can now sign in.</Alert>
        <Button variant="gradient" className="w-full" asChild>
          <Link href="/login">Continue to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {serverError && <Alert variant="error">{serverError}</Alert>}
      <input type="hidden" {...register("token")} />
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <PasswordInput id="password" placeholder="••••••••" className={errors.password ? "border-destructive" : ""} {...register("password")} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm">Confirm password</Label>
        <PasswordInput id="confirm" placeholder="••••••••" className={errors.confirm ? "border-destructive" : ""} {...register("confirm")} />
        {errors.confirm && <p className="text-xs text-destructive">{errors.confirm.message}</p>}
      </div>
      <Button type="submit" variant="gradient" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Reset password
      </Button>
    </form>
  );
}
