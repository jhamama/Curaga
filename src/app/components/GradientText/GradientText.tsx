import { motion } from "framer-motion";

export function GradientText({ children }: { children: string }) {
  return (
    <motion.span
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(253,187,45,1) 0%, rgba(255,156,141,1) 48%, rgba(146,221,255,1) 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {children}
    </motion.span>
  );
}
