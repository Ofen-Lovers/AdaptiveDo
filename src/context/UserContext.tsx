"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Task, UserMode, CognitiveLoad, TimeOfDay, DeviceType, UserContextType, ThemeMode } from '@/types';

const UserContext = createContext<UserContextType | undefined>(undefined);

// Assuming initialTasks is an empty array or loaded from somewhere for a fresh start
const initialTasks: Task[] = [];

export function UserProvider({ children }: { children: React.ReactNode }) {
  // --- State ---
  const [masteryScore, setMasteryScore] = useState(0);
  const [userMode, setUserMode] = useState<UserMode>('BEGINNER'); // userMode is now stateful
  const [cognitiveLoad, setCognitiveLoad] = useState<CognitiveLoad>('LOW');
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  
  // --- Context (Simulation) ---
  // --- Context (Simulation) ---
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('DAY');
  const [deviceType, setDeviceType] = useState<DeviceType>('DESKTOP');
  const [themeMode, setThemeMode] = useState<ThemeMode>('AUTO'); // User preference
  const [userName, setUserName] = useState("Kvass User");

  // Computed theme based on mode and time
  const [theme, setTheme] = useState<'LIGHT' | 'DARK'>('LIGHT');

  // Update theme based on mode and time
  useEffect(() => {
    const updateTheme = () => {
      if (themeMode === 'AUTO') {
        const hour = new Date().getHours();
        // Light mode between 6am (6) and 6pm (18)
        const isDayTime = hour >= 6 && hour < 18;
        setTheme(isDayTime ? 'LIGHT' : 'DARK');
      } else {
        setTheme(themeMode);
      }
    };

    updateTheme(); // Initial check

    // Check every minute for auto updates
    const interval = setInterval(updateTheme, 60000);
    return () => clearInterval(interval);
  }, [themeMode]);

  // --- UI State (Lifted) ---
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isPanicProposed, setIsPanicProposed] = useState(false);

  // --- Metrics ---
  const [metrics, setMetrics] = useState({
    tasksCompleted: 0,
    missedDeadlines: 0,
    streakDays: 0,
  });

  // --- Adaptive Logic ---
  // Mode Progression
  useEffect(() => {
    if (masteryScore < 30) setUserMode('BEGINNER');
    else if (masteryScore < 80) setUserMode('INTERMEDIATE');
    else setUserMode('EXPERIENCED');
  }, [masteryScore]);

  // Auto-Panic: Check based on Kanban board structure
  const [panicDismissedAt, setPanicDismissedAt] = React.useState<number | null>(null);
  const [dismissedTaskCount, setDismissedTaskCount] = React.useState<number>(0);

  // Calculate dynamic overdue count (Strictly before TODAY)
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const overdueCount = tasks.filter(t => {
    if (!t.completed && t.dueDate) {
      const taskDate = new Date(t.dueDate);
      const taskDay = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
      return taskDay < startOfToday;
    }
    return false;
  }).length;
  
  useEffect(() => {
    // Count tasks based on Kanban board structure
    const backlogCount = tasks.filter(t => !t.inProgress && !t.completed).length;
    const inProgressCount = tasks.filter(t => t.inProgress && !t.completed).length;
    const totalWorkload = backlogCount + inProgressCount; // Total tasks to do
    
    // Propose Catch Up Mode if:
    // 1. Total workload >= 4 OR Overdue Tasks > 0
    // 2. Not already in panic mode
    // 3. Haven't already proposed
    // 4. Either never dismissed OR (workload increased OR overdue count increased)
    const shouldPropose = 
      (totalWorkload >= 4 || overdueCount > 0) && 
      cognitiveLoad !== 'PANIC' && 
      !isPanicProposed &&
      (dismissedTaskCount === 0 || totalWorkload > dismissedTaskCount);
    
    if (shouldPropose) {
      setIsPanicProposed(true);
    }
    
    // Reset proposal flag if workload drops below 4 AND no overdue tasks
    if (totalWorkload < 4 && overdueCount === 0) {
      if (isPanicProposed) {
        setIsPanicProposed(false);
      }
      if (panicDismissedAt) {
        setPanicDismissedAt(null);
      }
      if (dismissedTaskCount > 0) {
        setDismissedTaskCount(0);
      }
    }
  }, [tasks, cognitiveLoad, isPanicProposed, panicDismissedAt, dismissedTaskCount, overdueCount]);

  // --- Helper: Priority Sorting (High > Medium > Low) ---
  const sortTasks = (tasksToSort: Task[]) => {
    const priorityWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    return [...tasksToSort].sort((a, b) => {
      // First by completion status (incomplete first)
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      // Then by priority
      const weightA = priorityWeight[a.priority] || 1;
      const weightB = priorityWeight[b.priority] || 1;
      return weightB - weightA;
    });
  };

  // --- Actions ---
  const addTask = (newTaskData: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTaskData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    setTasks(prev => sortTasks([...prev, task]));
  };

  const toggleTask = (id: string) => {
    setTasks(prev => {
      const newTasks = prev.map(t => {
        if (t.id === id) {
          const completed = !t.completed;
          // Update metrics on completion
          if (completed) {
            setMasteryScore(s => Math.min(s + 5, 100));
            setMetrics(m => ({ ...m, tasksCompleted: m.tasksCompleted + 1 }));
          }
          return { ...t, completed };
        }
        return t;
      });
      return sortTasks(newTasks);
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => sortTasks(prev.map(t => t.id === id ? { ...t, ...updates } : t)));
  };

  const setTaskInProgress = (id: string, inProgress: boolean) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, inProgress, completed: false } : t));
  };

  // --- Simulation Helpers ---
  const simulateMissedDeadline = () => {
    setMetrics(m => ({ ...m, missedDeadlines: m.missedDeadlines + 1 }));
    // Just add to metrics, let the useEffect handle the proposal
  };

  const triggerPanicMode = () => {
    // This function now just ADDS the tasks to simulate the overwhelm.
    // The useEffect will catch the overdue count and trigger the proposal.
    setMetrics(m => ({ ...m, missedDeadlines: m.missedDeadlines + 3 }));
    // Add some overwhelming tasks
    const panicTasks: Task[] = [
      { id: `panic-${Math.random().toString(36).substr(2, 9)}`, title: "OVERDUE: Submit Report", completed: false, priority: 'HIGH', effort: 60, createdAt: new Date(Date.now() - 86400000), dueDate: new Date(Date.now() - 86400000) }, // Past due
      { id: `panic-${Math.random().toString(36).substr(2, 9)}`, title: "URGENT: Fix Bug #992", completed: false, priority: 'HIGH', effort: 45, createdAt: new Date(Date.now() - 86400000), dueDate: new Date(Date.now() - 86400000) },
      { id: `panic-${Math.random().toString(36).substr(2, 9)}`, title: "Email Boss ASAP", completed: false, priority: 'HIGH', effort: 10, createdAt: new Date(Date.now() - 86400000), dueDate: new Date(Date.now() - 86400000) },
      { id: `panic-${Math.random().toString(36).substr(2, 9)}`, title: "Missed Call: Mom", completed: false, priority: 'HIGH', effort: 5, createdAt: new Date(Date.now() - 86400000), dueDate: new Date(Date.now() - 86400000) },
    ];
    setTasks(prev => sortTasks([...prev, ...panicTasks]));
  };

  const resetSimulation = () => {
    setMasteryScore(0);
    setCognitiveLoad('LOW');
    setMetrics({ tasksCompleted: 0, missedDeadlines: 0, streakDays: 0 });
    setTasks(initialTasks);
    setHasSeenOnboarding(false);
    setHasSeenOnboarding(false);
    setThemeMode('AUTO');
    setTimeOfDay('DAY');
    setIsPanicProposed(false);
    setUserName("Kvass User");
  };

  return (
    <UserContext.Provider value={{
      masteryScore,
      userMode,
      cognitiveLoad,
      tasks,
      timeOfDay,
      deviceType,
      metrics,
      editingTask,
      hasSeenOnboarding,
      theme,
      themeMode,
      userName,
      isPanicProposed,
      overdueCount,
      
      addTask,
      toggleTask,
      deleteTask,
      updateTask,
      setTaskInProgress,
      setEditingTask,
      setHasSeenOnboarding,
      setThemeMode,
      setUserName,
      setIsPanicProposed,
      setPanicDismissedAt,
      setDismissedTaskCount,
      
      setMasteryScore,
      setCognitiveLoad,
      setTimeOfDay,
      setDeviceType,
      simulateMissedDeadline,
      triggerPanicMode,
      resetSimulation,
      setMetrics,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
