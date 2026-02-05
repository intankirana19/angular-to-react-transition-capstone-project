import { DisplaySection } from './components/DisplaySection';
import { HeadingsSection } from './components/HeadingsSection';
import { BodyTextSection } from './components/BodyTextSection';
import { PracticalExamples } from './components/PracticalExamples';

export default function TypographyShowcase() {
  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="border-b border-ait-neutral-200 pb-6">
        <h1 className="text-ait-h1 text-ait-neutral-900 mb-2">Typography Showcase</h1>
        <p className="text-ait-body-lg-regular text-ait-neutral-600">
          Demonstrating AIT Design System typography styles with Roboto font
        </p>
      </div>

      <DisplaySection />
      <HeadingsSection />
      <BodyTextSection />
      <PracticalExamples />
    </div>
  );
}
