import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a request-scoped Supabase client for Server Components, Server Actions,
 * and Route Handlers using Next.js 16 async `cookies()`.
 */
export async function createClient() {
  const cookieStore = await cookies();

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component where setting response cookies is not
          // permitted; `src/proxy.ts` handles session cookie refreshes.
        }
      },
    },
  });
}
