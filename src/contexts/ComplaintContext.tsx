import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Complaint {
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

interface ComplaintsContextType {
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'dateRegistered'> & { description: string }) => Complaint;
}

const ComplaintsContext = createContext<ComplaintsContextType | undefined>(undefined);

const initialComplaints: Complaint[] = [
  {
    id: 'CPL001',
    dateRegistered: '2024-01-15',
    description: 'Unauthorized transaction of $500 from my account to unknown recipient',
    replyFromAuthority: 'Your complaint has been forwarded to the cybercrime investigation unit. We are actively investigating this matter.',
    status: 'In-progress',
    investigationDetails: {
      assignedOfficer: 'Detective Sarah Wilson - Cybercrime Unit',
      caseNumber: 'CC-2024-001547',
      evidence: ['Transaction logs', 'IP address traces', 'Bank statements'],
      timeline: [
        { date: '2024-01-15', action: 'Complaint registered', officer: 'System' },
        { date: '2024-01-16', action: 'Assigned to cybercrime unit', officer: 'Admin' },
        { date: '2024-01-18', action: 'Initial investigation started', officer: 'Detective Wilson' },
        { date: '2024-01-20', action: 'Bank records requested', officer: 'Detective Wilson' }
      ]
    }
  },
  {
    id: 'CPL002',
    dateRegistered: '2024-01-10',
    description: 'Fraudulent activity detected with recipient ID JD123',
    replyFromAuthority: 'Investigation completed. The reported account has been flagged and suspended.',
    status: 'Completed',
    investigationDetails: {
      assignedOfficer: 'Officer Mike Chen - Fraud Prevention',
      caseNumber: 'FP-2024-000892',
      evidence: ['Account activity logs', 'User reports', 'Transaction patterns'],
      timeline: [
        { date: '2024-01-10', action: 'Complaint registered', officer: 'System' },
        { date: '2024-01-11', action: 'Evidence collected', officer: 'Officer Chen' },
        { date: '2024-01-12', action: 'Account suspended', officer: 'Officer Chen' },
        { date: '2024-01-13', action: 'Case closed', officer: 'Officer Chen' }
      ]
    }
  },
  {
    id: 'CPL003',
    dateRegistered: '2024-01-20',
    description: 'Suspicious payment request from unknown source',
    replyFromAuthority: 'Complaint received and under review. Initial assessment in progress.',
    status: 'Pending',
    investigationDetails: {
      assignedOfficer: 'Not yet assigned',
      caseNumber: 'Pending assignment',
      evidence: ['Complaint details', 'Screenshots provided'],
      timeline: [
        { date: '2024-01-20', action: 'Complaint submitted', officer: 'System' },
        { date: '2024-01-20', action: 'Awaiting assignment', officer: 'System' }
      ]
    }
  }
];

export const ComplaintsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const stored = localStorage.getItem('complaints');
      if (stored) return JSON.parse(stored) as Complaint[];
    } catch {
      // ignore
    }
    return initialComplaints;
  });

  useEffect(() => {
    try {
      localStorage.setItem('complaints', JSON.stringify(complaints));
    } catch {
      // ignore
    }
  }, [complaints]);

  const addComplaint: ComplaintsContextType['addComplaint'] = (complaintInput) => {
    const newComplaint: Complaint = {
      id: `CPL${Math.floor(1000 + Math.random() * 9000)}`,
      dateRegistered: new Date().toISOString().split('T')[0],
      description: complaintInput.description,
      replyFromAuthority: complaintInput.replyFromAuthority ?? 'Complaint received and under review. Initial assessment in progress.',
      status: complaintInput.status ?? 'Pending',
      investigationDetails: complaintInput.investigationDetails ?? {
        assignedOfficer: 'Not yet assigned',
        caseNumber: 'Pending assignment',
        evidence: [],
        timeline: [
          { date: new Date().toISOString().split('T')[0], action: 'Complaint submitted', officer: 'System' }
        ]
      }
    };
    setComplaints(prev => [newComplaint, ...prev]);
    return newComplaint;
  };

  return (
    <ComplaintsContext.Provider value={{ complaints, addComplaint }}>
      {children}
    </ComplaintsContext.Provider>
  );
};

export const useComplaints = () => {
  const ctx = useContext(ComplaintsContext);
  if (!ctx) throw new Error('useComplaints must be used within a ComplaintsProvider');
  return ctx;
};