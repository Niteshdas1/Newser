import React, { useState, useCallback } from 'react';
import { LoginModal } from './components/auth/LoginModal';
import { NewspaperView } from './components/newspaper/NewspaperView';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Sidebar } from './components/layout/Sidebar';
import { FeaturedStories } from './components/news/FeaturedStories';
import { NewsList } from './components/news/NewsList';
import { AdminPanel } from './components/admin/AdminPanel';
import { useAuth } from './contexts/AuthContext';
import { categories } from './data/categories';
import { sampleNews } from './data/news';
import { sponsoredAds } from './data/sponsoredAds';
import { NewsArticle, NewsFormData } from './types';

function App() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showNewspaperView, setShowNewspaperView] = useState(false);
  const [news, setNews] = useState<NewsArticle[]>(sampleNews);
  const [expandedNewsIds, setExpandedNewsIds] = useState<Set<string>>(new Set());
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  
  const { isAuthenticated, logout } = useAuth();

  // Form state for adding new articles
  const [newNewsForm, setNewNewsForm] = useState<NewsFormData>({
    title: "",
    excerpt: "",
    content: "",
    category: "finance_crypto",
    image: "",
    author: "",
    readTime: "",
    featured: false
  });

  // Filter news by category
  const filteredNews = selectedCategory === "all"
    ? news
    : news.filter(item => item.category === selectedCategory);

  // Featured news filtered by category
  const featuredNews = selectedCategory === "all"
    ? news.filter(item => item.featured)
    : news.filter(item => item.featured && item.category === selectedCategory);

  // Toggle expanded content for "Read more"
  const handleToggleExpand = useCallback((id: string) => {
    setExpandedNewsIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // Form handlers
  const handleFormChange = useCallback((field: keyof NewsFormData, value: string | boolean) => {
    setNewNewsForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleAddNews = useCallback(() => {
    const newArticle: NewsArticle = {
      id: Date.now().toString(),
      ...newNewsForm,
      publishedDate: new Date().toISOString().split('T')[0]
    };
    setNews(prev => [newArticle, ...prev]);
    setNewNewsForm({
      title: "",
      excerpt: "",
      content: "",
      category: "finance_crypto",
      image: "",
      author: "",
      readTime: "",
      featured: false
    });
  }, [newNewsForm]);

  const handleEditNews = useCallback((article: NewsArticle) => {
    setEditingNews(article);
  }, []);

  const handleUpdateNews = useCallback(() => {
    if (!editingNews) return;
    
    setNews(prev => prev.map(item => 
      item.id === editingNews.id ? editingNews : item
    ));
    setEditingNews(null);
  }, [editingNews]);

  const handleDeleteNews = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      setNews(prev => prev.filter(item => item.id !== id));
    }
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingNews(null);
  }, []);

  const handleAdminToggle = useCallback(() => {
    if (isAuthenticated) {
      logout();
    } else {
      setShowLoginModal(true);
    }
  }, [isAuthenticated, logout]);

  const handleLoginSuccess = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  const handleNewspaperView = useCallback(() => {
    setShowNewspaperView(true);
  }, []);

  const handleCloseNewspaper = useCallback(() => {
    setShowNewspaperView(false);
  }, []);

  // Show newspaper view
  if (showNewspaperView) {
    return (
      <NewspaperView
        articles={news}
        categories={categories}
        onClose={handleCloseNewspaper}
      />
    );
  }

  if (isAuthenticated) {
    return (
      <AdminPanel
        news={news}
        categories={categories}
        formData={newNewsForm}
        editingNews={editingNews}
        onFormChange={editingNews ? 
          (field, value) => setEditingNews(prev => prev ? { ...prev, [field]: value } : null) :
          handleFormChange
        }
        onAddNews={handleAddNews}
        onEditNews={handleEditNews}
        onUpdateNews={handleUpdateNews}
        onDeleteNews={handleDeleteNews}
        onCancelEdit={handleCancelEdit}
        onViewSite={() => logout()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 semi-dark:bg-slate-800 transition-colors duration-300">
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
      
      <Header
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onAdminToggle={handleAdminToggle}
        onNewspaperView={handleNewspaperView}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Stories */}
        <FeaturedStories
          articles={featuredNews}
          categories={categories}
          expandedIds={expandedNewsIds}
          onToggleExpand={handleToggleExpand}
        />

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-12">
          <NewsList
            articles={filteredNews}
            categories={categories}
            selectedCategory={selectedCategory}
            expandedIds={expandedNewsIds}
            onToggleExpand={handleToggleExpand}
            onCategoryChange={setSelectedCategory}
          />

          <Sidebar
            sponsoredAds={sponsoredAds}
            categories={categories}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </main>

      <Footer
        categories={categories}
        onCategoryChange={setSelectedCategory}
      />
    </div>
  );
}

export default App;