import { BasicAccordion } from './components/BasicAccordion';
import { AccordionVariants } from './components/AccordionVariants';
import { AccordionExamples } from './components/AccordionExamples';

export default function AccordionShowcase() {
  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="border-b border-ait-neutral-200 pb-6">
        <h1 className="text-ait-h1 text-ait-neutral-900 mb-2">Accordion Component</h1>
        <p className="text-ait-body-lg-regular text-ait-neutral-600">
          Interactive component that organizes content into expandable and collapsible sections
        </p>
      </div>

      <BasicAccordion />
      <AccordionVariants />
      <AccordionExamples />
    </div>
  );
}
