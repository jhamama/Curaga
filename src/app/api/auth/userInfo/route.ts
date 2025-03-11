import { parseJwt } from "@/app/utils/helpers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get("session")?.value;
  if (!sessionToken) {
    return NextResponse.json({ loggedIn: false });
  }

  const parsedJwt = parseJwt(sessionToken);
  if (!("properties" in parsedJwt)) {
    return NextResponse.json({ loggedIn: false });
  }

  return NextResponse.json({ loggedIn: true, ...parsedJwt.properties });
}
