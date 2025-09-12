import React from 'react';
import { Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { NewsFormData, Category } from '../../types';

interface NewsFormProps {
  formData: NewsFormData;
  categories: Category[];
  isEditing: boolean;
  onFormChange: (field: keyof NewsFormData, value: string | boolean) => void;
  onSubmit: () => void;
  onCancel?: () => void;
}

export const NewsForm: React.FC<NewsFormProps> = ({
  formData,
  categories,
  isEditing,
  onFormChange,
  onSubmit,
  onCancel
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Save className="w-5 h-5 mr-2" />
          {isEditing ? "Edit News Article" : "Add New Article"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Article Title"
            value={formData.title}
            onChange={(e) => onFormChange('title', e.target.value)}
            required
          />
          
          <Textarea
            placeholder="Short Excerpt"
            rows={3}
            value={formData.excerpt}
            onChange={(e) => onFormChange('excerpt', e.target.value)}
            required
          />
          
          <Textarea
            placeholder="Full Content"
            rows={8}
            value={formData.content}
            onChange={(e) => onFormChange('content', e.target.value)}
            required
          />
          
          <select
            className="w-full p-2 border border-slate-300 rounded-md focus:border-slate-400 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            value={formData.category}
            onChange={(e) => onFormChange('category', e.target.value)}
            required
          >
            {categories.filter(cat => cat.id !== "all").map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          
          <Input
            placeholder="Image URL"
            type="url"
            value={formData.image}
            onChange={(e) => onFormChange('image', e.target.value)}
            required
          />
          
          <Input
            placeholder="Author Name"
            value={formData.author}
            onChange={(e) => onFormChange('author', e.target.value)}
            required
          />
          
          <Input
            placeholder="Read Time (e.g., '5 min read')"
            value={formData.readTime}
            onChange={(e) => onFormChange('readTime', e.target.value)}
            required
          />
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => onFormChange('featured', e.target.checked)}
              className="mr-2 rounded border-slate-300"
            />
            <label htmlFor="featured" className="text-sm text-slate-700">
              Featured Article
            </label>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              {isEditing ? "Update Article" : "Add Article"}
            </Button>
            {isEditing && onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};