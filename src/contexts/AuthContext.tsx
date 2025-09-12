import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'editor';
  lastLogin: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  loginWithOTP: (phoneNumber: string, otp: string) => Promise<boolean>;
  sendOTP: (phoneNumber: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loginAttempts: number;
  isLocked: boolean;
  lockoutTime: number | null;
  updateCredentials: (userId: string, newUsername: string, newPassword: string, phoneNumber?: string) => Promise<boolean>;
  resetPassword: (username: string, newPassword: string, otp: string) => Promise<boolean>;
  getUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Enhanced security with encrypted storage
const ENCRYPTION_KEY = 'GlobalNewsHub2024SecureKey!@#$%';

const encryptData = (data: string): string => {
  // Simple encryption for demo - in production use proper encryption
  return btoa(data + ENCRYPTION_KEY);
};

const decryptData = (encryptedData: string): string => {
  try {
    const decoded = atob(encryptedData);
    return decoded.replace(ENCRYPTION_KEY, '');
  } catch {
    return '';
  }
};

// Default admin credentials with enhanced security
const getStoredUsers = (): User[] => {
  const stored = localStorage.getItem('secureUsers');
  if (stored) {
    try {
      const decrypted = decryptData(stored);
      return JSON.parse(decrypted);
    } catch {
      // If decryption fails, return default users
    }
  }
  
  return [
    { 
      id: '1', 
      username: 'admin', 
      role: 'admin' as const, 
      lastLogin: '',
      phoneNumber: '+1234567890'
    },
    { 
      id: '2', 
      username: 'editor', 
      role: 'editor' as const, 
      lastLogin: '',
      phoneNumber: '+1234567891'
    }
  ];
};

const getStoredPasswords = (): Record<string, string> => {
  const stored = localStorage.getItem('securePasswords');
  if (stored) {
    try {
      const decrypted = decryptData(stored);
      return JSON.parse(decrypted);
    } catch {
      // If decryption fails, return default passwords
    }
  }
  
  return {
    'admin': 'SecureAdmin123!@#',
    'editor': 'SecureEditor123!@#'
  };
};

const MAX_LOGIN_ATTEMPTS = 3;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// OTP storage (in production, this would be server-side)
const otpStorage: Record<string, { otp: string; expires: number; purpose: 'login' | 'reset' }> = {};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>(getStoredUsers);
  const [passwords, setPasswords] = useState<Record<string, string>>(getStoredPasswords);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('secureUser');
    const savedAttempts = localStorage.getItem('loginAttempts');
    const savedLockout = localStorage.getItem('lockoutTime');

    if (savedUser) {
      try {
        const decrypted = decryptData(savedUser);
        setUser(JSON.parse(decrypted));
      } catch {
        localStorage.removeItem('secureUser');
      }
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

  const saveUsers = (updatedUsers: User[]) => {
    const encrypted = encryptData(JSON.stringify(updatedUsers));
    localStorage.setItem('secureUsers', encrypted);
    setUsers(updatedUsers);
  };

  const savePasswords = (updatedPasswords: Record<string, string>) => {
    const encrypted = encryptData(JSON.stringify(updatedPasswords));
    localStorage.setItem('securePasswords', encrypted);
    setPasswords(updatedPasswords);
  };

  const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTP = async (phoneNumber: string): Promise<boolean> => {
    const foundUser = users.find(u => u.phoneNumber === phoneNumber);
    if (!foundUser) return false;

    const otp = generateOTP();
    otpStorage[phoneNumber] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
      purpose: 'login'
    };

    // Simulate SMS sending (in production, integrate with SMS service)
    console.log(`OTP sent to ${phoneNumber}: ${otp}`);
    alert(`OTP sent to ${phoneNumber}: ${otp} (Demo mode - check console)`);
    
    return true;
  };

  const loginWithOTP = async (phoneNumber: string, otp: string): Promise<boolean> => {
    const storedOTP = otpStorage[phoneNumber];
    if (!storedOTP || storedOTP.expires < Date.now() || storedOTP.otp !== otp) {
      return false;
    }

    const foundUser = users.find(u => u.phoneNumber === phoneNumber);
    if (!foundUser) return false;

    const loggedInUser: User = {
      ...foundUser,
      lastLogin: new Date().toISOString()
    };

    setUser(loggedInUser);
    setLoginAttempts(0);
    const encrypted = encryptData(JSON.stringify(loggedInUser));
    localStorage.setItem('secureUser', encrypted);
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('lockoutTime');

    // Clear used OTP
    delete otpStorage[phoneNumber];

    return true;
  };

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

    const foundUser = users.find(u => u.username === username);
    const storedPassword = passwords[username];
    
    if (foundUser && storedPassword === password) {
      const loggedInUser: User = {
        ...foundUser,
        lastLogin: new Date().toISOString()
      };
      
      setUser(loggedInUser);
      setLoginAttempts(0);
      const encrypted = encryptData(JSON.stringify(loggedInUser));
      localStorage.setItem('secureUser', encrypted);
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

  const updateCredentials = async (userId: string, newUsername: string, newPassword: string, phoneNumber?: string): Promise<boolean> => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return false;

    // Check if username already exists (for other users)
    const existingUser = users.find(u => u.username === newUsername && u.id !== userId);
    if (existingUser) return false;

    const oldUsername = users[userIndex].username;
    const updatedUsers = [...users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      username: newUsername,
      phoneNumber
    };

    const updatedPasswords = { ...passwords };
    delete updatedPasswords[oldUsername];
    updatedPasswords[newUsername] = newPassword;

    saveUsers(updatedUsers);
    savePasswords(updatedPasswords);

    return true;
  };

  const resetPassword = async (username: string, newPassword: string, otp: string): Promise<boolean> => {
    const foundUser = users.find(u => u.username === username);
    if (!foundUser || !foundUser.phoneNumber) return false;

    const storedOTP = otpStorage[foundUser.phoneNumber];
    if (!storedOTP || storedOTP.expires < Date.now() || storedOTP.otp !== otp || storedOTP.purpose !== 'reset') {
      return false;
    }

    const updatedPasswords = { ...passwords };
    updatedPasswords[username] = newPassword;
    savePasswords(updatedPasswords);

    // Clear used OTP
    delete otpStorage[foundUser.phoneNumber];

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('secureUser');
  };

  const getUsers = () => users;

  const isLocked = lockoutTime !== null && Date.now() < lockoutTime;

  return (
    <AuthContext.Provider value={{
      user,
      login,
      loginWithOTP,
      sendOTP,
      logout,
      isAuthenticated: !!user,
      loginAttempts,
      isLocked,
      lockoutTime,
      updateCredentials,
      resetPassword,
      getUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};