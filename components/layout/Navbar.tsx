"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Code2,
  Bell,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Settings,
  User as UserIcon,
  RefreshCw,
  Layers,
  Menu,
} from "lucide-react";
import { useData } from "@/context/DataContext";
import { Avatar } from "@/components/ui/Avatar";
import { SearchBar } from "@/components/ui/SearchBar";
import { ThemeSelector } from "@/components/ui/ThemeSelector";


interface NavbarProps {
  onToggleSidebar?: () => void;
  onOpenMobileMenu?: () => void;
}

export function Navbar({ onOpenMobileMenu }: NavbarProps) {
  const {
    user,
    globalSearch,
    setGlobalSearch,
    refreshData,
    simulateErrorToggle,
    error,
    isLoading,
    stats,
  } = useData();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click or ESC
  useEffect(() => {
    const handleEvents = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key === "Escape") {
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
        return;
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleEvents);
    document.addEventListener("keydown", handleEvents);
    return () => {
      document.removeEventListener("mousedown", handleEvents);
      document.removeEventListener("keydown", handleEvents);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b-1.5 border-slate-900 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 gap-4">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 -ml-1 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link
            href="/"
            className="flex items-center gap-2.5 font-black text-slate-900 dark:text-slate-100 tracking-tight text-base sm:text-lg hover:opacity-90 transition-opacity rounded-lg"
          >
            <div className="w-8 h-8 rounded-xl bg-[#ff8585] border border-slate-900 flex items-center justify-center text-slate-950 shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.9)]">
              <Code2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="hidden sm:inline">DevPulse</span>
          </Link>
        </div>


        {/* Middle: Global Search Bar */}
        <div className="flex-1 max-w-xl mx-2 sm:mx-6">
          <SearchBar
            value={globalSearch}
            onSearch={setGlobalSearch}
            placeholder="Search projects, tasks, tech stacks..."
            className="w-full"
          />
        </div>

        {/* Right: Actions, Notifications & Profile */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Color Theme Switcher Dropdown */}
          <ThemeSelector />

          {/* Simulated Error Toggle button (useful for testing step 7) */}

          <button
            type="button"
            onClick={simulateErrorToggle}
            title={error ? "Clear simulated error" : "Simulate error state"}
            className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
              error
                ? "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800/50 dark:border-slate-800 dark:text-slate-400"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">
              {error ? "Error Active" : "Simulate Error"}
            </span>
          </button>

          {/* Refresh button */}
          <button
            type="button"
            onClick={() => refreshData()}
            disabled={isLoading}
            className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
            aria-label="Refresh dashboard data"
            title="Refresh dashboard data"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin text-brand-600" : ""}`}
            />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
              aria-expanded={isNotificationsOpen}
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {stats.overdueTasks > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Notifications
                  </h4>
                  <span className="text-[11px] text-brand-600 font-medium cursor-pointer hover:underline">
                    Mark all read
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-64 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1 rounded bg-amber-500/10 text-amber-600 shrink-0 mt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                          {stats.overdueTasks} Overdue Task{stats.overdueTasks === 1 ? "" : "s"}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Requires sprint attention in Active Projects.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1 rounded bg-emerald-500/10 text-emerald-600 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                          Sprint Milestone Met
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Portfolio CMS deployment marked 100% complete.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
              aria-expanded={isProfileOpen}
              aria-label="User profile menu"
            >
              <Avatar
                src={user?.avatar}
                name={user?.name || "Alex Chen"}
                size="sm"
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* User info header */}
                <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {user?.name || "Alex Chen"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {user?.email || "alex.chen@devops.internal"}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                    {user?.role || "Senior Full-Stack Engineer"}
                  </span>
                </div>

                {/* Dropdown links */}
                <div className="py-1">
                  <Link
                    href="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    Profile Details
                  </Link>
                  <Link
                    href="/projects"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Layers className="w-4 h-4 text-slate-400" />
                    My Projects ({stats.activeProjects})
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    Dashboard Settings
                  </Link>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      alert("Signed out (Session cleared)");
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
