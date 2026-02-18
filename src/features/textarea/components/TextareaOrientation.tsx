import { useState } from 'react';
import { Textarea, TextareaField } from '@/shared/ui/Textarea';
import { CodeBlock } from '@/shared/ui/CodeBlock';

const exampleCode = `import { useState } from 'react';
import { Textarea, TextareaField } from '@/shared/ui/Textarea';

const [value, setValue] = useState('');

{/* Vertical (default) */}
<TextareaField
  label="Vertical Input Field"
  helperText="This is a text text in help text"
  orientation="vertical"
>
  <Textarea placeholder="Enter a description..." />
</TextareaField>

{/* Horizontal */}
<TextareaField
  label="Horizontal Input"
  helperText="This is a text text in help text"
  orientation="horizontal"
>
  <Textarea placeholder="Enter a description..." />
</TextareaField>

{/* With character count */}
<TextareaField
  label="With Character Count"
  helperText="Maximum 200 characters"
>
  <Textarea
    placeholder="Enter a description..."
    maxLength={200}
    showCount
    value={value}
    onChange={(e) => setValue(e.target.value)}
  />
</TextareaField>`;

export function TextareaOrientation() {
  const [value, setValue] = useState('');

  return (
    <section className="space-y-4">
      <h2 className="text-ait-h2-bold text-neutral-900 border-b border-neutral-200 pb-2">
        Label Orientation & Character Count
      </h2>
      <p className="text-ait-body-md-regular text-neutral-600 mb-4">
        Vertical and horizontal label positioning with optional character count
      </p>
      <div className="space-y-6">
        {/* Vertical (default) */}
        <TextareaField
          label="Vertical Input Field"
          helperText="This is a text text in help text"
          orientation="vertical"
        >
          <Textarea placeholder="Enter a description..." />
        </TextareaField>

        {/* Horizontal */}
        <TextareaField
          label="Horizontal Input"
          helperText="This is a text text in help text"
          orientation="horizontal"
        >
          <Textarea placeholder="Enter a description..." />
        </TextareaField>

        {/* With character count */}
        <TextareaField label="With Character Count" helperText="Maximum 200 characters">
          <Textarea
            placeholder="Enter a description..."
            maxLength={200}
            showCount
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </TextareaField>
      </div>

      <div className="mt-4">
        <h3 className="text-ait-body-lg-semibold text-neutral-900 mb-2">Code Example</h3>
        <CodeBlock code={exampleCode} />
      </div>
    </section>
  );
}
