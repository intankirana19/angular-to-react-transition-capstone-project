import { BasicSelect } from './components/BasicSelect';
import { SelectSizes } from './components/SelectSizes';
import { SelectStates } from './components/SelectStates';
import { GroupedSelect } from './components/GroupedSelect';

export default function SelectShowcase() {
  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="border-b border-ait-neutral-200 pb-6">
        <h1 className="text-ait-h1 text-ait-neutral-900 mb-2">Select Component</h1>
        <p className="text-ait-body-lg-regular text-ait-neutral-600">
          Dropdown component for selecting from a list of options
        </p>
      </div>

      <BasicSelect />
      <SelectSizes />
      <SelectStates />
      <GroupedSelect />
    </div>
  );
}
