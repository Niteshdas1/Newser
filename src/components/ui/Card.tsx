@@ .. @@
 export const Card: React.FC<CardProps> = ({ className = '', children }) => {
   return (
-    <div className={`bg-white dark:bg-slate-800 semi-dark:bg-slate-700 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 semi-dark:border-slate-600 transition-colors duration-300 ${className}`}>
+    <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300 ${className}`}>
       {children}
     </div>
   );
@@ .. @@
 export const CardTitle: React.FC<CardTitleProps> = ({ className = '', children }) => {
   return (
-    <h3 className={`text-xl font-semibold leading-tight text-slate-900 ${className}`}>
+    <h3 className={`text-xl font-semibold leading-tight text-slate-900 dark:text-white ${className}`}>
       {children}
     </h3>
   );