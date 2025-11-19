import React, { useEffect, useState } from 'react';
import RipstopBackground from './RipstopBackground.jsx';
import Header from './layout/Header.jsx';
import Sidebar from './layout/Sidebar.jsx';
import PostList from './posts/PostList.jsx';
import PostDetail from './posts/PostDetail.jsx';
import Footer from './layout/Footer.jsx';
import StaticSection from './sections/StaticSection.jsx';
import FieldNotes from './sections/FieldNotes.jsx';
import { NAV_ITEMS, SECTION_CONTENT } from '../data/sections.js';

const STORAGE_KEY = 'algebraic-drift-state';

const App = ({ posts = [], fieldNotes = [] }) => {
  const [theme, setTheme] = useState('light');
  const [userOverrideTheme, setUserOverrideTheme] = useState(false);
  const [view, setView] = useState('index');
  const [activePost, setActivePost] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('index');
  const [hydrated, setHydrated] = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const applyPreference = () => {
      if (!userOverrideTheme) {
        setTheme(media.matches ? 'dark' : 'light');
      }
    };
    applyPreference();
    media.addEventListener('change', applyPreference);
    return () => media.removeEventListener('change', applyPreference);
  }, [userOverrideTheme]);

  useEffect(() => {
    if (typeof window === 'undefined' || hydrated) return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setHydrated(true);
        return;
      }
      const data = JSON.parse(stored);
      if (typeof data.userOverride === 'boolean') {
        setUserOverrideTheme(data.userOverride);
      }
      if (data.theme === 'dark' || data.theme === 'light') {
        setTheme(data.theme);
      }

      let nextView = data.view || 'index';
      let nextSection = data.section || 'index';

      if (nextView === 'post') {
        if (data.postSlug && posts.length) {
          const idx = posts.findIndex(
            (entry) => entry.slug === data.postSlug || entry.id === data.postSlug
          );
          if (idx >= 0) {
            setActiveIndex(idx);
            setActivePost(posts[idx]);
          } else {
            nextView = 'index';
            nextSection = 'index';
          }
        } else {
          nextView = 'index';
          nextSection = 'index';
        }
      }

      setView(nextView);
      setActiveSection(nextSection);
    } catch (error) {
      console.warn('Failed to restore state', error);
    } finally {
      setHydrated(true);
    }
  }, [posts, hydrated]);

  useEffect(() => {
    if (typeof window === 'undefined' || !hydrated) return;
    const payload = {
      view,
      section: activeSection,
      postSlug: activePost?.slug || activePost?.id || null,
      theme,
      userOverride: userOverrideTheme
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [view, activeSection, activePost, theme, userOverrideTheme, hydrated]);

  const palette = {
    textPrimary: isDark ? 'text-white' : 'text-slate-900',
    textSecondary: isDark ? 'text-slate-400' : 'text-slate-600',
    textMuted: isDark ? 'text-slate-500' : 'text-slate-500',
    borderBase: isDark ? 'border-slate-800' : 'border-slate-200',
    cardBg: isDark ? 'bg-[#161b22]/80' : 'bg-white',
    cardHoverBg: isDark ? 'hover:bg-[#1c2128]' : 'hover:bg-white',
    cardShadow: isDark ? 'shadow-none' : 'shadow-md hover:shadow-lg'
  };

  const toggleTheme = () => {
    setUserOverrideTheme(true);
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleTitleClick = () => {
    setView('index');
    setActivePost(null);
    setActiveIndex(null);
    setActiveSection('index');
    setMenuOpen(false);
  };

  const focusPost = (identifier) => {
    if (!posts.length) return;
    const targetIndex =
      typeof identifier === 'number'
        ? identifier
        : posts.findIndex(
            (entry) => entry.slug === identifier || entry.id === identifier
          );
    if (targetIndex < 0 || targetIndex >= posts.length) return;

    setActiveIndex(targetIndex);
    setActivePost(posts[targetIndex]);
    setView('post');
    setActiveSection('index');
    setMenuOpen(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setView('index');
    setActivePost(null);
    setActiveIndex(null);
    setActiveSection('index');
  };

  const handleSectionChange = (sectionKey) => {
    if (sectionKey === 'index') {
      handleBack();
    } else {
      setView(sectionKey);
      setActivePost(null);
      setActiveIndex(null);
    }
    setActiveSection(sectionKey);
    setMenuOpen(false);
  };
  const previousPost = activeIndex !== null ? posts[activeIndex + 1] : null;
  const nextPost = activeIndex !== null ? posts[activeIndex - 1] : null;

  return (
    <div
      className={`min-h-screen font-sans selection:bg-orange-500 selection:text-white transition-colors duration-500 ${
        isDark ? 'text-slate-200' : 'text-slate-800'
      }`}
    >
      <RipstopBackground theme={theme} />

      <Header
        isDark={isDark}
        textPrimary={palette.textPrimary}
        textMuted={palette.textMuted}
        toggleTheme={toggleTheme}
        onTitleClick={handleTitleClick}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        navItems={NAV_ITEMS}
        activeSection={activeSection}
        onNavigate={handleSectionChange}
      />

      <main className="pt-24 pb-20 px-4 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Sidebar
          isDark={isDark}
          palette={palette}
          navItems={NAV_ITEMS}
          activeSection={activeSection}
          onNavigate={handleSectionChange}
        />

        <div className="lg:col-span-9 min-h-[60vh]">
          {view === 'index' ? (
            <PostList posts={posts} palette={palette} isDark={isDark} onSelect={focusPost} />
          ) : view === 'post' ? (
            <PostDetail
              post={activePost}
              previousPost={previousPost}
              nextPost={nextPost}
              onBack={handleBack}
              onNavigate={focusPost}
              palette={palette}
              theme={theme}
            />
          ) : view === 'field-notes' ? (
            <FieldNotes entries={fieldNotes} palette={palette} isDark={isDark} />
          ) : (
            <StaticSection data={SECTION_CONTENT[view]} palette={palette} isDark={isDark} />
          )}
        </div>
      </main>

      <Footer isDark={isDark} palette={palette} />
    </div>
  );
};

export default App;
