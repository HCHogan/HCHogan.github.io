import React, { useMemo, useState } from 'react';
import { marked } from 'marked';
import Icon from '../icons/Icon.jsx';

const FieldNotes = ({ entries = [], palette, isDark }) => {
  const [copiedId, setCopiedId] = useState(null);

  const parser = useMemo(() => {
    marked.setOptions({
      breaks: true,
      gfm: true
    });
    return marked;
  }, []);

  const handleCopy = async (entry) => {
    if (typeof navigator === 'undefined') return;
    try {
      await navigator.clipboard.writeText(entry.content.trim());
      setCopiedId(entry.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (error) {
      console.error('Copy failed', error);
    }
  };

  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className={`border rounded-2xl p-8 backdrop-blur ${palette.borderBase} ${palette.cardBg} ${palette.cardShadow}`}>
        <p className={`text-xs font-mono uppercase tracking-[0.3em] mb-4 ${palette.textMuted}`}>Curated AI Responses · Newest to Oldest</p>
        <h1 className={`text-3xl md:text-4xl font-bold tracking-tight mb-4 ${palette.textPrimary}`}>FIELD_NOTES</h1>
        <p className={`text-base md:text-lg leading-relaxed ${palette.textSecondary}`}>
          Illuminating responses from AI, Ready to Copy.
        </p>
      </div>

      <div className="space-y-6">
        {entries.map((entry) => (
          <article
            key={entry.id}
            className={`border rounded-2xl p-6 transition-colors ${palette.borderBase} ${palette.cardBg} ${palette.cardShadow}`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/30">
                    {entry.model || 'AI' }
                  </span>
                  <span className={`text-xs font-mono ${palette.textMuted}`}>{entry.date}</span>
                </div>
                <h2 className={`text-2xl font-bold mt-3 ${palette.textPrimary}`}>{entry.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(entry)}
                className={`inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wide px-4 py-2 rounded-full transition-all ${
                  isDark ? 'bg-slate-900/70 text-slate-200 hover:bg-slate-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon name="Terminal" size={14} /> {copiedId === entry.id ? 'COPIED' : 'COPY MD'}
              </button>
            </div>
            <div
              className={`prose max-w-none ${
                isDark ? 'prose-invert prose-p:text-slate-300' : 'prose-slate prose-p:text-slate-600'
              } prose-headings:mt-4 prose-headings:mb-2 prose-strong:text-orange-500`}
              dangerouslySetInnerHTML={{ __html: parser.parse(entry.content) }}
            />
          </article>
        ))}

        {entries.length === 0 && (
          <div className={`border rounded-2xl p-6 text-sm font-mono ${palette.borderBase} ${palette.cardBg}`}>
            还没有 Field Notes。向 <code>src/content/field-notes</code> 添加 .md 文件即可自动出现。
          </div>
        )}
      </div>
    </section>
  );
};

export default FieldNotes;
