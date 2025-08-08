import React, { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import SendMoney from '@/components/SendMoney';
import QRScanner from '@/components/QRScanner';
import TransactionHistory from '@/components/TransactionHistory';
import Profile from '@/components/Profile';
import BottomNavigation from '@/components/BottomNavigation';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'send':
        return <SendMoney onBack={() => setActiveTab('home')} />;
      case 'scan':
        return <QRScanner onBack={() => setActiveTab('home')} />;
      case 'history':
        return <TransactionHistory onBack={() => setActiveTab('home')} />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 overflow-y-auto">
      {renderActiveComponent()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
