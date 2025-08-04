import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Upload, Sparkles, RefreshCw, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({ open, onOpenChange }) => {
  const { user, updateProfile, isLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || ''
  });
  
  const [avatarMode, setAvatarMode] = useState<'current' | 'upload' | 'ai'>('current');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [selectedAiAvatar, setSelectedAiAvatar] = useState<string>('');
  const [aiAvatars, setAiAvatars] = useState<string[]>([]);
  const [generatingAvatars, setGeneratingAvatars] = useState(false);

  // Generate AI avatars using DiceBear API
  const generateAiAvatars = () => {
    setGeneratingAvatars(true);
    const styles = ['avataaars', 'big-smile', 'bottts', 'fun-emoji', 'micah', 'pixel-art'];
    const seeds = Array.from({ length: 6 }, () => Math.random().toString(36).substring(7));
    
    const avatars = seeds.map((seed, index) => {
      const style = styles[index % styles.length];
      return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
    });
    
    setAiAvatars(avatars);
    setGeneratingAvatars(false);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setAvatarMode('upload');
    }
  };

  // Get current avatar URL based on mode
  const getCurrentAvatarUrl = () => {
    switch (avatarMode) {
      case 'upload':
        return previewUrl;
      case 'ai':
        return selectedAiAvatar;
      default:
        return formData.avatar;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let avatarUrl = formData.avatar;
    
    if (avatarMode === 'upload' && uploadedFile) {
      // In a real app, you would upload to a cloud service
      // For demo purposes, we'll use the preview URL
      avatarUrl = previewUrl;
    } else if (avatarMode === 'ai' && selectedAiAvatar) {
      avatarUrl = selectedAiAvatar;
    }
    
    const result = await updateProfile({
      ...formData,
      avatar: avatarUrl
    });
    
    if (result.success) {
      onOpenChange(false);
      // Reset form
      setAvatarMode('current');
      setUploadedFile(null);
      setPreviewUrl('');
      setSelectedAiAvatar('');
    } else {
      alert(result.error || 'Failed to update profile');
    }
  };

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open && user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        avatar: user.avatar || ''
      });
      setAvatarMode('current');
      setUploadedFile(null);
      setPreviewUrl('');
      setSelectedAiAvatar('');
    }
  }, [open, user]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and photo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="space-y-4">
            <Label>Profile Photo</Label>
            
            {/* Current Avatar Display */}
            <div className="flex justify-center">
              <Avatar className="w-20 h-20">
                <AvatarImage src={getCurrentAvatarUrl()} alt="Profile" />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xl">
                  {formData.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Avatar Options */}
            <div className="flex gap-2 justify-center">
              <Button
                type="button"
                variant={avatarMode === 'current' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAvatarMode('current')}
              >
                Current
              </Button>
              <Button
                type="button"
                variant={avatarMode === 'upload' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setAvatarMode('upload');
                  fileInputRef.current?.click();
                }}
              >
                <Upload className="w-4 h-4 mr-1" />
                Upload
              </Button>
              <Button
                type="button"
                variant={avatarMode === 'ai' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setAvatarMode('ai');
                  if (aiAvatars.length === 0) {
                    generateAiAvatars();
                  }
                }}
              >
                <Sparkles className="w-4 h-4 mr-1" />
                AI Generated
              </Button>
            </div>

            {/* File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* AI Avatar Selection */}
            {avatarMode === 'ai' && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <Label className="text-sm">Choose an AI-generated avatar</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateAiAvatars}
                      disabled={generatingAvatars}
                    >
                      {generatingAvatars ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                  
                  {generatingAvatars ? (
                    <div className="grid grid-cols-3 gap-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {aiAvatars.map((avatar, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                            selectedAiAvatar === avatar
                              ? 'border-purple-500 ring-2 ring-purple-200'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedAiAvatar(avatar)}
                        >
                          <Avatar className="w-full h-full">
                            <AvatarImage src={avatar} alt={`AI Avatar ${index + 1}`} />
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                          {selectedAiAvatar === avatar && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                              <Check className="w-2 h-2 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;