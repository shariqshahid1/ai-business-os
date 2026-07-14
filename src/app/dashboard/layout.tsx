import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/shell";
import { formatRelative } from "@/lib/utils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const notifications = await prisma.notification
    .findMany({
      where: { businessId: session.user.businessId },
      orderBy: { createdAt: "desc" },
      take: 6,
    })
    .then((list) =>
      list.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        read: n.read,
        time: n.createdAt.toISOString(),
      })),
    );

  return (
    <DashboardShell
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role,
      }}
      notifications={notifications}
    >
      {children}
    </DashboardShell>
  );
}
