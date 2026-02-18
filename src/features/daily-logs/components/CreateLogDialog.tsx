import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from '@/shared/ui/Dialog';
import { SimpleDatePicker } from '@/shared/ui/SimpleDatePicker';
import { SimpleSelect } from '@/shared/ui/SimpleSelect';
import { Textarea } from '@/shared/ui/Textarea';
import type { CreateDailyLogInput, DailyLog } from '../types';

interface CreateLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (log: CreateDailyLogInput) => void;
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

export function CreateLogDialog({ open, onOpenChange, onSubmit }: CreateLogDialogProps) {
  const [formData, setFormData] = useState<CreateDailyLogInput>({
    date: new Date(),
    title: '',
    category: 'work',
    priority: 'medium',
    description: '',
    status: 'pending',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      date: new Date(),
      title: '',
      category: 'work',
      priority: 'medium',
      description: '',
      status: 'pending',
    });
    setErrors({});
  };

  const handleCancel = () => {
    handleReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Create New Daily Log</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            {/* Date Picker */}
            <div className="space-y-2">
              <label className="text-ait-body-md-bold text-neutral-900">
                Date <span className="text-danger-500">*</span>
              </label>
              <SimpleDatePicker
                date={formData.date}
                onDateChange={(date: Date | undefined) =>
                  setFormData({ ...formData, date: date || new Date() })
                }
                placeholder="Select date"
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-ait-body-md-bold text-neutral-900">
                Title <span className="text-danger-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) {
                    setErrors({ ...errors, title: '' });
                  }
                }}
                placeholder="Enter log title"
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.title
                    ? 'border-danger-500 focus:ring-danger-500'
                    : 'border-neutral-300 focus:ring-primary-500'
                } text-ait-body-md-regular placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
              />
              {errors.title && (
                <p className="text-ait-caption-md-regular text-danger-500">{errors.title}</p>
              )}
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-ait-body-md-bold text-neutral-900">
                  Category <span className="text-danger-500">*</span>
                </label>
                <SimpleSelect
                  value={formData.category}
                  onChange={(value) =>
                    setFormData({ ...formData, category: value as DailyLog['category'] })
                  }
                  options={categoryOptions}
                  placeholder="Select category"
                />
              </div>
              <div className="space-y-2">
                <label className="text-ait-body-md-bold text-neutral-900">
                  Priority <span className="text-danger-500">*</span>
                </label>
                <SimpleSelect
                  value={formData.priority}
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
              <label className="text-ait-body-md-bold text-neutral-900">
                Status <span className="text-danger-500">*</span>
              </label>
              <SimpleSelect
                value={formData.status}
                onChange={(value) =>
                  setFormData({ ...formData, status: value as DailyLog['status'] })
                }
                options={statusOptions}
                placeholder="Select status"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-ait-body-md-bold text-neutral-900">
                Description <span className="text-danger-500">*</span>
              </label>
              <Textarea
                value={formData.description}
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
                <p className="text-ait-caption-md-regular text-danger-500">
                  {errors.description}
                </p>
              )}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <button
            onClick={handleCancel}
            className="px-4 py-2.5 text-ait-body-md-semibold text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2.5 text-ait-body-md-semibold text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Create Log
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
