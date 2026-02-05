import { useState } from 'react';
import { DatePicker, DatePickerField } from '@/components/ui/DatePicker';
import { CodeBlock } from '@/components/ui/CodeBlock';

const withLabelCode = `import { useState } from 'react';
import { DatePicker, DatePickerField } from '@/components/ui/DatePicker';

const [date, setDate] = useState<Date>();

<DatePickerField
  label="Event Date"
  helperText="Select the date for your event"
  required
>
  <DatePicker
    date={date}
    onDateChange={setDate}
    placeholder="MM/DD/YYYY"
  />
</DatePickerField>`;

const errorStateCode = `import { useState } from 'react';
import { DatePicker, DatePickerField } from '@/components/ui/DatePicker';

const [date, setDate] = useState<Date>();

<DatePickerField
  label="Appointment Date"
  error="Please select a valid date"
  required
>
  <DatePicker
    date={date}
    onDateChange={setDate}
    placeholder="Select date"
    variant="error"
  />
</DatePickerField>`;

const disabledStateCode = `import { DatePicker, DatePickerField } from '@/components/ui/DatePicker';

<DatePickerField
  label="Birth Date"
  helperText="This field is currently disabled"
>
  <DatePicker
    date={new Date('2000-01-01')}
    placeholder="Select date"
    disabled
  />
</DatePickerField>`;

export function DatePickerStates() {
  const [date1, setDate1] = useState<Date>();
  const [date2, setDate2] = useState<Date>();

  return (
    <>
      {/* With Label and Helper Text */}
      <section className="space-y-4 overflow-visible">
        <h2 className="text-ait-h2-bold text-ait-neutral-900 border-b border-ait-neutral-200 pb-2">
          With Label and Helper Text
        </h2>
        <p className="text-ait-body-md-regular text-ait-neutral-600 mb-4">
          Date picker with labels, helper text, and required indicator
        </p>
        <div className="bg-ait-white p-6 rounded-lg border border-ait-neutral-200 max-w-md overflow-visible">
          <DatePickerField label="Event Date" helperText="Select the date for your event" required>
            <DatePicker date={date1} onDateChange={setDate1} placeholder="MM/DD/YYYY" />
          </DatePickerField>
        </div>

        <div className="mt-4">
          <h3 className="text-ait-body-lg-semibold text-ait-neutral-900 mb-2">Code Example</h3>
          <CodeBlock code={withLabelCode} />
        </div>
      </section>

      {/* Error State */}
      <section className="space-y-4 overflow-visible">
        <h2 className="text-ait-h2-bold text-ait-neutral-900 border-b border-ait-neutral-200 pb-2">
          Error State
        </h2>
        <p className="text-ait-body-md-regular text-ait-neutral-600 mb-4">
          Date picker with error styling and message
        </p>
        <div className="bg-ait-white p-6 rounded-lg border border-ait-neutral-200 max-w-md overflow-visible">
          <DatePickerField label="Appointment Date" error="Please select a valid date" required>
            <DatePicker
              date={date2}
              onDateChange={setDate2}
              placeholder="Select date"
              variant="error"
            />
          </DatePickerField>
        </div>

        <div className="mt-4">
          <h3 className="text-ait-body-lg-semibold text-ait-neutral-900 mb-2">Code Example</h3>
          <CodeBlock code={errorStateCode} />
        </div>
      </section>

      {/* Disabled State */}
      <section className="space-y-4 overflow-visible">
        <h2 className="text-ait-h2-bold text-ait-neutral-900 border-b border-ait-neutral-200 pb-2">
          Disabled State
        </h2>
        <p className="text-ait-body-md-regular text-ait-neutral-600 mb-4">
          Disabled date picker that cannot be interacted with
        </p>
        <div className="bg-ait-white p-6 rounded-lg border border-ait-neutral-200 max-w-md overflow-visible">
          <DatePickerField label="Birth Date" helperText="This field is currently disabled">
            <DatePicker date={new Date('2000-01-01')} placeholder="Select date" disabled />
          </DatePickerField>
        </div>

        <div className="mt-4">
          <h3 className="text-ait-body-lg-semibold text-ait-neutral-900 mb-2">Code Example</h3>
          <CodeBlock code={disabledStateCode} />
        </div>
      </section>
    </>
  );
}
