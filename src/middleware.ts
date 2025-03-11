import { NextRequest, NextResponse } from "next/server";

const publicUrls = ["/", "/login"];

export async function middleware(req: NextRequest) {
  // If no auth token, redirect to the login screen
  const sessionToken = req.cookies.get("session")?.value;

  // If theres no session token and theyre not on a public url, redirect them to login
  if (!sessionToken && !publicUrls.includes(req.nextUrl.pathname)) {
    const newUrl = new URL(
      `/login?redirect=${encodeURIComponent(`${req.nextUrl.pathname}${req.nextUrl.search}`)}`,
      req.nextUrl,
    );
    return NextResponse.redirect(newUrl);
  }

  // If session token and they hit login then redirect to home page
  if (sessionToken && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
