import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/Dialog';
import { format } from 'date-fns';
import type { DailyLog } from '../types';

interface ViewLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log?: DailyLog | null;
}

export function ViewLogDialog({
  open,
  onOpenChange,
  log,
}: ViewLogDialogProps) {
  if (!log) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {/* <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary-600" />
            </div> */}
            <DialogTitle>Daily Log Detail</DialogTitle>
          </div>
        </DialogHeader>

        {/* CONTENT */}
        <div className="space-y-4">
          <div>
            <p className="text-ait-body-sm-semibold text-neutral-600">
              Title
            </p>
            <p className="text-ait-body-md text-neutral-900">
              {log.title}
            </p>
          </div>

          {log.description && (
            <div>
              <p className="text-ait-body-sm-semibold text-neutral-600">
                Description
              </p>
              <p className="text-ait-body-md text-neutral-900 whitespace-pre-line">
                {log.description}
              </p>
            </div>
          )}

          {log.date && (
            <div>
              <p className="text-ait-body-sm-semibold text-neutral-600">
                Date
              </p>
              <p className="text-ait-body-md text-neutral-900">
                {format(log.date, 'MMM d, yyyy')}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2.5 text-ait-body-md-semibold text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
