import React, { useState, useEffect } from 'react';
import { Lock, User, Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lockoutCountdown, setLockoutCountdown] = useState(0);
  
  const { login, loginAttempts, isLocked, lockoutTime } = useAuth();

  useEffect(() => {
    if (isLocked && lockoutTime) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((lockoutTime - Date.now()) / 1000));
        setLockoutCountdown(remaining);
        
        if (remaining === 0) {
          clearInterval(interval);
          setError('');
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLocked, lockoutTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      setError(`Account locked. Try again in ${Math.ceil(lockoutCountdown / 60)} minutes.`);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await login(username, password);
      
      if (success) {
        onSuccess();
        onClose();
        setUsername('');
        setPassword('');
      } else {
        const remainingAttempts = 3 - (loginAttempts + 1);
        if (remainingAttempts > 0) {
          setError(`Invalid credentials. ${remainingAttempts} attempts remaining.`);
        } else {
          setError('Account locked for 15 minutes due to multiple failed attempts.');
        }
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-slate-800">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
            Admin Login
          </CardTitle>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            Secure access to admin panel
          </p>
        </CardHeader>
        
        <CardContent>
          {isLocked && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center text-red-800 dark:text-red-200">
                <AlertTriangle className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">
                  Account locked for {Math.ceil(lockoutCountdown / 60)} minutes
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                required
                disabled={isLocked}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
                disabled={isLocked}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                disabled={isLocked}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">
                {error}
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading || isLocked}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </form>

          <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-200 font-medium mb-2">Demo Credentials:</p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Admin: admin / SecureAdmin123!<br />
              Editor: editor / SecureEditor123!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};