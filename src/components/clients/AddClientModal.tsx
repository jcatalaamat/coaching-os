"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { ClientStatus } from "@/types/entities";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (client: {
    name: string;
    email: string;
    phone: string;
    status: ClientStatus;
    tags: string[];
  }) => void;
}

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "lead", label: "Lead" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
];

interface FormErrors {
  name?: string;
  email?: string;
}

export function AddClientModal({ isOpen, onClose, onSave }: AddClientModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<ClientStatus>("lead");
  const [tags, setTags] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateEmail = (email: string): boolean => {
    if (!email) return true; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (email && !validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({ name: true, email: true });

    if (Object.keys(validationErrors).length > 0) return;

    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSave?.({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      status,
      tags: tagArray,
    });

    // Reset form
    setName("");
    setEmail("");
    setPhone("");
    setStatus("lead");
    setTags("");
    setErrors({});
    setTouched({});
    onClose();
  };

  const handleClose = () => {
    setName("");
    setEmail("");
    setPhone("");
    setStatus("lead");
    setTags("");
    setErrors({});
    setTouched({});
    onClose();
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate());
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[500px] p-5 lg:p-8">
      <form onSubmit={handleSubmit}>
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          Add New Client
        </h4>

        <div className="space-y-5">
          <div>
            <Label>
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder="Enter client name"
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
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="client@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
              error={touched.email && errors.email ? true : false}
            />
            {touched.email && errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <Label>Phone</Label>
            <Input
              type="text"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <Label>Status</Label>
            <Select
              options={statusOptions}
              defaultValue={status}
              onChange={(value) => setStatus(value as ClientStatus)}
              placeholder="Select status"
            />
          </div>

          <div>
            <Label>Tags</Label>
            <Input
              type="text"
              placeholder="executive, leadership (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Separate tags with commas
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button size="sm" variant="outline" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button size="sm" type="submit">
            Add Client
          </Button>
        </div>
      </form>
    </Modal>
  );
}
