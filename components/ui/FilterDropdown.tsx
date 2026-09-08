"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  className?: string;
}

export function FilterDropdown({
  label,
  options,
  selectedValue,
  onChange,
  icon,
  className,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === selectedValue);
  const isFiltered = selectedValue !== "" && selectedValue !== "all";

  return (
    <div className={cn("relative inline-block text-left", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={cn(
          "inline-flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20",
          isFiltered
            ? "bg-brand-50/80 dark:bg-brand-950/40 border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300"
            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850"
        )}
      >
        <div className="flex items-center gap-1.5 truncate">
          {icon}
          <span className="text-slate-500 dark:text-slate-400 font-normal">{label}:</span>
          <span className="truncate">{selectedOption ? selectedOption.label : "All"}</span>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0",
            isOpen && "rotate-180 text-brand-600"
          )}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute z-30 right-0 mt-1.5 w-52 max-h-60 overflow-y-auto bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-1 focus:outline-none animate-in fade-in zoom-in-95 duration-100"
        >
          {options.map((option) => {
            const isSelected = option.value === selectedValue;
            return (
              <button
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3.5 py-2 text-sm flex items-center justify-between transition-colors",
                  isSelected
                    ? "bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 font-medium"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                )}
              >
                <span className="truncate">{option.label}</span>
                <div className="flex items-center gap-2">
                  {option.count !== undefined && (
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                      {option.count}
                    </span>
                  )}
                  {isSelected && <Check className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
