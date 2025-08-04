
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import TransactionItem from './TransactionItem';

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

interface TransactionGroupProps {
  date: string;
  transactions: Transaction[];
  formatDate: (dateString: string) => string;
}

const TransactionGroup: React.FC<TransactionGroupProps> = ({ 
  date, 
  transactions, 
  formatDate 
}) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-medium text-gray-600">{formatDate(date)}</h3>
      </div>
      
      <Card className="mb-4">
        <CardContent className="p-0">
          {transactions.map((transaction, index) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              isLast={index === transactions.length - 1}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionGroup;
