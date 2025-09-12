import React from 'react';
import { X, Calendar, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { NewsArticle, Category } from '../../types';

interface NewspaperViewProps {
  articles: NewsArticle[];
  categories: Category[];
  onClose: () => void;
}

export const NewspaperView: React.FC<NewspaperViewProps> = ({ articles, categories, onClose }) => {
  const featuredArticles = articles.filter(article => article.featured);
  const regularArticles = articles.filter(article => !article.featured);

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 overflow-auto">
      {/* Newspaper Header */}
      <div className="sticky top-0 bg-white dark:bg-slate-900 border-b-4 border-slate-900 dark:border-slate-100 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <h1 className="text-4xl md:text-6xl font-bold font-serif text-slate-900 dark:text-white tracking-tight">
                GLOBAL NEWS HUB
              </h1>
              <div className="flex justify-center items-center space-x-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="font-medium">ESTABLISHED 2024</span>
                <span>•</span>
                <span>{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
                <span>•</span>
                <span>DIGITAL EDITION</span>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="ml-4"
            >
              <X className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>
      </div>

      {/* Newspaper Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Featured Stories Section */}
        {featuredArticles.length > 0 && (
          <section className="mb-12">
            <div className="border-b-2 border-slate-900 dark:border-slate-100 mb-6">
              <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white mb-2">
                FEATURED STORIES
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {featuredArticles.slice(0, 2).map((article, index) => (
                <article key={article.id} className={index === 0 ? 'lg:col-span-2' : ''}>
                  <div className="mb-4">
                    <Badge className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs">
                      {getCategoryName(article.category).toUpperCase()}
                    </Badge>
                  </div>
                  <h3 className={`font-bold font-serif text-slate-900 dark:text-white leading-tight mb-3 ${
                    index === 0 ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'
                  }`}>
                    {article.title}
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-4 font-serif">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 mb-4">
                    <User className="w-4 h-4 mr-1" />
                    <span className="font-medium mr-3">{article.author}</span>
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="text-slate-800 dark:text-slate-200 leading-relaxed font-serif text-base">
                    {article.content}
                  </div>
                  {index < featuredArticles.length - 1 && (
                    <hr className="border-slate-300 dark:border-slate-600 my-8" />
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Regular Articles Section */}
        {regularArticles.length > 0 && (
          <section>
            <div className="border-b-2 border-slate-900 dark:border-slate-100 mb-6">
              <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white mb-2">
                LATEST NEWS
              </h2>
            </div>
            
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {regularArticles.map((article, index) => (
                <article key={article.id} className="break-inside-avoid">
                  <div className="mb-2">
                    <Badge className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs">
                      {getCategoryName(article.category).toUpperCase()}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white leading-tight mb-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center text-xs text-slate-600 dark:text-slate-400 mb-3">
                    <User className="w-3 h-3 mr-1" />
                    <span className="font-medium mr-2">{article.author}</span>
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3 font-serif">
                    {article.excerpt}
                  </p>
                  <div className="text-slate-800 dark:text-slate-200 leading-relaxed font-serif text-sm">
                    {article.content}
                  </div>
                  {index < regularArticles.length - 1 && (
                    <hr className="border-slate-300 dark:border-slate-600 mt-6" />
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Newspaper Footer */}
        <footer className="mt-16 pt-8 border-t-2 border-slate-900 dark:border-slate-100">
          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-serif">
              © 2024 Global News Hub • All rights reserved • Digital Edition
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 font-serif">
              "All the news that's fit to print, digitally delivered"
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};