import { useState } from 'react';
import { Textarea, TextareaField } from '@/shared/ui/Textarea';
import { CodeBlock } from '@/shared/ui/CodeBlock';

const exampleCode = `import { useState } from 'react';
import { Textarea, TextareaField } from '@/shared/ui/Textarea';

const [dynamicValue, setDynamicValue] = useState('');

{/* Dynamic (auto-grow) */}
<TextareaField
  label="Dynamic"
  helperText="This textarea grows as you type"
  required
>
  <Textarea
    autoGrow
    placeholder="Start typing to see it grow..."
    value={dynamicValue}
    onChange={(e) => setDynamicValue(e.target.value)}
  />
</TextareaField>

{/* Fixed */}
<TextareaField
  label="Fixed"
  helperText="This textarea has a fixed height"
  required
>
  <Textarea
    placeholder="Enter a description..."
    resize="none"
  />
</TextareaField>`;

export function TextareaVariants() {
  const [dynamicValue, setDynamicValue] = useState('');

  return (
    <section className="space-y-4">
      <h2 className="text-ait-h2-bold text-ait-neutral-900 border-b border-ait-neutral-200 pb-2">
        Dynamic vs Fixed Height
      </h2>
      <p className="text-ait-body-md-regular text-ait-neutral-600 mb-4">
        Textarea can grow dynamically with content or maintain a fixed height
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dynamic (auto-grow) */}
        <TextareaField label="Dynamic" helperText="This textarea grows as you type" required>
          <Textarea
            autoGrow
            placeholder="Start typing to see it grow..."
            value={dynamicValue}
            onChange={(e) => setDynamicValue(e.target.value)}
          />
        </TextareaField>

        {/* Fixed */}
        <TextareaField label="Fixed" helperText="This textarea has a fixed height" required>
          <Textarea placeholder="Enter a description..." resize="none" />
        </TextareaField>
      </div>

      <div className="mt-4">
        <h3 className="text-ait-body-lg-semibold text-ait-neutral-900 mb-2">Code Example</h3>
        <CodeBlock code={exampleCode} />
      </div>
    </section>
  );
}
