import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import { FileText, HelpCircle, Settings, Shield, CreditCard } from 'lucide-react';
import { CodeBlock } from '@/components/ui/CodeBlock';

const flippedCode = `<Accordion type="single" collapsible variant="line" flipIcon>
  <AccordionItem value="item-1">
    <AccordionTrigger icon={<FileText size={20} />}>
      Documentation
    </AccordionTrigger>
    <AccordionContent>
      Access comprehensive guides...
    </AccordionContent>
  </AccordionItem>
</Accordion>`;

const multipleCode = `<Accordion type="multiple" variant="border">
  <AccordionItem value="item-1">
    <AccordionTrigger icon={<Settings size={20} />}>
      General Settings
    </AccordionTrigger>
    <AccordionContent>
      Configure basic application settings...
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger icon={<Shield size={20} />}>
      Privacy Settings
    </AccordionTrigger>
    <AccordionContent>
      Control who can see your profile...
    </AccordionContent>
  </AccordionItem>
</Accordion>`;

export function AccordionExamples() {
  return (
    <>
      {/* Flipped Icon Position */}
      <section className="space-y-4">
        <h2 className="text-ait-h2-bold text-ait-neutral-900 border-b border-ait-neutral-200 pb-2">
          Flipped Icon Position
        </h2>
        <p className="text-ait-body-md-regular text-ait-neutral-600 mb-4">
          Accordion with chevron icon on the left side
        </p>
        <div className="bg-ait-white p-6 rounded-lg border border-ait-neutral-200">
          <Accordion type="single" collapsible variant="line" flipIcon>
            <AccordionItem value="item-1">
              <AccordionTrigger icon={<FileText size={20} />}>Documentation</AccordionTrigger>
              <AccordionContent>
                Access comprehensive guides, API references, and tutorials to help you make the most
                of our platform. Updated regularly with new features and best practices.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger icon={<HelpCircle size={20} />}>FAQs</AccordionTrigger>
              <AccordionContent>
                Find answers to commonly asked questions about features, pricing, integrations, and
                troubleshooting. Can't find what you're looking for? Contact our support team.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="mt-4">
          <h3 className="text-ait-body-lg-semibold text-ait-neutral-900 mb-2">Code Example</h3>
          <CodeBlock code={flippedCode} />
        </div>
      </section>

      {/* Multiple Open Items */}
      <section className="space-y-4">
        <h2 className="text-ait-h2-bold text-ait-neutral-900 border-b border-ait-neutral-200 pb-2">
          Multiple Open Items
        </h2>
        <p className="text-ait-body-md-regular text-ait-neutral-600 mb-4">
          Accordion allowing multiple items to be expanded simultaneously
        </p>
        <div className="bg-ait-white p-6 rounded-lg border border-ait-neutral-200">
          <Accordion type="multiple" variant="border">
            <AccordionItem value="item-1">
              <AccordionTrigger icon={<Settings size={20} />}>General Settings</AccordionTrigger>
              <AccordionContent>
                Configure basic application settings including language preferences, timezone, date
                format, and default views.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger icon={<Shield size={20} />}>Privacy Settings</AccordionTrigger>
              <AccordionContent>
                Control who can see your profile, activity, and content. Manage cookie preferences
                and data sharing options.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger icon={<CreditCard size={20} />}>Payment Settings</AccordionTrigger>
              <AccordionContent>
                Add, remove, or set a default payment method. Enable auto-renewal and manage billing
                notifications.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="mt-4">
          <h3 className="text-ait-body-lg-semibold text-ait-neutral-900 mb-2">Code Example</h3>
          <CodeBlock code={multipleCode} />
        </div>
      </section>
    </>
  );
}
