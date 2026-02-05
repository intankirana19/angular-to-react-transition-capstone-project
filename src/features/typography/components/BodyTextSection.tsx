import { CodeBlock } from '@/shared/ui/CodeBlock';

const bodyTextExample = `<div className="space-y-4">
  {/* Body Large Regular */}
  <p className="text-ait-body-lg-regular text-ait-neutral-700">
    This is body large regular text at 18px.
  </p>

  {/* Body Large Semibold */}
  <p className="text-ait-body-lg-semibold text-ait-neutral-700">
    This is body large semibold text at 18px.
  </p>

  {/* Body Medium Regular */}
  <p className="text-ait-body-md-regular text-ait-neutral-700">
    This is body medium regular text at 16px.
  </p>

  {/* Body Medium Bold */}
  <p className="text-ait-body-md-bold text-ait-neutral-700">
    This is body medium bold text at 16px.
  </p>

  {/* Caption Medium Regular */}
  <p className="text-ait-caption-md-regular text-ait-neutral-700">
    This is caption medium regular text at 12px.
  </p>

  {/* Caption Small */}
  <p className="text-ait-caption-sm text-ait-neutral-700">
    This is caption small text at 11px.
  </p>
</div>`;

export function BodyTextSection() {
  return (
    <section className="space-y-4">
      <h2 className="text-ait-h2-bold text-ait-neutral-900 border-b border-ait-neutral-200 pb-2">
        Body Text
      </h2>
      <div className="space-y-4">
        <div className="bg-ait-neutral-50 p-6 rounded-lg">
          <p className="text-ait-body-lg-regular text-ait-neutral-700">Body Large Regular</p>
          <p className="text-ait-caption-md-regular text-ait-neutral-500 mt-2">
            18px, Regular (400), line-height: 28px
          </p>
        </div>

        <div className="bg-ait-neutral-50 p-6 rounded-lg">
          <p className="text-ait-body-lg-semibold text-ait-neutral-700">Body Large Semibold</p>
          <p className="text-ait-caption-md-regular text-ait-neutral-500 mt-2">
            18px, Semibold (600), line-height: 28px
          </p>
        </div>

        <div className="bg-ait-neutral-50 p-6 rounded-lg">
          <p className="text-ait-body-md-regular text-ait-neutral-700">Body Medium Regular</p>
          <p className="text-ait-caption-md-regular text-ait-neutral-500 mt-2">
            16px, Regular (400), line-height: 24px
          </p>
        </div>

        <div className="bg-ait-neutral-50 p-6 rounded-lg">
          <p className="text-ait-body-md-bold text-ait-neutral-700">Body Medium Bold</p>
          <p className="text-ait-caption-md-regular text-ait-neutral-500 mt-2">
            16px, Bold (700), line-height: 24px
          </p>
        </div>

        <div className="bg-ait-neutral-50 p-6 rounded-lg">
          <p className="text-ait-caption-md-regular text-ait-neutral-700">Caption Medium Regular</p>
          <p className="text-ait-caption-md-regular text-ait-neutral-500 mt-2">
            12px, Regular (400), line-height: 16px
          </p>
        </div>

        <div className="bg-ait-neutral-50 p-6 rounded-lg">
          <p className="text-ait-caption-sm text-ait-neutral-700">Caption Small</p>
          <p className="text-ait-caption-md-regular text-ait-neutral-500 mt-2">
            11px, Regular (400), line-height: 16px
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-ait-h5-bold text-ait-neutral-900 mb-3">Code Example</h3>
        <CodeBlock code={bodyTextExample} language="jsx" />
      </div>
    </section>
  );
}
