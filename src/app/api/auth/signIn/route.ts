// https://github.com/iway1/trpc-panel

import { parseJwt } from "@/app/utils/helpers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const parsedUrl = new URL(request.url);
  const code = parsedUrl.searchParams.get("code");

  if (!code) throw Error("No auth coded found");

  const codeData = parseJwt(code);
  const token = codeData?.token;

  if (!token) throw Error("No token found");

  const originalUrl = request.nextUrl.protocol + request.headers.get("host");

  const redirectLocation = parsedUrl.searchParams.get("redirect");

  const response = NextResponse.redirect(originalUrl + redirectLocation, {
    status: 302,
  });
  response.cookies.set("session", token, {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return response;
}
