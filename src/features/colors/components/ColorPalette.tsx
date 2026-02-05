import { CodeBlock } from '@/shared/ui/CodeBlock';

interface ColorSwatchProps {
  name: string;
  value: string;
}

function ColorSwatch({ name, value }: ColorSwatchProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-ait-neutral-200 bg-white hover:shadow-sm transition-shadow">
      <div
        className="w-12 h-12 rounded-lg border border-ait-neutral-200 flex-shrink-0"
        style={{ backgroundColor: value }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-ait-body-md-semibold text-ait-neutral-900">{name}</p>
        <p className="text-ait-caption-md-regular text-ait-neutral-500 uppercase">{value}</p>
      </div>
    </div>
  );
}

interface ColorGroupProps {
  title: string;
  description?: string;
  colors: { name: string; value: string }[];
  codeExample?: string;
}

function ColorGroup({ title, description, colors, codeExample }: ColorGroupProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-ait-h2-bold text-ait-neutral-900 border-b border-ait-neutral-200 pb-2">
          {title}
        </h2>
        {description && (
          <p className="text-ait-body-md-regular text-ait-neutral-600 mt-2">{description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {colors.map((color) => (
          <ColorSwatch key={color.name} name={color.name} value={color.value} />
        ))}
      </div>

      {codeExample && (
        <div className="mt-4">
          <h3 className="text-ait-body-lg-semibold text-ait-neutral-900 mb-2">Usage Example</h3>
          <CodeBlock code={codeExample} />
        </div>
      )}
    </section>
  );
}

export function ColorPalette() {
  const aitPrimaryColors = [
    { name: 'Primary 50', value: '#E6F4FB' },
    { name: 'Primary 100', value: '#CCE9F7' },
    { name: 'Primary 200', value: '#99D3EF' },
    { name: 'Primary 400', value: '#2B80AF' },
    { name: 'Primary 500', value: '#00487A' },
    { name: 'Primary 600', value: '#003768' },
  ];

  const aitSuccessColors = [
    { name: 'Success 25', value: '#F7FEF6' },
    { name: 'Success 50', value: '#ECFDF3' },
    { name: 'Success 200', value: '#A9EFC5' },
    { name: 'Success 500', value: '#20872E' },
    { name: 'Success 700', value: '#054F31' },
  ];

  const aitDangerColors = [
    { name: 'Danger 25', value: '#FFFBFA' },
    { name: 'Danger 50', value: '#FEF3F2' },
    { name: 'Danger 100', value: '#FEE4E2' },
    { name: 'Danger 200', value: '#FECDCA' },
    { name: 'Danger 500', value: '#A01713' },
    { name: 'Danger 600', value: '#D92D20' },
    { name: 'Danger 700', value: '#B42318' },
  ];

  const aitWarningColors = [
    { name: 'Warning 50', value: '#FFFAEB' },
    { name: 'Warning 200', value: '#F9E296' },
    { name: 'Warning 700', value: '#B54708' },
    { name: 'Warning 900', value: '#603200' },
  ];

  const aitInfoColors = [
    { name: 'Info 50', value: '#F0F9FF' },
    { name: 'Info 700', value: '#026AA2' },
  ];

  const aitNeutralColors = [
    { name: 'Neutral 25', value: '#FCFCFD' },
    { name: 'Neutral 50', value: '#F9FAFB' },
    { name: 'Neutral 100', value: '#F2F4F7' },
    { name: 'Neutral 200', value: '#EAECF0' },
    { name: 'Neutral 300', value: '#D0D5DD' },
    { name: 'Neutral 400', value: '#98A2B3' },
    { name: 'Neutral 500', value: '#667085' },
    { name: 'Neutral 600', value: '#475467' },
    { name: 'Neutral 700', value: '#344054' },
    { name: 'Neutral 800', value: '#1D2939' },
    { name: 'Neutral 900', value: '#101828' },
  ];

  const baseColors = [
    { name: 'White', value: '#FFFFFF' },
    { name: 'Black', value: '#000000' },
  ];

  const primaryExample = `// Using Primary colors
<button className="bg-ait-primary-500 hover:bg-ait-primary-600 text-white">
  Primary Button
</button>

<div className="bg-ait-primary-50 border border-ait-primary-200">
  Primary background
</div>`;

  const successExample = `// Using Success colors
<div className="bg-ait-success-50 border border-ait-success-200 text-ait-success-700">
  Success message
</div>`;

  const dangerExample = `// Using Danger colors
<div className="bg-ait-danger-50 border border-ait-danger-200 text-ait-danger-700">
  Error message
</div>`;

  const neutralExample = `// Using Neutral colors
<div className="bg-ait-neutral-50 border border-ait-neutral-200">
  <h3 className="text-ait-neutral-900">Heading</h3>
  <p className="text-ait-neutral-600">Description text</p>
</div>`;

  return (
    <>
      <ColorGroup
        title="AIT Primary"
        description="Main brand color for primary actions, links, and key UI elements"
        colors={aitPrimaryColors}
        codeExample={primaryExample}
      />

      <ColorGroup
        title="AIT Success"
        description="Used for positive feedback, success states, and confirmations"
        colors={aitSuccessColors}
        codeExample={successExample}
      />

      <ColorGroup
        title="AIT Danger"
        description="Used for errors, warnings, and destructive actions"
        colors={aitDangerColors}
        codeExample={dangerExample}
      />

      <ColorGroup
        title="AIT Warning"
        description="Used for alerts and cautionary messages"
        colors={aitWarningColors}
      />

      <ColorGroup
        title="AIT Info"
        description="Used for informational messages and highlights"
        colors={aitInfoColors}
      />

      <ColorGroup
        title="AIT Neutral"
        description="Used for text, backgrounds, borders, and general UI elements"
        colors={aitNeutralColors}
        codeExample={neutralExample}
      />

      <ColorGroup
        title="Base Colors"
        description="Fundamental colors for backgrounds and text"
        colors={baseColors}
      />
    </>
  );
}
