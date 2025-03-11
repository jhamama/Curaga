"use client";

import { useGetUserInfo } from "../utils/hooks/useGetUserInfo";
import Homepage from "./components/Homepage";

export default function Home() {
  const { isLoading, loggedIn } = useGetUserInfo();

  return <Homepage />;
}
