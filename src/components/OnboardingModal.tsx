"use client";

import { useUser } from "@/context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle2, ArrowRight, ArrowLeft, Sun, Moon, Monitor } from "lucide-react";

export function OnboardingModal() {
  const { hasSeenOnboarding, setHasSeenOnboarding, themeMode, setThemeMode } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Only open if NOT seen onboarding
    if (!hasSeenOnboarding) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [hasSeenOnboarding]);

  const handleComplete = () => {
    setHasSeenOnboarding(true);
    setIsOpen(false);
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Welcome to AdaptiveDo",
      subtitle: "The to-do list that evolves with you.",
      icon: "👋",
      content: (
        <div className="space-y-4">
          <p className="text-on-surface-variant">
            AdaptiveDo isn't just another checklist. It's a living system that reacts to your stress levels and workload.
          </p>
          <div className="bg-secondary-container p-4 rounded-xl text-on-secondary-container flex gap-3 items-center">
            <span className="text-2xl">🧠</span>
            <p className="text-sm font-medium">Designed to reduce cognitive load and prevent burnout.</p>
          </div>
        </div>
      ),
    },
    {
      title: "Choose Your Style",
      subtitle: "Light, Dark, or Auto",
      icon: "🎨",
      content: (
        <div className="space-y-6">
          <p className="text-on-surface-variant text-center">
            Select the theme that fits your vibe. You can change this later in settings.
          </p>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setThemeMode('LIGHT')}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${themeMode === 'LIGHT' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant hover:bg-surface-container-high'}`}
            >
              <Sun size={24} />
              <span className="text-xs font-bold">Light</span>
            </button>
            <button
              onClick={() => setThemeMode('DARK')}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${themeMode === 'DARK' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant hover:bg-surface-container-high'}`}
            >
              <Moon size={24} />
              <span className="text-xs font-bold">Dark</span>
            </button>
            <button
              onClick={() => setThemeMode('AUTO')}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${themeMode === 'AUTO' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant hover:bg-surface-container-high'}`}
            >
              <Monitor size={24} />
              <span className="text-xs font-bold">Auto</span>
            </button>
          </div>
        </div>
      ),
    },
    {
      title: "It Adapts To You",
      subtitle: "Panic Mode & Focus",
      icon: "🧘",
      content: (
        <div className="space-y-4">
          <p className="text-on-surface-variant">
            When you have too many overdue tasks, the system detects "Overwhelm" and proposes <strong>Panic Mode</strong>.
          </p>
          <div className="bg-error/10 p-4 rounded-xl text-error border border-error/20">
            <h4 className="font-bold mb-1">Panic Mode</h4>
            <p className="text-sm">Hides everything except your top 3 priorities. No distractions, just execution.</p>
          </div>
        </div>
      ),
    },
    {
      title: "Gamified Progression",
      subtitle: "Unlock Features as You Grow",
      icon: "🚀",
      content: (
        <div className="space-y-4">
          <p className="text-on-surface-variant">
            You start as a <strong>Beginner</strong> with a simple list. Complete tasks to earn <strong>Mastery</strong>.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container p-3 rounded-lg border border-outline-variant">
              <div className="text-2xl mb-1">🌱</div>
              <div className="font-bold text-sm">Beginner</div>
              <div className="text-xs text-on-surface-variant">Simple List</div>
            </div>
            <div className="bg-surface-container-high p-3 rounded-lg border border-outline-variant opacity-50">
              <div className="text-2xl mb-1">🔥</div>
              <div className="font-bold text-sm">Experienced</div>
              <div className="text-xs text-on-surface-variant">
                Kanban, Calendar & Shortcuts
                <div className="mt-1 flex gap-1 flex-wrap">
                  <span className="bg-surface-container-highest px-1 rounded border border-outline-variant/50">K</span>
                  <span className="bg-surface-container-highest px-1 rounded border border-outline-variant/50">B</span>
                  <span className="bg-surface-container-highest px-1 rounded border border-outline-variant/50">C</span>
                  <span className="bg-surface-container-highest px-1 rounded border border-outline-variant/50">L</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Ready to Begin?",
      subtitle: "Your journey starts now.",
      icon: "✨",
      content: (
        <div className="space-y-4 text-center">
          <p className="text-on-surface-variant">
            Start adding tasks. If things get tough, we've got your back.
          </p>
          <div className="py-4">
            <div className="inline-block p-4 rounded-full bg-primary/10 text-primary animate-bounce">
              <ArrowRight size={32} />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-surface-container-low w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden border border-outline-variant flex flex-col"
          >
            {/* Header Image / Icon Area */}
            <div className="bg-primary p-8 text-on-primary text-center relative overflow-hidden transition-colors duration-500">
              <motion.div
                key={step}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative z-10"
              >
                <div className="mx-auto bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mb-4 backdrop-blur-md shadow-inner">
                  <span className="text-4xl">{steps[step].icon}</span>
                </div>
                <h2 className="text-2xl font-bold mb-1">{steps[step].title}</h2>
                <p className="text-primary-container/80 text-sm font-medium">{steps[step].subtitle}</p>
              </motion.div>

              {/* Decorative Circles */}
              <div className="absolute top-[-50%] left-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-[-50%] right-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            </div>

            {/* Content Area */}
            <div className="p-6 flex-1 flex flex-col">
              <motion.div
                key={step}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="flex-1"
              >
                {steps[step].content}
              </motion.div>

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between">
                {/* Dots Indicator */}
                <div className="flex gap-2">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${i === step ? "bg-primary w-6" : "bg-surface-container-highest"}`}
                    />
                  ))}
                </div>

                <div className="flex gap-3">
                  {step > 0 && (
                    <button
                      onClick={prevStep}
                      className="p-3 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                  )}

                  {step < steps.length - 1 ? (
                    <button
                      onClick={nextStep}
                      className="py-3 px-6 bg-primary text-on-primary rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2"
                    >
                      Next <ArrowRight size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={handleComplete}
                      className="py-3 px-6 bg-primary text-on-primary rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2"
                    >
                      Get Started <CheckCircle2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
