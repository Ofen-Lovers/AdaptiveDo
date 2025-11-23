"use client";

import { TaskList } from "@/components/TaskList";
import { useUser } from "@/context/UserContext";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TimelineView } from "@/components/TimelineView";
import { OnboardingModal } from "@/components/OnboardingModal";
import { CommandPalette } from "@/components/CommandPalette";

import { useState, useEffect } from "react";
import { LayoutList, Kanban, CalendarDays } from "lucide-react";

export default function Home() {
  const { userMode, cognitiveLoad, setCognitiveLoad, tasks, overdueCount, isPanicProposed, masteryScore } = useUser();
  const [view, setView] = useState<'LIST' | 'KANBAN' | 'TIMELINE'>('LIST');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only active if mastery >= 100
      if (masteryScore < 100) return;

      // Ignore if typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Single key shortcuts (no modifiers needed)
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'k':
            e.preventDefault();
            setIsCommandPaletteOpen(prev => !prev);
            break;
          case 'b': // Board (Kanban)
            e.preventDefault();
            setView('KANBAN');
            break;
          case 'c': // Calendar (Timeline)
            e.preventDefault();
            setView('TIMELINE');
            break;
          case 'l': // List
            e.preventDefault();
            setView('LIST');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [masteryScore]);

  return (
    <>
      <OnboardingModal />
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />

      {/* Shortcuts Bar - Only for Mastery >= 100 */}
      {masteryScore >= 100 && (
        <div className="w-full max-w-2xl mx-auto mb-6 flex items-center justify-center gap-4 text-xs text-muted-foreground bg-surface-container-low p-2 rounded-full border border-outline-variant/50 shadow-sm">
          <div className="flex items-center gap-1">
            <span className="bg-surface-container-highest px-1.5 py-0.5 rounded font-mono text-on-surface">K</span>
            <span>Search</span>
          </div>
          <div className="w-px h-3 bg-outline-variant"></div>
          <div className="flex items-center gap-1">
            <span className="bg-surface-container-highest px-1.5 py-0.5 rounded font-mono text-on-surface">L</span>
            <span>List</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="bg-surface-container-highest px-1.5 py-0.5 rounded font-mono text-on-surface">B</span>
            <span>Board</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="bg-surface-container-highest px-1.5 py-0.5 rounded font-mono text-on-surface">C</span>
            <span>Calendar</span>
          </div>
        </div>
      )}

      {/* Manual Focus Mode Trigger */}
      {cognitiveLoad !== 'PANIC' && !isPanicProposed && (tasks.filter(t => !t.completed).length >= 4 || overdueCount > 0) && (
        <div className="mb-6">
          <button
            onClick={() => setCognitiveLoad('PANIC')}
            className="w-full py-4 rounded-[24px] bg-error/10 text-error border border-error/20 hover:bg-error/20 transition-all flex items-center justify-center gap-3 font-bold animate-pulse"
          >
            <span className="text-2xl">🧘</span>
            <span>Enter Focus Mode</span>
          </button>
        </div>
      )}


      {/* View Switcher - Only for Experienced Users */}
      {userMode === 'EXPERIENCED' && (
        <div className="flex justify-end mb-6 gap-2 items-center">
          {masteryScore >= 100 && (
            <div className="text-xs text-muted-foreground mr-2 hidden md:block">
              <span className="bg-muted px-1.5 py-0.5 rounded border border-border">⌘K</span> Search
            </div>
          )}
          <button
            onClick={() => setView('LIST')}
            title={masteryScore >= 100 ? "List View (Cmd+L)" : "List View"}
            className={`p-2 rounded ${view === 'LIST' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            <LayoutList size={16} />
          </button>
          <button
            onClick={() => setView('KANBAN')}
            title={masteryScore >= 100 ? "Kanban View (Cmd+B)" : "Kanban View"}
            className={`p-2 rounded ${view === 'KANBAN' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            <Kanban size={16} />
          </button>
          <button
            onClick={() => setView('TIMELINE')}
            title={masteryScore >= 100 ? "Timeline View (Cmd+C)" : "Timeline View"}
            className={`p-2 rounded ${view === 'TIMELINE' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            <CalendarDays size={16} />
          </button>
        </div>
      )}

      {view === 'LIST' && <TaskList />}
      {view === 'KANBAN' && <KanbanBoard />}
      {view === 'TIMELINE' && <TimelineView />}
    </>
  );
}
