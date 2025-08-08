
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowDownRight,
  TrendingUp,
  ShoppingBag,
  Car,
  Home,
  Utensils,
  Star,
  AlertTriangle
} from 'lucide-react';

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

interface TransactionItemProps {
  transaction: Transaction;
  isLast: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, isLast }) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      'Food': 'bg-orange-100 text-orange-800',
      'Shopping': 'bg-blue-100 text-blue-800',
      'Transport': 'bg-green-100 text-green-800',
      'Transfer': 'bg-purple-100 text-purple-800',
      'Bills': 'bg-red-100 text-red-800',
      'Top-up': 'bg-emerald-100 text-emerald-800',
      'Review Fee': 'bg-yellow-100 text-yellow-800',
      'Fraud Fee': 'bg-rose-100 text-rose-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const IconComponent = transaction.icon;

  return (
    <div 
      className={`p-4 flex items-center justify-between ${
        !isLast ? 'border-b border-gray-100' : ''
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          transaction.type === 'received' 
            ? 'bg-green-100' 
            : 'bg-red-100'
        }`}>
          <IconComponent className={`w-5 h-5 ${
            transaction.type === 'received' 
              ? 'text-green-600' 
              : 'text-red-600'
          }`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">
              {transaction.type === 'received' 
                ? `From ${transaction.sender}` 
                : `To ${transaction.recipient}`}
            </p>
            {transaction.flagged && (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-gray-500">{transaction.time}</p>
            <Badge 
              variant="secondary" 
              className={`text-xs ${getCategoryColor(transaction.category)}`}
            >
              {transaction.category}
            </Badge>
          </div>
          {transaction.rating && (
            <div className="flex items-center gap-1 mt-1">
              {renderStars(transaction.rating)}
              {transaction.hasReview && (
                <span className="text-xs text-blue-600 ml-1">Has Review</span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className={`font-semibold text-right ${
        transaction.type === 'received' 
          ? 'text-green-600' 
          : 'text-red-600'
      }`}>
        {transaction.type === 'received' ? '+' : '-'}${transaction.amount.toFixed(2)}
      </div>
    </div>
  );
};

export default TransactionItem;
