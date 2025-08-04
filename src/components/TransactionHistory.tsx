
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import TransactionSummaryCards from './TransactionSummaryCards';
import TransactionFilters from './TransactionFilters';
import TransactionList from './TransactionList';

interface TransactionHistoryProps {
  onBack: () => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
        </div>

        {/* Search and Filter */}
        <TransactionFilters 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Summary Cards */}
        <TransactionSummaryCards />

        {/* Transaction Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="received">Received</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <TransactionList searchTerm={searchTerm} />
          </TabsContent>
          
          <TabsContent value="sent">
            <p className="text-center text-gray-500 py-8">Sent transactions will be displayed here</p>
          </TabsContent>
          
          <TabsContent value="received">
            <p className="text-center text-gray-500 py-8">Received transactions will be displayed here</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TransactionHistory;
