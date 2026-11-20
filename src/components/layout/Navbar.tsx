import { isSupabaseConfigured } from "@/lib/config";
import { getCurrentUser } from "@/lib/data";
import { NavbarClient } from "./NavbarClient";

export async function Navbar() {
  const isDemoMode = !isSupabaseConfigured();
  const user = await getCurrentUser();

  return <NavbarClient user={user} isDemoMode={isDemoMode} />;
}
