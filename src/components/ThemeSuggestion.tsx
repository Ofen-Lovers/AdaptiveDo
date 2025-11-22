"use client";

import { useUser } from "@/context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, X } from "lucide-react";
import { useState, useEffect } from "react";

export function ThemeSuggestion() {
  const { timeOfDay, theme, setTheme } = useUser();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show suggestion if it's Night time but user is in Light mode
    if (timeOfDay === 'NIGHT' && theme === 'LIGHT') {
      const timer = setTimeout(() => setIsVisible(true), 1000); // Small delay for effect
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [timeOfDay, theme]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, x: '-50%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        exit={{ opacity: 0, y: 50, x: '-50%' }}
        className="fixed bottom-8 left-1/2 z-50 w-[90%] max-w-md"
      >
        <div className="bg-surface-container-high border border-outline-variant/20 p-4 rounded-[24px] shadow-xl flex items-center gap-4 backdrop-blur-md">
          <div className="bg-primary/10 p-3 rounded-full text-primary">
            <Moon size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-on-surface text-sm">It's getting dark</h4>
            <p className="text-xs text-on-surface-variant">Switch to Night Mode for better eye comfort?</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsVisible(false)}
              className="p-2 text-on-surface-variant hover:bg-surface-container-highest rounded-full"
            >
              <X size={20} />
            </button>
            <button 
              onClick={() => setTheme('DARK')}
              className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-full shadow-sm hover:bg-primary/90"
            >
              Switch
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
