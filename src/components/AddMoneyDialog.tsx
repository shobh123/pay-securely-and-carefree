import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Plus, ScanLine } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTransaction } from '@/contexts/TransactionContext';
import { useCards } from '@/contexts/CardContext';
import { useToast } from '@/hooks/use-toast';

const AddMoneyDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [holderName, setHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, updateProfile } = useAuth();
  const { addTransaction } = useTransaction();
  const { cards, addCard } = useCards();
  const { toast } = useToast();

  const parseCard = (num: string) => num.replace(/\s+/g, '');

  const handleScanCard = () => {
    // Simulated scan: prefill demo card data
    setHolderName(user?.name || 'John Doe');
    setCardNumber('4242 4242 4242 4242');
    setExpMonth('12');
    setExpYear(String(new Date().getFullYear() + 3));
    setCvv('123');
    toast({ title: 'Card scanned', description: 'Demo data filled.' });
  };

  const handleSubmit = async () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      toast({ title: 'Invalid amount', description: 'Enter a valid amount', variant: 'destructive' });
      return;
    }

    if (!selectedCardId && (!holderName || !cardNumber || !expMonth || !expYear || !cvv)) {
      toast({ title: 'Card required', description: 'Select a saved card or enter card details', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));

    // Save card if entered
    let cardLast4 = '';
    if (!selectedCardId) {
      const digits = parseCard(cardNumber);
      cardLast4 = digits.slice(-4);
      addCard({
        holderName: holderName || 'Card Holder',
        last4: cardLast4,
        brand: 'Visa',
        expMonth: Number(expMonth),
        expYear: Number(expYear)
      });
    } else {
      const card = cards.find(c => c.id === selectedCardId);
      cardLast4 = card?.last4 || '0000';
    }

    // Update balance and add transaction
    if (user) {
      await updateProfile({ balance: user.balance + value });
      addTransaction({
        type: 'received',
        amount: value,
        sender: `Card •••• ${cardLast4}`,
        description: 'Wallet top-up',
        category: 'Top-up',
        status: 'completed'
      });
    }

    toast({ title: 'Money added', description: `$${value.toFixed(2)} added to your wallet` });

    // Reset
    setOpen(false);
    setAmount('');
    setSelectedCardId('');
    setHolderName(''); setCardNumber(''); setExpMonth(''); setExpYear(''); setCvv('');
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-white/20 hover:bg-white/30 border-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Money
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5" /> Add Money from Card</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Amount</Label>
            <Input type="number" placeholder="0.00" value={amount} onChange={e=>setAmount(e.target.value)} className="mt-1" />
          </div>

          {cards.length > 0 && (
            <div>
              <Label>Saved Cards</Label>
              <Select value={selectedCardId} onValueChange={setSelectedCardId}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select a card (optional)" /></SelectTrigger>
                <SelectContent>
                  {cards.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.brand} •••• {c.last4} — {c.holderName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-medium">Enter Card Details</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleScanCard}>
                  <ScanLine className="w-4 h-4 mr-1" /> Scan Card
                </Button>
              </div>
              <div>
                <Label>Cardholder Name</Label>
                <Input value={holderName} onChange={e=>setHolderName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Card Number</Label>
                <Input value={cardNumber} onChange={e=>setCardNumber(e.target.value)} placeholder="4242 4242 4242 4242" className="mt-1" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>MM</Label>
                  <Input value={expMonth} onChange={e=>setExpMonth(e.target.value)} placeholder="12" className="mt-1" />
                </div>
                <div>
                  <Label>YYYY</Label>
                  <Input value={expYear} onChange={e=>setExpYear(e.target.value)} placeholder="2028" className="mt-1" />
                </div>
                <div>
                  <Label>CVV</Label>
                  <Input value={cvv} onChange={e=>setCvv(e.target.value)} placeholder="123" className="mt-1" />
                </div>
              </div>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Adding...' : 'Add Money'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMoneyDialog;