"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import { getSessionsForClient } from "@/lib/utils/helpers";
import { formatDateTime } from "@/lib/utils/formatters";

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  onSave?: (note: {
    title: string;
    content: string;
    sessionId: string;
  }) => void;
}

export function AddNoteModal({ isOpen, onClose, clientId, onSave }: AddNoteModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sessionId, setSessionId] = useState("");

  const sessions = getSessionsForClient(clientId);
  const sessionOptions = [
    { value: "", label: "No linked session" },
    ...sessions.map((session) => ({
      value: session.id,
      label: formatDateTime(session.dateTime),
    })),
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    onSave?.({
      title: title.trim(),
      content: content.trim(),
      sessionId,
    });

    // Reset form
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setSessionId("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[500px] p-5 lg:p-8">
      <form onSubmit={handleSubmit}>
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          Add Note
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

          <div>
            <Label>Link to Session</Label>
            <Select
              options={sessionOptions}
              defaultValue={sessionId}
              onChange={(value) => setSessionId(value)}
              placeholder="Select a session (optional)"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button size="sm" variant="outline" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button size="sm" type="submit">
            Save Note
          </Button>
        </div>
      </form>
    </Modal>
  );
}
