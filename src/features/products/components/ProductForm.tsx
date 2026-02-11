import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';

export function ProductForm() {
  return (
    <form className="space-y-4">
      <Input
        label="Name"
        placeholder="Product name"
        required
      />
      <Input
        label="Price"
        type="number"
        placeholder="0"
        required
      />
      <Input
        label="Avatar URL"
        placeholder="https://..."
      />
      <Input
        label="Material"
        placeholder="Cotton / Wood / Metal"
      />
      <Textarea
        placeholder="Description"
      />

      <button
        type="submit"
        className="px-4 py-2.5 text-ait-body-md-semibold text-white bg-ait-primary-500 rounded-lg hover:bg-ait-primary-400 transition-colors"
      >
        Save
      </button>
    </form>
  );
}
