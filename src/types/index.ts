export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  inProgress?: boolean; // For 3-column Kanban
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  effort: number; // in minutes
  category?: string;
  dueDate?: Date;
  createdAt: Date;
}

export type UserMode = 'BEGINNER' | 'INTERMEDIATE' | 'EXPERIENCED';

export type CognitiveLoad = 'LOW' | 'HIGH' | 'PANIC';

export type TimeOfDay = 'MORNING' | 'DAY' | 'NIGHT';
export type DeviceType = 'DESKTOP' | 'MOBILE';
export type ThemeMode = 'AUTO' | 'LIGHT' | 'DARK';

export interface UserContextType {
  // State
  masteryScore: number;
  userMode: UserMode;
  cognitiveLoad: CognitiveLoad;
  tasks: Task[];
  
  // Context
  timeOfDay: TimeOfDay;
  deviceType: DeviceType;
  theme: 'LIGHT' | 'DARK'; // Computed theme based on themeMode
  themeMode: ThemeMode; // User's theme preference

  // Metrics
  metrics: {
    tasksCompleted: number;
    missedDeadlines: number;
    streakDays: number;
  };

  // UI State
  editingTask: Task | null;
  hasSeenOnboarding: boolean;
  userName: string;
  isPanicProposed: boolean;
  overdueCount: number;

  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  setTaskInProgress: (id: string, inProgress: boolean) => void;
  setEditingTask: (task: Task | null) => void;
  setHasSeenOnboarding: (seen: boolean) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setUserName: (name: string) => void;
  setIsPanicProposed: (proposed: boolean) => void;
  setPanicDismissedAt: (timestamp: number | null) => void;
  setDismissedTaskCount: (count: number) => void;
  
  // Simulation / Debug
  setMasteryScore: React.Dispatch<React.SetStateAction<number>>;
  setCognitiveLoad: (load: CognitiveLoad) => void;
  setTimeOfDay: (time: TimeOfDay) => void;
  setDeviceType: (type: DeviceType) => void;
  simulateMissedDeadline: () => void;
  triggerPanicMode: () => void;
  resetSimulation: () => void;
  setMetrics: React.Dispatch<React.SetStateAction<{ tasksCompleted: number; missedDeadlines: number; streakDays: number; }>>;
}
