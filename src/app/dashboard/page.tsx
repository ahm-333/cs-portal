import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?next=/courses");
  }
  redirect("/courses");
}
