import { ColorPalette } from './components/ColorPalette';

export default function ColorsShowcase() {
  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="border-b border-neutral-200 pb-6">
        <h1 className="text-ait-h1 text-neutral-900 mb-2">Color Palette</h1>
        <p className="text-ait-body-lg-regular text-neutral-600">
          Complete color system with semantic color scales for consistent UI design
        </p>
      </div>

      <ColorPalette />
    </div>
  );
}
