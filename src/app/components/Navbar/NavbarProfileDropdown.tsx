"use client";

import Image from "next/image";
import { SignOutButton } from "../Authentication/SignOut";
import { api } from "@/app/utils/trpc/react";
import { User2 } from "lucide-react";
import { useGetUserInfo } from "@/app/utils/hooks/useGetUserInfo";
import { SignInButton } from "../Authentication/SignIn";

export default function NavbarProfileDropdown() {
  const userInfo = useGetUserInfo();
  const isSignedIn = userInfo.loggedIn;
  const { data: userData } = api.user.userDetails.useQuery(undefined, {
    enabled: isSignedIn,
  });
  const imageSrc = userData?.picture;

  return (
    <details className="dropdown dropdown-end items-center justify-center">
      <summary
        tabIndex={0}
        role="button"
        className="btn btn-circle btn-sm my-auto items-center overflow-hidden align-middle"
      >
        {imageSrc ? (
          <Image
            unoptimized
            loader={({ src }) => src}
            src={imageSrc}
            alt="user profile pic"
            className="w-20"
            width={20}
            height={20}
          />
        ) : (
          <User2 color="grey" />
        )}
      </summary>
      <ul className="menu dropdown-content rounded-box z-[1] w-52 bg-base-100 p-2 shadow">
        {isSignedIn ? (
          <>
            <li>
              <div>{userData?.name}</div>
            </li>

            <SignOutButton />
          </>
        ) : (
          <li>
            <SignInButton authUrl={process.env.NEXT_PUBLIC_AUTH_URL ?? ""} />
          </li>
        )}
      </ul>
    </details>
  );
}
