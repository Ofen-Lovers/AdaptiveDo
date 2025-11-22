"use client";

import { TaskList } from "@/components/TaskList";
import { useUser } from "@/context/UserContext";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TimelineView } from "@/components/TimelineView";
import { OnboardingModal } from "@/components/OnboardingModal";

import { useState } from "react";
import { LayoutList, Kanban, CalendarDays } from "lucide-react";

export default function Home() {
  const { userMode, cognitiveLoad, setCognitiveLoad, tasks, overdueCount, isPanicProposed } = useUser();
  const [view, setView] = useState<'LIST' | 'KANBAN' | 'TIMELINE'>('LIST');

  return (
    <>
      <OnboardingModal />
      
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
        <div className="flex justify-end mb-6 gap-2">
          <button 
            onClick={() => setView('LIST')}
            className={`p-2 rounded ${view === 'LIST' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            <LayoutList size={16} />
          </button>
          <button 
            onClick={() => setView('KANBAN')}
            className={`p-2 rounded ${view === 'KANBAN' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            <Kanban size={16} />
          </button>
          <button 
            onClick={() => setView('TIMELINE')}
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
