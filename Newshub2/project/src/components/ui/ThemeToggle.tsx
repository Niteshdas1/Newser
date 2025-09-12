import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from './Button';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'semi-dark', icon: Monitor, label: 'Semi Dark' },
    { id: 'dark', icon: Moon, label: 'Dark' }
  ] as const;

  return (
    <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-700 semi-dark:bg-slate-600 rounded-lg p-1">
      {themes.map(({ id, icon: Icon, label }) => (
        <Button
          key={id}
          variant={theme === id ? "default" : "outline"}
          size="sm"
          onClick={() => setTheme(id)}
          className={`p-2 ${
            theme === id 
              ? 'bg-white dark:bg-slate-800 shadow-sm' 
              : 'bg-transparent border-none hover:bg-white/50 dark:hover:bg-slate-600'
          }`}
          title={label}
        >
          <Icon className="w-4 h-4" />
        </Button>
      ))}
    </div>
  );
};