"use client";

import { motion } from "framer-motion";

type ColorScheme = "success" | "error";

export const AnimatedBackground = ({
  colorScheme,
}: {
  colorScheme: ColorScheme;
}) => (
  <>
    {/* Animated gradient background */}
    <motion.div
      className={`fixed inset-0 bg-gradient-to-br from-primary-50 to-${colorScheme}-50 dark:from-primary-900/30 dark:to-${colorScheme}-900/20 pointer-events-none`}
      animate={{
        background: [
          `linear-gradient(to bottom right, rgba(var(--primary-50), 0.3), rgba(var(--${colorScheme}-50), 0.3))`,
          `linear-gradient(to bottom right, rgba(var(--${colorScheme}-50), 0.3), rgba(var(--primary-50), 0.3))`,
          `linear-gradient(to bottom right, rgba(var(--primary-50), 0.3), rgba(var(--${colorScheme}-50), 0.3))`,
        ],
      }}
      transition={{
        duration: 10,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
    />

    {/* Floating circles */}
    <motion.div
      className={`fixed w-64 h-64 rounded-full bg-${colorScheme}-200/20 dark:bg-${colorScheme}-800/10 pointer-events-none`}
      animate={{
        x: ["-20vw", "10vw", "-20vw"],
        y: ["-10vh", "30vh", "-10vh"],
      }}
      transition={{
        duration: 20,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    />

    <motion.div
      className="fixed w-96 h-96 rounded-full bg-primary-200/20 dark:bg-primary-800/10 pointer-events-none right-0"
      animate={{
        x: ["10vw", "-20vw", "10vw"],
        y: ["20vh", "-10vh", "20vh"],
      }}
      transition={{
        duration: 25,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    />
  </>
);
