"use client";

import { useUser } from "@/context/UserContext";
import { Task } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Trash2, Clock, Tag, AlertCircle, Pencil } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface TaskItemProps {
  task: Task;
  isDraggable?: boolean;
}

export function TaskItem({ task, isDraggable = false }: TaskItemProps) {
  const { userMode, toggleTask, deleteTask, cognitiveLoad, setEditingTask } = useUser();
  
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    disabled: !isDraggable,
  });

  const isBeginner = userMode === 'BEGINNER';
  const isPanic = cognitiveLoad === 'PANIC';
  
  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "group flex items-center gap-5 rounded-[24px] border transition-all duration-300",
        task.completed 
          ? "bg-surface-container-highest/40 border-transparent opacity-60" 
          : "bg-surface-container-lowest border-outline-variant/30 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5",
        isBeginner ? "p-6" : "p-5",
        isDragging && "opacity-50 cursor-grabbing",
        isDraggable && !isDragging && "cursor-grab"
      )}
    >
      {/* Checkbox - Squircle Style */}
      <button
        onClick={() => toggleTask(task.id)}
        className={cn(
          "flex items-center justify-center rounded-xl border-2 transition-all duration-300",
          isBeginner ? "w-9 h-9" : "w-7 h-7",
          task.completed 
            ? "bg-primary border-primary text-on-primary rotate-0" 
            : "border-outline hover:border-primary hover:bg-primary/10 -rotate-12 hover:rotate-0"
        )}
      >
        {task.completed && <Check size={isBeginner ? 20 : 16} strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-bold transition-all",
          task.completed ? "text-on-surface-variant line-through" : "text-on-surface",
          isBeginner ? "text-xl" : "text-lg"
        )}>
          {task.title}
        </p>
        
        {/* Metadata - Hidden for Beginners */}
        {!isBeginner && (
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs font-bold text-on-surface-variant tracking-wide">
            {task.dueDate && (
              <span className="flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-lg whitespace-nowrap">
                <Clock size={14} />
                {task.dueDate.toLocaleDateString()}
              </span>
            )}
            {task.category && (
              <span className="flex items-center gap-1.5 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-lg whitespace-nowrap">
                <Tag size={14} />
                {task.category}
              </span>
            )}
            {task.priority !== 'LOW' && (
              <span className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-lg whitespace-nowrap",
                task.priority === 'HIGH' 
                  ? "bg-error-container text-on-error-container" 
                  : "bg-tertiary-container text-on-tertiary-container"
              )}>
                <AlertCircle size={14} />
                {task.priority}
              </span>
            )}
             <span className="flex items-center gap-1 px-2 text-outline whitespace-nowrap">
                {task.effort}m
              </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setEditingTask(task)}
          className="p-3 text-on-surface-variant hover:text-primary hover:bg-primary-container rounded-xl transition-all"
        >
          <Pencil size={isBeginner ? 22 : 20} />
        </button>
        <button
          onClick={() => deleteTask(task.id)}
          className="p-3 text-on-surface-variant hover:text-error hover:bg-error-container rounded-xl transition-all"
        >
          <Trash2 size={isBeginner ? 22 : 20} />
        </button>
      </div>
    </motion.div>
  );
}
