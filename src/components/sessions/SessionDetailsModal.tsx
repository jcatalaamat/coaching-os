"use client";

import { useState, useEffect, useMemo } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import TextArea from "@/components/form/input/TextArea";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Session } from "@/types/entities";
import { useClients, usePrograms, useSessions, useNotes } from "@/lib/store/useStore";
import { formatDateTime, formatDuration, formatRelativeTime } from "@/lib/utils/formatters";

interface SessionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
}

const statusOptions = [
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const durationOptions = [
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "60 minutes" },
  { value: "90", label: "90 minutes" },
  { value: "120", label: "2 hours" },
];

const locationOptions = [
  { value: "Zoom", label: "Zoom" },
  { value: "Google Meet", label: "Google Meet" },
  { value: "Phone", label: "Phone Call" },
  { value: "In-Person", label: "In-Person" },
];

export function SessionDetailsModal({
  isOpen,
  onClose,
  session,
}: SessionDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  const { getClientById } = useClients();
  const { getProgramById } = usePrograms();
  const { updateSession, deleteSession } = useSessions();
  const { getNotesForSession, addNote, deleteNote } = useNotes();

  useEffect(() => {
    if (session) {
      setStatus(session.status);
      setDate(session.dateTime.toISOString().split("T")[0]);
      setTime(session.dateTime.toTimeString().slice(0, 5));
      setDuration(session.durationMinutes.toString());
      setLocation(session.location);
      setIsEditing(false);
      setNewNote("");
      setIsAddingNote(false);
    }
  }, [session]);

  const sessionNotes = useMemo(() => {
    if (!session) return [];
    return getNotesForSession(session.id);
  }, [session, getNotesForSession]);

  if (!session) return null;

  const client = getClientById(session.clientId);
  const program = session.programId ? getProgramById(session.programId) : null;

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNote({
      clientId: session.clientId,
      sessionId: session.id,
      content: newNote.trim(),
    });
    setNewNote("");
    setIsAddingNote(false);
  };

  const handleDeleteNote = (noteId: string) => {
    if (confirm("Delete this note?")) {
      deleteNote(noteId);
    }
  };

  const handleSave = () => {
    const dateTime = new Date(`${date}T${time}`);
    updateSession(session.id, {
      status: status as Session["status"],
      dateTime,
      durationMinutes: parseInt(duration),
      location,
    });
    setIsEditing(false);
    onClose();
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this session? This cannot be undone.")) {
      deleteSession(session.id);
      onClose();
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setNewNote("");
    setIsAddingNote(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[500px] p-5 lg:p-8">
      <div className="flex items-start justify-between mb-6">
        <h4 className="text-lg font-medium text-gray-800 dark:text-white/90">
          Session Details
        </h4>
        <StatusBadge status={session.status} />
      </div>

      {isEditing ? (
        <div className="space-y-5">
          <div>
            <Label>Client</Label>
            <p className="text-sm text-gray-900 dark:text-white font-medium">
              {client?.name || "Unknown Client"}
            </p>
          </div>

          <div>
            <Label>Status</Label>
            <Select
              options={statusOptions}
              defaultValue={status}
              onChange={(value) => setStatus(value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <Label>Time</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Duration</Label>
              <Select
                options={durationOptions}
                defaultValue={duration}
                onChange={(value) => setDuration(value)}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Select
                options={locationOptions}
                defaultValue={location}
                onChange={(value) => setLocation(value)}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
            >
              Delete
            </Button>
            <div className="flex gap-3">
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                Client
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {client?.name || "Unknown Client"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                Program
              </p>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {program?.name || "—"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                Date & Time
              </p>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {formatDateTime(session.dateTime)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                Duration
              </p>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {formatDuration(session.durationMinutes)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
              Location
            </p>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {session.location}
            </p>
          </div>

          {/* Session Notes Section */}
          <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                Session Notes
              </p>
              {!isAddingNote && (
                <button
                  onClick={() => setIsAddingNote(true)}
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  + Add Note
                </button>
              )}
            </div>

            {isAddingNote && (
              <div className="mb-3 space-y-2">
                <TextArea
                  placeholder="Write your session notes..."
                  rows={3}
                  value={newNote}
                  onChange={(value) => setNewNote(value)}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setNewNote("");
                      setIsAddingNote(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleAddNote}>
                    Save Note
                  </Button>
                </div>
              </div>
            )}

            {sessionNotes.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {sessionNotes.map((note) => (
                  <div
                    key={note.id}
                    className="group rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50"
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                      {note.content}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {formatRelativeTime(note.createdAt)}
                      </span>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !isAddingNote && (
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  No notes for this session yet.
                </p>
              )
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <Button size="sm" variant="outline" onClick={handleClose}>
              Close
            </Button>
            <Button size="sm" onClick={() => setIsEditing(true)}>
              Edit Session
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
