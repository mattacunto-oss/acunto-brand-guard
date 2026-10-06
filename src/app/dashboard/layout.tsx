import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { DashboardNav } from "@/components/DashboardNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) redirect("/login");
  return (
    <div>
      <DashboardNav />
      <main className="container" style={{ paddingBottom: "3rem" }}>{children}</main>
    </div>
  );
}
