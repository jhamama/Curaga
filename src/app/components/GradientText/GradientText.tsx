import { motion } from "framer-motion";

export function GradientText({ children }: { children: string }) {
  return (
    <motion.span
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(243,233,152,1) 0%, rgba(255,180,170,1) 48%, rgba(168,240,202,1) 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {children}
    </motion.span>
  );
}
