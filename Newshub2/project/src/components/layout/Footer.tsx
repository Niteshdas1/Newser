import React from 'react';
import { Newspaper, Mail, Phone, MapPin } from 'lucide-react';
import { Category } from '../../types';

interface FooterProps {
  categories: Category[];
  onCategoryChange: (categoryId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ categories, onCategoryChange }) => {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 semi-dark:bg-slate-900 text-white mt-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              <Newspaper className="w-8 h-8 text-slate-300 dark:text-slate-400 semi-dark:text-slate-400 mr-3" />
              <h3 className="text-xl font-bold">Global News Hub</h3>
            </div>
            <p className="text-slate-300 dark:text-slate-400 semi-dark:text-slate-400 text-sm leading-relaxed">
              Your trusted source for the latest news and insights across various categories. 
              Delivering quality journalism since 2024.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.filter(c => c.id !== "all").map(category => (
                <li key={category.id}>
                  <button
                    onClick={() => onCategoryChange(category.id)}
                    className="text-slate-300 dark:text-slate-400 semi-dark:text-slate-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-300 dark:text-slate-400 semi-dark:text-slate-400 hover:text-white text-sm transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="text-slate-300 dark:text-slate-400 semi-dark:text-slate-400 hover:text-white text-sm transition-colors duration-200">Editorial Policy</a></li>
              <li><a href="#" className="text-slate-300 dark:text-slate-400 semi-dark:text-slate-400 hover:text-white text-sm transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-300 dark:text-slate-400 semi-dark:text-slate-400 hover:text-white text-sm transition-colors duration-200">Terms of Service</a></li>
              <li><a href="#" className="text-slate-300 dark:text-slate-400 semi-dark:text-slate-400 hover:text-white text-sm transition-colors duration-200">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center text-slate-300 dark:text-slate-400 semi-dark:text-slate-400 text-sm">
                <Mail className="w-4 h-4 mr-2" />
                <a href="mailto:contact@globalnewshub.com" className="hover:text-white transition-colors duration-200">
                  contact@globalnewshub.com
                </a>
              </div>
              <div className="flex items-center text-slate-300 dark:text-slate-400 semi-dark:text-slate-400 text-sm">
                <Phone className="w-4 h-4 mr-2" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start text-slate-300 dark:text-slate-400 semi-dark:text-slate-400 text-sm">
                <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                <span>123 News Street<br />Media City, MC 10001</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 dark:border-slate-700 semi-dark:border-slate-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-slate-400 dark:text-slate-500 semi-dark:text-slate-500 text-sm">
            © 2024 Global News Hub. All rights reserved.
          </p>
          <p className="text-slate-400 dark:text-slate-500 semi-dark:text-slate-500 text-sm mt-2 sm:mt-0">
            Powered by professional journalism
          </p>
        </div>
      </div>
    </footer>
  );
};