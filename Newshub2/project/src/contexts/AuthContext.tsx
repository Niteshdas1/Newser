import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'editor';
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loginAttempts: number;
  isLocked: boolean;
  lockoutTime: number | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Demo credentials - In production, this would be handled by a secure backend
const DEMO_USERS = [
  { id: '1', username: 'admin', password: 'SecureAdmin123!', role: 'admin' as const },
  { id: '2', username: 'editor', password: 'SecureEditor123!', role: 'editor' as const }
];

const MAX_LOGIN_ATTEMPTS = 3;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    const savedAttempts = localStorage.getItem('loginAttempts');
    const savedLockout = localStorage.getItem('lockoutTime');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedAttempts) {
      setLoginAttempts(parseInt(savedAttempts));
    }
    if (savedLockout) {
      const lockoutTime = parseInt(savedLockout);
      if (Date.now() < lockoutTime) {
        setLockoutTime(lockoutTime);
      } else {
        localStorage.removeItem('lockoutTime');
        localStorage.removeItem('loginAttempts');
        setLoginAttempts(0);
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Check if account is locked
    if (lockoutTime && Date.now() < lockoutTime) {
      return false;
    }

    // Clear lockout if time has passed
    if (lockoutTime && Date.now() >= lockoutTime) {
      setLockoutTime(null);
      setLoginAttempts(0);
      localStorage.removeItem('lockoutTime');
      localStorage.removeItem('loginAttempts');
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundUser = DEMO_USERS.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      const loggedInUser: User = {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
        lastLogin: new Date().toISOString()
      };
      
      setUser(loggedInUser);
      setLoginAttempts(0);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('lockoutTime');
      return true;
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts.toString());

      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        const lockTime = Date.now() + LOCKOUT_DURATION;
        setLockoutTime(lockTime);
        localStorage.setItem('lockoutTime', lockTime.toString());
      }
      
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isLocked = lockoutTime !== null && Date.now() < lockoutTime;

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      loginAttempts,
      isLocked,
      lockoutTime
    }}>
      {children}
    </AuthContext.Provider>
  );
};