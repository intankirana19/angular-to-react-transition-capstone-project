import { Textarea, TextareaField } from '@/shared/ui/Textarea';
import { CodeBlock } from '@/shared/ui/CodeBlock';

const exampleCode = `import { Textarea, TextareaField } from '@/shared/ui/Textarea';

{/* Default */}
<TextareaField label="Default" helperText="This is a text text in help text">
  <Textarea placeholder="Enter a description..." />
</TextareaField>

{/* Filled */}
<TextareaField label="Filled" helperText="This is a text text in help text">
  <Textarea
    defaultValue="A little about the company"
    placeholder="Enter a description..."
  />
</TextareaField>

{/* Disabled */}
<TextareaField label="Disabled" helperText="This is a text text in help text">
  <Textarea
    disabled
    defaultValue="This content is not editable"
    placeholder="Enter a description..."
  />
</TextareaField>

{/* Error */}
<TextareaField
  label="Error"
  error="This is a text text in help text"
  required
>
  <Textarea
    error
    defaultValue="A little about the company"
    placeholder="Enter a description..."
  />
</TextareaField>`;

export function TextareaStates() {
  return (
    <section className="space-y-4">
      <h2 className="text-ait-h2-bold text-ait-neutral-900 border-b border-ait-neutral-200 pb-2">
        Textarea States
      </h2>
      <p className="text-ait-body-md-regular text-ait-neutral-600 mb-4">
        Different states of the textarea component
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Default */}
        <TextareaField label="Default" helperText="This is a text text in help text">
          <Textarea placeholder="Enter a description..." />
        </TextareaField>

        {/* Filled */}
        <TextareaField label="Filled" helperText="This is a text text in help text">
          <Textarea
            defaultValue="A little about the company"
            placeholder="Enter a description..."
          />
        </TextareaField>

        {/* Disabled */}
        <TextareaField label="Disabled" helperText="This is a text text in help text">
          <Textarea
            disabled
            defaultValue="This content is not editable"
            placeholder="Enter a description..."
          />
        </TextareaField>

        {/* Error */}
        <TextareaField label="Error" error="This is a text text in help text" required>
          <Textarea
            error
            defaultValue="A little about the company"
            placeholder="Enter a description..."
          />
        </TextareaField>
      </div>

      <div className="mt-4">
        <h3 className="text-ait-body-lg-semibold text-ait-neutral-900 mb-2">Code Example</h3>
        <CodeBlock code={exampleCode} />
      </div>
    </section>
  );
}
