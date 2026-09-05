"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useData } from "@/context/DataContext";
import { ProjectStatus, ProjectIconType } from "@/types";
import {
  FolderKanban,
  Calendar,
  AlertCircle,
  Layers,
  Sparkles,
  AlignLeft,
  Plus,
  X,
  ShoppingCart,
  Laptop,
  Smartphone,
  Megaphone,
  Gauge,
  BookOpen,
} from "lucide-react";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_TECH_STACKS = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "Python",
  "GraphQL",
  "PostgreSQL",
  "Redis",
  "Docker",
  "Stripe",
  "AWS",
];

const ICONS_LIST: { type: ProjectIconType; label: string; icon: any }[] = [
  { type: "shopping-cart", label: "E-Commerce", icon: ShoppingCart },
  { type: "laptop", label: "Web / Portfolio", icon: Laptop },
  { type: "smartphone", label: "Mobile App", icon: Smartphone },
  { type: "megaphone", label: "Marketing", icon: Megaphone },
  { type: "gauge", label: "SaaS / Analytics", icon: Gauge },
  { type: "book-open", label: "Education / LMS", icon: BookOpen },
];

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const { addProject } = useData();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("active");
  const [selectedIcon, setSelectedIcon] = useState<ProjectIconType>("laptop");
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [selectedTechs, setSelectedTechs] = useState<string[]>([
    "Next.js",
    "TypeScript",
  ]);
  const [customTechInput, setCustomTechInput] = useState("");
  const [errorText, setErrorText] = useState("");

  const toggleTech = (tech: string) => {
    if (selectedTechs.includes(tech)) {
      setSelectedTechs(selectedTechs.filter((t) => t !== tech));
    } else {
      setSelectedTechs([...selectedTechs, tech]);
    }
  };

  const handleAddCustomTech = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    const trimmed = customTechInput.trim();
    if (!trimmed) return;
    if (!selectedTechs.includes(trimmed)) {
      setSelectedTechs([...selectedTechs, trimmed]);
    }
    setCustomTechInput("");
  };

  const handleRemoveTech = (tech: string) => {
    setSelectedTechs(selectedTechs.filter((t) => t !== tech));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorText("Project name is required");
      return;
    }
    if (!description.trim()) {
      setErrorText("Project description is required");
      return;
    }
    if (selectedTechs.length === 0) {
      setErrorText("Please select at least one technology stack tag");
      return;
    }

    addProject({
      name: name.trim(),
      description: description.trim(),
      techStack: selectedTechs,
      status,
      dueDate,
      icon: selectedIcon,
    });

    // Reset & close
    setName("");
    setDescription("");
    setStatus("active");
    setSelectedIcon("laptop");
    setDueDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
    setSelectedTechs(["Next.js", "TypeScript"]);
    setErrorText("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Engineering Project"
      description="Initialize a codebase repository with architecture stack, delivery milestones, and sprint tracking."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorText && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorText}</span>
          </div>
        )}

        {/* Project Icon Category Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Category Icon
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {ICONS_LIST.map((item) => {
              const IconComponent = item.icon;
              const isSelected = selectedIcon === item.type;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setSelectedIcon(item.type)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#ff8585] text-slate-950 border-slate-900 shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.9)]"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-[10px] font-bold truncate max-w-full">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Project Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errorText) setErrorText("");
            }}
            placeholder="e.g., E-Commerce Website"
            required
            autoFocus
            className="w-full px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-900 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Description & Architecture <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errorText) setErrorText("");
            }}
            placeholder="High-throughput storefront with Stripe integration..."
            required
            className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-900 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Tech Stack Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Technology Tags</span>
            <span className="text-[10px] font-normal text-slate-400">Click to toggle</span>
          </label>

          <div className="flex flex-wrap gap-1.5">
            {COMMON_TECH_STACKS.map((tech) => {
              const isSelected = selectedTechs.includes(tech);
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleTech(tech)}
                  className={`px-2 py-0.5 text-[11px] font-bold rounded-md border transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400"
                  }`}
                >
                  {tech}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={customTechInput}
              onChange={(e) => setCustomTechInput(e.target.value)}
              onKeyDown={handleAddCustomTech}
              placeholder="Or type custom stack tag..."
              className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-900 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddCustomTech}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>

        {/* Status and Due Date */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="w-full px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-900 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
            >
              <option value="active">Active (In Progress)</option>
              <option value="planning">Planning</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-900 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="neo-btn bg-[#ff8585] text-slate-950 text-xs font-black shadow-neo-sm hover:bg-[#ff7070]"
          >
            Create Project
          </button>
        </div>
      </form>
    </Modal>
  );
}

