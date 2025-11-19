import React from 'react';
import Icon from '../icons/Icon.jsx';

const Footer = ({ isDark, palette }) => (
  <footer
    className={`border-t py-12 mt-12 relative transition-colors duration-500 ${
      isDark ? 'border-slate-800 bg-[#0f1115]' : 'border-slate-200 bg-white'
    }`}
  >
    <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

    <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm relative z-10">
      <div>
        <h5 className={`font-mono font-bold mb-4 flex items-center ${palette.textPrimary}`}>
          <Icon name="Box" size={16} className="mr-2 text-orange-500" /> RESOURCES
        </h5>
        <ul className={`space-y-2 font-mono ${palette.textMuted}`}>
          <li className="hover:text-orange-500 cursor-pointer transition-colors">Lean4 Manual</li>
          <li className="hover:text-orange-500 cursor-pointer transition-colors">HoTT Book</li>
        </ul>
      </div>
      <div>
        <h5 className={`font-mono font-bold mb-4 flex items-center ${palette.textPrimary}`}>
          <Icon name="Layers" size={16} className="mr-2 text-orange-500" /> CONNECT
        </h5>
        <ul className={`space-y-2 font-mono ${palette.textMuted}`}>
          <li className="hover:text-orange-500 cursor-pointer transition-colors">GitHub</li>
          <li className="hover:text-orange-500 cursor-pointer transition-colors">MathOverflow</li>
        </ul>
      </div>
      <div className="md:text-right">
        <div className={`font-mono text-xs mb-2 ${palette.textSecondary}`}>RENDERED_IN: REACT_v18</div>
        <div className={`font-mono text-xs mb-2 ${palette.textSecondary}`}>
          THEME: {isDark ? 'GORP_DARK_v3' : 'GORP_LIGHT_v3'}
        </div>
        <div className="flex md:justify-end space-x-2 mt-4">
          <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
          <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
