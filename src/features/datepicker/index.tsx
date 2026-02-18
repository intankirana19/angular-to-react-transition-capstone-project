import { BasicDatePicker } from './components/BasicDatePicker';
import { DateRangeExample } from './components/DateRangeExample';
import { DateTimeRangeExample } from './components/DateTimeRangeExample';
import { DatePickerStates } from './components/DatePickerStates';
import { DatePickerExamples } from './components/DatePickerExamples';

export default function DatePickerShowcase() {
  return (
    <div className="space-y-12 overflow-visible">
      {/* Header Section */}
      <div className="border-b border-neutral-200 pb-6">
        <h1 className="text-ait-h1 text-neutral-900 mb-2">Date Picker Component</h1>
        <p className="text-ait-body-lg-regular text-neutral-600">
          Date, date range, and date-time range pickers for forms and scheduling
        </p>
      </div>

      <DateTimeRangeExample />
      <BasicDatePicker />
      <DateRangeExample />
      <DatePickerStates />
      <DatePickerExamples />
    </div>
  );
}
