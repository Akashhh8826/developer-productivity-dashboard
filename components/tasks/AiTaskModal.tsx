"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { useData } from "@/context/DataContext";
import { api } from "@/lib/api";
import { Sparkles, Loader2, FolderKanban, Check, AlertCircle, Plus } from "lucide-react";
import { PriorityBadge } from "@/components/ui/PriorityBadge";

interface SuggestedTask {
  title: string;
  priority: "low" | "medium" | "high";
  rationale: string;
}

interface AiSuggestResponse {
  success: boolean;
  data: SuggestedTask[];
  message?: string;
}

interface AiTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiTaskModal({ isOpen, onClose }: AiTaskModalProps) {
  const { projects, refreshData } = useData();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [suggestedTasks, setSuggestedTasks] = useState<SuggestedTask[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  const handleFetchSuggestions = async () => {
    if (!selectedProjectId) {
      setErrorText("Please select a project first.");
      return;
    }

    try {
      setIsSuggesting(true);
      setErrorText(null);
      setSuggestedTasks([]);
      setSelectedIndices(new Set());

      const response = await api.post<AiSuggestResponse>("/api/ai/suggest-tasks", {
        projectId: selectedProjectId,
      });

      if (response && Array.isArray(response.data)) {
        setSuggestedTasks(response.data);
        setSelectedIndices(new Set(response.data.map((_, i) => i)));
      } else {
        setErrorText("No task suggestions received.");
      }
    } catch (err: any) {
      const msg = err?.message || "Failed to generate AI task suggestions.";
      setErrorText(msg);
    } finally {
      setIsSuggesting(false);
    }
  };

  const toggleTaskSelection = (index: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleAcceptTasks = async () => {
    const tasksToAccept = suggestedTasks.filter((_, idx) => selectedIndices.has(idx));
    if (tasksToAccept.length === 0) {
      setErrorText("Please select at least one task to accept.");
      return;
    }

    try {
      setIsAccepting(true);
      setErrorText(null);

      await api.post("/api/ai/suggest-tasks/accept", {
        projectId: selectedProjectId,
        tasks: tasksToAccept,
      });

      await refreshData();
      onClose();
    } catch (err: any) {
      setErrorText(err?.message || "Failed to accept AI suggestions.");
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Task Suggestions"
      description="Select a project and let AI analyze project goals to generate actionable development tasks."
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {errorText && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorText}</div>
          </div>
        )}

        {/* Project Selector & Generate Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <FolderKanban className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>Select Target Project</span>
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setSuggestedTasks([]);
                setErrorText(null);
              }}
              className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleFetchSuggestions}
            disabled={isSuggesting || !selectedProjectId}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSuggesting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Tasks</span>
              </>
            )}
          </button>
        </div>

        {/* Suggested Tasks Results */}
        {suggestedTasks.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Suggested Tasks ({selectedIndices.size}/{suggestedTasks.length} Selected)
              </span>
              <button
                type="button"
                onClick={() => {
                  if (selectedIndices.size === suggestedTasks.length) {
                    setSelectedIndices(new Set());
                  } else {
                    setSelectedIndices(new Set(suggestedTasks.map((_, i) => i)));
                  }
                }}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
              >
                {selectedIndices.size === suggestedTasks.length ? "Deselect All" : "Select All"}
              </button>
            </div>

            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {suggestedTasks.map((task, index) => {
                const isChecked = selectedIndices.has(index);
                return (
                  <div
                    key={index}
                    onClick={() => toggleTaskSelection(index)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800/80 shadow-xs"
                        : "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div
                      className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        isChecked
                          ? "bg-rose-500 border-rose-500 text-white"
                          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {task.title}
                        </h4>
                        <PriorityBadge priority={task.priority} />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {task.rationale}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Accept Action Footer */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAcceptTasks}
                disabled={isAccepting || selectedIndices.size === 0}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isAccepting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Accepting...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add {selectedIndices.size} Selected Tasks</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
