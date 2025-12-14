"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import { ProgramType } from "@/types/entities";

interface CreateProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (program: {
    name: string;
    description: string;
    type: ProgramType;
    price: number;
    currency: string;
    numberOfSessions: number | null;
  }) => void;
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

interface FormErrors {
  name?: string;
  price?: string;
}

export function CreateProgramModal({ isOpen, onClose, onSave }: CreateProgramModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ProgramType>("1:1");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [numberOfSessions, setNumberOfSessions] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!name.trim()) {
      newErrors.name = "Program name is required";
    }
    if (!price) {
      newErrors.price = "Price is required";
    } else if (parseFloat(price) < 0) {
      newErrors.price = "Price must be a positive number";
    }
    return newErrors;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({ name: true, price: true });

    if (Object.keys(validationErrors).length > 0) return;

    onSave?.({
      name: name.trim(),
      description: description.trim(),
      type,
      price: parseFloat(price),
      currency,
      numberOfSessions: numberOfSessions ? parseInt(numberOfSessions) : null,
    });

    // Reset form
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setType("1:1");
    setPrice("");
    setCurrency("USD");
    setNumberOfSessions("");
    setErrors({});
    setTouched({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[500px] p-5 lg:p-8">
      <form onSubmit={handleSubmit}>
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          Create Program
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
              onBlur={() => handleBlur("name")}
              error={touched.name && errors.name ? true : false}
            />
            {touched.name && errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
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
                onBlur={() => handleBlur("price")}
                error={touched.price && errors.price ? true : false}
              />
              {touched.price && errors.price && (
                <p className="mt-1 text-xs text-red-500">{errors.price}</p>
              )}
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

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button size="sm" variant="outline" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button size="sm" type="submit">
            Create Program
          </Button>
        </div>
      </form>
    </Modal>
  );
}
