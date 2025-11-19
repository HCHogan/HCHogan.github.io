import typography from '@tailwindcss/typography';

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular']
      }
    }
  },
  plugins: [typography]
};
