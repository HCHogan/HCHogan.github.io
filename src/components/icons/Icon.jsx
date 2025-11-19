import React from 'react';

const ICON_PATHS = {
  Terminal: <path d="m4 17 6-6-6-6M12 19h8" />,
  Mountain: <path d="m8 3 4 8 5-5 5 15H2L8 3z" />,
  Activity: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  GitBranch: (
    <path d="M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9" />
  ),
  Hash: <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />,
  ArrowRight: <path d="M5 12h14M12 5l7 7-7 7" />,
  X: <path d="M18 6 6 18M6 6l12 12" />,
  Menu: <path d="M4 12h16M4 6h16M4 18h16" />,
  Sun: <circle cx="12" cy="12" r="5" />,
  Moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
  Compass: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
    </>
  ),
  Box: (
    <>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5M12 22v-9" />
    </>
  ),
  Layers: (
    <>
      <path d="m12.83 2.12-.14-.11a2 2 0 0 0-1.38 0l-.14.11-9 4.82a2 2 0 0 0 0 3.52l9 4.82a2 2 0 0 0 1.38 0l9-4.82a2 2 0 0 0 0-3.52l-9-4.82Z" />
      <path d="m22 12-9.5 5.25a2 2 0 0 1-2 0L2 12M22 17l-9.5 5.25a2 2 0 0 1-2 0L2 17" />
    </>
  ),
  Cpu: (
    <>
      <rect width="16" height="16" x="4" y="4" rx="2" />
      <path d="M9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
    </>
  )
};

const Icon = ({ name, size = 20, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {ICON_PATHS[name] || <circle cx="12" cy="12" r="10" />}
  </svg>
);

export default Icon;
