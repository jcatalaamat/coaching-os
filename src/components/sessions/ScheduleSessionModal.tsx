"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { useClients, usePrograms } from "@/lib/store/useStore";

interface ScheduleSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedClientId?: string;
  preselectedDate?: string;
  preselectedTime?: string;
  onSave?: (session: {
    clientId: string;
    programId: string;
    date: string;
    time: string;
    duration: number;
    location: string;
  }) => void;
}

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

export function ScheduleSessionModal({
  isOpen,
  onClose,
  preselectedClientId,
  preselectedDate,
  preselectedTime,
  onSave,
}: ScheduleSessionModalProps) {
  const [clientId, setClientId] = useState(preselectedClientId || "");
  const [programId, setProgramId] = useState("");
  const [date, setDate] = useState(preselectedDate || "");
  const [time, setTime] = useState(preselectedTime || "");
  const [duration, setDuration] = useState("60");
  const [location, setLocation] = useState("Zoom");

  const { clients } = useClients();
  const { programs } = usePrograms();

  // Update form when preselected values change
  useEffect(() => {
    if (preselectedClientId) setClientId(preselectedClientId);
  }, [preselectedClientId]);

  useEffect(() => {
    if (preselectedDate) setDate(preselectedDate);
  }, [preselectedDate]);

  useEffect(() => {
    if (preselectedTime) setTime(preselectedTime);
  }, [preselectedTime]);

  const clientOptions = clients.map((client) => ({
    value: client.id,
    label: client.name,
  }));

  const programOptions = [
    { value: "", label: "No program" },
    ...programs.map((program) => ({
      value: program.id,
      label: program.name,
    })),
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientId || !date || !time) return;

    onSave?.({
      clientId,
      programId,
      date,
      time,
      duration: parseInt(duration),
      location,
    });

    // Reset form
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setClientId(preselectedClientId || "");
    setProgramId("");
    setDate(preselectedDate || "");
    setTime(preselectedTime || "");
    setDuration("60");
    setLocation("Zoom");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[500px] p-5 lg:p-8">
      <form onSubmit={handleSubmit}>
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          Schedule Session
        </h4>

        <div className="space-y-5">
          <div>
            <Label>
              Client <span className="text-red-500">*</span>
            </Label>
            <Select
              options={clientOptions}
              defaultValue={clientId}
              onChange={(value) => setClientId(value)}
              placeholder="Select a client"
            />
          </div>

          <div>
            <Label>Program</Label>
            <Select
              options={programOptions}
              defaultValue={programId}
              onChange={(value) => setProgramId(value)}
              placeholder="Select a program (optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <Label>
                Time <span className="text-red-500">*</span>
              </Label>
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
                placeholder="Select duration"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Select
                options={locationOptions}
                defaultValue={location}
                onChange={(value) => setLocation(value)}
                placeholder="Select location"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button size="sm" variant="outline" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button size="sm" type="submit">
            Schedule Session
          </Button>
        </div>
      </form>
    </Modal>
  );
}
