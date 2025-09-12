@@ .. @@
 import { AdminPanel } from './components/admin/AdminPanel';
 import { useAuth } from './contexts/AuthContext';
 import { categories } from './data/categories';
-import { sampleNews } from './data/news';
-import { sponsoredAds } from './data/sponsoredAds';
+import { sampleNews as initialNews } from './data/news';
+import { sponsoredAds as initialAds } from './data/sponsoredAds';
 import { NewsArticle, NewsFormData } from './types';

 function App() {
@@ .. @@
   const [showLoginModal, setShowLoginModal] = useState(false);
   const [showNewspaperView, setShowNewspaperView] = useState(false);
-  const [news, setNews] = useState<NewsArticle[]>(sampleNews);
+  const [news, setNews] = useState<NewsArticle[]>(initialNews);
+  const [sponsoredAds, setSponsoredAds] = useState(initialAds);
   const [expandedNewsIds, setExpandedNewsIds] = useState<Set<string>>(new Set());
@@ .. @@
   const handleCloseNewspaper = useCallback(() => {
     setShowNewspaperView(false);
   }, []);
+
+  const handleUpdateAds = useCallback((ads: typeof sponsoredAds) => {
+    setSponsoredAds(ads);
+  }, []);
+
+  const handleBulkUploadNews = useCallback((articles: NewsArticle[]) => {
+    setNews(prev => [...articles, ...prev]);
+  }, []);
+
+  const handleClearAllData = useCallback(() => {
+    setNews([]);
+    setSponsoredAds([]);
+  }, []);

   // Show newspaper view
@@ .. @@
         onDeleteNews={handleDeleteNews}
         onCancelEdit={handleCancelEdit}
         onViewSite={() => logout()}
+        sponsoredAds={sponsoredAds}
+        onUpdateAds={handleUpdateAds}
+        onBulkUploadNews={handleBulkUploadNews}
+        onClearAllData={handleClearAllData}
       />
     );