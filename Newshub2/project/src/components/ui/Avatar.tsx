import React from 'react';

interface AvatarProps {
  className?: string;
  children: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({ className = '', children }) => {
  return (
    <div className={`relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full ${className}`}>
      {children}
    </div>
  );
};

interface AvatarFallbackProps {
  className?: string;
  children: React.ReactNode;
}

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({ className = '', children }) => {
  return (
    <div className={`flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-slate-600 font-medium ${className}`}>
      {children}
    </div>
  );
};