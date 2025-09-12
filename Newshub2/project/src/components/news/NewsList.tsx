import React from 'react';
import { FileText } from 'lucide-react';
import { NewsCard } from './NewsCard';
import { Button } from '../ui/Button';
import { NewsArticle, Category } from '../../types';

interface NewsListProps {
  articles: NewsArticle[];
  categories: Category[];
  selectedCategory: string;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onCategoryChange: (categoryId: string) => void;
}

export const NewsList: React.FC<NewsListProps> = ({
  articles,
  categories,
  selectedCategory,
  expandedIds,
  onToggleExpand,
  onCategoryChange
}) => {
  const categoryName = selectedCategory === "all" 
    ? "Latest News" 
    : categories.find(c => c.id === selectedCategory)?.name;

  return (
    <section className="flex-1">
      <div className="flex items-center mb-6">
        <FileText className="w-6 h-6 text-slate-600 mr-2" />
        <h2 className="text-3xl font-bold text-slate-900">{categoryName}</h2>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-lg border border-slate-200">
          <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500 text-xl mb-4">No news articles found in this category.</p>
          <Button 
            onClick={() => onCategoryChange("all")} 
            variant="outline"
          >
            View All News
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              categories={categories}
              isExpanded={expandedIds.has(article.id)}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </section>
  );
};