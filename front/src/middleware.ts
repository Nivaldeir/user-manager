import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("next-auth.session-token"); // Assuming NextAuth for auth

  if (!token && !request.nextUrl.pathname.startsWith("/sign-in")) {
    console.log("Unauthorized access attempted:", request.nextUrl.pathname);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
