"use client";

import { useUser } from "@/context/UserContext";
import { useSmartSorting } from "@/hooks/useSmartSorting";
import { TaskItem } from "./TaskItem";
import { AnimatePresence, motion } from "framer-motion";
import { QuickAdd } from "./QuickAdd";
import { PomodoroTimer } from "./PomodoroTimer";
import { useEffect, useRef } from "react";

export function TaskList() {
  const { tasks, cognitiveLoad, setTaskInProgress } = useUser();
  const sortedTasks = useSmartSorting(tasks);
  const previousVisibleTasksRef = useRef<string[]>([]);

  // PANIC MODE: Show only "In Progress" tasks
  const inProgressTasks = sortedTasks.filter(t => t.inProgress && !t.completed);
  const visibleTasks = cognitiveLoad === 'PANIC' ? inProgressTasks : sortedTasks;

  // Auto-fetch next tasks in Focus Mode when current ones are completed
  useEffect(() => {
    if (cognitiveLoad === 'PANIC') {
      const currentVisibleIds = visibleTasks.map(t => t.id);
      const previousVisibleIds = previousVisibleTasksRef.current;
      
      // If we have no in-progress tasks, auto-fetch next 3 from backlog
      if (currentVisibleIds.length === 0) {
        const backlogTasks = tasks
          .filter(t => !t.inProgress && !t.completed)
          .slice(0, 3);
        
        backlogTasks.forEach(task => {
          setTaskInProgress(task.id, true);
        });
      }
      
      // Check if all previously visible tasks are now completed
      const allPreviousCompleted = previousVisibleIds.length > 0 && 
        previousVisibleIds.every(id => {
          const task = tasks.find(t => t.id === id);
          return task?.completed;
        });
      
      // If all previous tasks are completed and we have new tasks to show
      if (allPreviousCompleted && currentVisibleIds.length > 0 && 
          JSON.stringify(currentVisibleIds) !== JSON.stringify(previousVisibleIds)) {
        
        // Mark the new visible tasks as "in progress" for Kanban
        currentVisibleIds.forEach(id => {
          const task = tasks.find(t => t.id === id);
          if (task && !task.inProgress && !task.completed) {
            setTaskInProgress(id, true);
          }
        });
      }
      
      // Update the ref with current visible task IDs
      previousVisibleTasksRef.current = currentVisibleIds;
    }
  }, [visibleTasks, tasks, cognitiveLoad, setTaskInProgress]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">My Tasks</h2>
        <p className="text-muted-foreground">
          {tasks.filter(t => !t.completed).length} remaining
        </p>
      </div>

      {cognitiveLoad === 'PANIC' && (
        <div className="mb-6">
          <PomodoroTimer />
        </div>
      )}

      <QuickAdd />

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {visibleTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </AnimatePresence>
        
        {visibleTasks.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-muted-foreground"
          >
            <p>No tasks found. Take a deep breath!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
