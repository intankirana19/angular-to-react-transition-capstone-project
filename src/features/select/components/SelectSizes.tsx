import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/Select';
import { CodeBlock } from '@/shared/ui/CodeBlock';

const exampleCode = `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/Select';

{/* Small */}
<Select>
  <SelectTrigger size="sm">
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>

{/* Medium (Default) */}
<Select>
  <SelectTrigger size="md">
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
  </SelectContent>
</Select>

{/* Large */}
<Select>
  <SelectTrigger size="lg">
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
  </SelectContent>
</Select>`;

export function SelectSizes() {
  return (
    <section className="space-y-4">
      <h2 className="text-ait-h2-bold text-ait-neutral-900 border-b border-ait-neutral-200 pb-2">
        Sizes
      </h2>
      <p className="text-ait-body-md-regular text-ait-neutral-600 mb-4">
        Three size variants: small, medium, and large
      </p>
      <div className="bg-ait-white p-6 rounded-lg border border-ait-neutral-200 space-y-4">
        <div>
          <p className="text-ait-caption-md-bold text-ait-neutral-700 mb-2">Small</p>
          <Select>
            <SelectTrigger size="sm">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <p className="text-ait-caption-md-bold text-ait-neutral-700 mb-2">Medium (Default)</p>
          <Select>
            <SelectTrigger size="md">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <p className="text-ait-caption-md-bold text-ait-neutral-700 mb-2">Large</p>
          <Select>
            <SelectTrigger size="lg">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-ait-body-lg-semibold text-ait-neutral-900 mb-2">Code Example</h3>
        <CodeBlock code={exampleCode} />
      </div>
    </section>
  );
}
