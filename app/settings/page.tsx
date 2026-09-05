"use client";

import React, { useState, useEffect, useRef } from "react";
import { useData } from "@/context/DataContext";
import { Avatar } from "@/components/ui/Avatar";
import {
  Settings,
  User as UserIcon,
  Bell,
  Database,
  RefreshCw,
  AlertTriangle,
  Check,
  Camera,
  Upload,
  Link as LinkIcon,
  RotateCcw,
  Sparkles,
  MapPin,
  Briefcase,
  Building2,
  Mail,
  Palette,
  Sun,
  Moon,
} from "lucide-react";
import { PALETTE_OPTIONS } from "@/components/ui/ThemeSelector";



const AVATAR_PRESETS = [
  {
    label: "Default (Alex)",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    label: "Tech Lead",
    url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  },
  {
    label: "Architect",
    url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
  },
  {
    label: "Engineering Manager",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
  {
    label: "DevOps Specialist",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    label: "Full Stack Engineer",
    url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
  },
];

export default function SettingsPage() {
  const {
    user,
    updateUser,
    refreshData,
    simulateErrorToggle,
    error,
    mode,
    setMode,
    colorPalette,
    setColorPalette,
  } = useData();



  const [name, setName] = useState(user?.name || "Alex Chen");
  const [email, setEmail] = useState(user?.email || "alex.chen@devops.internal");
  const [role, setRole] = useState(user?.role || "Senior Full-Stack Engineer");
  const [department, setDepartment] = useState(user?.department || "Core Platform & Infrastructure");
  const [location, setLocation] = useState(user?.location || "San Francisco, CA (Remote)");
  const [avatar, setAvatar] = useState(user?.avatar || AVATAR_PRESETS[0].url);

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when user object loads or updates
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setRole(user.role || "");
      setDepartment(user.department || "Core Platform & Infrastructure");
      setLocation(user.location || "San Francisco, CA (Remote)");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  // Load notification preferences from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedNotifs = localStorage.getItem("devpulse_notification_prefs");
      if (savedNotifs) {
        try {
          const parsed = JSON.parse(savedNotifs);
          setEmailNotifications(parsed.emailNotifications ?? true);
          setSlackAlerts(parsed.slackAlerts ?? true);
        } catch (e) {
          console.error("Failed to parse notification preferences", e);
        }
      }
    }
  }, []);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    updateUser({
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
      department: department.trim(),
      location: location.trim(),
      avatar: avatar.trim(),
    });

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "devpulse_notification_prefs",
        JSON.stringify({ emailNotifications, slackAlerts })
      );
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 3MB)
    if (file.size > 3 * 1024 * 1024) {
      alert("Please select an image file under 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        setAvatar(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetToDefault = () => {
    if (confirm("Reset profile details to the original mock developer profile?")) {
      const defaultUser = {
        name: "Alex Chen",
        email: "alex.chen@devops.internal",
        role: "Senior Full-Stack Engineer",
        department: "Core Platform & Infrastructure",
        location: "San Francisco, CA (Remote)",
        avatar: AVATAR_PRESETS[0].url,
      };

      setName(defaultUser.name);
      setEmail(defaultUser.email);
      setRole(defaultUser.role);
      setDepartment(defaultUser.department);
      setLocation(defaultUser.location);
      setAvatar(defaultUser.avatar);

      updateUser(defaultUser);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span>Dashboard & Workspace Settings</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure developer profile, customize avatar, notification rules, and local mock data environment
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-sm text-emerald-800 dark:text-emerald-200 flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Check className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <p className="font-semibold">Profile saved successfully!</p>
            <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80">
              Your profile updates are now active and persisted across DevPulse.
            </p>
          </div>
        </div>
      )}

      {/* User Profile Card */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Developer Profile & Avatar
            </h2>
          </div>
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-xs font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* Live Profile Header & Avatar Editor */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50">
          <div className="relative group shrink-0">
            <Avatar
              src={avatar || user?.avatar}
              name={name || "Alex Chen"}
              size="xl"
              className="ring-4 ring-indigo-500/20 shadow-md w-20 h-20 text-xl"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg border-2 border-white dark:border-slate-900 transition-transform active:scale-95 cursor-pointer"
              title="Upload photo from device"
              aria-label="Upload photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                {name || "Alex Chen"}
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300">
                <Sparkles className="w-3 h-3" />
                <span>Live Preview</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {role || "Senior Full-Stack Engineer"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {department || "Core Platform & Infrastructure"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {email || "alex.chen@devops.internal"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {location || "San Francisco, CA (Remote)"}
              </span>
            </div>
          </div>
        </div>

        {/* Avatar Preset & Custom Selection Section */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Choose Preset Avatar or Upload Custom Photo</span>
            <span className="text-[11px] font-normal text-slate-400">Click any avatar to apply</span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-3">
            {AVATAR_PRESETS.map((preset, idx) => {
              const isSelected = avatar === preset.url;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(preset.url)}
                  title={preset.label}
                  className={`relative p-0.5 rounded-full transition-all cursor-pointer ${
                    isSelected
                      ? "ring-2 ring-offset-2 ring-indigo-600 ring-offset-white dark:ring-offset-slate-900 scale-105"
                      : "hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-700 opacity-80 hover:opacity-100"
                  }`}
                >
                  <Avatar
                    src={preset.url}
                    name={preset.label}
                    size="md"
                    className="w-10 h-10"
                  />
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}

            {/* Custom upload button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Upload Custom Image</span>
            </button>

            {/* Clear avatar button */}
            {avatar && (
              <button
                type="button"
                onClick={() => setAvatar("")}
                className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:underline px-2 py-1 cursor-pointer"
              >
                Use Initials
              </button>
            )}
          </div>

          {/* Optional Direct Avatar URL input */}
          <div className="pt-2">
            <details className="group">
              <summary className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer list-none flex items-center gap-1.5 font-medium select-none">
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Or enter custom image URL directly</span>
              </summary>
              <div className="mt-2.5 flex items-center gap-2">
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                />
              </div>
            </details>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSavePreferences} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Display Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Alex Chen"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Internal Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. alex.chen@devops.internal"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Role Title
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Senior Full-Stack Engineer"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Department / Team
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Core Platform & Infrastructure"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Location / Timezone
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, CA (Remote)"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="sm:col-span-2 pt-3 flex items-center gap-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Save Profile Changes</span>
            </button>
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Cancel / Reset
            </button>
          </div>
        </form>
      </section>

      {/* Color Themes & Workspace Aesthetics */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Workspace Theme & Color Aesthetics
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Toggle between Light and Dark mode, and choose your preferred accent color scheme across DevPulse.
              </p>
            </div>
          </div>
        </div>

        {/* 1. Dark vs Light Mode Switcher */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Appearance Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setMode("dark")}
              className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                mode === "dark"
                  ? "border-indigo-600 dark:border-indigo-400 bg-slate-950 text-white shadow-md"
                  : "border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-400"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">Dark Mode</p>
                  <p className="text-xs opacity-75">Sleek dark surfaces with high contrast</p>
                </div>
              </div>
              {mode === "dark" && (
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              )}
            </div>

            <div
              onClick={() => setMode("light")}
              className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                mode === "light"
                  ? "border-indigo-600 dark:border-indigo-400 bg-white text-slate-900 shadow-md ring-2 ring-indigo-500/20"
                  : "border-slate-200 dark:border-slate-800 bg-slate-50 text-slate-700 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-600">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">Light Mode</p>
                  <p className="text-xs opacity-75">Clean crisp white background and surfaces</p>
                </div>
              </div>
              {mode === "light" && (
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2. Color Accent Palette Selector */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Accent Color Palette
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {PALETTE_OPTIONS.map((p) => {
              const isSelected = colorPalette === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setColorPalette(p.id)}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "border-indigo-600 dark:border-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-850/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10 shadow-xs"
                      style={{ backgroundColor: p.primaryColor }}
                    />
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {p.name}
                    </span>
                  </div>

                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>



      {/* Notifications Rules */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <Bell className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Sprint & Deadline Notifications
          </h2>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Daily Overdue & Due-Today Digest
              </p>
              <p className="text-xs text-slate-500">
                Receive morning summary of urgent tickets and overdue tasks
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => {
                setEmailNotifications(e.target.checked);
                if (typeof window !== "undefined") {
                  localStorage.setItem(
                    "devpulse_notification_prefs",
                    JSON.stringify({ emailNotifications: e.target.checked, slackAlerts })
                  );
                }
              }}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Task Status Real-time Sync
              </p>
              <p className="text-xs text-slate-500">
                Notify project leads when task status toggles to Done or In Progress
              </p>
            </div>
            <input
              type="checkbox"
              checked={slackAlerts}
              onChange={(e) => {
                setSlackAlerts(e.target.checked);
                if (typeof window !== "undefined") {
                  localStorage.setItem(
                    "devpulse_notification_prefs",
                    JSON.stringify({ emailNotifications, slackAlerts: e.target.checked })
                  );
                }
              }}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </label>
        </div>
      </section>

      {/* Mock Data & Testing Environment Controls */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <Database className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Mock Data & Resilience Controls
          </h2>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          This dashboard runs on modular mock services with local persistence. Use the actions below to test loading, error fallbacks, and state resets.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem("devpulse_user_profile");
                localStorage.removeItem("devpulse_tasks");
                localStorage.removeItem("devpulse_projects");
              }
              refreshData();
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Data to Initial Seed</span>
          </button>

          <button
            type="button"
            onClick={simulateErrorToggle}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              error
                ? "bg-rose-600 text-white hover:bg-rose-700"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900 hover:bg-rose-100"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{error ? "Clear Simulated Error" : "Trigger Simulated Error Fallback"}</span>
          </button>
        </div>
      </section>
    </div>
  );
}
