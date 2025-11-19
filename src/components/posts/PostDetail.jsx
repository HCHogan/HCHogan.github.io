import React from 'react';
import Icon from '../icons/Icon.jsx';
import CodeBlock from '../CodeBlock.jsx';

const PostDetail = ({ post, previousPost, nextPost, onBack, onNavigate, palette, theme }) => {
  if (!post) return null;
  const isDark = theme === 'dark';
  const handleNavigate = (target) => {
    if (!target || !onNavigate) return;
    onNavigate(target.slug || target.id);
  };

  let listBuffer = [];
  let codeLang = null;
  let codeBuffer = [];

  const nodes = [];

  const flushList = (key) => {
    if (!listBuffer.length) return;
    nodes.push(
      <ul key={`list-${key}`} className="list-disc pl-6 mb-4">
        {listBuffer.map((item, idx) => (
          <li key={`list-item-${key}-${idx}`} className="leading-loose">
            {item}
          </li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  const flushCode = (key) => {
    if (!codeBuffer.length) return;
    nodes.push(
      <CodeBlock key={`code-${key}`} lang={codeLang || post.category.toLowerCase()} isDark={isDark}>
        {codeBuffer.join('\n')}
      </CodeBlock>
    );
    codeBuffer = [];
    codeLang = null;
  };

  post.content.split('\n').forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      if (codeLang === null) {
        codeLang = trimmed.replace('```', '').trim();
        flushList(idx);
      } else {
        flushCode(idx);
      }
      return;
    }

    if (codeLang !== null) {
      codeBuffer.push(line);
      return;
    }

    if (!trimmed.length) {
      flushList(idx);
      nodes.push(<br key={`break-${idx}`} />);
      return;
    }

    if (trimmed.startsWith('* ')) {
      listBuffer.push(trimmed.substring(2));
      return;
    }

    flushList(idx);

    if (trimmed.startsWith('###')) {
      nodes.push(
        <div key={`heading-${idx}`} className="flex items-center mt-12 mb-6">
          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded mr-3 font-mono">0{idx}</span>
          <h3 className={`text-2xl font-bold m-0 ${palette.textPrimary}`}>{trimmed.replace('###', '')}</h3>
        </div>
      );
      return;
    }

    nodes.push(
      <p key={`paragraph-${idx}`} className="mb-4">
        {line}
      </p>
    );
  });

  flushList('end');
  flushCode('end');

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
        {nodes}
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
