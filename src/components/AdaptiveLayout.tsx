"use client";

import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckSquare, Calendar, LayoutDashboard, Settings, Menu, Home, Plus } from "lucide-react";
import { SimulationPanel } from "./SimulationPanel";
import { TaskEditModal } from "./TaskEditModal";
import { ThemeSuggestion } from "./ThemeSuggestion";
import { PanicProposalModal } from "./PanicProposalModal";
import { ConfettiCelebration } from "./ConfettiCelebration";
import { FeatureUnlockNotification } from "./FeatureUnlockNotification";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface AdaptiveLayoutProps {
  children: React.ReactNode;
}

export function AdaptiveLayout({ children }: AdaptiveLayoutProps) {
  const { userMode, cognitiveLoad, setCognitiveLoad, timeOfDay, deviceType, editingTask, setEditingTask, theme, tasks, metrics, isPanicProposed, overdueCount } = useUser();
  const pathname = usePathname();
  
  // Sidebar visibility logic
  const showSidebar = deviceType === 'DESKTOP' && cognitiveLoad !== 'PANIC';
  
  // Apply Dark Mode Class to HTML element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'DARK');
  }, [theme]);
  
  // Background class based on Theme (not just time)
  const bgClass = theme === 'DARK' ? 'bg-surface-container-lowest' : 'bg-surface';

  // Calculate if we should show the manual "Enter Catch Up" button
  // Show if: Not in panic mode, not proposed, but workload is high or missed deadlines exist
  const backlogCount = tasks.filter(t => !t.inProgress && !t.completed).length;
  const inProgressCount = tasks.filter(t => t.inProgress && !t.completed).length;
  const totalWorkload = backlogCount + inProgressCount;
  
  const showManualCatchUp = cognitiveLoad !== 'PANIC' && !isPanicProposed && (totalWorkload >= 4 || overdueCount > 0);

  return (
    <div className={cn("min-h-screen transition-colors duration-700 p-4 md:p-6 flex gap-6", bgClass)}>
      
      {/* Sidebar - Floating Island (Desktop Only) */}
      <motion.aside
        initial={{ width: showSidebar ? 280 : 0, opacity: showSidebar ? 1 : 0 }}
        animate={{ width: showSidebar ? 280 : 0, opacity: showSidebar ? 1 : 0 }}
        className="bg-surface-container-low rounded-[32px] overflow-hidden flex-shrink-0 shadow-sm border border-outline-variant/20 hidden md:flex flex-col"
      >
        <div className="p-8">
          <h1 className="font-bold text-3xl tracking-tight text-primary">AdaptiveDo</h1>
          <p className="text-xs font-bold text-on-surface-variant mt-2 uppercase tracking-widest">
            {userMode} MODE
          </p>
        </div>
        
        <nav className="px-6 space-y-2 flex-1">
          <NavItem href="/" icon={<CheckSquare size={22} />} label="Tasks" active={pathname === '/'} />
          {/* Progressive Disclosure: Calendar only for Intermediate+ */}
          {userMode !== 'BEGINNER' && (
            <NavItem href="/calendar" icon={<Calendar size={22} />} label="Calendar" active={pathname === '/calendar'} />
          )}
            {/* Progressive Disclosure: Dashboard only for Experienced */}
          {userMode === 'EXPERIENCED' && (
            <NavItem href="/dashboard" icon={<LayoutDashboard size={22} />} label="Dashboard" active={pathname === '/dashboard'} />
          )}
            <div className="pt-8 space-y-2">
              <NavItem href="/settings" icon={<Settings size={22} />} label="Settings" active={pathname === '/settings'} />
            </div>
        </nav>
        
        <div className="p-6">
           {/* Placeholder for user profile or extra actions */}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 overflow-auto relative rounded-[32px] border border-outline-variant/10 transition-all duration-500",
        timeOfDay === 'NIGHT' ? "bg-surface-container-lowest/50" : "bg-surface-container-lowest/50",
        deviceType === 'MOBILE' ? "mb-20" : "" // Space for bottom nav
      )}>
        {/* Panic Mode Header */}
        {cognitiveLoad === 'PANIC' && (
          <motion.div 
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="bg-error-container text-on-error-container mx-6 mt-6 p-4 rounded-[24px] text-center text-sm font-bold flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧘</span> 
              <span>Focus Mode Active. Let's just do one thing.</span>
            </div>
            <button 
              onClick={() => setCognitiveLoad('LOW')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-xs transition-colors"
            >
              Exit
            </button>
          </motion.div>
        )}

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {deviceType === 'MOBILE' && (
        <>
          {/* Floating Action Button */}
          <button
            onClick={() => setEditingTask({ 
              id: '', 
              title: '', 
              completed: false, 
              priority: 'MEDIUM', 
              effort: 15, 
              createdAt: new Date() 
            })}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 p-5 bg-primary text-on-primary rounded-full shadow-2xl hover:scale-110 transition-transform"
          >
            <Plus size={28} strokeWidth={2.5} />
          </button>

          {/* Bottom Navigation Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-surface-container-low border-t border-outline-variant/20 p-4 pb-6 flex justify-around items-center z-40 rounded-t-[32px] shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
            <Link href="/" className={cn("p-2 flex flex-col items-center gap-1", pathname === '/' ? "text-primary" : "text-on-surface-variant")}>
              <Home size={24} />
              <span className="text-[10px] font-bold">Home</span>
            </Link>
            
            {/* Calendar - Only for Intermediate+ */}
            {userMode !== 'BEGINNER' && (
              <Link href="/calendar" className={cn("p-2 flex flex-col items-center gap-1", pathname === '/calendar' ? "text-primary" : "text-on-surface-variant")}>
                <Calendar size={24} />
                <span className="text-[10px] font-bold">Calendar</span>
              </Link>
            )}
            
            {/* Dashboard - Only for Experienced */}
            {userMode === 'EXPERIENCED' && (
              <Link href="/dashboard" className={cn("p-2 flex flex-col items-center gap-1", pathname === '/dashboard' ? "text-primary" : "text-on-surface-variant")}>
                <LayoutDashboard size={24} />
                <span className="text-[10px] font-bold">Dashboard</span>
              </Link>
            )}
            
            <Link href="/settings" className={cn("p-2 flex flex-col items-center gap-1", pathname === '/settings' ? "text-primary" : "text-on-surface-variant")}>
              <Settings size={24} />
              <span className="text-[10px] font-bold">Settings</span>
            </Link>
          </div>
        </>
      )}

      <SimulationPanel />
      <ThemeSuggestion />
      <PanicProposalModal />
      <ConfettiCelebration />
      <FeatureUnlockNotification />
      
      {/* Global Edit Modal */}
      {editingTask && (
        <TaskEditModal 
          task={editingTask} 
          isOpen={!!editingTask} 
          onClose={() => setEditingTask(null)} 
        />
      )}
    </div>
  );
}

function NavItem({ icon, label, active, href }: { icon: React.ReactNode, label: string, active?: boolean, href: string }) {
  return (
    <Link href={href} className={cn(
      "flex items-center gap-4 w-full px-6 py-4 rounded-[24px] text-base font-medium transition-all duration-300",
      active 
        ? "bg-primary-container text-on-primary-container shadow-sm" 
        : "hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface"
    )}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}
