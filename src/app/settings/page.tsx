"use client";

import { useUser } from "@/context/UserContext";
import { User, Trash2, Moon, Sun, Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { resetSimulation, theme, setTheme, deviceType, setDeviceType, userName, setUserName } = useUser();

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-on-surface">Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Section */}
        <div className="bg-surface-container-low p-8 rounded-[32px] border border-outline-variant/20">
          <h3 className="font-bold text-xl mb-6 text-on-surface flex items-center gap-2">
            <User size={24} />
            Profile
          </h3>
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center text-3xl font-bold text-on-primary-container">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-lg font-bold text-on-surface">{userName}</h4>
              <p className="text-on-surface-variant">Pro Member</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-on-surface-variant">Display Name</label>
              <input 
                type="text" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                maxLength={20}
                className="w-full p-4 rounded-2xl bg-surface-container border-none focus:ring-2 focus:ring-primary outline-none text-on-surface"
              />
              <p className="text-xs text-on-surface-variant text-right">{userName.length}/20</p>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="space-y-6">
          <div className="bg-surface-container-low p-8 rounded-[32px] border border-outline-variant/20">
            <h3 className="font-bold text-xl mb-6 text-on-surface">Appearance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-container rounded-2xl">
                <div className="flex items-center gap-3">
                  {theme === 'LIGHT' ? <Sun size={20} /> : <Moon size={20} />}
                  <span className="font-bold text-on-surface">Dark Mode</span>
                </div>
                <button 
                  onClick={() => setTheme(theme === 'LIGHT' ? 'DARK' : 'LIGHT')}
                  className={cn(
                    "w-12 h-7 rounded-full transition-colors relative",
                    theme === 'DARK' ? "bg-primary" : "bg-outline-variant"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm",
                    theme === 'DARK' ? "left-6" : "left-1"
                  )} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-8 rounded-[32px] border border-outline-variant/20">
            <h3 className="font-bold text-xl mb-6 text-on-surface text-error">Danger Zone</h3>
            <p className="text-sm text-on-surface-variant mb-4">
              Resetting your data will clear all tasks, mastery score, and settings. This action cannot be undone.
            </p>
            <button 
              onClick={resetSimulation}
              className="w-full p-4 bg-error-container text-on-error-container font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-error-container/80 transition-colors"
            >
              <Trash2 size={20} />
              Reset All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
