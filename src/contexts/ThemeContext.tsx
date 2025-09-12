@@ .. @@
-type Theme = 'light' | 'dark' | 'semi-dark';
+type Theme = 'light' | 'dark';

 interface ThemeContextType {
   theme: Theme;
@@ .. @@
   const toggleTheme = () => {
-    const themes: Theme[] = ['light', 'semi-dark', 'dark'];
+    const themes: Theme[] = ['light', 'dark'];
     const currentIndex = themes.indexOf(theme);
     const nextIndex = (currentIndex + 1) % themes.length;
     setTheme(themes[nextIndex]);
   };