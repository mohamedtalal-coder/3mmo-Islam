import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/courses",
  "/auth/callback",
  "/api/payments/webhook",
  "/verify",
];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith("/courses/")) return true;
  if (pathname.startsWith("/verify/")) return true;
  return false;
}

export function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const token = request.cookies.get('token')?.value;
  let user = null;

  if (token) {
    try {
      const payload = token.split('.')[1];
      user = JSON.parse(atob(payload));
    } catch (e) {
      // invalid token
    }
  }

  const { pathname } = request.nextUrl;

  // Auth required for protected routes
  if (!user && !isPublicPath(pathname) && !pathname.startsWith("/api/dev/")) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based guards for teacher dashboard
  if (user && pathname.startsWith("/dashboard/teacher")) {
    const role = user.role?.toUpperCase();
    if (role !== "TEACHER") {
      const studentUrl = request.nextUrl.clone();
      studentUrl.pathname = "/dashboard/student";
      return NextResponse.redirect(studentUrl);
    }
  }

  // Students cannot access teacher routes via /dashboard root — handled in page
  if (user && pathname.startsWith("/checkout")) {
    const role = user.role?.toUpperCase();
    if (role === "TEACHER") {
      const teacherUrl = request.nextUrl.clone();
      teacherUrl.pathname = "/dashboard/teacher";
      return NextResponse.redirect(teacherUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2)$).*)",
  ],
};
