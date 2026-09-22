"use client";

import React, { useState, ReactNode } from "react";

import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { MobileDrawer } from "./MobileNav";
import { FloatingDock } from "./FloatingDock";
import { ProjectDetailModal } from "@/components/projects/ProjectDetailModal";

import { useData } from "@/context/DataContext";

import { AlertCircle, RefreshCw } from "lucide-react";

export function AppShell({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { error, refreshData } = useData();

  return (<div className="min-h-screen bg-[#f4f5f8] dark:bg-[#0d1117] bg-grid-pattern text-slate-900 dark:text-slate-100 flex flex-col antialiased selection:bg-rose-400 selection:text-slate-950">
    <Navbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />


    {error && (
      <div className="bg-rose-600 text-white px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm font-bold shadow-inner">
        <div className="flex items-center gap-2 max-w-4xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>

          <button
            type="button"
            onClick={() => refreshData()}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-md text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      </div>
    )}

    <MobileDrawer
      isOpen={isMobileMenuOpen}
      onClose={() => setIsMobileMenuOpen(false)}
    />

    <div className="flex-1 flex w-full max-w-[1600px] mx-auto">
      <Sidebar />

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-32 overflow-x-hidden">
        {children}
      </main>
    </div>

    <FloatingDock />

    <ProjectDetailModal />
  </div>


  );
}
