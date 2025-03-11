import { useGetUserInfo } from "./useGetUserInfo";

export function useIsAdmin() {
  const userInfo = useGetUserInfo();
  if (!("role" in userInfo)) return false;

  if (userInfo.role === "admin") {
    return true;
  } else {
    return false;
  }
}
