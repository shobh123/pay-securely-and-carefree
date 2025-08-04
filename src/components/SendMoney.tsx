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
  UserX
} from 'lucide-react';
import ReviewSystem from './ReviewSystem';
import FraudReport from './FraudReport';
import ComplaintStatus from './ComplaintStatus';
import { useTransaction } from '@/contexts/TransactionContext';
import { useToast } from '@/hooks/use-toast';

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

  const recentContacts = [
    { 
      id: '1', 
      name: 'Sarah Johnson', 
      email: 'sarah@email.com', 
      avatar: 'SJ', 
      lastSent: '$50.00',
      rating: 4.5,
      reviewCount: 12,
      trustScore: 'high',
      spamCount: 0,
      fraudCount: 0,
      criminalCount: 0
    },
    { 
      id: '2', 
      name: 'John Doe', 
      email: 'john@email.com', 
      avatar: 'JD', 
      lastSent: '$125.00',
      rating: 2.1,
      reviewCount: 8,
      trustScore: 'low',
      flagged: true,
      spamCount: 2,
      fraudCount: 1,
      criminalCount: 0
    },
    { 
      id: '3', 
      name: 'Emma Wilson', 
      email: 'emma@email.com', 
      avatar: 'EW', 
      lastSent: '$25.00',
      rating: 4.8,
      reviewCount: 25,
      trustScore: 'high',
      spamCount: 0,
      fraudCount: 0,
      criminalCount: 0
    },
    { 
      id: '4', 
      name: 'Mike Chen', 
      email: 'mike@email.com', 
      avatar: 'MC', 
      lastSent: '$75.00',
      rating: 3.2,
      reviewCount: 5,
      trustScore: 'medium',
      spamCount: 1,
      fraudCount: 0,
      criminalCount: 1
    },
    { 
      id: '5', 
      name: 'Lisa Anderson', 
      email: 'lisa@email.com', 
      avatar: 'LA', 
      lastSent: '$200.00',
      rating: 4.7,
      reviewCount: 18,
      trustScore: 'high',
      spamCount: 0,
      fraudCount: 0,
      criminalCount: 0
    },
  ];

  const selectedContactData = recentContacts.find(contact => contact.id === selectedContact);

  const handleSendMoney = async () => {
    if (!amount || !selectedContact || !selectedContactData) {
      toast({
        title: "Missing Information",
        description: "Please enter an amount and select a recipient.",
        variant: "destructive"
      });
      return;
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Attempt to deduct balance
    const success = deductBalance(amountNumber);
    if (!success) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this transaction.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Add transaction to history
    addTransaction({
      type: 'sent',
      amount: amountNumber,
      recipient: selectedContactData.name,
      description: note || `Money sent to ${selectedContactData.name}`,
      category: 'Transfer',
      status: 'completed'
    });

    // Simulate processing delay
    setTimeout(() => {
      toast({
        title: "Money Sent Successfully",
        description: `$${amountNumber.toFixed(2)} has been sent to ${selectedContactData.name}`,
      });
      
      // Reset form
      setAmount('');
      setNote('');
      setSelectedContact(null);
      setShowReviews(false);
      setIsSubmitting(false);
      
      // Navigate back to home
      onBack();
    }, 2000);
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
        className={`w-3 h-3 ${
          index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const quickAmounts = [10, 25, 50, 100];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 overflow-y-auto">
      <div className="container mx-auto px-4 py-6 max-w-md min-h-full">
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
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Phone className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="text-xs font-medium">Phone Number</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Zap className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <p className="text-xs font-medium">UPI</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <CreditCard className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-xs font-medium">Bank Account</p>
            </CardContent>
          </Card>
        </div>

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
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Contacts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => {
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
            
            {/* Add New Contact Button */}
            <div className="p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-300 cursor-pointer transition-colors">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Plus className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-700">Add New Contact</p>
                  <p className="text-xs text-gray-500">Add someone to your contacts</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Section */}
        {showReviews && selectedContactData && (
          <ReviewSystem 
            recipientId={selectedContactData.id}
            recipientName={selectedContactData.name}
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
            disabled={!amount || !selectedContact || isSubmitting}
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
