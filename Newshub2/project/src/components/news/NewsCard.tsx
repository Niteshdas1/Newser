import React from 'react';
import { Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { NewsArticle, Category } from '../../types';

interface NewsCardProps {
  article: NewsArticle;
  categories: Category[];
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  className?: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  categories,
  isExpanded,
  onToggleExpand,
  className = ''
}) => {
  const category = categories.find(c => c.id === article.category);

  return (
    <article className={`h-full ${className}`}>
      <Card className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300 group">
        <div className="relative overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        
        <CardHeader>
          <div className="flex justify-between items-start mb-3">
            {category && (
              <Badge className={category.color}>
                {category.name}
              </Badge>
            )}
            <div className="flex items-center text-slate-500 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {article.readTime}
            </div>
          </div>
          <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors duration-200">
            {article.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex flex-col flex-1">
          <p className="text-slate-600 mb-4 leading-relaxed text-sm">
            {isExpanded ? article.content : article.excerpt}
          </p>
          
          <div className="flex items-center text-sm text-slate-500 mb-4">
            <Avatar className="h-7 w-7 mr-3">
              <AvatarFallback className="text-xs">
                {article.author.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              <span className="mr-3">{article.author}</span>
              <span className="text-slate-400">•</span>
              <span className="ml-3">{new Date(article.publishedDate).toLocaleDateString()}</span>
            </div>
          </div>
          
          <Button
            variant="link"
            className="mt-auto p-0 text-blue-600 hover:text-blue-800 self-start text-sm"
            onClick={() => onToggleExpand(article.id)}
          >
            {isExpanded ? "Show less" : "Read more"}
          </Button>
        </CardContent>
      </Card>
    </article>
  );
};