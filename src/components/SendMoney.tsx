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

interface SendMoneyProps {
  onBack: () => void;
}

const SendMoney: React.FC<SendMoneyProps> = ({ onBack }) => {
  const [amount, setAmount] = useState('');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [showReviews, setShowReviews] = useState(false);

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
  ];

  const selectedContactData = recentContacts.find(contact => contact.id === selectedContact);

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 max-w-md">
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
              <QrCode className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-xs font-medium">QR Code</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Phone className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="text-xs font-medium">Phone</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Mail className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-xs font-medium">Email</p>
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
                    ? 'bg-purple-50 border border-purple-200' 
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
            <div className="flex gap-3">
              <FraudReport 
                recipientId={selectedContactData.id}
                recipientName={selectedContactData.name}
                amount={amount || '0.00'}
              />
              <Button 
                variant="outline"
                onClick={() => setShowReviews(!showReviews)}
                className="flex-1"
              >
                {showReviews ? 'Hide Reviews' : 'View Reviews'}
              </Button>
            </div>
          )}
          
          <Button 
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            disabled={!amount || !selectedContact}
          >
            <Send className="w-5 h-5 mr-2" />
            Send ${amount || '0.00'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SendMoney;
