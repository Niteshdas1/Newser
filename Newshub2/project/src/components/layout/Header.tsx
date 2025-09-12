import React from 'react';
import { Newspaper, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Category } from '../../types';

interface HeaderProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onAdminToggle: () => void;
  onNewspaperView: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  onAdminToggle,
  onNewspaperView
}) => {
  return (
    <header className="bg-white dark:bg-slate-900 semi-dark:bg-slate-800 shadow-sm sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700 semi-dark:border-slate-600 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 semi-dark:from-slate-600 semi-dark:to-slate-800 rounded-xl mr-4">
              <Newspaper className="w-7 h-7 text-white dark:text-slate-900 semi-dark:text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white semi-dark:text-white tracking-tight">Global News Hub</h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 semi-dark:text-slate-300 mt-0.5">Your trusted source for breaking news</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Button onClick={onNewspaperView} variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Newspaper
            </Button>
            <Button onClick={onAdminToggle} variant="outline" size="sm">
              Admin Panel
            </Button>
          </div>
        </div>

        {/* Category Navigation */}
        <nav aria-label="News categories" className="border-t border-slate-100 dark:border-slate-700 semi-dark:border-slate-600 py-4">
          <div className="flex space-x-1 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => onCategoryChange(category.id)}
                className="whitespace-nowrap text-sm transition-colors duration-200"
                size="sm"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};