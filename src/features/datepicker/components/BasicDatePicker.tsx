import { useState } from 'react';
import { DatePicker } from '@/shared/ui/DatePicker';
import { CodeBlock } from '@/shared/ui/CodeBlock';

const exampleCode = `import { useState } from 'react';
import { DatePicker } from '@/shared/ui/DatePicker';

const [date, setDate] = useState<Date>();

<DatePicker
  date={date}
  onDateChange={setDate}
  placeholder="Select a date"
/>`;

export function BasicDatePicker() {
  const [date, setDate] = useState<Date>();

  return (
    <section className="space-y-4 overflow-visible">
      <h2 className="text-ait-h2-bold text-ait-neutral-900 border-b border-ait-neutral-200 pb-2">
        Basic Date Picker
      </h2>
      <p className="text-ait-body-md-regular text-ait-neutral-600 mb-4">
        Simple date picker for selecting a single date
      </p>
      <div className="bg-ait-white p-6 rounded-lg border border-ait-neutral-200 max-w-md overflow-visible">
        <DatePicker date={date} onDateChange={setDate} placeholder="Select a date" />
        {date && (
          <p className="text-ait-caption-md-regular text-ait-neutral-600 mt-4">
            Selected: {date.toDateString()}
          </p>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-ait-body-lg-semibold text-ait-neutral-900 mb-2">Code Example</h3>
        <CodeBlock code={exampleCode} />
      </div>
    </section>
  );
}
