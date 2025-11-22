"use client";

import { useUser } from "@/context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, X } from "lucide-react";
import { useState, useEffect } from "react";

export function ThemeSuggestion() {
  const { timeOfDay, theme, themeMode, setThemeMode } = useUser();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show suggestion if user is not in AUTO mode
    if (themeMode === 'AUTO') {
      setIsVisible(false);
      return;
    }

    // Show suggestion if it's Night time but user is in Light mode
    // OR if it's Day time but user is in Dark mode
    const shouldSuggest = (timeOfDay === 'NIGHT' && theme === 'LIGHT') || 
                          (timeOfDay === 'DAY' && theme === 'DARK');

    if (shouldSuggest) {
      const timer = setTimeout(() => setIsVisible(true), 1000); // Small delay for effect
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [timeOfDay, theme, themeMode]);

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
            <h4 className="font-bold text-on-surface text-sm">
              {timeOfDay === 'NIGHT' ? "It's getting dark" : "It's bright outside"}
            </h4>
            <p className="text-xs text-on-surface-variant">
              Switch to Auto Mode to match the time of day?
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsVisible(false)}
              className="p-2 text-on-surface-variant hover:bg-surface-container-highest rounded-full"
            >
              <X size={20} />
            </button>
            <button 
              onClick={() => setThemeMode('AUTO')}
              className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-full shadow-sm hover:bg-primary/90"
            >
              Auto Mode
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
