"use client";

import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { Plus, Zap } from "lucide-react";
import { TaskEditModal } from "./TaskEditModal";

export function QuickAdd() {
  const { addTask, userMode } = useUser();
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Simple parser for demo
    // "Buy milk #personal !high 15m"
    let title = input;
    let category = "General";
    let priority: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    let effort = 15;

    if (input.includes("#")) {
      const parts = input.split("#");
      title = parts[0].trim();
      category = parts[1].split(" ")[0].trim();
    }
    
    if (input.includes("!high")) priority = 'HIGH';
    if (input.includes("!medium")) priority = 'MEDIUM';

    addTask({
      title,
      completed: false,
      priority,
      category,
      effort,
      dueDate: new Date()
    });
    setInput("");
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (userMode === 'BEGINNER') {
    return (
      <>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full py-6 rounded-[28px] bg-surface-container-low border border-outline-variant/20 hover:bg-surface-container hover:shadow-lg transition-all flex flex-col items-center justify-center gap-3 text-primary font-bold shadow-sm group"
        >
          <div className="bg-primary text-on-primary rounded-[16px] p-3 shadow-md group-hover:scale-110 transition-transform">
            <Plus size={28} strokeWidth={3} />
          </div>
          <span className="text-lg">Add New Task</span>
        </button>
        <TaskEditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <div className="flex gap-4 mb-8">
        <form onSubmit={handleSubmit} className="relative group flex-1">
          <div className="relative">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary bg-primary-container p-2 rounded-[12px]">
              <Zap size={20} fill="currentColor" />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Quick add: 'Meeting #work !high'..."
              className="w-full pl-16 pr-6 py-5 rounded-[24px] bg-surface-container-low border-none shadow-sm focus:ring-2 focus:ring-primary/50 focus:bg-surface-container text-on-surface placeholder:text-outline transition-all text-lg font-medium"
              autoFocus
            />
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2 text-[10px] font-mono opacity-50 group-hover:opacity-100 transition-opacity">
            <span className="bg-surface-container-highest text-on-surface-variant px-3 py-1.5 rounded-[8px] border border-outline-variant font-bold">ENTER ↵</span>
          </div>
        </form>

        <button
          onClick={() => setIsModalOpen(true)}
          className="aspect-square h-auto rounded-[24px] bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary flex items-center justify-center transition-all shadow-sm hover:shadow-lg hover:scale-105 active:scale-95"
          title="Create with Details"
        >
          <Plus size={32} strokeWidth={2.5} />
        </button>
      </div>
      
      <TaskEditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
