
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useTransaction } from '@/contexts/TransactionContext';

const TransactionSummaryCards: React.FC = () => {
  const { transactions } = useTransaction();

  const { totalReceived, totalSent } = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    let received = 0;
    let sent = 0;
    for (const t of transactions) {
      const d = new Date(t.date);
      if (d.getMonth() === month && d.getFullYear() === year) {
        if (t.type === 'received') received += t.amount;
        else sent += t.amount;
      }
    }
    return { totalReceived: received, totalSent: sent };
  }, [transactions]);

  const format = (n: number) => n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-lg font-bold text-green-600">+{format(totalReceived)}</p>
            <p className="text-xs text-gray-500">Received</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-lg font-bold text-red-600">-{format(totalSent)}</p>
            <p className="text-xs text-gray-500">Spent</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionSummaryCards;
