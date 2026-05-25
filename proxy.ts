import { NextResponse } from "next/server";
import { auth } from "./app/utils/auth/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isInLoginPage = req.nextUrl.pathname === "/login";
  if (!isLoggedIn && !isInLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isLoggedIn && isInLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
