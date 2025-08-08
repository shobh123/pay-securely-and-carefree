
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// ...existing code...
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Shield, FileText, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useComplaints } from '@/contexts/ComplaintContext';
import { useAuth } from '@/contexts/AuthContext';

interface FraudReportProps {
  recipientId: string;
  recipientName: string;
  amount: string;
}

const FraudReport: React.FC<FraudReportProps> = ({ recipientId, recipientName, amount }) => {
  const [reportType, setReportType] = useState('');
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { addComplaint } = useComplaints();
  const [open, setOpen] = useState(false);
  const { user, updateProfile } = useAuth();

  const isDemoUser = !!user && (user.email?.toLowerCase() === 'demo@demo.com' || user.id === '3');

  const reportTypes = [
    { value: 'fraud', label: 'Fraudulent Activity' },
    { value: 'scam', label: 'Scam/Phishing' },
    { value: 'unauthorized', label: 'Unauthorized Transaction' },
    { value: 'fake_merchant', label: 'Fake Merchant' },
    { value: 'identity_theft', label: 'Identity Theft' },
    { value: 'other', label: 'Other Suspicious Activity' }
  ];

  const handleSubmitReport = async () => {
    if (!user) {
      toast({
        title: "Not signed in",
        description: "Please log in to submit a fraud report.",
        variant: "destructive",
      });
      return;
    }

    if (isDemoUser) {
      toast({
        title: "Demo account restriction",
        description: "Demo account cannot submit fraud reports. Please sign up or log in with a regular account.",
        variant: "destructive",
      });
      return;
    }
    if (!reportType || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(async () => {
      // Deduct $5 processing fee if possible
      if (user && user.balance >= 5) {
        await updateProfile({ balance: user.balance - 5 });
      }

      addComplaint({
        description: `${reportType.toUpperCase()}: ${description} (Recipient: ${recipientName}, Amount: $${amount}, ID: ${recipientId})`,
        replyFromAuthority: 'Complaint received and under review. Initial assessment in progress.',
        status: 'Pending',
        investigationDetails: {
          assignedOfficer: 'Not yet assigned',
          caseNumber: 'Pending assignment',
          evidence: evidence ? [evidence] : [],
          timeline: [
            { date: new Date().toISOString().split('T')[0], action: 'Complaint submitted', officer: 'System' }
          ]
        }
      });

      toast({
        title: "Report Submitted Successfully",
        description: "Your fraud report has been submitted to authorities. A $5 processing fee will be charged to your account.",
      });

      // Reset form and close dialog
      setReportType('');
      setDescription('');
      setEvidence('');
      setIsSubmitting(false);
      setOpen(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" disabled={!user || isDemoUser}>
          <AlertTriangle className="w-4 h-4 mr-2" />
          Report Fraud
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Shield className="w-5 h-5" />
            Report Fraudulent Activity
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Warning Notice */}
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-orange-800 mb-1">Important Notice</p>
                  <p className="text-orange-700">
                    A processing fee of <strong>$5</strong> will be charged for fraud reports. 
                    This helps us maintain the integrity of our investigation process.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Details */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Transaction Details
              </h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Recipient:</span> {recipientName}</p>
                <p><span className="font-medium">Amount:</span> ${amount}</p>
                <p><span className="font-medium">ID:</span> {recipientId}</p>
              </div>
            </CardContent>
          </Card>

          {/* Report Type */}
          <div>
            <Label className="text-sm font-medium">Type of Fraud *</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select fraud type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label className="text-sm font-medium">Detailed Description *</Label>
            <textarea
              className="w-full mt-2 p-3 border border-gray-300 rounded-md text-sm resize-none"
              rows={4}
              placeholder="Describe the fraudulent activity in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Evidence */}
          <div>
            <Label className="text-sm font-medium">Additional Evidence (Optional)</Label>
            <Input
              placeholder="Reference numbers, screenshots, etc."
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Actions Taken */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2 text-blue-800">
                <FileText className="w-4 h-4" />
                Actions We'll Take
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Forward report to local cybercrime authorities</li>
                <li>• Initiate transaction trace with banking partners</li>
                <li>• Block suspicious accounts if verified</li>
                <li>• Provide case reference number for follow-up</li>
                <li>• Assist with legal proceedings if required</li>
              </ul>
            </CardContent>
          </Card>

          {/* Fee Notice */}
          <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <span className="text-sm font-medium">Processing Fee:</span>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              $5.00
            </Badge>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmitReport} 
            disabled={isSubmitting || !reportType || !description}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? 'Submitting Report...' : 'Submit Fraud Report ($5)'}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By submitting this report, you agree to pay the processing fee and provide accurate information.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FraudReport;
