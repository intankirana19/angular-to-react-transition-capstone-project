import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogBody,
} from '@/components/ui/Dialog';
import { CodeBlock } from '@/components/ui/CodeBlock';

const exampleCode = `import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogBody,
} from '@/components/ui/Dialog';

const [open, setOpen] = useState(false);
const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <button>Open Form Dialog</button>
  </DialogTrigger>
  <DialogContent size="md">
    <DialogHeader>
      <DialogTitle>Card Details</DialogTitle>
    </DialogHeader>
    <DialogBody>
      <div className="space-y-4">
        <div className="space-y-2">
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label>Email <span className="text-ait-danger-500">*</span></label>
          <input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>
    </DialogBody>
    <DialogFooter>
      <button onClick={() => setOpen(false)}>Cancel</button>
      <button onClick={() => setOpen(false)}>Submit</button>
    </DialogFooter>
  </DialogContent>
</Dialog>`;

export function FormDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  return (
    <section className="space-y-4">
      <h2 className="text-ait-h2-bold text-ait-neutral-900 border-b border-ait-neutral-200 pb-2">
        Form Dialog
      </h2>
      <p className="text-ait-body-md-regular text-ait-neutral-600 mb-4">
        Dialog with form fields for collecting user input
      </p>
      <div className="flex gap-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="px-4 py-2.5 text-ait-body-md-semibold text-white bg-ait-primary-500 rounded-lg hover:bg-ait-primary-400 transition-colors">
              Open Form Dialog
            </button>
          </DialogTrigger>
          <DialogContent size="md">
            <DialogHeader>
              <DialogTitle>Card Details</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-ait-body-md-bold text-ait-neutral-900">Name</label>
                    <input
                      type="text"
                      placeholder="Enter name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-ait-neutral-300 text-ait-body-md-regular placeholder:text-ait-neutral-500 focus:outline-none focus:ring-2 focus:ring-ait-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-ait-body-md-bold text-ait-neutral-900">Phone</label>
                    <input
                      type="tel"
                      placeholder="Enter phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-ait-neutral-300 text-ait-body-md-regular placeholder:text-ait-neutral-500 focus:outline-none focus:ring-2 focus:ring-ait-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-ait-body-md-bold text-ait-neutral-900">
                    Email
                    <span className="text-ait-danger-500 ml-1">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-ait-neutral-300 text-ait-body-md-regular placeholder:text-ait-neutral-500 focus:outline-none focus:ring-2 focus:ring-ait-primary-500 focus:border-transparent"
                  />
                  <p className="text-ait-caption-md-regular text-ait-neutral-500">
                    We'll never share your email.
                  </p>
                </div>
              </div>
            </DialogBody>
            <DialogFooter>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 text-ait-body-md-semibold text-ait-neutral-700 border border-ait-neutral-300 rounded-lg hover:bg-ait-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 text-ait-body-md-semibold text-white bg-[#00487a] rounded-lg hover:bg-[#003768] transition-colors"
              >
                Submit
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4">
        <h3 className="text-ait-body-lg-semibold text-ait-neutral-900 mb-2">Code Example</h3>
        <CodeBlock code={exampleCode} />
      </div>
    </section>
  );
}
