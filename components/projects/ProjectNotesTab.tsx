"use client";

import React, { useState } from "react";
import { Project, ProjectNote } from "@/types";
import { useData } from "@/context/DataContext";
import {
  FileText,
  Search,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Tag,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";
import { CreateNoteModal } from "./CreateNoteModal";

interface ProjectNotesTabProps {
  project: Project;
}

export function ProjectNotesTab({ project }: ProjectNotesTabProps) {
  const { notes, deleteNote, updateNote } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [copied, setCopied] = useState(false);

  const projectNotes = notes.filter((n) => n.projectId === project.id);
  const filteredNotes = projectNotes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Set default selected note
  const activeNote =
    filteredNotes.find((n) => n.id === selectedNoteId) ||
    filteredNotes[0] ||
    projectNotes[0];

  const handleStartEdit = (note: ProjectNote) => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (activeNote && editTitle.trim()) {
      updateNote(activeNote.id, {
        title: editTitle.trim(),
        content: editContent.trim(),
      });
      setIsEditing(false);
    }
  };

  const handleDeleteNote = (noteId: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteNote(noteId);
      if (selectedNoteId === noteId) {
        setSelectedNoteId(null);
      }
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Documentation & Architecture Notes ({projectNotes.length})
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="neo-btn bg-[#ff8585] text-slate-950 text-xs font-black shadow-neo-sm hover:bg-[#ff7070]"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Add Note</span>
        </button>
      </div>

      {/* Split 2-Column View Matching Image 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: All Notes Search & List (5 cols) */}
        <div className="lg:col-span-5 neo-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-rose-500" />
              <span>All Notes</span>
            </h3>
            <span className="text-xs font-mono font-bold text-slate-500">
              {filteredNotes.length} Notes
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-8 pr-3 py-1.5 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-900 dark:border-slate-700 rounded-lg focus:outline-none"
            />
          </div>

          {/* Notes List */}
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {filteredNotes.map((note) => {
              const isSelected = activeNote?.id === note.id;
              return (
                <div
                  key={note.id}
                  onClick={() => {
                    setSelectedNoteId(note.id);
                    setIsEditing(false);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-rose-50/80 dark:bg-rose-950/40 border-rose-400 dark:border-rose-700 shadow-sm"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-black text-xs text-slate-900 dark:text-slate-100 truncate flex-1">
                      {note.title}
                    </h4>
                    <span className="text-[10px] font-mono font-semibold text-slate-400 shrink-0 ml-2">
                      {note.createdAt}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {note.content.replace(/[#*`]/g, "")}
                  </p>
                </div>
              );
            })}

            {filteredNotes.length === 0 && (
              <div className="text-center py-10 text-xs text-slate-400">
                No notes found. Click &quot;Add Note&quot; to create one.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Note Reader & Editor (7 cols) */}
        <div className="lg:col-span-7 neo-card p-5 space-y-4">
          {activeNote ? (
            <>
              {/* Note Header & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                    {activeNote.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>Created on {activeNote.createdAt}</span>
                    <span>•</span>
                    <span>Updated {activeNote.updatedAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(activeNote.content)}
                    className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    title="Copy Content"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      isEditing ? handleSaveEdit() : handleStartEdit(activeNote)
                    }
                    className="p-1.5 rounded-lg border border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-900 dark:text-slate-100 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditing ? "Save" : "Edit"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteNote(activeNote.id, activeNote.title)
                    }
                    className="p-1.5 rounded-lg border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Note Content (Editable or Reader) */}
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2.5 text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-900 dark:border-slate-700 rounded-lg"
                    placeholder="Note Title"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={12}
                    className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-900 dark:border-slate-700 rounded-lg focus:outline-none"
                    placeholder="Write markdown note..."
                  />
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-2 whitespace-pre-line font-medium text-slate-800 dark:text-slate-200">
                  {activeNote.content}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-xs text-slate-400">
              Select a note from the left list to view or edit details.
            </div>
          )}
        </div>
      </div>

      {/* Create Note Modal */}
      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        defaultProjectId={project.id}
      />
    </div>
  );
}
