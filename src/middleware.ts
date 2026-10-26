import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { supabaseCookieOptions } from "@/lib/supabase/cookie-options";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (request.nextUrl.pathname === "/admin/login") return response;
    return redirectToLogin(request, response);
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookieOptions: supabaseCookieOptions,
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data, error } = await supabase.auth.getClaims();
  response.headers.set("Cache-Control", "private, no-store, max-age=0");

  if (request.nextUrl.pathname === "/admin/login") return response;
  if (error || !data?.claims?.sub) return redirectToLogin(request, response);
  return response;
}

function redirectToLogin(request: NextRequest, response: NextResponse) {
  const loginUrl = new URL("/admin/login", request.url);
  const redirectResponse = NextResponse.redirect(loginUrl);
  for (const cookie of response.cookies.getAll()) redirectResponse.cookies.set(cookie);
  for (const headerName of ["cache-control", "expires", "pragma"]) {
    const value = response.headers.get(headerName);
    if (value) redirectResponse.headers.set(headerName, value);
  }
  redirectResponse.headers.set("Cache-Control", "private, no-store, max-age=0");
  return redirectResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
