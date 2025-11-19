import React from 'react';
import Icon from '../icons/Icon.jsx';

const PostList = ({ posts, palette, isDark, onSelect }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className={`flex items-center justify-between border-b pb-4 mb-8 font-mono text-xs uppercase tracking-wider ${palette.borderBase} ${palette.textMuted}`}>
      <span className="font-bold flex items-center">
        <span className="w-2 h-2 bg-orange-500 mr-2 rounded-sm" /> Latest Transmissions
      </span>
      <div className="flex items-center space-x-4">
        {['Date', 'Relevance'].map((filter) => (
          <span key={filter} className="cursor-pointer hover:text-orange-500 transition-colors">
            {filter}
          </span>
        ))}
      </div>
    </div>

    <div className="grid gap-6">
      {posts.map((post) => (
        <article
          key={post.slug || post.id}
          onClick={() => onSelect(post.slug || post.id)}
          className={`group relative border rounded-xl p-0 cursor-pointer overflow-hidden transition-all duration-300 ${palette.borderBase} ${palette.cardBg} ${palette.cardHoverBg} ${palette.cardShadow}`}
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-4 gap-2">
              <div className="flex items-center space-x-3">
                <span className="px-2 py-1 bg-orange-500/10 text-orange-500 text-xs font-mono font-bold rounded uppercase border border-orange-500/20">
                  {post.category}
                </span>
                <span className={`text-xs font-mono ${palette.textMuted}`}>{post.date}</span>
              </div>
              <div className={`text-xs font-mono flex items-center ${palette.textMuted}`}>
                <Icon name="Compass" size={12} className="mr-1" /> {post.readTime} read
              </div>
            </div>

            <h3 className={`text-2xl md:text-3xl font-bold mb-2 transition-colors group-hover:text-orange-500 ${palette.textPrimary}`}>
              {post.title}
            </h3>
            <h4 className={`text-md font-mono mb-4 ${palette.textSecondary}`}>{post.subtitle}</h4>

            <p className={`line-clamp-2 mb-8 leading-relaxed ${palette.textSecondary}`}>{post.preview}</p>

            <div className="flex items-center">
              <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-mono font-bold py-3 px-6 rounded shadow-lg shadow-orange-500/20 transition-all flex items-center group-hover:translate-x-1">
                READ ENTRY <Icon name="ArrowRight" size={16} className="ml-2" />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  </div>
);

export default PostList;
