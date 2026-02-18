import { CodeBlock } from '@/shared/ui/CodeBlock';

const displayCode = `<p className="text-ait-display-sm text-primary-500">
  Display Small
</p>`;

export function DisplaySection() {
  return (
    <section className="space-y-4">
      <h2 className="text-ait-h2-bold text-neutral-900 border-b border-neutral-200 pb-2">
        Display
      </h2>
      <div className="bg-neutral-50 p-6 rounded-lg">
        <p className="text-ait-display-sm text-primary-500">Display Small</p>
        <p className="text-ait-caption-md-regular text-neutral-500 mt-2">
          72px, Medium (500), line-height: 96px, letter-spacing: -2px
        </p>
      </div>
      <div className="mt-4">
        <h3 className="text-ait-body-lg-semibold text-neutral-900 mb-2">Code Example</h3>
        <CodeBlock code={displayCode} />
      </div>
    </section>
  );
}
