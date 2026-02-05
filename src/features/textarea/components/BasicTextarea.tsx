import { useState } from 'react';
import { Textarea, TextareaField } from '@/components/ui/Textarea';
import { CodeBlock } from '@/components/ui/CodeBlock';

const exampleCode = `import { useState } from 'react';
import { Textarea, TextareaField } from '@/components/ui/Textarea';

const [value, setValue] = useState('');

<TextareaField
  label="Description"
  helperText="This is a text text in help text"
  required
>
  <Textarea
    variant="outlined"
    placeholder="Enter a description..."
    value={value}
    onChange={(e) => setValue(e.target.value)}
  />
</TextareaField>`;

export function BasicTextarea() {
  const [value, setValue] = useState('');

  return (
    <section className="space-y-4">
      <h2 className="text-ait-h2-bold text-ait-neutral-900 border-b border-ait-neutral-200 pb-2">
        Basic Textarea
      </h2>
      <p className="text-ait-body-md-regular text-ait-neutral-600 mb-4">
        Simple textarea with label and helper text
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Outlined variant */}
        <div>
          <h3 className="text-ait-body-lg-semibold text-ait-neutral-900 mb-4">
            Outlined (Default)
          </h3>
          <TextareaField label="Description" helperText="This is a text text in help text" required>
            <Textarea
              variant="outlined"
              placeholder="Enter a description..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </TextareaField>
        </div>

        {/* Box variant */}
        <div>
          <h3 className="text-ait-body-lg-semibold text-ait-neutral-900 mb-4">Box</h3>
          <TextareaField label="Description" helperText="This is a text text in help text" required>
            <Textarea variant="box" placeholder="Enter a description..." />
          </TextareaField>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-ait-body-lg-semibold text-ait-neutral-900 mb-2">Code Example</h3>
        <CodeBlock code={exampleCode} />
      </div>
    </section>
  );
}
