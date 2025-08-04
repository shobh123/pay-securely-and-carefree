
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const TransactionSummaryCards: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-lg font-bold text-green-600">+$2,890.12</p>
            <p className="text-xs text-gray-500">Received</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-lg font-bold text-red-600">-$1,234.56</p>
            <p className="text-xs text-gray-500">Spent</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionSummaryCards;
