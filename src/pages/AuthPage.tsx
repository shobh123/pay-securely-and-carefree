import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, Shield, Zap, Users, Star } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');

  const features = [
    {
      icon: <Wallet className="h-5 w-5 text-primary" />,
      title: "Digital Wallet",
      description: "Secure payments"
    },
    {
      icon: <Shield className="h-5 w-5 text-primary" />,
      title: "Bank Security",
      description: "Advanced encryption"
    },
    {
      icon: <Zap className="h-5 w-5 text-primary" />,
      title: "Instant Transfers",
      description: "Send money fast"
    },
    {
      icon: <Users className="h-5 w-5 text-primary" />,
      title: "24/7 Support",
      description: "Always here to help"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header with Logo/Branding */}
        <div className="text-center mb-8 pt-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Digital Wallet
          </h1>
          <p className="text-gray-600 text-sm">
            Secure, fast, and convenient banking
          </p>
        </div>

        {/* Auth Tabs */}
        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <LoginForm onSwitchToSignup={() => setActiveTab('signup')} />
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <SignupForm onSwitchToLogin={() => setActiveTab('login')} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Features Grid - Mobile Optimized */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">
            Why Choose Us?
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <Card key={index} className="p-3 border-none shadow-sm bg-white/60 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="text-center space-y-2">
                    <div className="flex justify-center">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
            ))}
            <span className="text-sm text-gray-600 ml-2">4.9/5</span>
          </div>
          <p className="text-sm text-gray-500">
            Trusted by 10,000+ users worldwide
          </p>
          <div className="flex justify-center space-x-4 text-xs text-gray-400">
            <span>✓ FDIC Insured</span>
            <span>✓ 256-bit SSL</span>
            <span>✓ PCI Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;