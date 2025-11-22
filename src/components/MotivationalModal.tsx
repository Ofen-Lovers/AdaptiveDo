"use client";

import { useUser } from "@/context/UserContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HeartHandshake } from "lucide-react";

export function MotivationalModal() {
  const { metrics, setCognitiveLoad } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Trigger when missed deadlines hit a threshold
    if (metrics.missedDeadlines > 0 && metrics.missedDeadlines % 3 === 0) {
      setIsOpen(true);
    }
  }, [metrics.missedDeadlines]);

  const handleAcceptHelp = () => {
    setCognitiveLoad('PANIC'); // Enter Focus Mode
    setIsOpen(false);
  };

  const handleDismiss = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-surface-container-low w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden border border-outline-variant"
          >
            <div className="bg-error-container p-8 text-on-error-container text-center">
              <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-md">
                <span className="text-3xl">😤</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Feeling Overwhelmed?</h2>
              <p className="opacity-90">It happens to the best of us. You've missed a few deadlines recently.</p>
            </div>

            <div className="p-8 space-y-4">
              <p className="text-on-surface-variant text-center">
                Would you like to enter <strong>Focus Mode</strong>? We'll hide the clutter and just show you the top 3 easiest tasks to get your momentum back.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                  onClick={handleDismiss}
                  className="py-3 px-4 rounded-full font-medium text-on-surface-variant hover:bg-surface-container-highest transition-colors"
                >
                  I'm fine
                </button>
                <button
                  onClick={handleAcceptHelp}
                  className="py-3 px-4 bg-error text-on-error rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-error/90 transition-all active:scale-95"
                >
                  Enter Focus Mode
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
