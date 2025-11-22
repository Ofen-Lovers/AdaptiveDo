"use client";

import { useUser } from "@/context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

export function OnboardingModal() {
  const { hasSeenOnboarding, setHasSeenOnboarding } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!hasSeenOnboarding) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [hasSeenOnboarding]);

  const handleComplete = () => {
    setIsOpen(false);
    setHasSeenOnboarding(true);
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
            className="bg-surface-container-low w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden border border-outline-variant"
          >
            <div className="bg-primary p-8 text-on-primary text-center">
              <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-md">
                <span className="text-3xl">👋</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">Welcome to AdaptiveDo</h2>
              <p className="text-primary-container/80">The to-do list that evolves with you.</p>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="bg-secondary-container p-2 rounded-xl text-on-secondary-container">
                    <span className="text-xl">🌱</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface">Start Simple</h3>
                    <p className="text-on-surface-variant text-sm">We keep things clean. No complex fields until you need them.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-tertiary-container p-2 rounded-xl text-on-tertiary-container">
                    <span className="text-xl">🚀</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface">Unlock Power</h3>
                    <p className="text-on-surface-variant text-sm">As you complete tasks, you'll gain Mastery and unlock features like Kanban, Categories, and more.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="w-full py-4 bg-primary text-on-primary rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all active:scale-95"
              >
                Let's Get Started
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
