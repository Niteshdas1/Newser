import React from 'react';
import { Settings, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { NewsForm } from './NewsForm';
import { NewsArticle, NewsFormData, Category } from '../../types';

interface AdminPanelProps {
  news: NewsArticle[];
  categories: Category[];
  formData: NewsFormData;
  editingNews: NewsArticle | null;
  onFormChange: (field: keyof NewsFormData, value: string | boolean) => void;
  onAddNews: () => void;
  onEditNews: (article: NewsArticle) => void;
  onUpdateNews: () => void;
  onDeleteNews: (id: string) => void;
  onCancelEdit: () => void;
  onViewSite: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  news,
  categories,
  formData,
  editingNews,
  onFormChange,
  onAddNews,
  onEditNews,
  onUpdateNews,
  onDeleteNews,
  onCancelEdit,
  onViewSite
}) => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Settings className="w-6 h-6 text-slate-600 mr-3" />
              <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
            </div>
            <Button onClick={onViewSite} variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              View Site
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* News Form */}
          <div className="lg:col-span-1">
            <NewsForm
              formData={editingNews ? {
                title: editingNews.title,
                excerpt: editingNews.excerpt,
                content: editingNews.content,
                category: editingNews.category,
                image: editingNews.image,
                author: editingNews.author,
                readTime: editingNews.readTime,
                featured: editingNews.featured
              } : formData}
              categories={categories}
              isEditing={!!editingNews}
              onFormChange={onFormChange}
              onSubmit={editingNews ? onUpdateNews : onAddNews}
              onCancel={editingNews ? onCancelEdit : undefined}
            />
          </div>

          {/* News Management */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">
              Manage Articles ({news.length})
            </h2>
            <div className="space-y-4">
              {news.map((article) => {
                const category = categories.find(c => c.id === article.category);
                return (
                  <Card key={article.id} className="hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-24 h-24 object-cover rounded-lg mr-4"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg text-slate-900 line-clamp-2">
                              {article.title}
                            </h3>
                            <div className="flex items-center ml-4">
                              {category && (
                                <Badge className={category.color}>
                                  {category.name}
                                </Badge>
                              )}
                              {article.featured && (
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 ml-2">
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center text-xs text-slate-500">
                            <span>{article.author}</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-slate-100">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onEditNews(article)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => onDeleteNews(article.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};