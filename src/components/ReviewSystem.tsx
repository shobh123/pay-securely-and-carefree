
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
  categories?: string[];
}

interface ReviewSystemProps {
  recipientId: string;
  recipientName: string;
  onReviewsUpdated?: (averageRating: number, count: number, flags?: { spam: number; fraud: number; criminal: number }) => void;
}

const storageKeyFor = (recipientId: string) => `reviews:${recipientId}`;

const DEFAULT_CATEGORIES: string[] = [
  'spam',
  'fraud',
  'criminal',
  'harassment',
  'impersonation',
  'money_laundering',
  'fake_goods',
  'chargeback',
  'other'
];

const ReviewSystem: React.FC<ReviewSystemProps> = ({ recipientId, recipientName, onReviewsUpdated }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState('');
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

  // Emit updated stats whenever reviews change so parent can sync rating/flags on selection
  useEffect(() => {
    if (!onReviewsUpdated) return;
    const count = reviews.length;
    const avg = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
    const flags = (() => {
      const stats = { spam: 0, fraud: 0, criminal: 0 };
      reviews.forEach(r => r.categories?.forEach(c => { if (c === 'spam' || c === 'fraud' || c === 'criminal') { (stats as any)[c]++; } }));
      return stats;
    })();
    onReviewsUpdated(avg, count, flags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviews]);

  // Prefill dialog fields when opening for edit
  useEffect(() => {
    if (!open) return;
    if (!user) return;
    const existing = reviews.find(r => r.userId === (user?.id || 'current-user'));
    if (existing) {
      setRating(existing.rating);
      setComment(existing.comment);
      setSelectedCategories(existing.categories || []);
    } else {
      setRating(0);
      setComment('');
      setSelectedCategories([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const flaggedReviews = reviews.filter(review => review.flagged || (review.categories && review.categories.length > 0)).length;
  
  const getCategoryStats = () => {
    const stats = { spam: 0, fraud: 0, criminal: 0 };
    reviews.forEach(review => {
      review.categories?.forEach(category => {
        if (category === 'spam' || category === 'fraud' || category === 'criminal') {
          // Count only primary categories for contact summary
          (stats as any)[category]++;
        }
      });
    });
    return stats;
  };

  const categoryStats = getCategoryStats();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'spam': return <Zap className="w-4 h-4 text-orange-500" />;
      case 'fraud': return <CreditCard className="w-4 h-4 text-red-500" />;
      case 'criminal': return <UserX className="w-4 h-4 text-purple-500" />;
      case 'harassment': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'impersonation': return <UserX className="w-4 h-4 text-amber-600" />;
      case 'money_laundering': return <Shield className="w-4 h-4 text-blue-600" />;
      case 'fake_goods': return <Flag className="w-4 h-4 text-gray-600" />;
      case 'chargeback': return <CreditCard className="w-4 h-4 text-pink-600" />;
      default: return <Flag className="w-4 h-4 text-gray-500" />;
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const addCustomCategory = () => {
    const normalized = customCategory.trim().toLowerCase().replace(/\s+/g, '_');
    if (!normalized) return;
    if (!selectedCategories.includes(normalized)) {
      setSelectedCategories(prev => [...prev, normalized]);
    }
    setCustomCategory('');
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

    if (!user) {
      toast({
        title: "Not signed in",
        description: "Please log in to submit a review.",
        variant: "destructive",
      });
      return;
    }

    // Block demo account from submitting reviews
    const isDemoUser = user.email?.toLowerCase() === 'demo@demo.com' || user.id === '3';
    if (isDemoUser) {
      toast({
        title: "Demo account restriction",
        description: "Demo account cannot submit reviews. Please sign up or log in with a regular account.",
        variant: "destructive",
      });
      return;
    }

    // Charge $5 only if we're actually submitting a valid review
    if (user.balance < 5) {
      toast({
        title: "Insufficient Balance",
        description: "You need at least $5 to submit a review.",
        variant: "destructive",
      });
      return;
    }

    const chargeResult = await updateProfile({ balance: user.balance - 5 });
    if (!chargeResult.success) {
      toast({
        title: "Payment Failed",
        description: "We couldn't process the review charge. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date().toISOString().split('T')[0];
    const currentUserName = user?.name || 'You';
    const currentUserId = user?.id || 'current-user';

    // Build the updated reviews array first so we can compute accurate stats
    const existingIndex = reviews.findIndex(r => r.userId === currentUserId);
    const updatedEntry: Review = {
      id: existingIndex >= 0 ? reviews[existingIndex].id : Math.random().toString(36).slice(2),
      userId: currentUserId,
      userName: currentUserName,
      rating,
      comment,
      date: now,
      verified: true,
      categories: selectedCategories.length ? selectedCategories : undefined,
      flagged: selectedCategories.length > 0
    };

    const newReviews: Review[] = existingIndex >= 0
      ? (() => { const copy = [...reviews]; copy[existingIndex] = updatedEntry; return copy; })()
      : [updatedEntry, ...reviews];

    setReviews(newReviews);

    // Compute and emit updated stats from the new reviews
    const newCount = newReviews.length;
    const newAverage = newCount > 0
      ? newReviews.reduce((sum, r) => sum + r.rating, 0) / newCount
      : 0;
    const newCategoryStats = (() => {
      const stats = { spam: 0, fraud: 0, criminal: 0 };
      newReviews.forEach(r => r.categories?.forEach(c => { if (c === 'spam' || c === 'fraud' || c === 'criminal') { (stats as any)[c]++; } }));
      return stats;
    })();
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
                  {(review.flagged || (review.categories && review.categories.length > 0)) && (
                    <Flag className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <span className="text-xs text-gray-500">{review.date}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                {renderStars(review.rating)}
              </div>
              <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
              {review.categories && review.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {review.categories.map(category => (
                    <Badge key={category} variant="outline" className="flex items-center gap-1">
                      {getCategoryIcon(category)}
                      <span className="capitalize">{category.replace(/_/g, ' ')}</span>
                    </Badge>
                  ))}
                </div>
              )}
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
                  {DEFAULT_CATEGORIES.map(category => (
                    <Button
                      key={category}
                      type="button"
                      variant={selectedCategories.includes(category) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCategory(category)}
                      className="flex items-center gap-1"
                    >
                      {getCategoryIcon(category)}
                      {category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ')}
                    </Button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Input 
                    placeholder="Add your own flag (e.g., rude behavior)" 
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                  />
                  <Button type="button" variant="secondary" onClick={addCustomCategory}>Add</Button>
                </div>
              </div>
              <Button onClick={handleSubmitReview} className="w-full">
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
