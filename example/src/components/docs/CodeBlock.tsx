'use client';

import { useState, type FC } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/button';
import { Check, Clipboard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language: string;
  className?: string;
}

export const CodeBlock: FC<CodeBlockProps> = ({
  code,
  language,
  className,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code to clipboard:', error);
    }
  };

  return (
    <div
      className={cn(
        'not-prose group relative my-4 w-full overflow-hidden rounded-lg border border-border/50 bg-[#1e1e1e]',
        className
      )}
    >
      <div className="w-full overflow-x-auto">
        <SyntaxHighlighter
          className="SyntaxHighlighter !m-0"
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem',
            backgroundColor: 'transparent',
            fontSize: 'var(--fz-0)',
            lineHeight: '1.6',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'var(--font-mono)',
              display: 'block',
              width: 'fit-content',
              minWidth: '100%',
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 text-white/50 opacity-0 transition-opacity hover:bg-white/10 hover:text-white group-hover:opacity-100"
        onClick={handleCopy}
      >
        {isCopied ? (
          <Check className="h-4 w-4 text-emerald-400" />
        ) : (
          <Clipboard className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};
