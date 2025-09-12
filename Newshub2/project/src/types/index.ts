export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  publishedDate: string;
  readTime: string;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  color?: string;
}

export interface SponsoredAd {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

export interface NewsFormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  readTime: string;
  featured: boolean;
}