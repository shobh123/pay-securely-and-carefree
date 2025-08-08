import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar: string; // initials or URL
  lastSent: string; // formatted $ amount
  rating: number; // average rating
  reviewCount: number;
  trustScore: 'high' | 'medium' | 'low';
  flagged?: boolean;
  spamCount: number;
  fraudCount: number;
  criminalCount: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string; // YYYY-MM-DD
  verified: boolean;
  flagged?: boolean;
  categories?: ('spam' | 'fraud' | 'criminal')[];
}

interface ContactsContextType {
  contacts: Contact[];
  addContact: (name: string, email: string) => Contact;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  recordSendToContact: (id: string, amount: number) => void;
  getReviews: (contactId: string) => Review[];
  addOrUpdateReview: (contactId: string, review: Review) => { average: number; count: number };
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

const STORAGE_KEY = 'app_contacts_state_v1';

type PersistedState = {
  contacts: Contact[];
  reviewsById: Record<string, Review[]>;
};

const defaultContacts: Contact[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@email.com', avatar: 'SJ', lastSent: '$50.00', rating: 4.5, reviewCount: 12, trustScore: 'high', spamCount: 0, fraudCount: 0, criminalCount: 0 },
  { id: '2', name: 'John Doe', email: 'john@email.com', avatar: 'JD', lastSent: '$125.00', rating: 2.1, reviewCount: 8, trustScore: 'low', flagged: true, spamCount: 2, fraudCount: 1, criminalCount: 0 },
  { id: '3', name: 'Emma Wilson', email: 'emma@email.com', avatar: 'EW', lastSent: '$25.00', rating: 4.8, reviewCount: 25, trustScore: 'high', spamCount: 0, fraudCount: 0, criminalCount: 0 },
  { id: '4', name: 'Mike Chen', email: 'mike@email.com', avatar: 'MC', lastSent: '$75.00', rating: 3.2, reviewCount: 5, trustScore: 'medium', spamCount: 1, fraudCount: 0, criminalCount: 1 },
  { id: '5', name: 'Lisa Anderson', email: 'lisa@email.com', avatar: 'LA', lastSent: '$200.00', rating: 4.7, reviewCount: 18, trustScore: 'high', spamCount: 0, fraudCount: 0, criminalCount: 0 },
];

const defaultReviews: Record<string, Review[]> = {
  '1': [
    { id: 'r1', userId: 'user1', userName: 'John D.', rating: 5, comment: 'Fast and reliable payment. Highly recommended!', date: '2024-01-10', verified: true },
  ],
  '2': [
    { id: 'r2', userId: 'user2', userName: 'Sarah M.', rating: 2, comment: 'Payment was delayed and had to follow up multiple times.', date: '2024-01-08', verified: true, flagged: true, categories: ['spam'] },
  ],
  '3': [
    { id: 'r3', userId: 'user3', userName: 'Mike R.', rating: 4, comment: 'Good service overall, minor delays but resolved quickly.', date: '2024-01-05', verified: false },
  ],
};

export const ContactsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>(defaultContacts);
  const [reviewsById, setReviewsById] = useState<Record<string, Review[]>>(defaultReviews);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: PersistedState = JSON.parse(raw);
        if (parsed.contacts) setContacts(parsed.contacts);
        if (parsed.reviewsById) setReviewsById(parsed.reviewsById);
      }
    } catch {}
  }, []);

  // Persist to localStorage
  useEffect(() => {
    const data: PersistedState = { contacts, reviewsById };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [contacts, reviewsById]);

  const addContact: ContactsContextType['addContact'] = (name, email) => {
    const id = Math.random().toString(36).slice(2);
    const avatar = name.split(' ').map(n => n[0]).join('').toUpperCase();
    const newContact: Contact = {
      id, name, email, avatar,
      lastSent: '$0.00', rating: 0, reviewCount: 0, trustScore: 'high', spamCount: 0, fraudCount: 0, criminalCount: 0
    };
    setContacts(prev => [newContact, ...prev]);
    return newContact;
  };

  const updateContact: ContactsContextType['updateContact'] = (id, updates) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const recordSendToContact: ContactsContextType['recordSendToContact'] = (id, amount) => {
    setContacts(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, lastSent: `$${amount.toFixed(2)}` } : c);
      const selected = updated.find(c => c.id === id)!;
      const rest = updated.filter(c => c.id !== id);
      return [selected, ...rest];
    });
  };

  const getReviews: ContactsContextType['getReviews'] = (contactId) => {
    return reviewsById[contactId] || [];
  };

  const addOrUpdateReview: ContactsContextType['addOrUpdateReview'] = (contactId, review) => {
    setReviewsById(prev => {
      const existing = prev[contactId] || [];
      const index = existing.findIndex(r => r.userId === review.userId);
      const next = [...existing];
      if (index >= 0) {
        next[index] = { ...review, id: existing[index].id };
      } else {
        next.unshift({ ...review, id: Math.random().toString(36).slice(2) });
      }
      const sum = next.reduce((s, r) => s + r.rating, 0);
      const avg = next.length > 0 ? sum / next.length : 0;
      // update contact aggregates
      setContacts(prevContacts => prevContacts.map(c => c.id === contactId ? { ...c, rating: Number(avg.toFixed(1)), reviewCount: next.length } : c));
      return { ...prev, [contactId]: next };
    });
    const after = reviewsById[contactId] || [];
    const sum = after.reduce((s, r) => s + r.rating, 0);
    const avg = after.length > 0 ? sum / after.length : 0;
    return { average: avg, count: after.length };
  };

  const value = useMemo<ContactsContextType>(() => ({
    contacts,
    addContact,
    updateContact,
    recordSendToContact,
    getReviews,
    addOrUpdateReview,
  }), [contacts, getReviews]);

  return (
    <ContactsContext.Provider value={value}>
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => {
  const ctx = useContext(ContactsContext);
  if (!ctx) throw new Error('useContacts must be used within a ContactsProvider');
  return ctx;
};