"use client";

import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles, X } from "lucide-react";

export function ConfettiCelebration() {
  const { tasks, cognitiveLoad, setCognitiveLoad } = useUser();
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const incompleteTasks = tasks.filter(t => !t.completed);
    const allTasksDone = tasks.length > 0 && incompleteTasks.length === 0;

    // Trigger celebration if all tasks are done and we haven't triggered yet
    if (allTasksDone && !hasTriggered) {
      setHasTriggered(true);
      setShowCelebration(true);

      // Fire confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#A855F7', '#EC4899', '#F59E0B', '#10B981'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#A855F7', '#EC4899', '#F59E0B', '#10B981'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      // Auto-exit Focus Mode after celebration
      if (cognitiveLoad === 'PANIC') {
        setTimeout(() => {
          setCognitiveLoad('LOW');
        }, 3500);
      }

      // Auto-hide celebration after 4 seconds
      setTimeout(() => {
        setShowCelebration(false);
      }, 4000);
    }

    // Reset trigger when new tasks are added
    if (incompleteTasks.length > 0) {
      setHasTriggered(false);
    }
  }, [tasks, hasTriggered, cognitiveLoad, setCognitiveLoad]);

  return (
    <AnimatePresence>
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className="fixed bottom-8 left-1/2 z-50 w-[90%] max-w-md"
        >
          <div className="bg-gradient-to-br from-primary to-secondary border border-outline-variant/20 p-6 rounded-[24px] shadow-xl backdrop-blur-md">
            <div className="flex items-start gap-4">
              {/* Trophy Icon */}
              <div className="bg-on-primary/10 p-3 rounded-full text-on-primary flex-shrink-0">
                <Trophy size={28} />
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h4 className="font-bold text-on-primary text-lg mb-1">Amazing Work! 🎉</h4>
                <p className="text-sm text-on-primary/90 mb-2">
                  You've completed all your tasks!
                </p>
                <div className="flex items-center gap-2 text-on-primary/80">
                  <Sparkles size={16} />
                  <span className="text-xs font-bold">You're absolutely crushing it!</span>
                  <Sparkles size={16} />
                </div>
              </div>
              
              {/* Close Button */}
              <button 
                onClick={() => setShowCelebration(false)}
                className="p-2 text-on-primary/80 hover:bg-on-primary/10 rounded-full flex-shrink-0"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
