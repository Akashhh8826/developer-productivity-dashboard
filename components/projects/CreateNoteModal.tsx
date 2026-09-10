"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useData } from "@/context/DataContext";
import { FileText, Sparkles } from "lucide-react";

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId: string;
}

export function CreateNoteModal({
  isOpen,
  onClose,
  defaultProjectId,
}: CreateNoteModalProps) {
  const { addNote } = useData();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Specifications");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addNote({
      projectId: defaultProjectId,
      title: title.trim(),
      category: category.trim(),
      content: content.trim() || "### Notes & Implementation Details\n- ",
    });

    setTitle("");
    setContent("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Project Note"
      description="Add technical documentation, architecture specs, or sprint brainstorming notes."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Note Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., API Integration Plan or DB Migration"
            className="w-full px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-900 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none text-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-900 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none text-slate-900 dark:text-slate-100 cursor-pointer"
          >
            <option value="Specifications">Specifications</option>
            <option value="Architecture">Architecture</option>
            <option value="Database">Database</option>
            <option value="Design">UI/UX Design</option>
            <option value="Brainstorming">Brainstorming</option>
            <option value="General">General</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Content (Markdown)
          </label>
          <textarea
            rows={7}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write markdown specs, checklists, endpoints..."
            className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-900 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none text-slate-900 dark:text-slate-100"
          />
        </div>

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
            className="neo-btn neo-btn-primary text-xs font-black shadow-neo-sm"
          >
            Save Note
          </button>
        </div>
      </form>
    </Modal>
  );
}
