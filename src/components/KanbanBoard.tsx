"use client";

import { useUser } from "@/context/UserContext";
import { Task } from "@/types";
import { TaskItem } from "./TaskItem";
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";

function DroppableColumn({ 
  id, 
  children, 
  title, 
  count, 
  color 
}: { 
  id: string; 
  children: React.ReactNode; 
  title: string; 
  count: number; 
  color: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  
  return (
    <div 
      ref={setNodeRef}
      className={`bg-surface-container/50 rounded-[28px] p-4 flex flex-col h-full border transition-all ${
        isOver ? 'border-primary border-2 bg-primary/5' : 'border-outline-variant/50'
      }`}
    >
      <h3 className="font-bold text-on-surface mb-4 px-2 flex items-center gap-2">
        <span className={`w-3 h-3 rounded-full ${color}`}></span>
        {title}
        <span className="text-on-surface-variant text-sm font-normal ml-auto">{count}</span>
      </h3>
      <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
        {children}
      </div>
    </div>
  );
}

export function KanbanBoard() {
  const { tasks, setTaskInProgress, toggleTask } = useUser();
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required to start drag
      },
    })
  );
  
  // 3 columns: Backlog, In Progress, Done
  const backlogTasks = tasks.filter(t => !t.inProgress && !t.completed);
  const inProgressTasks = tasks.filter(t => t.inProgress && !t.completed);
  const doneTasks = tasks.filter(t => t.completed);
  
  const handleDragStart = (event: DragEndEvent) => {
    setActiveId(event.active.id as string);
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }
    
    const taskId = active.id as string;
    const targetColumn = over.id as string;
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
      setActiveId(null);
      return;
    }
    
    // Update task state based on target column
    if (targetColumn === 'backlog') {
      // Move to backlog: not in progress, not completed
      if (task.completed) {
        toggleTask(taskId); // Uncomplete it FIRST
      }
      if (task.inProgress) {
        setTaskInProgress(taskId, false);
      }
    } else if (targetColumn === 'inprogress') {
      // Move to in progress: in progress, not completed
      if (task.completed) {
        toggleTask(taskId); // Uncomplete it FIRST
      }
      setTaskInProgress(taskId, true);
    } else if (targetColumn === 'done') {
      // Move to done: completed (inProgress doesn't matter)
      if (!task.completed) {
        toggleTask(taskId);
      }
    }
    
    setActiveId(null);
  };
  
  const activeTask = tasks.find(t => t.id === activeId);

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full overflow-hidden">
        {/* Backlog Column */}
        <DroppableColumn id="backlog" title="Backlog" count={backlogTasks.length} color="bg-outline">
          {backlogTasks.map(task => (
            <TaskItem key={task.id} task={task} isDraggable={true} />
          ))}
          {backlogTasks.length === 0 && (
            <div className="text-center py-10 text-on-surface-variant opacity-50 border-2 border-dashed border-outline-variant rounded-2xl">
              No tasks in backlog
            </div>
          )}
        </DroppableColumn>

        {/* In Progress Column */}
        <DroppableColumn id="inprogress" title="In Progress" count={inProgressTasks.length} color="bg-primary">
          {inProgressTasks.map(task => (
            <TaskItem key={task.id} task={task} isDraggable={true} />
          ))}
          {inProgressTasks.length === 0 && (
            <div className="text-center py-10 text-on-surface-variant opacity-50 border-2 border-dashed border-outline-variant rounded-2xl">
              Start working on a task
            </div>
          )}
        </DroppableColumn>

        {/* Done Column */}
        <DroppableColumn id="done" title="Done" count={doneTasks.length} color="bg-tertiary">
          {doneTasks.map(task => (
            <TaskItem key={task.id} task={task} isDraggable={true} />
          ))}
          {doneTasks.length === 0 && (
            <div className="text-center py-10 text-on-surface-variant opacity-50 border-2 border-dashed border-outline-variant rounded-2xl">
              No completed tasks yet
            </div>
          )}
        </DroppableColumn>
      </div>
      
      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <div className="opacity-80 rotate-3 scale-105">
            <TaskItem task={activeTask} isDraggable={false} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
