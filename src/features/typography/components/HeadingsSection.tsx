import { CodeBlock } from '@/shared/ui/CodeBlock';

const headingsCode = `<h1 className="text-ait-h1 text-neutral-900">
  Heading 1 - Semibold
</h1>

<h2 className="text-ait-h2-bold text-neutral-900">
  Heading 2 - Bold
</h2>

<h3 className="text-ait-h3-bold text-neutral-900">
  Heading 3 - Bold
</h3>

<h3 className="text-ait-h3-semibold text-neutral-900">
  Heading 3 - Semibold
</h3>

<h5 className="text-ait-h5-bold text-neutral-900">
  Heading 5 - Bold
</h5>

<h5 className="text-ait-h5-semibold text-neutral-900">
  Heading 5 - Semibold
</h5>

<h6 className="text-ait-h6 text-neutral-900">
  Heading 6 - Regular
</h6>`;

export function HeadingsSection() {
  return (
    <section className="space-y-4">
      <h2 className="text-ait-h2-bold text-neutral-900 border-b border-neutral-200 pb-2">
        Headings
      </h2>
      <div className="space-y-4">
        <div className="bg-neutral-50 p-6 rounded-lg">
          <h1 className="text-ait-h1 text-neutral-900">Heading 1 - Semibold</h1>
          <p className="text-ait-caption-md-regular text-neutral-500 mt-2">
            60px, Semibold (600), line-height: 80px, letter-spacing: -2px
          </p>
        </div>

        <div className="bg-neutral-50 p-6 rounded-lg">
          <h2 className="text-ait-h2-bold text-neutral-900">Heading 2 - Bold</h2>
          <p className="text-ait-caption-md-regular text-neutral-500 mt-2">
            48px, Bold (700), line-height: 64px, letter-spacing: -2px
          </p>
        </div>

        <div className="bg-neutral-50 p-6 rounded-lg">
          <h3 className="text-ait-h3-bold text-neutral-900">Heading 3 - Bold</h3>
          <p className="text-ait-caption-md-regular text-neutral-500 mt-2">
            36px, Bold (700), line-height: 48px, letter-spacing: -2px
          </p>
        </div>

        <div className="bg-neutral-50 p-6 rounded-lg">
          <h3 className="text-ait-h3-semibold text-neutral-900">Heading 3 - Semibold</h3>
          <p className="text-ait-caption-md-regular text-neutral-500 mt-2">
            36px, Semibold (600), line-height: 48px, letter-spacing: -2px
          </p>
        </div>

        <div className="bg-neutral-50 p-6 rounded-lg">
          <h5 className="text-ait-h5-bold text-neutral-900">Heading 5 - Bold</h5>
          <p className="text-ait-caption-md-regular text-neutral-500 mt-2">
            24px, Bold (700), line-height: 32px
          </p>
        </div>

        <div className="bg-neutral-50 p-6 rounded-lg">
          <h5 className="text-ait-h5-semibold text-neutral-900">Heading 5 - Semibold</h5>
          <p className="text-ait-caption-md-regular text-neutral-500 mt-2">
            24px, Semibold (600), line-height: 32px
          </p>
        </div>

        <div className="bg-neutral-50 p-6 rounded-lg">
          <h6 className="text-ait-h6 text-neutral-900">Heading 6 - Regular</h6>
          <p className="text-ait-caption-md-regular text-neutral-500 mt-2">
            20px, Regular (400), line-height: 32px
          </p>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-ait-body-lg-semibold text-neutral-900 mb-2">Code Example</h3>
        <CodeBlock code={headingsCode} />
      </div>
    </section>
  );
}
