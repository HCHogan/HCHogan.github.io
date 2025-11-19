import React from 'react';

const RipstopBackground = ({ theme }) => {
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0f1115' : '#f1f5f9';
  const minorGrid = isDark ? '#334155' : '#cbd5e1';
  const majorGrid = isDark ? '#475569' : '#94a3b8';

  return (
    <div
      className="fixed inset-0 -z-10 h-full w-full transition-colors duration-500"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${minorGrid} 1px, transparent 1px),
            linear-gradient(to bottom, ${minorGrid} 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${majorGrid} 1px, transparent 1px),
            linear-gradient(to bottom, ${majorGrid} 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}
      />

      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isDark
            ? 'opacity-100 bg-gradient-to-b from-[#0f1115]/10 via-transparent to-[#0f1115]/80'
            : 'opacity-50 bg-gradient-to-b from-transparent via-transparent to-slate-200/50'
        }`}
      />
    </div>
  );
};

export default RipstopBackground;
