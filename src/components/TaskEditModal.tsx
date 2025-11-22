"use client";

import { useUser } from "@/context/UserContext";
import { Task, Priority } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { X, Calendar, Tag, AlertCircle, Clock, Save } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TaskEditModalProps {
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskEditModal({ task, isOpen, onClose }: TaskEditModalProps) {
  const { updateTask, addTask, userMode } = useUser();
  
  const [title, setTitle] = useState(task?.title || "");
  const [category, setCategory] = useState(task?.category || "");
  const [priority, setPriority] = useState<Priority>(task?.priority || 'LOW');
  const [effort, setEffort] = useState(task?.effort || 15);
  const [dueDate, setDueDate] = useState<string>(
    task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ""
  );

  const handleSave = () => {
    if (task) {
      updateTask(task.id, {
        title,
        category,
        priority,
        effort,
        dueDate: dueDate ? new Date(dueDate) : undefined
      });
    } else {
      addTask({
        title: title || "New Task",
        completed: false,
        category,
        priority,
        effort,
        dueDate: dueDate ? new Date(dueDate) : undefined
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-surface-container-low w-full max-w-md rounded-[28px] shadow-2xl overflow-hidden border border-outline-variant"
        >
          {/* Header */}
          <div className="bg-surface-container p-6 flex items-center justify-between border-b border-outline-variant">
            <h2 className="text-xl font-bold text-on-surface">{task ? 'Edit Task' : 'Create Task'}</h2>
            <button onClick={onClose} className="p-2 hover:bg-surface-container-highest rounded-full transition-colors">
              <X size={20} className="text-on-surface-variant" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-primary uppercase tracking-wider">Task Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-4 rounded-xl bg-surface-container-highest/50 border-none focus:ring-2 focus:ring-primary text-on-surface text-lg font-medium"
              />
            </div>

            {/* Date & Category (Intermediate+) */}
            {userMode !== 'BEGINNER' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                    <Calendar size={12} /> Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-3 rounded-xl bg-surface-container-highest/50 border-none focus:ring-2 focus:ring-primary text-on-surface text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                    <Tag size={12} /> Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Work"
                    className="w-full p-3 rounded-xl bg-surface-container-highest/50 border-none focus:ring-2 focus:ring-primary text-on-surface text-sm"
                  />
                </div>
              </div>
            )}

            {/* Priority & Effort (Experienced) */}
            {userMode === 'EXPERIENCED' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                    <AlertCircle size={12} /> Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full p-3 rounded-xl bg-surface-container-highest/50 border-none focus:ring-2 focus:ring-primary text-on-surface text-sm"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                    <Clock size={12} /> Effort (min)
                  </label>
                  <input
                    type="number"
                    value={effort}
                    onChange={(e) => setEffort(parseInt(e.target.value))}
                    className="w-full p-3 rounded-xl bg-surface-container-highest/50 border-none focus:ring-2 focus:ring-primary text-on-surface text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-surface-container-low border-t border-outline-variant flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-3 rounded-full text-sm font-medium text-on-surface-variant hover:bg-surface-container-highest transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-3 rounded-full text-sm font-bold bg-primary text-on-primary hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
