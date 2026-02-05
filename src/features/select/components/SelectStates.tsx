import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectField,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { CodeBlock } from '@/components/ui/CodeBlock';

const withLabelCode = `import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectField,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';

const [selectedCountry, setSelectedCountry] = useState('');

<SelectField
  label="Country"
  helperText="Select your country of residence"
  required
>
  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
    <SelectTrigger>
      <SelectValue placeholder="Select a country" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="us">United States</SelectItem>
      <SelectItem value="uk">United Kingdom</SelectItem>
      <SelectItem value="ca">Canada</SelectItem>
    </SelectContent>
  </Select>
</SelectField>`;

const errorStateCode = `import {
  Select,
  SelectContent,
  SelectField,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';

<SelectField
  label="Payment Method"
  error="Please select a payment method"
  required
>
  <Select>
    <SelectTrigger variant="error">
      <SelectValue placeholder="Select payment method" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="credit">Credit Card</SelectItem>
      <SelectItem value="debit">Debit Card</SelectItem>
      <SelectItem value="paypal">PayPal</SelectItem>
    </SelectContent>
  </Select>
</SelectField>`;

const disabledStateCode = `import {
  Select,
  SelectContent,
  SelectField,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';

<SelectField
  label="Subscription Plan"
  helperText="This field is currently disabled"
>
  <Select disabled defaultValue="free">
    <SelectTrigger>
      <SelectValue placeholder="Select plan" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="free">Free Plan</SelectItem>
      <SelectItem value="pro">Pro Plan</SelectItem>
      <SelectItem value="enterprise">Enterprise Plan</SelectItem>
    </SelectContent>
  </Select>
</SelectField>`;

export function SelectStates() {
  const [selectedCountry, setSelectedCountry] = useState('');

  return (
    <>
      {/* With Label and Helper Text */}
      <section className="space-y-4">
        <h2 className="text-ait-h2-bold text-ait-neutral-900 border-b border-ait-neutral-200 pb-2">
          With Label and Helper Text
        </h2>
        <p className="text-ait-body-md-regular text-ait-neutral-600 mb-4">
          Select with labels, helper text, and required indicator
        </p>
        <div className="bg-ait-white p-6 rounded-lg border border-ait-neutral-200 max-w-md">
          <SelectField label="Country" helperText="Select your country of residence" required>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="fr">France</SelectItem>
                <SelectItem value="jp">Japan</SelectItem>
                <SelectItem value="id">Indonesia</SelectItem>
              </SelectContent>
            </Select>
          </SelectField>
        </div>

        <div className="mt-4">
          <h3 className="text-ait-body-lg-semibold text-ait-neutral-900 mb-2">Code Example</h3>
          <CodeBlock code={withLabelCode} />
        </div>
      </section>

      {/* Error State */}
      <section className="space-y-4">
        <h2 className="text-ait-h2-bold text-ait-neutral-900 border-b border-ait-neutral-200 pb-2">
          Error State
        </h2>
        <p className="text-ait-body-md-regular text-ait-neutral-600 mb-4">
          Select with error styling and message
        </p>
        <div className="bg-ait-white p-6 rounded-lg border border-ait-neutral-200 max-w-md">
          <SelectField label="Payment Method" error="Please select a payment method" required>
            <Select>
              <SelectTrigger variant="error">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit">Credit Card</SelectItem>
                <SelectItem value="debit">Debit Card</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </SelectField>
        </div>

        <div className="mt-4">
          <h3 className="text-ait-body-lg-semibold text-ait-neutral-900 mb-2">Code Example</h3>
          <CodeBlock code={errorStateCode} />
        </div>
      </section>

      {/* Disabled State */}
      <section className="space-y-4">
        <h2 className="text-ait-h2-bold text-ait-neutral-900 border-b border-ait-neutral-200 pb-2">
          Disabled State
        </h2>
        <p className="text-ait-body-md-regular text-ait-neutral-600 mb-4">
          Disabled select that cannot be interacted with
        </p>
        <div className="bg-ait-white p-6 rounded-lg border border-ait-neutral-200 max-w-md">
          <SelectField label="Subscription Plan" helperText="This field is currently disabled">
            <Select disabled defaultValue="free">
              <SelectTrigger>
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free Plan</SelectItem>
                <SelectItem value="pro">Pro Plan</SelectItem>
                <SelectItem value="enterprise">Enterprise Plan</SelectItem>
              </SelectContent>
            </Select>
          </SelectField>
        </div>

        <div className="mt-4">
          <h3 className="text-ait-body-lg-semibold text-ait-neutral-900 mb-2">Code Example</h3>
          <CodeBlock code={disabledStateCode} />
        </div>
      </section>
    </>
  );
}
