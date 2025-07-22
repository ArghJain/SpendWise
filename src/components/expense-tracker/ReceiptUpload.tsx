
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, FileImage, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface ReceiptData {
  description: string;
  amount: number;
  date: string;
  merchant?: string;
}

interface ReceiptUploadProps {
  onReceiptProcessed: (data: ReceiptData) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptUpload = ({ onReceiptProcessed, isOpen, onClose }: ReceiptUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please select an image file");
      }
    }
  };

  const processReceiptText = (text: string): ReceiptData => {
    console.log("Processing receipt text:", text);
    
    // Extract amount - look for currency symbols and numbers
    const amountRegex = /(?:₹|RS\.?|INR)\s*(\d+(?:\.\d{2})?)|(\d+(?:\.\d{2})?)\s*(?:₹|RS\.?|INR)/i;
    const amountMatch = text.match(amountRegex);
    const amount = amountMatch ? parseFloat(amountMatch[1] || amountMatch[2]) : 0;

    // Extract date - look for various date formats
    const dateRegex = /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})|(\d{2,4}[-\/]\d{1,2}[-\/]\d{1,2})/;
    const dateMatch = text.match(dateRegex);
    let date = new Date().toISOString().split('T')[0]; // Default to today
    
    if (dateMatch) {
      const dateStr = dateMatch[0];
      const parsedDate = new Date(dateStr);
      if (!isNaN(parsedDate.getTime())) {
        date = parsedDate.toISOString().split('T')[0];
      }
    }

    // Extract merchant/store name - usually appears at the top
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const merchant = lines[0]?.trim() || "";

    // Generate description from merchant or first few words
    const description = merchant || lines.slice(0, 2).join(' ').trim() || "Receipt Purchase";

    return {
      description: description.substring(0, 50), // Limit description length
      amount,
      date,
      merchant
    };
  };

  const simulateOCR = async (file: File): Promise<string> => {
    // Simulate OCR processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock OCR result - in a real implementation, you'd use Tesseract.js or similar
    const mockReceiptText = `
    SUPER MARKET DELHI
    Receipt #12345
    Date: ${new Date().toLocaleDateString('en-GB')}
    
    Groceries
    Milk 2L       ₹85.00
    Bread         ₹40.00
    Eggs 12pc     ₹60.00
    
    Subtotal:     ₹185.00
    Tax:          ₹15.00
    Total:        ₹200.00
    
    Thank you for shopping!
    `;
    
    return mockReceiptText;
  };

  const handleProcessReceipt = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      console.log("Processing receipt:", selectedFile.name);
      
      // In a real implementation, you would use Tesseract.js or a cloud OCR service
      const extractedText = await simulateOCR(selectedFile);
      const receiptData = processReceiptText(extractedText);
      
      console.log("Extracted receipt data:", receiptData);
      
      if (receiptData.amount > 0) {
        onReceiptProcessed(receiptData);
        toast.success("Receipt processed successfully!");
        handleClose();
      } else {
        toast.error("Could not extract amount from receipt. Please check the image quality.");
      }
    } catch (error) {
      console.error("Error processing receipt:", error);
      toast.error("Failed to process receipt. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Upload Receipt</h3>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X size={16} />
            </Button>
          </div>

          <div className="space-y-4">
            {!selectedFile ? (
              <div>
                <Label htmlFor="receipt-upload">Select Receipt Image</Label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload receipt image
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </div>
                <Input
                  ref={fileInputRef}
                  id="receipt-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={preview || ''} 
                    alt="Receipt preview" 
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreview(null);
                    }}
                  >
                    <X size={14} />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileImage size={16} />
                  <span>{selectedFile.name}</span>
                </div>

                <Button 
                  onClick={handleProcessReceipt}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Receipt...
                    </>
                  ) : (
                    "Process Receipt"
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
