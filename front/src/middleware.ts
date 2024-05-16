import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const tokenNext = request.cookies.get("next-auth.session-token");
  const tokenBackend = request.cookies.get("jwt");

  const pathname = request.nextUrl.pathname;

  if (pathname === "/sign-in" && tokenNext && tokenBackend) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!tokenNext && !pathname.startsWith("/sign-up")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  // if (
  //   !pathname.startsWith("/sign-in") &&
  //   !pathname.startsWith("/sign-up")
  // ) {
  //   return NextResponse.redirect(new URL("/sign-in", request.url));
  //
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
