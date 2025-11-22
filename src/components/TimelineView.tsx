"use client";

import { useUser } from "@/context/UserContext";
import { TaskItem } from "./TaskItem";
import { cn } from "@/lib/utils";

export function TimelineView() {
  const { tasks } = useUser();
  
  // Sort by due date
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.getTime() - b.dueDate.getTime();
  });

  return (
    <div className="relative pl-8 space-y-8 py-4">
      {/* Timeline Line */}
      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20"></div>

      {sortedTasks.map((task, index) => (
        <div key={task.id} className="relative">
          {/* Node */}
          <div className={cn(
            "absolute -left-[29px] top-6 w-4 h-4 rounded-full border-4 border-surface z-10",
            task.completed ? "bg-surface-container-highest" : "bg-primary shadow-[0_0_0_4px_rgba(var(--primary),0.2)]"
          )}></div>
          
          {/* Date Header if different from prev */}
          {(index === 0 || task.dueDate?.toDateString() !== sortedTasks[index-1].dueDate?.toDateString()) && (
            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2 ml-1">
              {task.dueDate ? task.dueDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'No Date'}
            </div>
          )}

          <TaskItem task={task} />
        </div>
      ))}
      
      {tasks.length === 0 && (
         <div className="text-center py-20 text-on-surface-variant">
           <p>No tasks to show on timeline.</p>
         </div>
      )}
    </div>
  );
}
