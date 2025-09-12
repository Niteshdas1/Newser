import React from 'react';
import { Star } from 'lucide-react';
import { NewsCard } from './NewsCard';
import { NewsArticle, Category } from '../../types';

interface FeaturedStoriesProps {
  articles: NewsArticle[];
  categories: Category[];
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
}

export const FeaturedStories: React.FC<FeaturedStoriesProps> = ({
  articles,
  categories,
  expandedIds,
  onToggleExpand
}) => {
  if (articles.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center mb-6">
        <Star className="w-6 h-6 text-yellow-500 mr-2" />
        <h2 className="text-3xl font-bold text-slate-900">Featured Stories</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.slice(0, 2).map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            categories={categories}
            isExpanded={expandedIds.has(article.id)}
            onToggleExpand={onToggleExpand}
            className="transform hover:-translate-y-1 transition-transform duration-300"
          />
        ))}
      </div>
    </section>
  );
};