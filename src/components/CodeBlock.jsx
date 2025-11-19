import React from 'react';
import clsx from 'clsx';

const CodeBlock = ({ children, isDark }) => {
  const content = Array.isArray(children) ? children.join('') : children || '';
  const trimmed = String(content);
  const isSingleLine = !trimmed.includes('\n');

  if (isSingleLine) {
    return (
      <code
        className={clsx(
          'font-mono text-[0.85rem] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-200',
          isDark ? 'bg-orange-500/10 text-orange-200' : 'bg-orange-100 text-orange-600'
        )}
      >
        {trimmed}
      </code>
    );
  }

  return (
    <div className="not-prose my-4">
      <pre
        className={`rounded-xl border px-4 py-3 text-[0.82rem] font-mono leading-relaxed overflow-x-auto ${
          isDark ? 'bg-[#131a2c] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <code className="whitespace-pre">{trimmed}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
