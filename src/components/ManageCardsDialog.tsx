import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCards } from '@/contexts/CardContext';
import { CreditCard, Trash } from 'lucide-react';

interface Props {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  asTrigger?: boolean;
}

const ManageCardsDialog: React.FC<Props> = ({ open, onOpenChange, asTrigger = true }) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const controlled = typeof open === 'boolean';
  const isOpen = controlled ? open! : internalOpen;
  const setOpen = controlled ? onOpenChange! : setInternalOpen;
  const { cards, removeCard } = useCards();

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {asTrigger && (
        <DialogTrigger asChild>
          <Button size="sm" className="bg-white/20 hover:bg-white/30 border-0">
            <CreditCard className="w-4 h-4 mr-2" />
            Cards
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" /> Manage Cards
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {cards.length === 0 && (
            <p className="text-sm text-gray-600">No saved cards yet. Add one from the Add Money dialog.</p>
          )}
          {cards.map(c => (
            <Card key={c.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{c.brand} •••• {c.last4}</p>
                  <p className="text-xs text-gray-500">{c.holderName} — Exp {String(c.expMonth).padStart(2,'0')}/{c.expYear}</p>
                </div>
                <Button variant="outline" size="sm" onClick={()=>removeCard(c.id)}>
                  <Trash className="w-4 h-4 mr-1" /> Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageCardsDialog;