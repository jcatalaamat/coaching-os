"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import { Note } from "@/types/entities";

interface EditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  onSave?: (note: Note) => void;
  onDelete?: (noteId: string) => void;
}

export function EditNoteModal({ isOpen, onClose, note, onSave, onDelete }: EditNoteModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content);
    }
  }, [note]);

  if (!note) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    onSave?.({
      ...note,
      title: title.trim() || undefined,
      content: content.trim(),
    });

    onClose();
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this note? This cannot be undone.")) {
      onDelete?.(note.id);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] p-5 lg:p-8">
      <form onSubmit={handleSubmit}>
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          Edit Note
        </h4>

        <div className="space-y-5">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              placeholder="Note title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label>
              Content <span className="text-red-500">*</span>
            </Label>
            <TextArea
              placeholder="Write your note here..."
              rows={5}
              value={content}
              onChange={(value) => setContent(value)}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button
            size="sm"
            variant="outline"
            onClick={handleDelete}
            type="button"
            className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
          >
            Delete Note
          </Button>
          <div className="flex gap-3">
            <Button size="sm" variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button size="sm" type="submit">
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
