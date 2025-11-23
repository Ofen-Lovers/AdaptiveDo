"use client";

import { useUser } from "@/context/UserContext";
import { UserMode } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper, Trophy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function FeatureUnlockNotification() {
  const { userMode } = useUser();
  const prevModeRef = useRef<UserMode>(userMode);
  const [notification, setNotification] = useState<{ title: string; message: string; icon: React.ReactNode } | null>(null);

  useEffect(() => {
    const prevMode = prevModeRef.current;
    
    if (prevMode !== userMode) {
      // Logic for "Level Up"
      if (prevMode === 'BEGINNER' && userMode === 'INTERMEDIATE') {
        setNotification({
          title: "Level Up!",
          message: "You've unlocked the Calendar view.",
          icon: <PartyPopper size={24} className="text-primary" />
        });
      } else if (prevMode === 'INTERMEDIATE' && userMode === 'EXPERIENCED') {
        setNotification({
          title: "Expert Status!",
          message: "Dashboard and Quick Add are now available.",
          icon: <Trophy size={24} className="text-tertiary" />
        });
      } else if (prevMode === 'BEGINNER' && userMode === 'EXPERIENCED') {
         // Jumped straight to experienced?
         setNotification({
            title: "Expert Status!",
            message: "You've unlocked all advanced features.",
            icon: <Trophy size={24} className="text-tertiary" />
          });
      }

      // Update ref
      prevModeRef.current = userMode;

      // Auto dismiss
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [userMode]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          className="fixed bottom-8 left-1/2 z-50 flex items-center gap-4 p-4 pr-6 bg-surface-container-high rounded-full shadow-2xl border border-outline-variant/20 backdrop-blur-md"
        >
          <div className="bg-surface-container-highest p-3 rounded-full">
            {notification.icon}
          </div>
          <div>
            <h4 className="font-bold text-sm text-on-surface">{notification.title}</h4>
            <p className="text-xs text-on-surface-variant">{notification.message}</p>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="ml-2 text-on-surface-variant hover:text-on-surface"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
