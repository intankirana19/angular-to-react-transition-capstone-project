import { useState } from 'react';
import { DateRangePicker } from '@/shared/ui/DatePicker';
import { CodeBlock } from '@/shared/ui/CodeBlock';

const exampleCode = `import { useState } from 'react';
import { DateRangePicker } from '@/shared/ui/DatePicker';

const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>();

<DateRangePicker
  dateRange={dateRange}
  onDateRangeChange={setDateRange}
  placeholder="Select date range"
/>`;

export function DateRangeExample() {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>();

  return (
    <section className="space-y-4 overflow-visible">
      <h2 className="text-ait-h2-bold text-neutral-900 border-b border-neutral-200 pb-2">
        Date Range Picker
      </h2>
      <p className="text-ait-body-md-regular text-neutral-600 mb-4">
        Select a date range with two-month view
      </p>
      <div className="bg-white p-6 rounded-lg border border-neutral-200 overflow-visible">
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          placeholder="Select date range"
        />
        {dateRange?.from && (
          <p className="text-ait-caption-md-regular text-neutral-600 mt-4">
            From: {dateRange.from.toDateString()}
            {dateRange.to && ` - To: ${dateRange.to.toDateString()}`}
          </p>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-ait-body-lg-semibold text-neutral-900 mb-2">Code Example</h3>
        <CodeBlock code={exampleCode} />
      </div>
    </section>
  );
}
