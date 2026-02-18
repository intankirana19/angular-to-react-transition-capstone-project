import { useState } from 'react';
import {
  DateTimeRangePicker,
  DatePickerField,
  type DateTimeRange,
} from '@/shared/ui/DatePicker';
import { CodeBlock } from '@/shared/ui/CodeBlock';

const exampleCode = `import { useState } from 'react';
import { DateTimeRangePicker, DatePickerField, type DateTimeRange } from '@/shared/ui/DatePicker';

const [dateTimeRange, setDateTimeRange] = useState<DateTimeRange>();

<DatePickerField
  label="Date & Time Range"
  helperText="Select a date and time range using quick filters or calendar"
  required
>
  <DateTimeRangePicker
    value={dateTimeRange}
    onChange={setDateTimeRange}
    placeholder="Select date time range"
    showQuickFilters={true}
    showTimePicker={true}
  />
</DatePickerField>`;

export function DateTimeRangeExample() {
  const [dateTimeRange, setDateTimeRange] = useState<DateTimeRange>();

  return (
    <section className="space-y-4 overflow-visible">
      <h2 className="text-ait-h2-bold text-neutral-900 border-b border-neutral-200 pb-2">
        Date-Time Range Picker with Quick Filters
      </h2>
      <p className="text-ait-body-md-regular text-neutral-600 mb-4">
        Advanced date-time range picker with quick filter sidebar, two-month calendar view, time
        selection, and Cancel/Apply actions
      </p>
      <div className="bg-white p-6 rounded-lg border border-neutral-200 overflow-visible">
        <DatePickerField
          label="Date & Time Range"
          helperText="Select a date and time range using quick filters or calendar"
          required
        >
          <DateTimeRangePicker
            value={dateTimeRange}
            onChange={setDateTimeRange}
            placeholder="Select date time range"
            showQuickFilters={true}
            showTimePicker={true}
          />
        </DatePickerField>
        {dateTimeRange && (
          <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
            <p className="text-ait-caption-md-semibold text-neutral-900 mb-2">
              Selected Range:
            </p>
            <p className="text-ait-body-md-regular text-neutral-700">
              From: {dateTimeRange.from.toLocaleString()}
            </p>
            <p className="text-ait-body-md-regular text-neutral-700">
              To: {dateTimeRange.to.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-ait-body-lg-semibold text-neutral-900 mb-2">Code Example</h3>
        <CodeBlock code={exampleCode} />
      </div>
    </section>
  );
}
