import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Eye, Clock, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { useComplaints } from '@/contexts/ComplaintContext';

interface Complaint {
  id: string;
  dateRegistered: string;
  description: string;
  replyFromAuthority: string;
  status: 'Pending' | 'In-progress' | 'Completed';
  investigationDetails: {
    assignedOfficer: string;
    caseNumber: string;
    evidence: string[];
    timeline: Array<{
      date: string;
      action: string;
      officer: string;
    }>;
  };
}

const ComplaintStatus: React.FC = () => {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const { complaints } = useComplaints();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'In-progress': return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'Completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In-progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
          <FileText className="w-4 h-4 mr-2" />
          Complaint Status
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-600">
            <FileText className="w-5 h-5" />
            Complaint Status
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {complaints.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No complaints found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <Card key={complaint.id} className="border-l-4 border-l-blue-400">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-blue-600">#{complaint.id}</span>
                        <Badge className={`${getStatusColor(complaint.status)}`}>
                          {getStatusIcon(complaint.status)}
                          <span className="ml-1">{complaint.status}</span>
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">{complaint.dateRegistered}</span>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="font-medium mb-1">Description:</h4>
                      <p className="text-sm text-gray-700">{complaint.description}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium mb-1">Authority Reply:</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{complaint.replyFromAuthority}</p>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedComplaint(complaint)}
                          className="w-full"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Investigation Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 text-purple-600">
                            <Shield className="w-5 h-5" />
                            Investigation Details - #{complaint.id}
                          </DialogTitle>
                        </DialogHeader>
                        
                        {selectedComplaint && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Case Information</h4>
                              <div className="bg-gray-50 p-3 rounded space-y-2">
                                <p className="text-sm"><strong>Case Number:</strong> {selectedComplaint.investigationDetails.caseNumber}</p>
                                <p className="text-sm"><strong>Assigned Officer:</strong> {selectedComplaint.investigationDetails.assignedOfficer}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Evidence Collected</h4>
                              <div className="space-y-2">
                                {selectedComplaint.investigationDetails.evidence.map((item, index) => (
                                  <div key={index} className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Investigation Timeline</h4>
                              <div className="space-y-3">
                                {selectedComplaint.investigationDetails.timeline.map((event, index) => (
                                  <div key={index} className="flex gap-3 pb-3 border-b border-gray-100 last:border-b-0">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium">{event.action}</span>
                                        <span className="text-xs text-gray-500">{event.date}</span>
                                      </div>
                                      <p className="text-xs text-gray-600">Officer: {event.officer}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComplaintStatus;