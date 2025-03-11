"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const SignInButton = ({ authUrl }: { authUrl: string }) => {
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const params = useSearchParams();

  const redirectParams = params?.get("redirect");
  const redirectUri =
    (redirectParams && decodeURIComponent(redirectParams)) || "/";

  const getRedirectLocation = useCallback(() => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "local",
      redirect_uri: `${window.location.origin}/api/auth/signIn?redirect=${redirectUri}`,
      response_type: "code",
      provider: "google",
    });
    return authUrl + "/authorize?" + params.toString();
  }, [authUrl, redirectUri]);

  useEffect(() => {
    setRedirectUrl(getRedirectLocation());
  }, [setRedirectUrl, getRedirectLocation]);

  return (
    <a href={redirectUrl} rel="noreferrer">
      Sign in
    </a>
  );
};
