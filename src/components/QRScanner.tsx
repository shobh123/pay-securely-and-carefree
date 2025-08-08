
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  QrCode, 
  Camera, 
  Image, 
  DollarSign,
  Check,
  X
} from 'lucide-react';
import { QrScanner } from '@yudiel/react-qr-scanner';
import jsQR from 'jsqr';
import { useAuth } from '@/contexts/AuthContext';
import { useTransaction } from '@/contexts/TransactionContext';

interface QRScannerProps {
  onBack: () => void;
}

// Define the expected shape of scanned data
interface ScannedPaymentRequest {
  type: 'payment_request';
  merchant: string;
  amount: string;
  description: string;
}

const QRScanner: React.FC<QRScannerProps> = ({ onBack }) => {
  const [scannedData, setScannedData] = useState<ScannedPaymentRequest | null>(null);
  const { user, updateProfile } = useAuth();
  const { addTransaction } = useTransaction();
  const [amount, setAmount] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [useCamera, setUseCamera] = useState(false);

  const parsePaymentRequest = (text: string): ScannedPaymentRequest | null => {
    try {
      const data = JSON.parse(text);
      if (data?.type === 'payment_request') return data as ScannedPaymentRequest;
      // fallback: simple vpa:merchant|amount|description
      if (text.startsWith('payment:')) {
        const [, merchant, amt, desc] = text.split(':');
        return { type: 'payment_request', merchant, amount: amt, description: desc };
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleScan = (result?: { rawValue?: string } | null) => {
    setIsScanning(true);
    const text = result?.rawValue || '';
    const parsed = parsePaymentRequest(text) || {
      type: 'payment_request',
      merchant: 'Coffee Shop',
      amount: '4.50',
      description: 'Latte and croissant'
    };
    setScannedData(parsed);
    setIsScanning(false);
  };

  const handleSelectFromGallery = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width; canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code?.data) {
            const parsed = parsePaymentRequest(code.data);
            if (parsed) setScannedData(parsed);
          } else {
            setScannedData({ type: 'payment_request', merchant: 'Gallery Merchant', amount: '12.00', description: 'Selected from gallery' });
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 overflow-y-auto">
      <div className="container mx-auto px-4 py-6 max-w-md min-h-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Scan QR Code</h1>
        </div>

        {/* Scanner Area */}
        <Card className="mb-6 overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-square bg-gradient-to-br from-gray-900 to-gray-700 relative flex items-center justify-center">
              {useCamera ? (
                <QrScanner
                  onDecode={(text) => { handleScan({ rawValue: text }); setUseCamera(false); }}
                  onError={() => setUseCamera(false)}
                  constraints={{ facingMode: 'environment' }}
                  containerStyle={{ width: '100%', height: '100%' }}
                />
              ) : isScanning ? (
                <div className="text-center text-white">
                  <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>Scanning...</p>
                </div>
              ) : scannedData ? (
                <div className="text-center text-white">
                  <Check className="w-16 h-16 mx-auto mb-4 text-green-400" />
                  <p>QR Code Detected!</p>
                </div>
              ) : (
                <div className="text-center text-white">
                  <QrCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="opacity-75">Position QR code in the frame</p>
                </div>
              )}
              <div className="absolute inset-8 border-2 border-white border-dashed rounded-lg opacity-50"></div>
            </div>
          </CardContent>
        </Card>

        {/* Scanner Controls */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button 
            variant="outline" 
            onClick={() => setUseCamera(true)}
            disabled={isScanning}
            className="h-12"
          >
            <Camera className="w-5 h-5 mr-2" />
            {useCamera ? 'Camera Active' : 'Scan'}
          </Button>
          
          <Button variant="outline" className="h-12" onClick={handleSelectFromGallery}>
            <Image className="w-5 h-5 mr-2" />
            From Gallery
          </Button>
        </div>

        {/* Scanned Payment Details */}
        {scannedData && (
          <Card className="mb-6 animate-fade-in">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">{scannedData.merchant}</h3>
                <p className="text-gray-600 text-sm">{scannedData.description}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-600">Requested Amount</Label>
                  <div className="flex items-center mt-1">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <span className="text-2xl font-bold ml-1">{scannedData.amount}</span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-gray-600">Custom Amount (Optional)</Label>
                  <Input
                    type="number"
                    placeholder="Enter different amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {scannedData ? (
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={() => setScannedData(null)}
              className="h-12"
            >
              <X className="w-5 h-5 mr-2" />
              Cancel
            </Button>
            
            <Button className="h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" onClick={async () => {
              const value = parseFloat(amount || scannedData.amount);
              if (isNaN(value) || value <= 0) return;
              if (!user || user.balance < value) return;
              await updateProfile({ balance: user.balance - value });
              addTransaction({
                type: 'sent',
                amount: value,
                recipient: scannedData.merchant,
                description: scannedData.description || 'QR payment',
                category: 'Transfer',
                status: 'completed'
              });
              setAmount('');
              setScannedData(null);
            }}>
              <Check className="w-5 h-5 mr-2" />
              Pay ${amount || scannedData.amount}
            </Button>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <QrCode className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Scan a QR code to make a payment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
