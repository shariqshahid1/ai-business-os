"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Check, ShieldCheck, Moon, Sun, Monitor, Bell, KeyRound } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { profileSchema, changePasswordSchema, type ProfileInput, type ChangePasswordInput } from "@/lib/validations";
import { updateProfile, changePassword, updateTwoFactor, revokeSession } from "@/actions/auth";
import { PasswordInput } from "@/components/auth/password-input";
import { cn } from "@/lib/utils";

export type SessionItem = {
  id: string;
  userAgent: string | null;
  ip: string | null;
  createdAt: string;
};

export function SettingsForm({
  user,
  sessions,
}: {
  user: { name?: string | null; email?: string | null; emailVerified?: Date | null; twoFactorEnabled?: boolean };
  sessions: SessionItem[];
}) {
  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="grid w-full max-w-md grid-cols-4">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="theme">Theme</TabsTrigger>
        <TabsTrigger value="notifications">Alerts</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <ProfileTab user={user} />
      </TabsContent>
      <TabsContent value="security">
        <SecurityTab user={user} sessions={sessions} />
      </TabsContent>
      <TabsContent value="theme">
        <ThemeTab />
      </TabsContent>
      <TabsContent value="notifications">
        <NotificationsTab />
      </TabsContent>
    </Tabs>
  );
}

function ProfileTab({ user }: { user: { name?: string | null; email?: string | null } }) {
  const [error, setError] = React.useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name ?? "", email: user.email ?? "" },
  });

  async function onSubmit(v: ProfileInput) {
    setError(null);
    const res = await updateProfile(v);
    if (res?.error) setError(res.error);
    else toast.success("Profile updated");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your personal information.</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <Alert variant="error" className="mb-4">{error}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" {...register("name")} className={errors.name ? "border-destructive" : ""} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} className={errors.email ? "border-destructive" : ""} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />} Save changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function SecurityTab({
  user,
  sessions,
}: {
  user: { emailVerified?: Date | null; twoFactorEnabled?: boolean };
  sessions: SessionItem[];
}) {
  const router = useRouter();
  const [tf, setTf] = React.useState(user.twoFactorEnabled ?? false);
  const [tfBusy, setTfBusy] = React.useState(false);
  const [revoking, setRevoking] = React.useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirm: "" },
  });

  async function onPw(v: ChangePasswordInput) {
    const res = await changePassword(v);
    if (res?.error) toast.error(res.error);
    else { toast.success("Password changed"); reset(); }
  }

  async function toggle2FA(checked: boolean) {
    setTfBusy(true);
    setTf(checked);
    const res = await updateTwoFactor(checked);
    setTfBusy(false);
    if (res?.error) { setTf(!checked); toast.error(res.error); }
    else toast.success(checked ? "Two-factor enabled" : "Two-factor disabled");
  }

  async function onRevoke(id: string) {
    setRevoking(id);
    const res = await revokeSession(id);
    setRevoking(null);
    if (res?.error) toast.error(res.error);
    else { toast.success("Session revoked"); router.refresh(); }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Account security</CardTitle>
          <CardDescription>Protect your workspace and sign-in methods.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 p-4">
            <div>
              <p className="text-sm font-medium">Email verification</p>
              <p className="text-xs text-muted-foreground">Confirm your email to secure your account.</p>
            </div>
            {user.emailVerified ? (
              <Badge variant="success" className="gap-1"><Check className="h-3 w-3" /> Verified</Badge>
            ) : (
              <Badge variant="warning">Not verified</Badge>
            )}
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Two-factor authentication</p>
              <p className="text-xs text-muted-foreground">Add an extra layer of security at sign-in.</p>
            </div>
            <Switch checked={tf} disabled={tfBusy} onCheckedChange={toggle2FA} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5 text-primary" /> Change password</CardTitle>
          <CardDescription>Use a strong, unique password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onPw)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current password</Label>
              <PasswordInput id="currentPassword" {...register("currentPassword")} className={errors.currentPassword ? "border-destructive" : ""} />
              {errors.currentPassword && <p className="text-xs text-destructive">{errors.currentPassword.message}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <PasswordInput id="newPassword" {...register("newPassword")} className={errors.newPassword ? "border-destructive" : ""} />
                {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm</Label>
                <PasswordInput id="confirm" {...register("confirm")} className={errors.confirm ? "border-destructive" : ""} />
                {errors.confirm && <p className="text-xs text-destructive">{errors.confirm.message}</p>}
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />} Update password
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Monitor className="h-5 w-5 text-primary" /> Active sessions</CardTitle>
          <CardDescription>Devices currently signed in to your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {sessions.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">No active sessions found.</p>
          ) : (
            sessions.map((s, i) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{deviceLabel(s.userAgent)}{i === 0 ? " · This device" : ""}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {s.ip ?? "Unknown IP"} · {new Date(s.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {i === 0 ? (
                  <Badge variant="success">Current</Badge>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={revoking === s.id}
                    onClick={() => onRevoke(s.id)}
                  >
                    {revoking === s.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Revoke"}
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function deviceLabel(ua: string | null) {
  if (!ua) return "Unknown device";
  if (/Mobile|Android|iPhone|iPad/i.test(ua)) return "Mobile device";
  if (/Mac/i.test(ua)) return "macOS";
  if (/Windows/i.test(ua)) return "Windows";
  if (/Linux/i.test(ua)) return "Linux";
  return "Desktop";
}

function ThemeTab() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose how Nexora looks to you.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3">
          {options.map((o) => (
            <button
              key={o.value}
              onClick={() => setTheme(o.value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border p-5 text-sm font-medium transition-all hover:-translate-y-0.5",
                mounted && theme === o.value
                  ? "border-primary bg-primary/5 text-primary shadow-soft"
                  : "border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground",
              )}
            >
              <o.icon className="h-6 w-6" />
              {o.label}
              {mounted && theme === o.value && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = React.useState({
    sales: true,
    lowStock: true,
    weekly: false,
    product: true,
  });
  const rows = [
    { key: "sales" as const, title: "New sale alerts", desc: "Get notified when an order is placed." },
    { key: "lowStock" as const, title: "Low stock warnings", desc: "Alert when products hit their threshold." },
    { key: "product" as const, title: "Product updates", desc: "Inventory changes and edits." },
    { key: "weekly" as const, title: "Weekly digest", desc: "A Monday summary of your business." },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Notifications</CardTitle>
        <CardDescription>Control which alerts you receive.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {rows.map((r) => (
          <div key={r.key} className="flex items-center justify-between rounded-xl px-2 py-3 hover:bg-accent/40">
            <div>
              <p className="text-sm font-medium">{r.title}</p>
              <p className="text-xs text-muted-foreground">{r.desc}</p>
            </div>
            <Switch
              checked={prefs[r.key]}
              onCheckedChange={(v) => setPrefs((p) => ({ ...p, [r.key]: v }))}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
