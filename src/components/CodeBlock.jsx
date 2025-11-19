import React from 'react';

const CodeBlock = ({ children, isDark }) => (
  <div className="not-prose my-4">
    <pre
      className={`rounded-xl border px-4 py-3 text-[0.82rem] font-mono leading-relaxed overflow-x-auto ${
        isDark ? 'bg-[#131a2c] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      <code className="whitespace-pre">{children}</code>
    </pre>
  </div>
);

export default CodeBlock;
