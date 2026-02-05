import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogBody,
  DialogImage,
} from '@/shared/ui/Dialog';
import { CodeBlock } from '@/shared/ui/CodeBlock';

const exampleCode = `import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogBody,
  DialogImage,
} from '@/shared/ui/Dialog';

const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <button>Open Image Dialog</button>
  </DialogTrigger>
  <DialogContent size="md" className="p-0">
    <DialogImage
      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"
      alt="Dialog banner"
      className="h-48"
    />
    <div className="p-6 space-y-4">
      <DialogHeader className="p-0">
        <DialogTitle>Submit proposal draft</DialogTitle>
      </DialogHeader>
      <DialogBody className="p-0">
        <div className="space-y-4">
          <div className="space-y-2">
            <label>Name</label>
            <input type="text" placeholder="Enter name" />
          </div>
          <div className="space-y-2">
            <label>Email <span className="text-ait-danger-500">*</span></label>
            <input type="email" placeholder="Enter your email" />
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="p-0">
        <button onClick={() => setOpen(false)}>Cancel</button>
        <button onClick={() => setOpen(false)}>Submit</button>
      </DialogFooter>
    </div>
  </DialogContent>
</Dialog>`;

export function ImageDialog() {
  const [open, setOpen] = useState(false);

  return (
    <section className="space-y-4">
      <h2 className="text-ait-h2-bold text-ait-neutral-900 border-b border-ait-neutral-200 pb-2">
        Image Dialog
      </h2>
      <p className="text-ait-body-md-regular text-ait-neutral-600 mb-4">
        Dialog with an image banner and form fields
      </p>
      <div className="flex gap-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="px-4 py-2.5 text-ait-body-md-semibold text-white bg-ait-primary-500 rounded-lg hover:bg-ait-primary-400 transition-colors">
              Open Image Dialog
            </button>
          </DialogTrigger>
          <DialogContent size="md" className="p-0">
            <DialogImage
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=400&fit=crop"
              alt="Dialog banner"
              className="h-48"
            />
            <div className="p-6 space-y-4">
              <DialogHeader className="p-0">
                <DialogTitle>Submit proposal draft</DialogTitle>
              </DialogHeader>
              <DialogBody className="p-0">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-ait-body-md-bold text-ait-neutral-900">Name</label>
                      <input
                        type="text"
                        placeholder="Enter name"
                        className="w-full px-4 py-2.5 rounded-lg border border-ait-neutral-300 text-ait-body-md-regular placeholder:text-ait-neutral-500 focus:outline-none focus:ring-2 focus:ring-ait-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-ait-body-md-bold text-ait-neutral-900">Phone</label>
                      <input
                        type="tel"
                        placeholder="Enter phone"
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
                      className="w-full px-4 py-2.5 rounded-lg border border-ait-neutral-300 text-ait-body-md-regular placeholder:text-ait-neutral-500 focus:outline-none focus:ring-2 focus:ring-ait-primary-500 focus:border-transparent"
                    />
                    <p className="text-ait-caption-md-regular text-ait-neutral-500">
                      We'll never share your email.
                    </p>
                  </div>
                </div>
              </DialogBody>
              <DialogFooter className="p-0">
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
            </div>
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
