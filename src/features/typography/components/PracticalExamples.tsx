import { CodeBlock } from '@/components/ui/CodeBlock';

const productCardExample = `<div className="bg-ait-white shadow-ait-lg rounded-lg p-6 border border-ait-neutral-200">
  <h3 className="text-ait-h5-bold text-ait-neutral-900 mb-2">
    Product Card Title
  </h3>
  <p className="text-ait-body-lg-regular text-ait-neutral-700 mb-4">
    This is a description of the product using AIT body large text.
  </p>
  <div className="flex items-center justify-between">
    <span className="text-ait-h3-bold text-ait-primary-500">$99.00</span>
    <button className="bg-ait-primary-500 text-ait-white px-6 py-2 rounded-lg text-ait-body-md-bold hover:bg-ait-primary-400 transition-colors">
      Add to Cart
    </button>
  </div>
</div>`;

const alertCardExample = `<div className="bg-ait-success-25 border border-ait-success-500 p-4 rounded-lg">
  <p className="text-ait-body-lg-semibold text-ait-success-500 mb-1">
    Success!
  </p>
  <p className="text-ait-body-md-regular text-ait-neutral-700">
    Your changes have been saved successfully.
  </p>
</div>`;

export function PracticalExamples() {
  return (
    <section className="space-y-4">
      <h2 className="text-ait-h2-bold text-ait-neutral-900 border-b border-ait-neutral-200 pb-2">
        Practical Examples
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Card */}
        <div className="bg-ait-white shadow-ait-lg rounded-lg p-6 border border-ait-neutral-200">
          <h3 className="text-ait-h5-bold text-ait-neutral-900 mb-2">Product Card Title</h3>
          <p className="text-ait-body-lg-regular text-ait-neutral-700 mb-4">
            This is a description of the product using AIT body large text.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-ait-h3-bold text-ait-primary-500">$99.00</span>
            <button className="bg-ait-primary-500 text-ait-white px-6 py-2 rounded-lg text-ait-body-md-bold hover:bg-ait-primary-400 transition-colors">
              Add to Cart
            </button>
          </div>
        </div>

        {/* Alert Card */}
        <div className="bg-ait-success-25 border border-ait-success-500 p-4 rounded-lg">
          <p className="text-ait-body-lg-semibold text-ait-success-500 mb-1">Success!</p>
          <p className="text-ait-body-md-regular text-ait-neutral-700">
            Your changes have been saved successfully.
          </p>
        </div>
      </div>

      <div className="space-y-6 mt-6">
        <div>
          <h3 className="text-ait-h5-bold text-ait-neutral-900 mb-3">Product Card Code</h3>
          <CodeBlock code={productCardExample} language="jsx" />
        </div>

        <div>
          <h3 className="text-ait-h5-bold text-ait-neutral-900 mb-3">Alert Card Code</h3>
          <CodeBlock code={alertCardExample} language="jsx" />
        </div>
      </div>
    </section>
  );
}
