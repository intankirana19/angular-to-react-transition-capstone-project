import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogBody,
} from '@/shared/ui/Dialog';
import { User } from 'lucide-react';
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
} from '@/shared/ui/Dialog';

const [open, setOpen] = useState(false);
const [selected, setSelected] = useState<number[]>([]);

const teamMembers = [
  { id: 1, name: 'Candice Wu', email: 'candice.wu@company.com', role: 'Admin' },
  { id: 2, name: 'Drew Cano', email: 'drew.cano@company.com', role: 'Admin' },
];

const toggleSelection = (id: number) => {
  setSelected((prev) =>
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
  );
};

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <button>Select Team Members</button>
  </DialogTrigger>
  <DialogContent size="md">
    <DialogHeader>
      <DialogTitle>Add new team members</DialogTitle>
    </DialogHeader>
    <DialogBody className="py-0">
      <div className="space-y-0 divide-y divide-neutral-200">
        {teamMembers.map((member) => (
          <label key={member.id}>
            <input
              type="checkbox"
              checked={selected.includes(member.id)}
              onChange={() => toggleSelection(member.id)}
            />
            <div>
              <p>{member.name}</p>
              <p>{member.email}</p>
            </div>
            <span>{member.role}</span>
          </label>
        ))}
      </div>
    </DialogBody>
    <DialogFooter>
      <button onClick={() => setOpen(false)}>Cancel</button>
      <button onClick={() => setOpen(false)}>Add ({selected.length})</button>
    </DialogFooter>
  </DialogContent>
</Dialog>`;

const teamMembers = [
  {
    id: 1,
    name: 'Candice Wu',
    email: 'candice.wu@company.com',
    role: 'Admin',
  },
  {
    id: 2,
    name: 'Drew Cano',
    email: 'drew.cano@company.com',
    role: 'Admin',
  },
  {
    id: 3,
    name: 'Natali Craig',
    email: 'natali.craig@company.com',
    role: 'Member',
  },
  {
    id: 4,
    name: 'Orlando Diggs',
    email: 'orlando.diggs@company.com',
    role: 'Member',
  },
];

export function ListDialog() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSelection = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <section className="space-y-4">
      <h2 className="text-ait-h2-bold text-neutral-900 border-b border-neutral-200 pb-2">
        List Dialog
      </h2>
      <p className="text-ait-body-md-regular text-neutral-600 mb-4">
        Dialog with a list of selectable items
      </p>
      <div className="flex gap-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="px-4 py-2.5 text-ait-body-md-semibold text-white bg-primary-500 rounded-lg hover:bg-primary-400 transition-colors">
              Select Team Members
            </button>
          </DialogTrigger>
          <DialogContent size="md">
            <DialogHeader>
              <DialogTitle>Add new team members</DialogTitle>
            </DialogHeader>
            <DialogBody className="py-0">
              <div className="space-y-0 divide-y divide-neutral-200">
                {teamMembers.map((member) => (
                  <label
                    key={member.id}
                    className="flex items-center gap-3 py-3 cursor-pointer hover:bg-neutral-50 px-3 -mx-3 rounded-lg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(member.id)}
                      onChange={() => toggleSelection(member.id)}
                      className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-neutral-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-ait-body-md-semibold text-neutral-900">
                          {member.name}
                        </p>
                        <p className="text-ait-caption-md-regular text-neutral-500">
                          {member.email}
                        </p>
                      </div>
                      <span className="text-ait-caption-md-regular text-neutral-500">
                        {member.role}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </DialogBody>
            <DialogFooter>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 text-ait-body-md-semibold text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Selected members:', selected);
                  setOpen(false);
                }}
                className="px-4 py-2.5 text-ait-body-md-semibold text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Add ({selected.length})
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
