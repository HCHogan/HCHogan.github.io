import React from 'react';
import Icon from '../icons/Icon.jsx';

const Header = ({
  isDark,
  textPrimary,
  textMuted,
  toggleTheme,
  onTitleClick,
  menuOpen,
  onToggleMenu,
  navItems = [],
  activeSection = 'index',
  onNavigate
}) => (
  <>
    <header
      className={`fixed top-0 w-full z-50 border-b backdrop-blur-md h-14 flex items-center justify-between px-4 lg:px-8 transition-colors duration-500 ${
        isDark ? 'border-slate-800/60 bg-[#0f1115]/90' : 'border-slate-200 bg-white/80'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-orange-500 rounded-sm flex items-center justify-center shadow-[0_0_10px_rgba(249,115,22,0.4)]">
          <Icon name="Mountain" size={18} className="text-white" />
        </div>
        <a
          href="https://github.com/HCHogan"
          target="_blank"
          rel="noopener noreferrer"
          className={`font-mono font-bold tracking-tighter text-lg cursor-pointer transition-colors ${textPrimary}`}
        >
          HCHOGAN
        </a>
      </div>

      <div className="hidden md:flex items-center space-x-6 text-xs font-mono font-medium">
        <span className={`flex items-center cursor-help ${textMuted} hover:text-orange-500 transition-colors`}>
          <Icon name="Activity" size={14} className="mr-1" /> SYSTEM_NORMAL
        </span>
        <span className={`flex items-center cursor-help ${textMuted} hover:text-orange-500 transition-colors`}>
          <Icon name="GitBranch" size={14} className="mr-1" /> MAIN_BRANCH
        </span>
        <span className="text-orange-500 border border-orange-500/30 px-2 py-0.5 rounded bg-orange-500/10 font-bold">
          v2.4.0
        </span>

        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-all ${
            isDark ? 'bg-slate-800 text-orange-400 hover:bg-slate-700' : 'bg-slate-100 text-orange-500 hover:bg-slate-200'
          }`}
        >
          <Icon name={isDark ? 'Sun' : 'Moon'} size={16} />
        </button>
      </div>

      <div className="md:hidden flex items-center gap-4">
        <button onClick={toggleTheme} className={isDark ? 'text-slate-300' : 'text-slate-600'}>
          <Icon name={isDark ? 'Sun' : 'Moon'} size={18} />
        </button>
        <button
          onClick={onToggleMenu}
          className={`hover:text-orange-500 transition-colors ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
        >
          <Icon name={menuOpen ? 'X' : 'Menu'} />
        </button>
      </div>
    </header>

    {menuOpen && (
      <div
        className={`fixed inset-0 z-40 backdrop-blur-xl pt-20 px-6 md:hidden ${
          isDark ? 'bg-[#0f1115]/95' : 'bg-slate-50/95'
        }`}
      >
        <nav className="flex flex-col space-y-4 font-mono text-xl">
          {navItems.map((item) => {
            const isActive = activeSection === item.key;
            return (
              <button
                type="button"
                key={item.key}
                onClick={() => onNavigate?.(item.key)}
                className={`text-left pb-3 border-b ${
                  isActive ? 'text-orange-500 border-orange-500/40' : `${textMuted} border-transparent`
                }`}
              >
                <div className="font-bold tracking-tight">{item.label.toUpperCase()}</div>
                {item.description && (
                  <div className="text-xs tracking-wide uppercase opacity-60 mt-1">{item.description}</div>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    )}
  </>
);

export default Header;
