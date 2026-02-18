import { BasicTextarea } from './components/BasicTextarea';
import { TextareaStates } from './components/TextareaStates';
import { TextareaVariants } from './components/TextareaVariants';
import { TextareaOrientation } from './components/TextareaOrientation';

export default function TextareaShowcase() {
  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="border-b border-neutral-200 pb-6">
        <h1 className="text-ait-h1 text-neutral-900 mb-2">Textarea Component</h1>
        <p className="text-ait-body-lg-regular text-neutral-600">
          Multi-line text input for descriptions, comments, and longer content
        </p>
      </div>

      <BasicTextarea />
      <TextareaVariants />
      <TextareaStates />
      <TextareaOrientation />
    </div>
  );
}
