import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, Shield, Zap, Users } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');

  const features = [
    {
      icon: <Wallet className="h-6 w-6 text-primary" />,
      title: "Digital Wallet",
      description: "Secure and convenient digital payments"
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Bank-Level Security",
      description: "Your money is protected with advanced encryption"
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Instant Transfers",
      description: "Send money instantly to friends and family"
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "24/7 Support",
      description: "Round-the-clock customer service"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-screen">
          {/* Left side - Branding and features */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
                Your Digital
                <span className="text-primary block">Wallet</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Experience the future of banking with secure, fast, and convenient digital payments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 border-none shadow-sm bg-white/60 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center lg:text-left">
              <p className="text-sm text-gray-500">
                Trusted by over 10,000+ users worldwide
              </p>
              <div className="flex justify-center lg:justify-start mt-2 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-primary rounded-full"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Authentication forms */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
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
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full py-4 text-center text-sm text-gray-500 bg-white/30 backdrop-blur-sm">
        <p>© 2024 Digital Wallet. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthPage;