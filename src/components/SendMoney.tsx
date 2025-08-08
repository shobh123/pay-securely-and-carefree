import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Search, 
  QrCode, 
  Phone, 
  Mail, 
  DollarSign,
  Send,
  Star,
  AlertTriangle,
  Zap,
  CreditCard,
  UserX,
  Plus
} from 'lucide-react';
import ReviewSystem from './ReviewSystem';
import FraudReport from './FraudReport';
import ComplaintStatus from './ComplaintStatus';
import { useTransaction } from '@/contexts/TransactionContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useContacts } from '@/contexts/ContactsContext';

interface SendMoneyProps {
  onBack: () => void;
}

const SendMoney: React.FC<SendMoneyProps> = ({ onBack }) => {
  const [amount, setAmount] = useState('');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [showReviews, setShowReviews] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTransaction, deductBalance } = useTransaction();
  const { toast } = useToast();
  const { contacts, addContact, recordSendToContact, updateContact } = useContacts();

  const [addContactOpen, setAddContactOpen] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');

  const [selectedMethod, setSelectedMethod] = useState<'contacts'|'phone'|'upi'|'bank'>('contacts');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifsc, setIfsc] = useState('');

  const selectedContactData = contacts.find(contact => contact.id === selectedContact);

  const handleAddContact = () => {
    if (!newContactName || !newContactEmail) return;
    const c = addContact(newContactName, newContactEmail);
    setSelectedContact(c.id);
    setNewContactName('');
    setNewContactEmail('');
    setAddContactOpen(false);
  };

  const handleSendMoney = async () => {
    if (!amount) {
      toast({ title: "Missing Amount", description: "Please enter an amount.", variant: "destructive" });
      return;
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid amount.", variant: "destructive" });
      return;
    }

    // Validate destination
    let recipientLabel: string | null = null;
    if (selectedMethod === 'contacts') {
      if (!selectedContact || !selectedContactData) {
        toast({ title: "Missing Recipient", description: "Please select a contact.", variant: "destructive" });
        return;
      }
      recipientLabel = selectedContactData.name;
    } else if (selectedMethod === 'phone') {
      if (!phoneNumber || phoneNumber.length < 8) {
        toast({ title: "Invalid Phone Number", description: "Enter a valid phone number.", variant: "destructive" });
        return;
      }
      recipientLabel = `Phone: ${phoneNumber}`;
    } else if (selectedMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        toast({ title: "Invalid UPI ID", description: "Enter a valid UPI ID (e.g., name@bank).", variant: "destructive" });
        return;
      }
      recipientLabel = `UPI: ${upiId}`;
    } else if (selectedMethod === 'bank') {
      if (!bankAccount || bankAccount.length < 6 || !ifsc) {
        toast({ title: "Invalid Bank Details", description: "Enter valid account number and IFSC.", variant: "destructive" });
        return;
      }
      recipientLabel = `A/C ${bankAccount} (${ifsc})`;
    }

    setIsSubmitting(true);

    const success = deductBalance(amountNumber);
    if (!success) {
      toast({ title: "Insufficient Balance", description: "You don't have enough balance for this transaction.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    addTransaction({
      type: 'sent',
      amount: amountNumber,
      recipient: recipientLabel || 'Recipient',
      description: note || `Money sent to ${recipientLabel}`,
      category: 'Transfer',
      status: 'completed'
    });

    if (selectedMethod === 'contacts' && selectedContactData) {
      recordSendToContact(selectedContactData.id, amountNumber);
    }

    setTimeout(() => {
      toast({ title: "Money Sent Successfully", description: `$${amountNumber.toFixed(2)} has been sent to ${recipientLabel}` });
      setAmount('');
      setNote('');
      setSelectedContact(null);
      setShowReviews(false);
      setIsSubmitting(false);
      setPhoneNumber('');
      setUpiId('');
      setBankAccount('');
      setIfsc('');
      onBack();
    }, 1200);
  };

  const getTrustScoreColor = (score: string) => {
    switch (score) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const quickAmounts = [10, 25, 50, 100];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 overflow-y-auto">
      <div className="container mx-auto px-4 py-6 max-w-md min-h-full pb-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Send Money</h1>
        </div>

        {/* Amount Input */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <Label className="text-sm text-gray-600">Amount</Label>
              <div className="flex items-center justify-center mt-2">
                <DollarSign className="w-8 h-8 text-gray-400" />
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-4xl font-bold border-0 shadow-none text-center px-0 focus-visible:ring-0"
                />
              </div>
            </div>
            
            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="h-8"
                >
                  ${quickAmount}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Send Methods */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className={`cursor-pointer hover:shadow-md transition-shadow ${selectedMethod === 'phone' ? 'ring-2 ring-green-400' : ''}`} onClick={() => setSelectedMethod('phone')}>
            <CardContent className="p-4 text-center">
              <Phone className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="text-xs font-medium">Phone Number</p>
            </CardContent>
          </Card>
          
          <Card className={`cursor-pointer hover:shadow-md transition-shadow ${selectedMethod === 'upi' ? 'ring-2 ring-orange-400' : ''}`} onClick={() => setSelectedMethod('upi')}>
            <CardContent className="p-4 text-center">
              <Zap className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <p className="text-xs font-medium">UPI</p>
            </CardContent>
          </Card>
          
          <Card className={`cursor-pointer hover:shadow-md transition-shadow ${selectedMethod === 'bank' ? 'ring-2 ring-blue-400' : ''}`} onClick={() => setSelectedMethod('bank')}>
            <CardContent className="p-4 text-center">
              <CreditCard className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-xs font-medium">Bank Account</p>
            </CardContent>
          </Card>
        </div>

        {/* Method-specific Inputs */}
        {selectedMethod === 'phone' && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <Label className="text-sm font-medium">Phone Number</Label>
              <Input placeholder="Enter phone number" value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)} className="mt-2" />
            </CardContent>
          </Card>
        )}
        {selectedMethod === 'upi' && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <Label className="text-sm font-medium">UPI ID</Label>
              <Input placeholder="e.g., name@bank" value={upiId} onChange={(e)=>setUpiId(e.target.value)} className="mt-2" />
            </CardContent>
          </Card>
        )}
        {selectedMethod === 'bank' && (
          <Card className="mb-6">
            <CardContent className="p-4 space-y-3">
              <div>
                <Label className="text-sm font-medium">Account Number</Label>
                <Input placeholder="Enter account number" value={bankAccount} onChange={(e)=>setBankAccount(e.target.value)} className="mt-2" />
              </div>
              <div>
                <Label className="text-sm font-medium">IFSC</Label>
                <Input placeholder="Enter IFSC" value={ifsc} onChange={(e)=>setIfsc(e.target.value)} className="mt-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search contacts..." 
            className="pl-10"
          />
        </div>

        {/* Recent Contacts */}
        <Card className="mb-6">
          <CardHeader className="pb-3 flex items-center justify-between">
            <CardTitle className="text-lg">Recent Contacts</CardTitle>
            <Dialog open={addContactOpen} onOpenChange={setAddContactOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Contact</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Name</Label>
                    <Input value={newContactName} onChange={(e)=>setNewContactName(e.target.value)} placeholder="Full name" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={newContactEmail} onChange={(e)=>setNewContactEmail(e.target.value)} placeholder="Email address" />
                  </div>
                  <Button onClick={handleAddContact} disabled={!newContactName || !newContactEmail} className="w-full">Add Contact</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => {
                  setSelectedMethod('contacts');
                  setSelectedContact(contact.id);
                  setShowReviews(true);
                }}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedContact === contact.id 
                    ? 'bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300 shadow-md' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        {contact.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{contact.name}</p>
                        {contact.flagged && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                        {contact.spamCount > 0 && (
                          <Zap className="w-4 h-4 text-orange-500" />
                        )}
                        {contact.fraudCount > 0 && (
                          <CreditCard className="w-4 h-4 text-red-500" />
                        )}
                        {contact.criminalCount > 0 && (
                          <UserX className="w-4 h-4 text-purple-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{contact.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          {renderStars(contact.rating)}
                          <span className="text-xs text-gray-600">
                            {contact.rating} ({contact.reviewCount})
                          </span>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getTrustScoreColor(contact.trustScore)}`}
                        >
                          {contact.trustScore} trust
                        </Badge>
                        {(contact.spamCount + contact.fraudCount + contact.criminalCount) > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {contact.spamCount + contact.fraudCount + contact.criminalCount} reports
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {contact.lastSent}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Reviews Section */}
        {showReviews && selectedContactData && (
          <ReviewSystem 
            recipientId={selectedContactData.id}
            recipientName={selectedContactData.name}
            onReviewsUpdated={(avg, count) => {
              updateContact(selectedContactData.id, { rating: Number(avg.toFixed(1)), reviewCount: count });
            }}
          />
        )}

        {/* Note */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <Label className="text-sm font-medium">Add a note (optional)</Label>
            <Input
              placeholder="What's this for?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-2"
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {selectedContactData && (
            <div className="space-y-3">
              <div className="flex gap-3">
                <FraudReport 
                  recipientId={selectedContactData.id}
                  recipientName={selectedContactData.name}
                  amount={amount || '0.00'}
                />
                <ComplaintStatus />
              </div>
              <Button 
                variant="outline"
                onClick={() => setShowReviews(!showReviews)}
                className="w-full"
              >
                {showReviews ? 'Hide Reviews' : 'View Reviews'}
              </Button>
            </div>
          )}
          
          <Button 
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            disabled={!amount || isSubmitting || (selectedMethod === 'contacts' && !selectedContact) || (selectedMethod === 'phone' && !phoneNumber) || (selectedMethod === 'upi' && !upiId) || (selectedMethod === 'bank' && (!bankAccount || !ifsc))}
            onClick={handleSendMoney}
          >
            <Send className="w-5 h-5 mr-2" />
            {isSubmitting ? 'Sending...' : `Send $${amount || '0.00'}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SendMoney;
