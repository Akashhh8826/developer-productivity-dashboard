"use client";

import React, { useState, useRef, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { ColorPalette, ThemeMode } from "@/types";
import { Sun, Moon, Palette, Check } from "lucide-react";

export interface PaletteOption {
  id: ColorPalette;
  name: string;
  primaryColor: string;
}

export const PALETTE_OPTIONS: PaletteOption[] = [
  { id: "indigo", name: "Slate Indigo", primaryColor: "#6366f1" },
  { id: "emerald", name: "Cyber Emerald", primaryColor: "#10b981" },
  { id: "cyan", name: "Sapphire Cyan", primaryColor: "#06b6d4" },
  { id: "rose", name: "Sunset Rose", primaryColor: "#f43f5e" },
  { id: "purple", name: "Amethyst Purple", primaryColor: "#a855f7" },
  { id: "amber", name: "Solar Amber", primaryColor: "#f59e0b" },
];

export function ThemeSelector() {
  const { mode, setMode, toggleMode, colorPalette, setColorPalette } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activePalette = PALETTE_OPTIONS.find((p) => p.id === colorPalette) || PALETTE_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center gap-1.5" ref={dropdownRef}>
      {/* Direct Quick Light / Dark Mode Toggle Button */}
      <button
        type="button"
        onClick={toggleMode}
        className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        title={`Switch to ${mode === "dark" ? "Light" : "Dark"} Mode`}
        aria-label="Toggle dark/light mode"
      >
        {mode === "dark" ? (
          <Moon className="w-4 h-4 text-indigo-400" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500" />
        )}
      </button>

      {/* Color Palette Selector Dropdown */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        title="Choose color accent theme"
        aria-label="Color theme palette selector"
      >
        <Palette className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        <span className="hidden sm:inline-block font-medium">{activePalette.name}</span>
        <span
          className="w-3 h-3 rounded-full shrink-0 shadow-xs"
          style={{ backgroundColor: activePalette.primaryColor }}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Mode Switcher Header in Dropdown */}
          <div className="px-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Theme Mode
            </span>
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setMode("light")}
                className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  mode === "light"
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setMode("dark")}
                className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  mode === "dark"
                    ? "bg-slate-700 text-white shadow-xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Color Palettes Header */}
          <div className="px-3.5 pt-2.5 pb-1 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Color Palette
            </span>
            <span className="text-[10px] font-mono text-slate-400">6 Colors</span>
          </div>

          <div className="py-1 px-1.5 space-y-0.5 max-h-64 overflow-y-auto">
            {PALETTE_OPTIONS.map((p) => {
              const isSelected = p.id === colorPalette;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setColorPalette(p.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/10 shrink-0"
                      style={{ backgroundColor: p.primaryColor }}
                    />
                    <span>{p.name}</span>
                  </div>

                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
