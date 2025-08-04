import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: number;
  recipient?: string;
  sender?: string;
  description: string;
  category: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  deductBalance: (amount: number) => boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Initial transaction history
const initialTransactions: Transaction[] = [
  {
    id: '1',
    type: 'received',
    amount: 150.00,
    sender: 'Sarah Johnson',
    description: 'Payment received',
    category: 'Food',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    status: 'completed'
  },
  {
    id: '2',
    type: 'sent',
    amount: 45.99,
    recipient: 'Uber Eats',
    description: 'Food delivery payment',
    category: 'Food',
    date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    status: 'completed'
  },
  {
    id: '3',
    type: 'received',
    amount: 500.00,
    sender: 'John Doe',
    description: 'Transfer received',
    category: 'Transfer',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    status: 'completed'
  },
  {
    id: '4',
    type: 'sent',
    amount: 89.50,
    recipient: 'Amazon',
    description: 'Online purchase',
    category: 'Shopping',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    status: 'completed'
  }
];

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const { user, updateProfile } = useAuth();

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deductBalance = (amount: number): boolean => {
    if (!user || user.balance < amount) {
      return false; // Insufficient balance
    }
    
    // Update user balance
    updateProfile({ balance: user.balance - amount });
    return true;
  };

  return (
    <TransactionContext.Provider value={{
      transactions,
      addTransaction,
      deductBalance
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};