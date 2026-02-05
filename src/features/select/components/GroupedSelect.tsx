import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectField,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { CodeBlock } from '@/components/ui/CodeBlock';

const exampleCode = `import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectField,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';

const [selectedFruit, setSelectedFruit] = useState('');

<SelectField label="Favorite Food" helperText="Choose from different categories">
  <Select value={selectedFruit} onValueChange={setSelectedFruit}>
    <SelectTrigger>
      <SelectValue placeholder="Select your favorite food" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Fruits</SelectLabel>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup>
        <SelectLabel>Vegetables</SelectLabel>
        <SelectItem value="carrot">Carrot</SelectItem>
        <SelectItem value="broccoli">Broccoli</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</SelectField>`;

export function GroupedSelect() {
  const [selectedFruit, setSelectedFruit] = useState('');

  return (
    <section className="space-y-4">
      <h2 className="text-ait-h2-bold text-ait-neutral-900 border-b border-ait-neutral-200 pb-2">
        Grouped Options
      </h2>
      <p className="text-ait-body-md-regular text-ait-neutral-600 mb-4">
        Options organized into labeled groups
      </p>
      <div className="bg-ait-white p-6 rounded-lg border border-ait-neutral-200 max-w-md">
        <SelectField label="Favorite Food" helperText="Choose from different categories">
          <Select value={selectedFruit} onValueChange={setSelectedFruit}>
            <SelectTrigger>
              <SelectValue placeholder="Select your favorite food" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="mango">Mango</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Vegetables</SelectLabel>
                <SelectItem value="carrot">Carrot</SelectItem>
                <SelectItem value="broccoli">Broccoli</SelectItem>
                <SelectItem value="spinach">Spinach</SelectItem>
                <SelectItem value="tomato">Tomato</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Grains</SelectLabel>
                <SelectItem value="rice">Rice</SelectItem>
                <SelectItem value="wheat">Wheat</SelectItem>
                <SelectItem value="oats">Oats</SelectItem>
                <SelectItem value="quinoa">Quinoa</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </SelectField>
      </div>

      <div className="mt-4">
        <h3 className="text-ait-body-lg-semibold text-ait-neutral-900 mb-2">Code Example</h3>
        <CodeBlock code={exampleCode} />
      </div>
    </section>
  );
}
