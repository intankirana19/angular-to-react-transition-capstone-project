import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from '@/components/ui/Dialog';
import { SimpleDatePicker } from '@/components/ui/SimpleDatePicker';
import { SimpleSelect } from '@/components/ui/SimpleSelect';
import { Textarea } from '@/components/ui/Textarea';
import type { DailyLog, UpdateDailyLogInput } from '../types';

interface EditLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: DailyLog | null;
  onSubmit: (id: string, updates: UpdateDailyLogInput) => void;
}

const categoryOptions = [
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'development', label: 'Development' },
  { value: 'other', label: 'Other' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export function EditLogDialog({ open, onOpenChange, log, onSubmit }: EditLogDialogProps) {
  const [formData, setFormData] = useState<UpdateDailyLogInput>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill form when log changes
  useEffect(() => {
    if (log) {
      setFormData({
        date: log.date,
        title: log.title,
        category: log.category,
        priority: log.priority,
        description: log.description,
        status: log.status,
      });
      setErrors({});
    }
  }, [log]);

  const handleSubmit = () => {
    if (!log) return;

    const newErrors: Record<string, string> = {};

    if (formData.title !== undefined && !formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (formData.description !== undefined && !formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(log.id, formData);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setErrors({});
    onOpenChange(false);
  };

  if (!log) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Edit Daily Log</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            {/* Date Picker */}
            <div className="space-y-2">
              <label className="text-ait-body-md-bold text-ait-neutral-900">
                Date <span className="text-ait-danger-500">*</span>
              </label>
              <SimpleDatePicker
                date={formData.date || log.date}
                onDateChange={(date: Date | undefined) =>
                  setFormData({ ...formData, date: date || new Date() })
                }
                placeholder="Select date"
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-ait-body-md-bold text-ait-neutral-900">
                Title <span className="text-ait-danger-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title ?? log.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) {
                    setErrors({ ...errors, title: '' });
                  }
                }}
                placeholder="Enter log title"
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.title
                    ? 'border-ait-danger-500 focus:ring-ait-danger-500'
                    : 'border-ait-neutral-300 focus:ring-ait-primary-500'
                } text-ait-body-md-regular placeholder:text-ait-neutral-500 focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
              />
              {errors.title && (
                <p className="text-ait-caption-md-regular text-ait-danger-500">{errors.title}</p>
              )}
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-ait-body-md-bold text-ait-neutral-900">
                  Category <span className="text-ait-danger-500">*</span>
                </label>
                <SimpleSelect
                  value={formData.category ?? log.category}
                  onChange={(value) =>
                    setFormData({ ...formData, category: value as DailyLog['category'] })
                  }
                  options={categoryOptions}
                  placeholder="Select category"
                />
              </div>
              <div className="space-y-2">
                <label className="text-ait-body-md-bold text-ait-neutral-900">
                  Priority <span className="text-ait-danger-500">*</span>
                </label>
                <SimpleSelect
                  value={formData.priority ?? log.priority}
                  onChange={(value) =>
                    setFormData({ ...formData, priority: value as DailyLog['priority'] })
                  }
                  options={priorityOptions}
                  placeholder="Select priority"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-ait-body-md-bold text-ait-neutral-900">
                Status <span className="text-ait-danger-500">*</span>
              </label>
              <SimpleSelect
                value={formData.status ?? log.status}
                onChange={(value) =>
                  setFormData({ ...formData, status: value as DailyLog['status'] })
                }
                options={statusOptions}
                placeholder="Select status"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-ait-body-md-bold text-ait-neutral-900">
                Description <span className="text-ait-danger-500">*</span>
              </label>
              <Textarea
                value={formData.description ?? log.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (errors.description) {
                    setErrors({ ...errors, description: '' });
                  }
                }}
                placeholder="Enter detailed description of the log"
                rows={4}
                error={!!errors.description}
              />
              {errors.description && (
                <p className="text-ait-caption-md-regular text-ait-danger-500">
                  {errors.description}
                </p>
              )}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <button
            onClick={handleCancel}
            className="px-4 py-2.5 text-ait-body-md-semibold text-ait-neutral-700 border border-ait-neutral-300 rounded-lg hover:bg-ait-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2.5 text-ait-body-md-semibold text-white bg-[#00487a] rounded-lg hover:bg-[#003768] transition-colors"
          >
            Save Changes
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
