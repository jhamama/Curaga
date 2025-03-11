"use client";

import { ComponentProps, useEffect, useRef } from "react";

export const ScrollToDiv = ({ children, ...rest }: ComponentProps<"div">) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [ref]);

  return (
    <div ref={ref} {...rest}>
      {children}
    </div>
  );
};
