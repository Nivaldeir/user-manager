import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const tokenNext = request.cookies.get("next-auth.session-token");
  const tokenBackend = request.cookies.get("jwt");

  const pathname = request.nextUrl.pathname;
  if (tokenNext && tokenBackend) {
    console.log("13", pathname);
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    !tokenNext &&
    !pathname.startsWith("/sign-in") &&
    !pathname.startsWith("/sign-up")
  ) {
    console.log("22", pathname);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  console.log("25", pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
