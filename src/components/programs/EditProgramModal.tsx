"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import { Program, ProgramType } from "@/types/entities";

interface EditProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
  onSave?: (program: Program) => void;
  onDelete?: (programId: string) => void;
}

const typeOptions = [
  { value: "1:1", label: "1:1 Coaching" },
  { value: "group", label: "Group Program" },
  { value: "hybrid", label: "Hybrid" },
];

const currencyOptions = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "CAD", label: "CAD ($)" },
  { value: "AUD", label: "AUD ($)" },
];

export function EditProgramModal({ isOpen, onClose, program, onSave, onDelete }: EditProgramModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ProgramType>("1:1");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [numberOfSessions, setNumberOfSessions] = useState("");

  useEffect(() => {
    if (program) {
      setName(program.name);
      setDescription(program.description);
      setType(program.type);
      setPrice(program.price.toString());
      setCurrency(program.currency);
      setNumberOfSessions(program.numberOfSessions?.toString() || "");
    }
  }, [program]);

  if (!program) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !price) return;

    onSave?.({
      ...program,
      name: name.trim(),
      description: description.trim(),
      type,
      price: parseFloat(price),
      currency,
      numberOfSessions: numberOfSessions ? parseInt(numberOfSessions) : undefined,
    });

    onClose();
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${program.name}"? This cannot be undone.`)) {
      onDelete?.(program.id);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] p-5 lg:p-8">
      <form onSubmit={handleSubmit}>
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          Edit Program
        </h4>

        <div className="space-y-5">
          <div>
            <Label>
              Program Name <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder="e.g., Executive Leadership Program"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label>Description</Label>
            <TextArea
              placeholder="Describe what this program offers..."
              rows={3}
              value={description}
              onChange={(value) => setDescription(value)}
            />
          </div>

          <div>
            <Label>Program Type</Label>
            <Select
              options={typeOptions}
              defaultValue={type}
              onChange={(value) => setType(value as ProgramType)}
              placeholder="Select type"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>
                Price <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <Label>Currency</Label>
              <Select
                options={currencyOptions}
                defaultValue={currency}
                onChange={(value) => setCurrency(value)}
                placeholder="Select currency"
              />
            </div>
          </div>

          <div>
            <Label>Number of Sessions</Label>
            <Input
              type="number"
              placeholder="Leave empty for unlimited"
              value={numberOfSessions}
              onChange={(e) => setNumberOfSessions(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Optional - leave empty for open-ended programs
            </p>
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
            Delete Program
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
