"use client";

import { useState, useEffect } from "react";

export function useIsMobileView() {
  const [isMobileView, setIsMobileView] = useState(() =>
    typeof window === "object" ? window.innerWidth <= 768 : false,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobileView;
}
