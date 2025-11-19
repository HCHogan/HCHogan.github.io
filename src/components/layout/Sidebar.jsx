import React from 'react';
import Icon from '../icons/Icon.jsx';

const tags = ['#Topos', '#Coq', '#Rust', '#Category', '#Hiking'];

const Sidebar = ({ isDark, palette, navItems = [], activeSection = 'index', onNavigate }) => (
  <aside className="hidden lg:block lg:col-span-3 space-y-8 sticky top-24 h-fit">
    <div className={`border backdrop-blur p-6 rounded-lg relative overflow-hidden group ${palette.borderBase} ${palette.cardBg} ${palette.cardShadow}`}>
      <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-500" />

      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center text-orange-500 font-bold border ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <Icon name="Cpu" size={24} />
        </div>
        <div
          className={`text-xs font-mono py-1 px-2 rounded ${
            isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
          }`}
        >
          ONLINE
        </div>
      </div>

      <h2 className={`font-mono text-xl font-bold mb-2 ${palette.textPrimary}`}>HCHOGAN</h2>
      <p className={`${palette.textSecondary} text-sm leading-relaxed mb-6 font-mono`}>
        Exploring the homotopy of software spaces.
        <br />
        <span className="text-orange-500">●</span> Haskell <span className="text-orange-500">●</span> Lean4 <span className="text-orange-500">●</span> Rust
      </p>
      <div className="flex space-x-2">
        <button
          className={`flex-1 py-2 border rounded font-mono text-xs font-bold transition-colors hover:bg-orange-500 hover:text-white hover:border-orange-500 ${palette.borderBase} ${palette.textSecondary}`}
        >
          FOLLOW
        </button>
        <button
          className={`px-3 border rounded hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors ${palette.borderBase} ${palette.textSecondary}`}
        >
          <Icon name="Terminal" size={14} />
        </button>
      </div>
    </div>

    <nav className="font-mono text-sm space-y-2">
      <div className={`text-xs mb-3 pl-2 tracking-widest uppercase flex items-center font-bold ${palette.textMuted}`}>
        Directives
      </div>
      {navItems.map((item) => {
        const isActive = activeSection === item.key;
        return (
          <button
            type="button"
            key={item.key}
            onClick={() => onNavigate?.(item.key)}
            className={`w-full group flex items-center justify-between cursor-pointer px-3 py-3 rounded transition-all ${
              isActive
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : `${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-200'} ${palette.textSecondary}`
            }`}
          >
            <span className="font-bold tracking-tight">{item.label.toUpperCase()}</span>
            {isActive ? (
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            ) : (
              <Icon
                name="ArrowRight"
                size={14}
                className="opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all text-orange-500"
              />
            )}
          </button>
        );
      })}
    </nav>

    <div className={`border-t pt-6 ${palette.borderBase}`}>
      <div className={`text-xs mb-3 pl-2 tracking-widest uppercase flex items-center font-bold ${palette.textMuted}`}>
        Coordinates
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`px-2 py-1.5 border rounded text-xs font-mono cursor-pointer transition-all hover:bg-orange-500 hover:text-white hover:border-orange-500 ${
              isDark
                ? 'bg-slate-800/50 border-slate-700 text-slate-400'
                : 'bg-white border-slate-200 text-slate-500 shadow-sm'
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </aside>
);

export default Sidebar;
