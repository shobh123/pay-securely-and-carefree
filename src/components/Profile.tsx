import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  CreditCard, 
  Shield, 
  Bell, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Star,
  Gift,
  Users,
  Smartphone,
  Eye,
  Lock,
  Edit3,
  Camera,
  Sun
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import EditProfileDialog from './EditProfileDialog';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from 'next-themes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [securityDialogOpen, setSecurityDialogOpen] = useState(false);
  const [rewardsDialogOpen, setRewardsDialogOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);

  const [cards, setCards] = useState<Array<{id:string; brand:string; last4:string; name:string}>>([
    { id: 'c1', brand: 'Visa', last4: '4242', name: 'Personal' },
    { id: 'c2', brand: 'Mastercard', last4: '4444', name: 'Business' },
    { id: 'c3', brand: 'Amex', last4: '0005', name: 'Travel' },
  ]);
  const [newCardBrand, setNewCardBrand] = useState('Visa');
  const [newCardLast4, setNewCardLast4] = useState('');
  const [newCardName, setNewCardName] = useState('');

  const handleLogout = () => {
    logout();
  };

  const handleInvite = () => {
    navigator.clipboard?.writeText('https://app.example.com/invite?ref=YOU');
    toast({ title: 'Invite link copied', description: 'Share it with your friends to earn $10.' });
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

  const menuItems = [
    {
      category: 'Account',
      items: [
        { icon: CreditCard, label: 'Payment Methods', badge: `${cards.length} cards`, onClick: () => setPaymentDialogOpen(true) },
        { icon: Shield, label: 'Security', description: 'Biometric, PIN, passwords', onClick: () => setSecurityDialogOpen(true) },
        { icon: Users, label: 'Invite Friends', badge: 'Earn $10', onClick: handleInvite },
        { icon: Gift, label: 'Rewards', description: 'Cashback and offers', onClick: () => setRewardsDialogOpen(true) },
      ]
    },
    {
      category: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', toggle: true, value: notifications, onChange: setNotifications },
        { icon: Smartphone, label: 'Biometric Login', toggle: true, value: biometric, onChange: setBiometric },
        { icon: Sun, label: 'Theme', description: `Current: ${theme || 'System'}`, customComponent: true },
        { icon: Eye, label: 'Privacy Settings', onClick: () => setPrivacyDialogOpen(true) },
      ]
    },
    {
      category: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', onClick: () => setHelpDialogOpen(true) },
        { icon: Settings, label: 'App Settings', onClick: () => setSettingsDialogOpen(true) },
        { icon: LogOut, label: 'Sign Out', danger: true, onClick: handleLogout },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 pb-20 overflow-y-auto">
      <div className="container mx-auto px-4 py-6 max-w-md min-h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
          <ThemeToggle />
        </div>
        {/* User Info */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-4">
            <Avatar className="w-20 h-20">
              {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xl">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => setEditDialogOpen(true)}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
            >
              <Camera className="w-3 h-3 text-white" />
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="text-xl font-semibold">{user?.name || 'User'}</h2>
            <button
              onClick={() => setEditDialogOpen(true)}
              className="p-1 text-gray-400 hover:text-purple-500 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-gray-600">{user?.email}</p>
          {user?.phone && <p className="text-gray-500 text-sm">{user.phone}</p>}
          <p className="text-sm text-gray-500 mt-1">Account: {user?.accountNumber}</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge className="bg-green-100 text-green-800">
              <Star className="w-3 h-3 mr-1" />
              Active
            </Badge>
            <Badge variant="secondary">
              Balance: ${user?.balance?.toLocaleString() || '0.00'}
            </Badge>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-purple-600">127</p>
              <p className="text-xs text-gray-600">Transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-green-600">$2.4K</p>
              <p className="text-xs text-gray-600">Sent</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-blue-600">$156</p>
              <p className="text-xs text-gray-600">Cashback</p>
            </CardContent>
          </Card>
        </div>
        {/* Menu Sections */}
        {menuItems.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{section.category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {section.items.map((item, itemIndex) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={itemIndex}
                    className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                      item.danger ? 'hover:bg-red-50' : ''
                    }`}
                    onClick={item.onClick}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.danger 
                          ? 'bg-red-100' 
                          : 'bg-gray-100'
                      }`}>
                        <IconComponent className={`w-4 h-4 ${
                          item.danger ? 'text-red-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <p className={`font-medium text-sm ${
                          item.danger ? 'text-red-600' : 'text-gray-800'
                        }`}>
                          {item.label}
                        </p>
                        {item.description && (
                          <p className="text-xs text-gray-500">{item.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                      {item.customComponent && item.label === 'Theme' ? (
                        <ThemeToggle />
                      ) : item.toggle ? (
                        <Switch
                          checked={item.value}
                          onCheckedChange={item.onChange}
                        />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
        {/* Version Info */}
        <div className="text-center text-gray-500 text-xs mb-4">
          Version 2.1.0
        </div>
        {/* Edit Profile Dialog */}
        <EditProfileDialog 
          open={editDialogOpen} 
          onOpenChange={setEditDialogOpen} 
        />

        {/* Payment Methods Dialog */}
        <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
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

        {/* Security Dialog */}
        <Dialog open={securityDialogOpen} onOpenChange={setSecurityDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Security</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• Biometric login: {biometric ? 'Enabled' : 'Disabled'}</p>
              <p>• Notifications: {notifications ? 'Enabled' : 'Disabled'}</p>
              <p>• Change PIN/Password options available soon.</p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Rewards Dialog */}
        <Dialog open={rewardsDialogOpen} onOpenChange={setRewardsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rewards</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-sm text-gray-700">
              <p>Cashback offers and upcoming promotions will appear here.</p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Help Center Dialog */}
        <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Help Center</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-sm text-gray-700">
              <p>For support, contact support@example.com</p>
              <p>FAQs and guides will be added here.</p>
            </div>
          </DialogContent>
        </Dialog>

        {/* App Settings Dialog */}
        <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>App Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-sm text-gray-700">
              <p>Language, Region, and other preferences coming soon.</p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Privacy Dialog */}
        <Dialog open={privacyDialogOpen} onOpenChange={setPrivacyDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Privacy Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-sm text-gray-700">
              <p>Manage data privacy, permissions, and visibility.</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Profile;
