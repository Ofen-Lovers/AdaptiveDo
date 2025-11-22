"use client";

import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";
import { Trophy, Target, Flame, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { masteryScore, metrics, userMode } = useUser();

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-on-surface">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          icon={<Trophy size={24} />} 
          label="Mastery Score" 
          value={masteryScore} 
          color="bg-primary-container text-on-primary-container"
        />
        <MetricCard 
          icon={<Target size={24} />} 
          label="Tasks Completed" 
          value={metrics.tasksCompleted} 
          color="bg-secondary-container text-on-secondary-container"
        />
        <MetricCard 
          icon={<Flame size={24} />} 
          label="Day Streak" 
          value={metrics.streakDays} 
          color="bg-tertiary-container text-on-tertiary-container"
        />
        <MetricCard 
          icon={<TrendingUp size={24} />} 
          label="Current Mode" 
          value={userMode} 
          color="bg-surface-container-high text-on-surface"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mastery Progress */}
        <div className="bg-surface-container-low p-8 rounded-[32px] border border-outline-variant/20 flex flex-col items-center justify-center text-center">
          <h3 className="font-bold text-xl mb-6 text-on-surface">Mastery Progress</h3>
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="16"
                fill="transparent"
                className="text-surface-container-high"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="16"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 88}
                strokeDashoffset={2 * Math.PI * 88 * (1 - masteryScore / 100)}
                className="text-primary transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-on-surface">{masteryScore}</span>
              <span className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Level</span>
            </div>
          </div>
          <p className="mt-6 text-on-surface-variant max-w-xs">
            Keep completing tasks to increase your mastery and unlock new features!
          </p>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-surface-container-low p-8 rounded-[32px] border border-outline-variant/20">
          <h3 className="font-bold text-xl mb-4 text-on-surface">Recent Achievements</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-surface-container rounded-2xl">
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                  <Trophy size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-on-surface">Task Master</h4>
                  <p className="text-xs text-on-surface-variant">Completed 5 tasks in a row</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) {
  return (
    <div className={`p-6 rounded-[24px] ${color} flex flex-col gap-2`}>
      <div className="flex items-center justify-between">
        <span className="font-bold text-sm opacity-80">{label}</span>
        {icon}
      </div>
      <span className="text-2xl lg:text-3xl font-bold break-words">{value}</span>
    </div>
  );
}
