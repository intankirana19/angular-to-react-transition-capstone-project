import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/ui/Dialog';
import { AlertTriangle } from 'lucide-react';
import type { DailyLog } from '../types';

interface DeleteLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: DailyLog | null;
  onConfirm: (id: string) => void;
}

export function DeleteLogDialog({ open, onOpenChange, log, onConfirm }: DeleteLogDialogProps) {
  const handleConfirm = () => {
    if (log) {
      onConfirm(log.id);
      onOpenChange(false);
    }
  };

  if (!log) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-danger-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-danger-600" />
            </div>
            <DialogTitle>Delete Daily Log</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete "{log.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2.5 text-ait-body-md-semibold text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2.5 text-ait-body-md-semibold text-white bg-danger-600 rounded-lg hover:bg-danger-700 transition-colors"
          >
            Delete Log
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
