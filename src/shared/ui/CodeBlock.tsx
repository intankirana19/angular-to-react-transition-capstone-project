import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('relative group', className)}>
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 p-2 rounded-md bg-neutral-800 hover:bg-neutral-700 transition-colors opacity-0 group-hover:opacity-100 z-10"
        title={copied ? 'Copied!' : 'Copy code'}
      >
        {copied ? (
          <Check className="w-4 h-4 text-success-400" />
        ) : (
          <Copy className="w-4 h-4 text-neutral-300" />
        )}
      </button>
      <pre className="bg-neutral-900 rounded-lg p-4 overflow-x-auto">
        <code
          className={cn('text-sm text-neutral-100 font-mono leading-relaxed', language)}
          data-language={language}
        >
          {code}
        </code>
      </pre>
    </div>
  );
}
