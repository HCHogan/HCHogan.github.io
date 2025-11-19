import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Icon from '../icons/Icon.jsx';
import CodeBlock from '../CodeBlock.jsx';

const PostDetail = ({ post, previousPost, nextPost, onBack, onNavigate, palette, theme }) => {
  if (!post) return null;
  const isDark = theme === 'dark';
  const handleNavigate = (target) => {
    if (!target || !onNavigate) return;
    onNavigate(target.slug || target.id);
  };

  const defaultCodeLang = typeof post.category === 'string' ? post.category.toLowerCase() : 'text';

  const markdownComponents = {
    pre: ({ children }) => <>{children}</>,
    h1: (props) => (
      <h1 {...props} className={`text-3xl font-bold mt-12 mb-6 ${palette.textPrimary}`} />
    ),
    h2: (props) => (
      <h2 {...props} className={`text-2xl font-bold mt-10 mb-4 ${palette.textPrimary}`} />
    ),
    h3: (props) => (
      <h3 {...props} className={`text-xl font-bold mt-8 mb-3 ${palette.textPrimary}`} />
    ),
    p: (props) => <p {...props} className="mb-4 leading-relaxed" />,
    ul: (props) => <ul {...props} className="list-disc pl-6 space-y-2 mb-4" />,
    ol: (props) => <ol {...props} className="list-decimal pl-6 space-y-2 mb-4" />,
    code: ({ inline, className, children }) => {
      if (inline) {
        return (
          <code className={className}>{children}</code>
        );
      }
      const match = /language-(\w+)/.exec(className || '');
      const lang = match ? match[1] : defaultCodeLang;
      return (
        <CodeBlock lang={lang} isDark={isDark}>
          {String(children).trim()}
        </CodeBlock>
      );
    }
  };

  return (
    <article className="animate-in fade-in zoom-in-95 duration-500">
      <button
        onClick={onBack}
        className={`mb-8 flex items-center text-xs font-mono font-bold uppercase tracking-widest group transition-colors ${palette.textMuted} hover:text-orange-500`}
      >
        <div className={`p-1 rounded-full mr-2 border transition-colors group-hover:border-orange-500 ${palette.borderBase}`}>
          <Icon name="ArrowRight" className="rotate-180 text-inherit" size={12} />
        </div>
        Return to Index
      </button>

      <header className={`mb-10 border rounded-xl p-8 backdrop-blur-sm ${palette.borderBase} ${palette.cardBg} ${palette.cardShadow}`}>
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs font-mono font-bold text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
        <h1 className={`text-3xl md:text-5xl font-bold mb-4 leading-tight ${palette.textPrimary}`}>{post.title}</h1>
        <h2 className={`text-xl font-mono mb-8 ${palette.textSecondary}`}>{post.subtitle}</h2>

        <div className="flex flex-col md:flex-row md:items-center justify-between text-sm font-mono p-4 rounded bg-orange-500/5 border border-orange-500/10">
          <div className="flex items-center gap-4 mb-2 md:mb-0">
            <span className={palette.textMuted}>
              PUBLISHED: <strong className={palette.textPrimary}>{post.date}</strong>
            </span>
            <span className={palette.textMuted}>
              CATEGORY: <strong className="text-orange-500">{post.category}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span className={palette.textPrimary}>LIVE_DOCUMENT</span>
          </div>
        </div>
      </header>

      <div
        className={`prose max-w-none px-2 md:px-0 font-sans leading-loose ${
          isDark
            ? 'prose-invert prose-p:text-slate-300 prose-headings:text-white'
            : 'prose-slate prose-p:text-slate-600 prose-headings:text-slate-900'
        } prose-a:text-orange-500 hover:prose-a:text-orange-600 prose-img:rounded-xl`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      {(previousPost || nextPost) && (
        <div className={`mt-16 grid gap-4 ${previousPost && nextPost ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
          {previousPost && (
            <button
              type="button"
              onClick={() => handleNavigate(previousPost)}
              className={`text-left p-6 border rounded-xl group transition-all hover:border-orange-500 ${palette.borderBase} ${palette.cardBg}`}
            >
              <div className={`text-xs font-mono uppercase mb-2 flex items-center gap-2 ${palette.textMuted}`}>
                <Icon name="ArrowRight" size={14} className="rotate-180 opacity-60" />
                Previous Node
              </div>
              <div className={`font-bold group-hover:text-orange-500 transition-colors ${palette.textPrimary}`}>
                {previousPost.title}
              </div>
            </button>
          )}
          {nextPost && (
            <button
              type="button"
              onClick={() => handleNavigate(nextPost)}
              className="text-left p-6 border rounded-xl group transition-all bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20"
            >
              <div className="text-xs font-mono uppercase mb-2 opacity-80 flex items-center gap-2">
                Next Node
                <Icon name="ArrowRight" size={14} className="opacity-80" />
              </div>
              <div className="font-bold flex items-center justify-between">
                {nextPost.title}
                <Icon name="ArrowRight" size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          )}
        </div>
      )}
    </article>
  );
};

export default PostDetail;
