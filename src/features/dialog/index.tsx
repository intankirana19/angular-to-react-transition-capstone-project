import { SimpleDialog } from './components/SimpleDialog';
import { FormDialog } from './components/FormDialog';
import { ListDialog } from './components/ListDialog';
import { ImageDialog } from './components/ImageDialog';

export default function DialogShowcase() {
  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="border-b border-ait-neutral-200 pb-6">
        <h1 className="text-ait-h1 text-ait-neutral-900 mb-2">Dialog Component</h1>
        <p className="text-ait-body-lg-regular text-ait-neutral-600">
          Modal dialogs for user interactions, forms, and confirmations
        </p>
      </div>

      <SimpleDialog />
      <FormDialog />
      <ListDialog />
      <ImageDialog />
    </div>
  );
}
