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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTransaction } from '@/contexts/TransactionContext';
import { useToast } from '@/hooks/use-toast';

interface DashboardProps {
  onNavigate?: (tab: 'home' | 'send' | 'scan' | 'history' | 'profile') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [addMoneyOpen, setAddMoneyOpen] = useState(false);
  const [cardsOpen, setCardsOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const { transactions, addTransaction, creditBalance } = useTransaction();
  const { toast } = useToast();

  const recentTransactions = transactions.slice(0, 4).map((t, idx) => ({
    id: idx,
    type: t.type,
    amount: t.amount,
    from: t.sender,
    to: t.recipient,
    time: new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    category: t.category
  }));

  // Demo cards state
  const [cards, setCards] = useState<Array<{id:string; brand:string; last4:string; name:string}>>([
    { id: 'c1', brand: 'Visa', last4: '4242', name: 'Personal' },
    { id: 'c2', brand: 'Mastercard', last4: '4444', name: 'Business' },
    { id: 'c3', brand: 'Amex', last4: '0005', name: 'Travel' },
  ]);
  const [newCardBrand, setNewCardBrand] = useState('Visa');
  const [newCardLast4, setNewCardLast4] = useState('');
  const [newCardName, setNewCardName] = useState('');

  const handleAddMoney = async () => {
    const amt = parseFloat(topUpAmount);
    if (isNaN(amt) || amt <= 0) {
      toast({ title: 'Invalid amount', description: 'Enter a valid top-up amount.', variant: 'destructive' });
      return;
    }
    const ok = await creditBalance(amt);
    if (ok) {
      addTransaction({
        type: 'received',
        amount: amt,
        sender: 'Add Money',
        description: 'Balance top-up',
        category: 'Transfer',
        status: 'completed'
      });
      toast({ title: 'Money added', description: `$${amt.toFixed(2)} added to your balance.` });
      setTopUpAmount('');
      setAddMoneyOpen(false);
    }
  };

  const handleAddCard = () => {
    if (!newCardLast4 || newCardLast4.length !== 4) {
      toast({ title: 'Invalid card', description: 'Enter last 4 digits.', variant: 'destructive' });
      return;
    }
    const id = Math.random().toString(36).slice(2);
    setCards(prev => [{ id, brand: newCardBrand, last4: newCardLast4, name: newCardName || newCardBrand }, ...prev]);
    setNewCardBrand('Visa');
    setNewCardLast4('');
    setNewCardName('');
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
              <Dialog open={addMoneyOpen} onOpenChange={setAddMoneyOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-white/20 hover:bg-white/30 border-0">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Money
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Money</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Label>Amount</Label>
                    <Input type="number" placeholder="0.00" value={topUpAmount} onChange={e=>setTopUpAmount(e.target.value)} />
                    <Button onClick={handleAddMoney}>Confirm Top-up</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={cardsOpen} onOpenChange={setCardsOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-white/20 hover:bg-white/30 border-0">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Cards
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Payment Methods</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {cards.map(card => (
                        <div key={card.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div>
                            <p className="font-medium text-sm">{card.brand} •••• {card.last4}</p>
                            <p className="text-xs text-gray-500">{card.name}</p>
                          </div>
                          <Badge variant="secondary">Default</Badge>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <Label>Brand</Label>
                        <select className="mt-1 w-full border rounded h-9 px-2" value={newCardBrand} onChange={e=>setNewCardBrand(e.target.value)}>
                          <option>Visa</option>
                          <option>Mastercard</option>
                          <option>Amex</option>
                        </select>
                      </div>
                      <div>
                        <Label>Last 4</Label>
                        <Input placeholder="1234" maxLength={4} value={newCardLast4} onChange={e=>setNewCardLast4(e.target.value.replace(/\D/g,''))} />
                      </div>
                      <div>
                        <Label>Name</Label>
                        <Input placeholder="Label" value={newCardName} onChange={e=>setNewCardName(e.target.value)} />
                      </div>
                    </div>
                    <Button onClick={handleAddCard} variant="outline">Add Card</Button>
                  </div>
                </DialogContent>
              </Dialog>
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
                        ? `From ${transaction.from || 'Unknown'}` 
                        : `To ${transaction.to || 'Unknown'}`}
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
