"use client";

import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Zap, Moon, Sun, Smartphone, Monitor, AlertTriangle, GraduationCap } from "lucide-react";
import { useState } from "react";

export function SimulationPanel() {
  const {
    masteryScore,
    setMasteryScore,
    cognitiveLoad,
    setCognitiveLoad,
    timeOfDay,
    setTimeOfDay,
    deviceType,
    setDeviceType,
    theme,
    setThemeMode,
    metrics,
    simulateMissedDeadline,
    triggerPanicMode,
    resetSimulation,
    setIsPanicProposed,
  } = useUser();

  const [isOpen, setIsOpen] = useState(false);

  // Helper component for persona buttons
  const PersonaButton = ({ label, onClick }: { label: string, onClick: () => void }) => (
    <button
      onClick={onClick}
      className="flex-1 py-2 rounded-[12px] bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-highest transition-colors"
    >
      {label}
    </button>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="w-80 rounded-[32px] bg-surface-container-high p-6 shadow-2xl border border-outline-variant/20 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-on-surface flex items-center gap-2">
                <Settings size={20} className="text-primary" />
                Simulation
              </h3>
              <button 
                onClick={resetSimulation}
                className="text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-wider"
              >
                Reset
              </button>
            </div>

            {/* Mastery Slider - Big Number Style */}
            <div className="mb-8 bg-surface-container p-5 rounded-[24px]">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Mastery Score</label>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-5xl font-bold text-primary tracking-tighter">{masteryScore}</span>
                <span className="text-sm font-medium text-on-surface-variant mb-2">/ 100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={masteryScore}
                onChange={(e) => setMasteryScore(parseInt(e.target.value))}
                className="w-full accent-primary h-2 bg-surface-container-highest rounded-full appearance-none cursor-pointer"
              />
            </div>

            {/* Context Toggles - Switch Style */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                onClick={() => setTimeOfDay(timeOfDay === 'DAY' ? 'NIGHT' : 'DAY')}
                className={cn(
                  "p-3 rounded-[20px] flex flex-col items-center gap-2 transition-all border-2",
                  timeOfDay === 'DAY' 
                    ? "bg-surface-container text-on-surface border-transparent" 
                    : "bg-primary text-on-primary border-primary"
                )}
              >
                {timeOfDay === 'DAY' ? <Sun size={20} /> : <Moon size={20} />}
                <span className="text-[10px] font-bold uppercase tracking-wider">Time</span>
              </button>

              <button
                onClick={() => setThemeMode(theme === 'LIGHT' ? 'DARK' : 'LIGHT')}
                className={cn(
                  "p-3 rounded-[20px] flex flex-col items-center gap-2 transition-all border-2",
                  theme === 'LIGHT' 
                    ? "bg-surface-container text-on-surface border-transparent" 
                    : "bg-secondary text-on-secondary border-secondary"
                )}
              >
                {theme === 'LIGHT' ? <Sun size={20} /> : <Moon size={20} />}
                <span className="text-[10px] font-bold uppercase tracking-wider">Theme</span>
              </button>

              <button
                onClick={() => setDeviceType(deviceType === 'DESKTOP' ? 'MOBILE' : 'DESKTOP')}
                className={cn(
                  "p-3 rounded-[20px] flex flex-col items-center gap-2 transition-all border-2",
                  deviceType === 'DESKTOP' 
                    ? "bg-surface-container text-on-surface border-transparent" 
                    : "bg-tertiary text-on-tertiary border-tertiary"
                )}
              >
                {deviceType === 'DESKTOP' ? <Monitor size={20} /> : <Smartphone size={20} />}
                <span className="text-[10px] font-bold uppercase tracking-wider">Device</span>
              </button>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={simulateMissedDeadline}
                className="w-full py-3 rounded-[16px] bg-error-container text-on-error-container font-bold text-sm hover:bg-error-container/80 transition-colors flex items-center justify-center gap-2"
              >
                <AlertTriangle size={16} />
                Simulate Missed Deadline ({metrics.missedDeadlines})
              </button>
              
              <div className="grid grid-cols-4 gap-2 pt-2">
                 <PersonaButton label="New" onClick={resetSimulation} />
                 <PersonaButton label="Int" onClick={() => setMasteryScore(50)} />
                 <PersonaButton label="Pro" onClick={() => setMasteryScore(85)} />
                 <PersonaButton label="Stress" onClick={() => {
                  triggerPanicMode();
                }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-on-primary p-4 rounded-[20px] shadow-xl hover:scale-105 transition-transform hover:shadow-2xl hover:bg-primary/90"
      >
        <Settings size={28} />
      </button>
    </div>
  );
}
