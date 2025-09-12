import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClasses = {
    default: 'bg-slate-900 dark:bg-slate-100 semi-dark:bg-slate-200 text-white dark:text-slate-900 semi-dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 semi-dark:hover:bg-slate-300 focus:ring-slate-500 transition-colors duration-200',
    outline: 'border border-slate-300 dark:border-slate-600 semi-dark:border-slate-500 bg-white dark:bg-slate-800 semi-dark:bg-slate-700 text-slate-900 dark:text-slate-100 semi-dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 semi-dark:hover:bg-slate-600 focus:ring-slate-500 transition-colors duration-200',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    link: 'text-slate-900 dark:text-slate-100 semi-dark:text-slate-100 underline-offset-4 hover:underline focus:ring-slate-500 transition-colors duration-200'
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};