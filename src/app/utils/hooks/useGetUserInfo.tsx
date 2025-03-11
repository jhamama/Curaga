"use client";

import type { UserProperties } from "@/services/utils/auth";
import { useQuery } from "@tanstack/react-query";

type UserInfo =
  | {
      loggedIn: false;
      isLoading: boolean;
    }
  | ({ loggedIn: true; isLoading: boolean } & UserProperties);

export function useGetUserInfo(): UserInfo {
  const { data, isLoading } = useQuery<UserInfo>({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const response = await fetch("/api/auth/userInfo", { cache: "no-cache" });
      const data = await response.json();
      return data;
    },
  });

  return data ? { ...data, isLoading } : { loggedIn: false, isLoading };
}
