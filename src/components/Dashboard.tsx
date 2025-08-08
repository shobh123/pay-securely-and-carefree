import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Send, 
  QrCode, 
  TrendingUp, 
  Eye, 
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard as CardIcon,
  Star,
  AlertTriangle
} from 'lucide-react';
import AddMoneyDialog from '@/components/AddMoneyDialog';
import ManageCardsDialog from '@/components/ManageCardsDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useTransaction } from '@/contexts/TransactionContext';

interface DashboardProps {
  onNavigate?: (tab: 'home' | 'send' | 'scan' | 'history' | 'profile') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { transactions } = useTransaction();
  const [balanceVisible, setBalanceVisible] = useState(true);

  const recent = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => +new Date(b.date) - +new Date(a.date));
    return sorted.slice(0, 4);
  }, [transactions]);

  const categoryBadge = (category: string) => {
    const map: Record<string, string> = {
      'Food': 'bg-orange-100 text-orange-800',
      'Shopping': 'bg-blue-100 text-blue-800',
      'Transfer': 'bg-purple-100 text-purple-800',
      'Top-up': 'bg-emerald-100 text-emerald-800',
      'Review Fee': 'bg-yellow-100 text-yellow-800',
      'Fraud Fee': 'bg-rose-100 text-rose-800',
    };
    return map[category] || 'bg-gray-100 text-gray-800';
  };

  const iconForCategory = (type: 'sent' | 'received', category: string) => {
    if (category === 'Top-up') return <CardIcon className="w-5 h-5 text-green-600" />;
    if (category === 'Review Fee') return <Star className="w-5 h-5 text-yellow-600" />;
    if (category === 'Fraud Fee') return <AlertTriangle className="w-5 h-5 text-red-600" />;
    return type === 'received' ? <ArrowDownRight className="w-5 h-5 text-green-600" /> : <ArrowUpRight className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 overflow-y-auto">
      <div className="container mx-auto px-4 py-6 max-w-md min-h-full pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Good Morning</h1>
            <p className="text-gray-600">Welcome back, {user?.name?.split(' ')[0] || 'User'}</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </span>
          </div>
        </div>

        {/* Balance Card */}
        <Card className="mb-6 bg-gradient-to-r from-purple-600 to-blue-600 border-0 shadow-lg">
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                <span className="text-sm opacity-90">Total Balance</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="text-white hover:bg-white/20"
              >
                {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
            </div>
            <div className="text-3xl font-bold mb-4" data-testid="balance-value">
              {balanceVisible ? `$${user?.balance?.toFixed(2) || '0.00'}` : '••••••'}
            </div>
            <div className="flex gap-3">
              <AddMoneyDialog />
              <ManageCardsDialog />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate?.('send')}>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Send className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium">Send Money</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate?.('scan')}>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <QrCode className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium">Scan QR</p>
            </CardContent>
          </Card>
        </div>

        {/* Spending Insights */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-600">Spent</p>
                <p className="text-2xl font-bold text-red-500">${(transactions.filter(t=>t.type==='sent').reduce((s,t)=>s+t.amount,0)).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Received</p>
                <p className="text-2xl font-bold text-green-500">${(transactions.filter(t=>t.type==='received').reduce((s,t)=>s+t.amount,0)).toFixed(2)}</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" style={{ width: `${Math.min(100, (transactions.filter(t=>t.type==='sent').reduce((s,t)=>s+t.amount,0) / ((transactions.filter(t=>t.type==='received').reduce((s,t)=>s+t.amount,0)) || 1)) * 100)}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Budget usage based on sent vs received</p>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recent.length === 0 && (
              <p className="text-sm text-gray-500">No recent activity yet.</p>
            )}
            {recent.map(tx => (
              <div key={tx.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'received' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {iconForCategory(tx.type, tx.category)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {tx.type === 'received' ? `From ${tx.sender}` : `To ${tx.recipient}`}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      <Badge variant="secondary" className={`text-xs ${categoryBadge(tx.category)}`}>
                        {tx.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className={`font-semibold ${
                  tx.type === 'received' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {tx.type === 'received' ? '+' : '-'}${tx.amount.toFixed(2)}
                </div>
              </div>
            ))}
            <div className="text-right">
              <Button variant="outline" size="sm" onClick={() => onNavigate?.('history')}>View all</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
