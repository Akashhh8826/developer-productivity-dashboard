"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useData } from "@/context/DataContext";
import { KeyRound } from "lucide-react";

interface CreateCredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId: string;
}

export function CreateCredentialModal({
  isOpen,
  onClose,
  defaultProjectId,
}: CreateCredentialModalProps) {
  const { addCredential } = useData();
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState<"api_key" | "database" | "secret" | "oauth" | "webhook">("api_key");
  const [environment, setEnvironment] = useState<"production" | "staging" | "development">("production");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !key.trim() || !value.trim()) return;

    addCredential({
      projectId: defaultProjectId,
      name: name.trim(),
      key: key.trim().toUpperCase(),
      value: value.trim(),
      type,
      environment,
    });

    setName("");
    setKey("");
    setValue("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Store New Credential"
      description="Add an API key, database URI, or webhook secret to your project's Developer Vault."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Credential Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Stripe Live Secret Key"
            className="w-full px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-900 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Environment
            </label>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-900 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none text-slate-900 dark:text-slate-100 cursor-pointer"
            >
              <option value="production">Production</option>
              <option value="staging">Staging</option>
              <option value="development">Development</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Secret Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-900 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none text-slate-900 dark:text-slate-100 cursor-pointer"
            >
              <option value="api_key">API Key</option>
              <option value="database">Database URI</option>
              <option value="secret">Secret Token</option>
              <option value="oauth">OAuth Key</option>
              <option value="webhook">Webhook Secret</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Environment Variable Key *
          </label>
          <input
            type="text"
            required
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="e.g., STRIPE_SECRET_KEY"
            className="w-full px-3 py-2 text-xs font-mono font-bold bg-white dark:bg-slate-800 border border-slate-900 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none text-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Secret Value *
          </label>
          <input
            type="password"
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g., sk_live_51M..."
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
            className="neo-btn bg-[#fcd34d] text-slate-950 text-xs font-black shadow-neo-sm hover:bg-[#fbbf24]"
          >
            Save Credential
          </button>
        </div>
      </form>
    </Modal>
  );
}
