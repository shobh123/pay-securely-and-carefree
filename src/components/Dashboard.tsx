
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Send, 
  QrCode, 
  Plus, 
  CreditCard, 
  TrendingUp, 
  Eye, 
  EyeOff,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [balanceVisible, setBalanceVisible] = useState(true);

  const recentTransactions = [
    { id: 1, type: 'received', amount: 150.00, from: 'Sarah Johnson', time: '2 hours ago', category: 'Food' },
    { id: 2, type: 'sent', amount: 45.99, to: 'Uber Eats', time: '5 hours ago', category: 'Food' },
    { id: 3, type: 'received', amount: 500.00, from: 'John Doe', time: '1 day ago', category: 'Transfer' },
    { id: 4, type: 'sent', amount: 89.50, to: 'Amazon', time: '2 days ago', category: 'Shopping' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 overflow-y-auto">
      <div className="container mx-auto px-4 py-6 max-w-md min-h-full">
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
            <div className="text-3xl font-bold mb-4">
              {balanceVisible ? `$${user?.balance?.toFixed(2) || '0.00'}` : '••••••'}
            </div>
            <div className="flex gap-3">
              <Button size="sm" className="bg-white/20 hover:bg-white/30 border-0">
                <Plus className="w-4 h-4 mr-2" />
                Add Money
              </Button>
              <Button size="sm" className="bg-white/20 hover:bg-white/30 border-0">
                <CreditCard className="w-4 h-4 mr-2" />
                Cards
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Send className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium">Send Money</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
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
                <p className="text-2xl font-bold text-red-500">$1,234.56</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Received</p>
                <p className="text-2xl font-bold text-green-500">$2,890.12</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full w-3/4"></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">75% of monthly budget used</p>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'received' 
                      ? 'bg-green-100' 
                      : 'bg-red-100'
                  }`}>
                    {transaction.type === 'received' ? (
                      <ArrowDownRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {transaction.type === 'received' 
                        ? `From ${transaction.from}` 
                        : `To ${transaction.to}`}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-500">{transaction.time}</p>
                      <Badge variant="secondary" className="text-xs">
                        {transaction.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className={`font-semibold ${
                  transaction.type === 'received' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'received' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
