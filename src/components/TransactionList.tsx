
import React from 'react';
import { 
  ArrowDownRight,
  TrendingUp,
  ShoppingBag,
  Car,
  Home,
  Utensils,
  CreditCard,
  Star,
  AlertTriangle
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
  icon: React.ComponentType<{ className?: string }>;
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
  
  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'Food': return Utensils;
      case 'Shopping': return ShoppingBag;
      case 'Transfer': return TrendingUp;
      case 'Bills': return Home;
      case 'Top-up': return CreditCard;
      case 'Review Fee': return Star;
      case 'Fraud Fee': return AlertTriangle;
      default: return ArrowDownRight;
    }
  };

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
    icon: getIconForCategory(transaction.category),
    status: transaction.status,
  }));

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

  const wantsSent = searchTerm.includes(' sent-filter');
  const wantsReceived = searchTerm.includes(' received-filter');

  const filteredTransactions = transactions.filter(transaction => {
    const searchLower = searchTerm.toLowerCase();
    const baseMatch = (
      (transaction.recipient?.toLowerCase().includes(searchLower)) ||
      (transaction.sender?.toLowerCase().includes(searchLower)) ||
      (transaction.category.toLowerCase().includes(searchLower))
    );
    if (wantsSent) return baseMatch || transaction.type === 'sent';
    if (wantsReceived) return baseMatch || transaction.type === 'received';
    return baseMatch;
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
