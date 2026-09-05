"use client";

import React, { useState } from "react";
import { Project, ProjectCredential } from "@/types";
import { useData } from "@/context/DataContext";
import {
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  Plus,
  Trash2,
  Database,
  Shield,
  Lock,
} from "lucide-react";
import { CreateCredentialModal } from "./CreateCredentialModal";

interface ProjectCredentialsTabProps {
  project: Project;
}

export function ProjectCredentialsTab({ project }: ProjectCredentialsTabProps) {
  const { credentials, deleteCredential } = useData();
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const projectCreds = credentials.filter((c) => c.projectId === project.id);

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (id: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete credential "${name}"?`)) {
      deleteCredential(id);
    }
  };

  const getEnvBadge = (env: string) => {
    switch (env) {
      case "production":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800";
      case "staging":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-yellow-950/60 dark:text-yellow-300 dark:border-yellow-800";
      case "development":
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800";
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Developer Secrets & API Vault ({projectCreds.length})
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Encrypted client-side secret storage for rapid development & environment configs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="neo-btn bg-[#fcd34d] text-slate-950 text-xs font-black shadow-neo-sm hover:bg-[#fbbf24]"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Add Credential</span>
        </button>
      </div>

      {/* Credentials List */}
      <div className="space-y-3">
        {projectCreds.map((cred) => {
          const isRevealed = Boolean(revealedIds[cred.id]);
          const isCopied = copiedId === cred.id;

          return (
            <div
              key={cred.id}
              className="neo-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900"
            >
              {/* Left Details */}
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-yellow-100 dark:bg-yellow-950/70 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-800">
                    <KeyRound className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 truncate">
                    {cred.name}
                  </h4>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md border uppercase tracking-wider ${getEnvBadge(
                      cred.environment
                    )}`}
                  >
                    {cred.environment}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="font-bold text-slate-600 dark:text-slate-400">
                    {cred.key}:
                  </span>
                  <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 truncate max-w-sm">
                    {isRevealed ? cred.value : "••••••••••••••••••••••••••••••••"}
                  </span>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => toggleReveal(cred.id)}
                  className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  title={isRevealed ? "Hide Secret" : "Reveal Secret"}
                >
                  {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{isRevealed ? "Hide" : "Reveal"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(cred.id, cred.value)}
                  className="p-1.5 rounded-lg border border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-900 dark:text-slate-100 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                  title="Copy secret value"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? "Copied" : "Copy"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(cred.id, cred.name)}
                  className="p-1.5 rounded-lg border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-300 text-xs font-bold transition-colors cursor-pointer"
                  title="Delete secret"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {projectCreds.length === 0 && (
          <div className="text-center py-12 neo-card p-6 text-slate-400 text-xs font-semibold">
            No credentials saved in this project. Click &quot;Add Credential&quot; above to store API keys or connection strings.
          </div>
        )}
      </div>

      {/* Create Credential Modal */}
      <CreateCredentialModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        defaultProjectId={project.id}
      />
    </div>
  );
}
