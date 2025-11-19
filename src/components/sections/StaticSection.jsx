import React from 'react';

const StaticSection = ({ data, palette, isDark }) => {
  if (!data) return null;

  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className={`border rounded-2xl p-8 backdrop-blur ${palette.borderBase} ${palette.cardBg} ${palette.cardShadow}`}>
        <p className={`text-xs font-mono uppercase tracking-[0.3em] mb-4 ${palette.textMuted}`}>{data.tagline}</p>
        <h1 className={`text-3xl md:text-4xl font-bold tracking-tight mb-4 ${palette.textPrimary}`}>{data.title}</h1>
        <p className={`text-base md:text-lg leading-relaxed ${palette.textSecondary}`}>{data.description}</p>
        {data.bullets && (
          <ul className={`mt-6 space-y-3 text-base leading-relaxed ${palette.textSecondary} list-disc pl-5`}>
            {data.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}

        {data.orcidId && (
          <div
            className={`mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border rounded-xl px-4 py-3 ${palette.borderBase} ${
              isDark ? 'bg-slate-900/40' : 'bg-slate-50'
            }`}
          >
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-orange-400">ORCID</div>
              <div className={`font-semibold ${palette.textPrimary}`}>{data.orcidId}</div>
            </div>
            <a
              href={`https://orcid.org/${data.orcidId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 rounded-full font-mono text-xs font-bold bg-orange-500 text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-colors"
            >
              View Profile
            </a>
          </div>
        )}

        {data.highlights && (
          <div className="grid gap-4 md:grid-cols-2 mt-8">
            {data.highlights.map((highlight) => (
              <div
                key={highlight.title}
                className={`border rounded-xl p-5 h-full transition-colors ${palette.borderBase} ${isDark ? 'bg-slate-900/40' : 'bg-slate-50'}`}
              >
                <div className="text-xs font-mono uppercase tracking-wide text-orange-500 mb-2">{highlight.title}</div>
                <p className={`${palette.textSecondary}`}>{highlight.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {data.sections && (
        <div className="space-y-6">
          {data.sections.map((section) => (
            <div
              key={section.title}
              className={`border rounded-2xl p-6 ${palette.borderBase} ${palette.cardBg} ${palette.cardShadow}`}
            >
              <h2 className={`text-xl font-bold mb-3 ${palette.textPrimary}`}>{section.title}</h2>
              {section.body && <p className={`${palette.textSecondary} leading-relaxed`}>{section.body}</p>}
              {section.list && (
                <ul className={`mt-4 space-y-2 ${palette.textSecondary}`}>
                  {section.list.map((item, idx) => (
                    <li key={`${section.title}-${idx}`} className="flex items-start gap-3">
                      <span className="text-orange-500 font-bold text-lg">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default StaticSection;
