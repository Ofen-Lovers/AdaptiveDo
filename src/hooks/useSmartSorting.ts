import { useUser } from "@/context/UserContext";
import { Task } from "@/types";
import { useMemo } from "react";

export function useSmartSorting(tasks: Task[]) {
  const { cognitiveLoad } = useUser();

  const sortedTasks = useMemo(() => {
    const tasksCopy = [...tasks];

    // PANIC MODE: Force sort by effort (ascending) to give "Quick Wins"
    if (cognitiveLoad === 'PANIC') {
      return tasksCopy.sort((a, b) => a.effort - b.effort);
    }

    // HIGH LOAD: Sort by Priority then Due Date
    if (cognitiveLoad === 'HIGH') {
      return tasksCopy.sort((a, b) => {
        const priorityWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        const diff = priorityWeight[b.priority] - priorityWeight[a.priority];
        if (diff !== 0) return diff;
        
        // If priority same, sort by due date
        if (a.dueDate && b.dueDate) return a.dueDate.getTime() - b.dueDate.getTime();
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return 0;
      });
    }

    // LOW LOAD: Default sort (Created At desc)
    return tasksCopy.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [tasks, cognitiveLoad]);

  return sortedTasks;
}
