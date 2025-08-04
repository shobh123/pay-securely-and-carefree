
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
  Camera
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import EditProfileDialog from './EditProfileDialog';

const Profile = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    {
      category: 'Account',
      items: [
        { icon: CreditCard, label: 'Payment Methods', badge: '3 cards' },
        { icon: Shield, label: 'Security', description: 'Biometric, PIN, passwords' },
        { icon: Users, label: 'Invite Friends', badge: 'Earn $10' },
        { icon: Gift, label: 'Rewards', description: 'Cashback and offers' },
      ]
    },
    {
      category: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', toggle: true, value: notifications, onChange: setNotifications },
        { icon: Smartphone, label: 'Biometric Login', toggle: true, value: biometric, onChange: setBiometric },
        { icon: Eye, label: 'Privacy Settings' },
      ]
    },
    {
      category: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center' },
        { icon: Settings, label: 'App Settings' },
        { icon: LogOut, label: 'Sign Out', danger: true, onClick: handleLogout },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>
          
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
                      {item.toggle ? (
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
      </div>
    </div>
  );
};

export default Profile;
