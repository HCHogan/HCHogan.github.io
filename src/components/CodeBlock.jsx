import React, { useState } from 'react';

const CodeBlock = ({ lang = 'code', children, isDark }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (typeof navigator === 'undefined' || !children) return;
    try {
      await navigator.clipboard.writeText(Array.isArray(children) ? children.join('\n') : children);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Copy failed', error);
    }
  };

  return (
    <div
      className={`my-6 rounded-2xl border overflow-hidden text-sm font-mono transition-all duration-300 ${
        isDark
          ? 'bg-[#050915]/80 border-slate-800 shadow-[0_20px_45px_rgba(2,6,23,0.65)]'
          : 'bg-white/95 border-slate-200 shadow-[0_30px_60px_rgba(15,23,42,0.08)]'
      }`}
    >
      <div
        className={`flex items-center justify-between px-4 py-3 border-b ${
          isDark
            ? 'border-slate-800/80 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-slate-800/20'
            : 'border-slate-200 bg-gradient-to-r from-white via-slate-50 to-slate-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {['bg-red-500', 'bg-amber-400', 'bg-emerald-500'].map((dot) => (
              <span key={dot} className={`w-2 h-2 rounded-full ${dot}`} />
            ))}
          </div>
          <span
            className={`text-[0.65rem] tracking-[0.2em] font-semibold uppercase ${
              isDark ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            {lang}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={`text-[0.65rem] tracking-wide font-bold uppercase px-3 py-1 rounded-full transition-all ${
            isDark
              ? 'bg-slate-900/50 text-slate-200 hover:bg-slate-800/70'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {copied ? 'COPIED' : 'COPY'}
        </button>
      </div>
      <pre
        className={`p-5 overflow-x-auto leading-6 ${
          isDark ? 'text-slate-200 bg-slate-950/50' : 'text-slate-700 bg-slate-50'
        }`}
      >
        <code>{children}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
