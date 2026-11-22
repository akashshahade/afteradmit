import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { AppRole } from "@/lib/auth-profile";
import { getSupabaseAnonKey, getSupabaseUrl, hasSupabaseEnv } from "@/lib/supabase/env";

function homeForRole(role: AppRole | null | undefined) {
  switch (role) {
    case "admin":
      return "/admin";
    case "partner":
      return "/partner";
    case "university_admin":
      return "/university";
    case "student":
    default:
      return "/student";
  }
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const path = request.nextUrl.pathname;
  const isStudentRoute = path === "/student" || path.startsWith("/student/");
  const isOnboarding = path === "/onboarding" || path.startsWith("/onboarding/");
  const isUniversityLogin = path === "/university/login";
  const isUniversityRoute =
    !isUniversityLogin && (path === "/university" || path.startsWith("/university/"));
  const isAdminRoute = path === "/admin" || path.startsWith("/admin/");
  const isPartnerRoute = path === "/partner" || path.startsWith("/partner/");
  const isProtected =
    isStudentRoute || isOnboarding || isUniversityRoute || isAdminRoute || isPartnerRoute;

  const redirectWithCookies = (pathname: string, setNext = false) => {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    url.search = "";
    if (setNext && (pathname === "/login" || pathname === "/university/login")) {
      url.searchParams.set("next", path);
    }
    const redirect = NextResponse.redirect(url);
    for (const cookie of supabaseResponse.cookies.getAll()) {
      redirect.cookies.set(cookie);
    }
    for (const header of ["cache-control", "expires", "pragma"] as const) {
      const value = supabaseResponse.headers.get(header);
      if (value) redirect.headers.set(header, value);
    }
    return redirect;
  };

  // Fail closed: without Supabase env, protected surfaces are unavailable.
  if (!hasSupabaseEnv()) {
    if (isProtected) {
      const res = new NextResponse(
        "AfterAdmit is misconfigured (missing Supabase environment). Protected routes are unavailable.",
        { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } },
      );
      return res;
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
        Object.entries(headers).forEach(([key, value]) =>
          supabaseResponse.headers.set(key, value),
        );
      },
    },
  });

  // Keep immediately after createServerClient — refreshes/verifies the session.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if ((isStudentRoute || isOnboarding || isAdminRoute || isPartnerRoute) && !user) {
    return redirectWithCookies("/login", true);
  }

  if (isUniversityRoute && !user) {
    return redirectWithCookies("/university/login", true);
  }

  if (user && (isStudentRoute || isOnboarding || isUniversityRoute || isAdminRoute || isPartnerRoute)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, onboarding_completed_at")
      .eq("id", user.sub as string)
      .maybeSingle();

    const role = (profile?.role as AppRole | undefined) ?? null;

    if (isAdminRoute && role !== "admin") {
      return redirectWithCookies(homeForRole(role));
    }
    if (isPartnerRoute && role !== "partner") {
      return redirectWithCookies(homeForRole(role));
    }
    if (isUniversityRoute && role !== "university_admin") {
      return redirectWithCookies(homeForRole(role));
    }
    if ((isStudentRoute || isOnboarding) && role && role !== "student") {
      return redirectWithCookies(homeForRole(role));
    }
    if (isStudentRoute && role === "student" && !profile?.onboarding_completed_at) {
      return redirectWithCookies("/onboarding");
    }
  }

  return supabaseResponse;
}
