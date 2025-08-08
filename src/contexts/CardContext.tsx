import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SavedCard {
  id: string;
  holderName: string;
  last4: string;
  brand: 'Visa' | 'Mastercard' | 'Amex' | 'Discover' | 'Other';
  expMonth: number;
  expYear: number;
}

interface CardContextType {
  cards: SavedCard[];
  addCard: (card: Omit<SavedCard, 'id'>) => SavedCard;
  removeCard: (id: string) => void;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

const initialCards: SavedCard[] = [
  { id: 'card_1', holderName: 'John Doe', last4: '4242', brand: 'Visa', expMonth: 12, expYear: 2028 },
];

export const CardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<SavedCard[]>(initialCards);

  const addCard: CardContextType['addCard'] = (card) => {
    const id = `card_${Math.random().toString(36).slice(2)}`;
    const saved: SavedCard = { id, ...card };
    setCards(prev => [saved, ...prev]);
    return saved;
  };

  const removeCard: CardContextType['removeCard'] = (id) => {
    setCards(prev => prev.filter(c => c.id !== id));
  };

  return (
    <CardContext.Provider value={{ cards, addCard, removeCard }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCards = () => {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error('useCards must be used within a CardProvider');
  return ctx;
};