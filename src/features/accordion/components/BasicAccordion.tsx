import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/Accordion';
import { HelpCircle, CreditCard, Shield } from 'lucide-react';
import { CodeBlock } from '@/shared/ui/CodeBlock';

const exampleCode = `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/Accordion';
import { HelpCircle } from 'lucide-react';

<Accordion type="single" collapsible variant="default">
  <AccordionItem value="item-1">
    <AccordionTrigger icon={<HelpCircle size={20} />}>
      What is your return policy?
    </AccordionTrigger>
    <AccordionContent>
      We offer a 30-day return policy for all unused items.
    </AccordionContent>
  </AccordionItem>
</Accordion>`;

export function BasicAccordion() {
  return (
    <section className="space-y-4">
      <h2 className="text-ait-h2-bold text-ait-neutral-900 border-b border-ait-neutral-200 pb-2">
        Default Style
      </h2>
      <p className="text-ait-body-md-regular text-ait-neutral-600 mb-4">
        Simple accordion with no borders or separators
      </p>
      <div className="bg-ait-white p-6 rounded-lg border border-ait-neutral-200">
        <Accordion type="single" collapsible variant="default">
          <AccordionItem value="item-1">
            <AccordionTrigger icon={<HelpCircle size={20} />}>
              What is your return policy?
            </AccordionTrigger>
            <AccordionContent>
              We offer a 30-day return policy for all unused items in their original packaging.
              Simply contact our customer service team to initiate a return, and we'll provide you
              with a prepaid shipping label.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger icon={<CreditCard size={20} />}>
              What payment methods do you accept?
            </AccordionTrigger>
            <AccordionContent>
              We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple
              Pay, and Google Pay. All transactions are secured with industry-standard encryption.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger icon={<Shield size={20} />}>
              Is my personal information secure?
            </AccordionTrigger>
            <AccordionContent>
              Yes, we take data security seriously. All personal information is encrypted and stored
              securely. We never share your data with third parties without your explicit consent.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="mt-4">
        <h3 className="text-ait-body-lg-semibold text-ait-neutral-900 mb-2">Code Example</h3>
        <CodeBlock code={exampleCode} />
      </div>
    </section>
  );
}
