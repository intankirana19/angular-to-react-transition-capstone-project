import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/Accordion';
import { Settings, Users, FileText, HelpCircle, Shield } from 'lucide-react';
import { CodeBlock } from '@/shared/ui/CodeBlock';

const lineCode = `<Accordion type="single" collapsible variant="line">
  <AccordionItem value="item-1">
    <AccordionTrigger icon={<Settings size={20} />}>
      Account Settings
    </AccordionTrigger>
    <AccordionContent>
      Manage your account preferences...
    </AccordionContent>
  </AccordionItem>
</Accordion>`;

const borderCode = `<Accordion type="single" collapsible variant="border">
  <AccordionItem value="item-1">
    <AccordionTrigger icon={<HelpCircle size={20} />}>
      Getting Started
    </AccordionTrigger>
    <AccordionContent>
      Welcome to our platform!
    </AccordionContent>
  </AccordionItem>
</Accordion>`;

export function AccordionVariants() {
  return (
    <>
      {/* Line Style */}
      <section className="space-y-4">
        <h2 className="text-ait-h2-bold text-neutral-900 border-b border-neutral-200 pb-2">
          Line Style
        </h2>
        <p className="text-ait-body-md-regular text-neutral-600 mb-4">
          Accordion with bottom border separators
        </p>
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <Accordion type="single" collapsible variant="line">
            <AccordionItem value="item-1">
              <AccordionTrigger icon={<Settings size={20} />}>Account Settings</AccordionTrigger>
              <AccordionContent>
                Manage your account preferences, including email notifications, privacy settings,
                and account security options. You can update your profile information and password
                here.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger icon={<Users size={20} />}>Team Management</AccordionTrigger>
              <AccordionContent>
                Add or remove team members, assign roles, and manage permissions. Team owners have
                full access while members can be assigned specific permissions based on their role.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger icon={<FileText size={20} />}>Billing & Invoices</AccordionTrigger>
              <AccordionContent>
                View your billing history, download invoices, and update payment methods. You can
                also upgrade or downgrade your subscription plan at any time.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="mt-4">
          <h3 className="text-ait-body-lg-semibold text-neutral-900 mb-2">Code Example</h3>
          <CodeBlock code={lineCode} />
        </div>
      </section>

      {/* Border Style */}
      <section className="space-y-4">
        <h2 className="text-ait-h2-bold text-neutral-900 border-b border-neutral-200 pb-2">
          Border Style
        </h2>
        <p className="text-ait-body-md-regular text-neutral-600 mb-4">
          Accordion with individual bordered cards
        </p>
        <div className="bg-neutral-50 p-6 rounded-lg">
          <Accordion type="single" collapsible variant="border">
            <AccordionItem value="item-1">
              <AccordionTrigger icon={<HelpCircle size={20} />}>Getting Started</AccordionTrigger>
              <AccordionContent>
                Welcome to our platform! To get started, complete your profile, explore the
                dashboard, and check out our quick start guide. If you need help, our support team
                is available 24/7.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger icon={<Settings size={20} />}>Configuration</AccordionTrigger>
              <AccordionContent>
                Customize your workspace by adjusting settings, adding integrations, and setting up
                automation rules. You can configure notifications, themes, and keyboard shortcuts.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger icon={<Shield size={20} />}>Security & Privacy</AccordionTrigger>
              <AccordionContent>
                Enable two-factor authentication, review recent login activity, and manage connected
                devices. Set up security questions and configure data retention policies.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="mt-4">
          <h3 className="text-ait-body-lg-semibold text-neutral-900 mb-2">Code Example</h3>
          <CodeBlock code={borderCode} />
        </div>
      </section>
    </>
  );
}
