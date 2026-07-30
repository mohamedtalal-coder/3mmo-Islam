"use client";

import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className={`fixed bottom-6 left-6 z-50 p-3 rounded-full shadow-lg backdrop-blur-md border transition-all duration-300 hover:scale-110 active:scale-95 ${
        theme === "dark" 
          ? "bg-surface/80 border-primary shadow-primary/20 text-primary" 
          : "bg-surface/80 border-primary/10 shadow-primary/10 text-primary hover:bg-surface"
      }`}
      aria-label="Toggle dark mode"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 360 : 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
      >
        {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
      </motion.div>
    </button>
  );
}
