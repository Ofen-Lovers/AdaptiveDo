"use client";

import { useUser } from "@/context/UserContext";
import { TaskItem } from "@/components/TaskItem";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CalendarPage() {
  const { tasks } = useUser();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Helper to get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(currentDate);
  const daysArray = Array.from({ length: days }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDay }, (_, i) => i);

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Filter tasks for selected date
  const selectedTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    return (
      taskDate.getDate() === selectedDate.getDate() &&
      taskDate.getMonth() === selectedDate.getMonth() &&
      taskDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-on-surface">Calendar</h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-surface-container-high rounded-full">
            <ChevronLeft />
          </button>
          <span className="font-bold text-lg min-w-[200px] text-center">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-surface-container-high rounded-full">
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar Grid */}
        <div className="bg-surface-container-low p-6 rounded-[32px] border border-outline-variant/20">
          <div className="grid grid-cols-7 gap-2 mb-4 text-center text-on-surface-variant font-bold text-sm">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {blanksArray.map(i => (
              <div key={`blank-${i}`} />
            ))}
            {daysArray.map(day => {
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const isSelected = 
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear();
              
              const hasTasks = tasks.some(t => {
                if (!t.dueDate) return false;
                const tDate = new Date(t.dueDate);
                return tDate.getDate() === day && tDate.getMonth() === currentDate.getMonth() && tDate.getFullYear() === currentDate.getFullYear();
              });

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    "h-12 rounded-2xl flex items-center justify-center relative transition-all",
                    isSelected 
                      ? "bg-primary text-on-primary font-bold shadow-md" 
                      : "hover:bg-surface-container-high text-on-surface"
                  )}
                >
                  {day}
                  {hasTasks && !isSelected && (
                    <div className="absolute bottom-2 w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tasks for Selected Date */}
        <div className="bg-surface-container-low p-6 rounded-[32px] border border-outline-variant/20 flex flex-col">
          <h3 className="font-bold text-xl mb-4 text-on-surface">
            Tasks for {selectedDate.toLocaleDateString()}
          </h3>
          <div className="space-y-3 flex-1 overflow-auto">
            {selectedTasks.length > 0 ? (
              selectedTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-on-surface-variant opacity-50">
                <p>No tasks scheduled</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
