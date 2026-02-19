import { useState } from 'react';
import { DatePicker, DatePickerField, DateRangePicker } from '@/shared/ui/DatePicker';
import { type DateRangeValue } from '@/shared/types/dateRange';
import { CodeBlock } from '@/shared/ui/CodeBlock';

const travelBookingCode = `import { useState } from 'react';
import { DatePicker, DatePickerField } from '@/shared/ui/DatePicker';

const [checkIn, setCheckIn] = useState<Date>();
const [checkOut, setCheckOut] = useState<Date>();

<div className="grid grid-cols-2 gap-6">
  <DatePickerField label="Check-in Date" required>
    <DatePicker
      date={checkIn}
      onDateChange={setCheckIn}
      placeholder="Select check-in"
    />
  </DatePickerField>

  <DatePickerField label="Check-out Date" required>
    <DatePicker
      date={checkOut}
      onDateChange={setCheckOut}
      placeholder="Select check-out"
    />
  </DatePickerField>
</div>`;

const eventPlanningCode = `import { useState } from 'react';
import { DateRangePicker, DatePickerField } from '@/shared/ui/DatePicker';
import { type DateRangeValue } from '@/shared/types/dateRange';

const [tripRange, setTripRange] = useState<DateRangeValue>();

<DatePickerField
  label="Campaign Duration"
  helperText="Select the start and end date for your campaign"
  required
>
  <DateRangePicker
    dateRange={tripRange}
    onDateRangeChange={setTripRange}
    placeholder="Select campaign period"
  />
</DatePickerField>`;

export function DatePickerExamples() {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [tripRange, setTripRange] = useState<DateRangeValue>();

  return (
    <>
      {/* Travel Booking Example */}
      <section className="space-y-4 overflow-visible">
        <h2 className="text-ait-h2-bold text-neutral-900 border-b border-neutral-200 pb-2">
          Travel Booking Example
        </h2>
        <p className="text-ait-body-md-regular text-neutral-600 mb-4">
          Real-world example for hotel booking
        </p>
        <div className="bg-white p-6 rounded-lg border border-neutral-200 max-w-2xl overflow-visible">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DatePickerField label="Check-in Date" required>
              <DatePicker date={checkIn} onDateChange={setCheckIn} placeholder="Select check-in" />
            </DatePickerField>

            <DatePickerField label="Check-out Date" required>
              <DatePicker
                date={checkOut}
                onDateChange={setCheckOut}
                placeholder="Select check-out"
              />
            </DatePickerField>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-ait-body-lg-semibold text-neutral-900 mb-2">Code Example</h3>
          <CodeBlock code={travelBookingCode} />
        </div>
      </section>

      {/* Event Planning Example */}
      <section className="space-y-4 overflow-visible">
        <h2 className="text-ait-h2-bold text-neutral-900 border-b border-neutral-200 pb-2">
          Event Planning Example
        </h2>
        <p className="text-ait-body-md-regular text-neutral-600 mb-4">
          Date range picker for events and campaigns
        </p>
        <div className="bg-white p-6 rounded-lg border border-neutral-200 overflow-visible">
          <DatePickerField
            label="Campaign Duration"
            helperText="Select the start and end date for your campaign"
            required
          >
            <DateRangePicker
              dateRange={tripRange}
              onDateRangeChange={setTripRange}
              placeholder="Select campaign period"
            />
          </DatePickerField>
        </div>

        <div className="mt-4">
          <h3 className="text-ait-body-lg-semibold text-neutral-900 mb-2">Code Example</h3>
          <CodeBlock code={eventPlanningCode} />
        </div>
      </section>
    </>
  );
}
