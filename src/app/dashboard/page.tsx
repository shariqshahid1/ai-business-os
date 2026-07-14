import { redirect } from "next/navigation";
import DashboardOverview from "@/components/dashboard/dashboard-overview";
import { getDashboardData } from "@/actions/dashboard";

export default async function DashboardPage() {
  let data;
  try {
    data = await getDashboardData();
  } catch {
    redirect("/login");
  }
  return <DashboardOverview {...data} />;
}
