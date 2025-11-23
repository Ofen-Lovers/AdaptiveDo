"use client";

import { useUser } from "@/context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Search, X, CheckCircle2, Circle } from "lucide-react";
import { Task } from "@/types";

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
    const { tasks, toggleTask } = useUser();
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery("");
        }
    }, [isOpen]);

    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(query.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[20vh] bg-black/40 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: -20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: -20 }}
                        className="bg-surface w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-outline-variant flex flex-col max-h-[60vh]"
                    >
                        <div className="flex items-center p-4 border-b border-outline-variant gap-3">
                            <Search className="text-on-surface-variant" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search tasks..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-lg text-on-surface placeholder:text-on-surface-variant/50"
                            />
                            <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-2">
                            {filteredTasks.length === 0 ? (
                                <div className="p-8 text-center text-on-surface-variant">
                                    No tasks found matching "{query}"
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {filteredTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-highest transition-colors cursor-pointer group"
                                            onClick={() => {
                                                // Optional: Navigate to task or just toggle it
                                                // For now, let's just toggle it to show interaction
                                                toggleTask(task.id);
                                            }}
                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleTask(task.id);
                                                }}
                                                className={`text-on-surface-variant group-hover:text-primary transition-colors ${task.completed ? 'text-primary' : ''}`}
                                            >
                                                {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                            </button>
                                            <span className={`flex-1 ${task.completed ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                                                {task.title}
                                            </span>
                                            <span className="text-xs text-on-surface-variant border border-outline-variant px-2 py-1 rounded">
                                                {task.priority}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-2 bg-surface-container text-xs text-on-surface-variant flex justify-between border-t border-outline-variant">
                            <span><strong>↑↓</strong> to navigate</span>
                            <span><strong>Enter</strong> to select</span>
                            <span><strong>Esc</strong> to close</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
