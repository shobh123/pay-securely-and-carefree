
import React from 'react';
import { 
  ArrowDownRight,
  TrendingUp,
  ShoppingBag,
  Car,
  Home,
  Utensils
} from 'lucide-react';
import TransactionGroup from './TransactionGroup';
import { useTransaction } from '@/contexts/TransactionContext';

interface Transaction {
  id: number;
  type: 'sent' | 'received';
  amount: number;
  recipient?: string;
  sender?: string;
  date: string;
  time: string;
  category: string;
  icon: any;
  status: string;
  rating?: number;
  hasReview?: boolean;
  flagged?: boolean;
}

interface TransactionListProps {
  searchTerm: string;
}

const TransactionList: React.FC<TransactionListProps> = ({ searchTerm }) => {
  const { transactions: contextTransactions } = useTransaction();
  
  // Map context transactions to the format expected by this component
  const transactions: Transaction[] = contextTransactions.map((transaction, index) => ({
    id: parseInt(transaction.id) || index,
    type: transaction.type,
    amount: transaction.amount,
    recipient: transaction.recipient,
    sender: transaction.sender,
    date: new Date(transaction.date).toLocaleDateString(),
    time: new Date(transaction.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    category: transaction.category,
    icon: transaction.category === 'Food' ? Utensils : 
          transaction.category === 'Shopping' ? ShoppingBag :
          transaction.category === 'Transfer' ? TrendingUp : ArrowDownRight,
    status: transaction.status,
  }));
  
  // Fallback transactions for demo purposes
  const fallbackTransactions: Transaction[] = [
    { 
      id: 1, 
      type: 'sent' as const, 
      amount: 45.99, 
      recipient: 'Uber Eats', 
      date: '2024-01-15', 
      time: '2:30 PM',
      category: 'Food',
      icon: Utensils,
      status: 'completed',
      rating: 5,
      hasReview: true
    },
    { 
      id: 2, 
      type: 'received' as const, 
      amount: 150.00, 
      sender: 'Sarah Johnson', 
      date: '2024-01-15', 
      time: '10:15 AM',
      category: 'Transfer',
      icon: ArrowDownRight,
      status: 'completed',
      rating: 4,
      hasReview: false
    },
    { 
      id: 3, 
      type: 'sent' as const, 
      amount: 89.50, 
      recipient: 'Amazon', 
      date: '2024-01-14', 
      time: '6:45 PM',
      category: 'Shopping',
      icon: ShoppingBag,
      status: 'completed',
      rating: 3,
      hasReview: true,
      flagged: true
    },
    { 
      id: 4, 
      type: 'sent' as const, 
      amount: 25.00, 
      recipient: 'Gas Station', 
      date: '2024-01-14', 
      time: '8:20 AM',
      category: 'Transport',
      icon: Car,
      status: 'completed'
    },
    { 
      id: 5, 
      type: 'received' as const, 
      amount: 500.00, 
      sender: 'John Doe', 
      date: '2024-01-13', 
      time: '3:00 PM',
      category: 'Transfer',
      icon: ArrowDownRight,
      status: 'completed'
    },
    { 
      id: 6, 
      type: 'sent' as const, 
      amount: 1200.00, 
      recipient: 'Rent Payment', 
      date: '2024-01-01', 
      time: '9:00 AM',
      category: 'Bills',
      icon: Home,
      status: 'completed'
    },
  ];

  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const grouped: Record<string, Transaction[]> = transactions.reduce((acc, transaction) => {
      const date = transaction.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    }, {} as Record<string, Transaction[]>);
    return grouped;
  };

  const filteredTransactions = transactions.filter(transaction => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (transaction.recipient?.toLowerCase().includes(searchLower)) ||
      (transaction.sender?.toLowerCase().includes(searchLower)) ||
      (transaction.category.toLowerCase().includes(searchLower))
    );
  });

  const groupedTransactions = groupTransactionsByDate(filteredTransactions);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className="space-y-4 mt-4">
      {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
        <TransactionGroup
          key={date}
          date={date}
          transactions={dayTransactions}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
};

export default TransactionList;
