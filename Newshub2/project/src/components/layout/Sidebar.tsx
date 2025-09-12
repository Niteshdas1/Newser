import React, { useState, useEffect } from 'react';
import { Mail, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { SponsoredAd, Category } from '../../types';

interface SidebarProps {
  sponsoredAds: SponsoredAd[];
  categories: Category[];
  onCategoryChange: (categoryId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sponsoredAds,
  categories,
  onCategoryChange
}) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [email, setEmail] = useState('');

  // Rotate ads every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % sponsoredAds.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [sponsoredAds.length]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert('Thank you for subscribing!');
      setEmail('');
    }
  };

  return (
    <aside className="w-full lg:w-80 space-y-8">
      {/* Sponsored Content */}
      <div>
        <div className="flex items-center mb-4">
          <TrendingUp className="w-5 h-5 text-slate-600 mr-2" />
          <h2 className="text-xl font-bold text-slate-900">Sponsored Content</h2>
        </div>
        <div className="space-y-4">
          {sponsoredAds.map((ad, index) => (
            <Card
              key={ad.id}
              className={`overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg ${
                index === currentAdIndex ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Sponsored
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-slate-900">{ad.title}</h3>
                <p className="text-slate-600 text-sm mb-3 leading-relaxed">{ad.description}</p>
                <Button size="sm" className="w-full">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center mb-2">
            <Mail className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="font-bold text-lg text-slate-900">Stay Updated</h3>
          </div>
          <p className="text-slate-600 text-sm">
            Get the latest breaking news and exclusive stories delivered to your inbox daily.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleNewsletterSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Subscribe Now
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <h3 className="font-bold text-lg text-slate-900">Quick Links</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {categories.filter(c => c.id !== "all").map(category => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className="block w-full text-left p-3 hover:bg-slate-50 rounded-lg text-sm text-slate-700 hover:text-slate-900 transition-colors duration-200"
              >
                {category.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
};