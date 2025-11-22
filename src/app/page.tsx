"use client";

import { TaskList } from "@/components/TaskList";
import { useUser } from "@/context/UserContext";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TimelineView } from "@/components/TimelineView";
import { OnboardingModal } from "@/components/OnboardingModal";
import { MotivationalModal } from "@/components/MotivationalModal";
import { useState } from "react";
import { LayoutList, Kanban, CalendarDays } from "lucide-react";

export default function Home() {
  const { userMode } = useUser();
  const [view, setView] = useState<'LIST' | 'KANBAN' | 'TIMELINE'>('LIST');

  return (
    <>
      <OnboardingModal />
      <MotivationalModal />
      
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
