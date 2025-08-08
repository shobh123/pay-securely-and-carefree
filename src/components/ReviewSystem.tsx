
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, AlertTriangle, Shield, Flag, Zap, CreditCard, UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  flagged?: boolean;
  categories?: ('spam' | 'fraud' | 'criminal')[];
}

interface ReviewSystemProps {
  recipientId: string;
  recipientName: string;
  onReviewsUpdated?: (averageRating: number, count: number, flags?: { spam: number; fraud: number; criminal: number }) => void;
}

const storageKeyFor = (recipientId: string) => `reviews:${recipientId}`;

const ReviewSystem: React.FC<ReviewSystemProps> = ({ recipientId, recipientName, onReviewsUpdated }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<('spam' | 'fraud' | 'criminal')[]>([]);
  const { toast } = useToast();
  const { user, updateProfile } = useAuth();
  const [open, setOpen] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKeyFor(recipientId));
      if (stored) {
        setReviews(JSON.parse(stored) as Review[]);
      } else {
        // Seed with demo data once if nothing stored
        const demo: Review[] = [
          { id: '1', userId: 'user1', userName: 'John D.', rating: 5, comment: 'Fast and reliable payment. Highly recommended!', date: '2024-01-10', verified: true },
          { id: '2', userId: 'user2', userName: 'Sarah M.', rating: 2, comment: 'Payment was delayed and had to follow up multiple times.', date: '2024-01-08', verified: true, flagged: true, categories: ['spam'] },
          { id: '3', userId: 'user3', userName: 'Mike R.', rating: 4, comment: 'Good service overall, minor delays but resolved quickly.', date: '2024-01-05', verified: false },
        ];
        setReviews(demo);
        localStorage.setItem(storageKeyFor(recipientId), JSON.stringify(demo));
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipientId]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKeyFor(recipientId), JSON.stringify(reviews));
    } catch {
      // ignore
    }
  }, [recipientId, reviews]);

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const flaggedReviews = reviews.filter(review => review.flagged).length;
  
  const getCategoryStats = (list: Review[] = reviews) => {
    const stats = { spam: 0, fraud: 0, criminal: 0 };
    list.forEach(review => {
      review.categories?.forEach(category => {
        stats[category]++;
      });
    });
    return stats;
  };

  const categoryStats = getCategoryStats();

  const getCategoryIcon = (category: 'spam' | 'fraud' | 'criminal') => {
    switch (category) {
      case 'spam': return <Zap className="w-4 h-4 text-orange-500" />;
      case 'fraud': return <CreditCard className="w-4 h-4 text-red-500" />;
      case 'criminal': return <UserX className="w-4 h-4 text-purple-500" />;
    }
  };

  const toggleCategory = (category: 'spam' | 'fraud' | 'criminal') => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive"
      });
      return;
    }

    const now = new Date().toISOString().split('T')[0];
    const currentUserName = user?.name || 'You';
    const currentUserId = user?.id || 'current-user';

    // Build updated reviews list (add or edit)
    const existingIndex = reviews.findIndex(r => r.userId === currentUserId);
    const updated: Review = {
      id: existingIndex >= 0 ? reviews[existingIndex].id : Math.random().toString(36).slice(2),
      userId: currentUserId,
      userName: currentUserName,
      rating,
      comment,
      date: now,
      verified: true,
      categories: selectedCategories.length ? selectedCategories : undefined
    };

    const newReviews = existingIndex >= 0
      ? (() => { const copy = [...reviews]; copy[existingIndex] = updated; return copy; })()
      : [updated, ...reviews];

    setReviews(newReviews);

    // Compute fresh stats from new list
    const newCount = newReviews.length;
    const sum = newReviews.reduce((acc, r) => acc + r.rating, 0);
    const newAverage = newCount > 0 ? sum / newCount : 0;
    const newCategoryStats = getCategoryStats(newReviews);

    // Deduct $5 after valid submission
    if (user && user.balance >= 5) {
      await updateProfile({ balance: user.balance - 5 });
    }

    onReviewsUpdated?.(newAverage, newCount, newCategoryStats);

    toast({
      title: "Review Submitted Successfully",
      description: "Thank you for your feedback! $5 has been deducted from your account balance."
    });

    // Reset and close dialog
    setRating(0);
    setComment('');
    setSelectedCategories([]);
    setOpen(false);
  };

  const renderStars = (currentRating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 cursor-pointer transition-colors ${
          index < (interactive ? (hoveredStar || rating) : currentRating)
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
        onClick={interactive ? () => setRating(index + 1) : undefined}
        onMouseEnter={interactive ? () => setHoveredStar(index + 1) : undefined}
        onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
      />
    ));
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Reviews for {recipientName}</CardTitle>
          <div className="flex items-center gap-2">
            {categoryStats.spam > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1 bg-orange-100 text-orange-800">
                <Zap className="w-3 h-3" />
                {categoryStats.spam} Spam
              </Badge>
            )}
            {categoryStats.fraud > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                {categoryStats.fraud} Fraud
              </Badge>
            )}
            {categoryStats.criminal > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1 bg-purple-100 text-purple-800">
                <UserX className="w-3 h-3" />
                {categoryStats.criminal} Criminal
              </Badge>
            )}
            {flaggedReviews > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {flaggedReviews} Flagged
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Rating */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center mb-1">
              {renderStars(Math.round(averageRating))}
            </div>
            <div className="text-sm text-gray-600">{reviews.length} reviews</div>
          </div>
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map(stars => {
              const count = reviews.filter(r => r.rating === stars).length;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-2 text-sm">
                  <span>{stars}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-gray-600">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-3 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{review.userName}</span>
                  {review.verified && (
                    <Shield className="w-4 h-4 text-green-500" />
                  )}
                  {review.flagged && (
                    <Flag className="w-4 h-4 text-red-500" />
                  )}
                  {review.categories?.map(category => (
                    <span key={category}>{getCategoryIcon(category)}</span>
                  ))}
                </div>
                <span className="text-xs text-gray-500">{review.date}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                {renderStars(review.rating)}
              </div>
              <p className="text-sm text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>

        {/* Add / Edit Review */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              {reviews.some(r => r.userId === (user?.id || 'current-user')) ? 'Edit Your Review' : 'Write a Review'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Review {recipientName}</DialogTitle>
            </DialogHeader>
            {/* Review Charge Disclaimer */}
            <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-orange-800">Review and rating are charged $5</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Rating</Label>
                <div className="flex gap-1 mt-2">
                  {renderStars(rating, true)}
                </div>
              </div>
              <div>
                <Label>Comment (Optional)</Label>
                <Input
                  placeholder="Share your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Report Categories (Optional)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(['spam', 'fraud', 'criminal'] as const).map(category => (
                    <Button
                      key={category}
                      type="button"
                      variant={selectedCategories.includes(category) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCategory(category)}
                      className="flex items-center gap-1"
                    >
                      {getCategoryIcon(category)}
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              <Button onClick={handleSubmitReview} className="w-full" disabled={rating === 0}>
                Submit Review
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ReviewSystem;
