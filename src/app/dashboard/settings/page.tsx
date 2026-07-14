import { PageHeader } from "@/components/dashboard/page-header";
import { SettingsForm, type SessionItem } from "@/components/dashboard/settings-form";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await auth();
  const user = session!.user;

  const [dbUser, sessions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: { emailVerified: true, twoFactorEnabled: true },
    }),
    prisma.session
      .findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 10,
      })
      .then((list) =>
        list.map<SessionItem>((s) => ({
          id: s.id,
          userAgent: s.userAgent,
          ip: s.ip,
          createdAt: s.createdAt.toISOString(),
        })),
      ),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your profile, security, and preferences." />
      <SettingsForm
        user={{
          name: user.name,
          email: user.email,
          emailVerified: dbUser?.emailVerified ?? user.emailVerified,
          twoFactorEnabled: dbUser?.twoFactorEnabled ?? false,
        }}
        sessions={sessions}
      />
    </div>
  );
}
