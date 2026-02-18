import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/Dialog';
import { CodeBlock } from '@/shared/ui/CodeBlock';

const exampleCode = `import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/Dialog';

const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <button>Open Dialog</button>
  </DialogTrigger>
  <DialogContent size="sm">
    <DialogHeader>
      <DialogTitle>Are you an admin?</DialogTitle>
      <DialogDescription>
        You need to be an administrator to access this section.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <button onClick={() => setOpen(false)}>Cancel</button>
      <button onClick={() => setOpen(false)}>Confirm</button>
    </DialogFooter>
  </DialogContent>
</Dialog>`;

export function SimpleDialog() {
  const [open, setOpen] = useState(false);

  return (
    <section className="space-y-4">
      <h2 className="text-ait-h2-bold text-neutral-900 border-b border-neutral-200 pb-2">
        Simple Dialog
      </h2>
      <p className="text-ait-body-md-regular text-neutral-600 mb-4">
        Basic dialog with title, description, and action buttons
      </p>
      <div className="flex gap-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="px-4 py-2.5 text-ait-body-md-semibold text-white bg-primary-500 rounded-lg hover:bg-primary-400 transition-colors">
              Open Dialog
            </button>
          </DialogTrigger>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>Are you an admin?</DialogTitle>
              <DialogDescription>
                You need to be an administrator to access this section. Please contact your admin
                for further assistance.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 text-ait-body-md-semibold text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 text-ait-body-md-semibold text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Confirm
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4">
        <h3 className="text-ait-body-lg-semibold text-neutral-900 mb-2">Code Example</h3>
        <CodeBlock code={exampleCode} />
      </div>
    </section>
  );
}
