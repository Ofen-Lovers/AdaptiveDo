"use client";

import { useUser } from "@/context/UserContext";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export function PanicProposalModal() {
  const { isPanicProposed, setIsPanicProposed, setCognitiveLoad, setPanicDismissedAt, setDismissedTaskCount, tasks } = useUser();

  if (!isPanicProposed) return null;

  const handleDismiss = () => {
    // Calculate workload using Kanban board structure
    const backlogCount = tasks.filter(t => !t.inProgress && !t.completed).length;
    const inProgressCount = tasks.filter(t => t.inProgress && !t.completed).length;
    const totalWorkload = backlogCount + inProgressCount;
    
    setIsPanicProposed(false);
    setPanicDismissedAt(Date.now());
    setDismissedTaskCount(totalWorkload); // Remember workload when dismissed
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-surface-container-high w-full max-w-md rounded-[32px] p-8 shadow-2xl border border-outline-variant/20"
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-error-container text-on-error-container flex items-center justify-center mb-2">
              <AlertTriangle size={32} />
            </div>
            
            <h2 className="text-2xl font-bold text-on-surface">Feeling Overwhelmed?</h2>
            <p className="text-on-surface-variant">
              You have 4 or more incomplete tasks. We can switch to <strong>Focus Mode</strong> to help you tackle them one by one.
            </p>

            <div className="flex flex-col w-full gap-3 mt-4">
              <button
                onClick={() => {
                  setCognitiveLoad('PANIC');
                  setIsPanicProposed(false);
                  setPanicDismissedAt(null); // Clear dismissal when entering panic mode
                }}
                className="w-full py-4 bg-error text-on-error rounded-[20px] font-bold text-lg hover:opacity-90 transition-opacity"
              >
                Enter Focus Mode
              </button>
              
              <button
                onClick={handleDismiss}
                className="w-full py-4 bg-surface-container text-on-surface rounded-[20px] font-bold hover:bg-surface-container-highest transition-colors"
              >
                I'm Fine
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
