import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  balance: number;
  accountNumber: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loginDemo: () => void;
  users: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In-memory user storage with demo accounts
const initialUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    name: 'John Doe',
    phone: '+1234567890',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    balance: 15420.50,
    accountNumber: '****1234',
    createdAt: new Date('2023-01-15')
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    phone: '+1987654321',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    balance: 8750.25,
    accountNumber: '****5678',
    createdAt: new Date('2023-03-22')
  },
  {
    id: '3',
    email: 'demo@demo.com',
    name: 'Demo User',
    phone: '+1555000000',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    balance: 25000.00,
    accountNumber: '****0000',
    createdAt: new Date('2024-01-01')
  }
];

// In-memory password storage (in real app, this would be hashed and stored securely)
const userPasswords: Record<string, string> = {
  'john.doe@example.com': 'password123',
  'jane.smith@example.com': 'password123',
  'demo@demo.com': 'demo123'
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>(initialUsers);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    const storedPassword = userPasswords[email.toLowerCase()];
    
    if (!foundUser || !storedPassword || storedPassword !== password) {
      setIsLoading(false);
      return { success: false, error: 'Invalid email or password' };
    }
    
    setUser(foundUser);
    localStorage.setItem('currentUser', JSON.stringify(foundUser));
    setIsLoading(false);
    return { success: true };
  };

  const signup = async (email: string, password: string, name: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      setIsLoading(false);
      return { success: false, error: 'An account with this email already exists' };
    }
    
    // Generate account number
    const accountNumber = `****${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      name,
      phone,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      balance: 1000.00, // Starting balance
      accountNumber,
      createdAt: new Date()
    };
    
    // Add to users array and password storage
    setUsers(prev => [...prev, newUser]);
    userPasswords[email.toLowerCase()] = password;
    
    // Auto-login the new user
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const loginDemo = () => {
    const demoUser = users.find(u => u.email === 'demo@demo.com');
    if (demoUser) {
      setUser(demoUser);
      localStorage.setItem('currentUser', JSON.stringify(demoUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    loginDemo,
    users
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};