'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Textarea,
  ButtonGroup,
  Spinner,
} from "@nextui-org/react";
import { Upload, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { BASE_URL } from '../BASE_URL';

export default function CompleteServicePage() {
  return (
    <Suspense 
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <Spinner color="success" size="lg" />
        </div>
      }
    >
      <CompleteService />
    </Suspense>
  );
}

function CompleteService() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatRoomId = searchParams.get('chatRoomId');

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setPaymentProof(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating) {
      toast.error('Please provide a rating');
      return;
    }

    if (!paymentProof) {
      toast.error('Please upload payment proof');
      return;
    }

    try {
      const userInfo = localStorage.getItem('userInfo');
      if (!userInfo) {
        router.push('/login');
        return;
      }

      const { token } = JSON.parse(userInfo);

      const formData = new FormData();
      formData.append('chatRoomId', chatRoomId || '');
      formData.append('rating', rating.toString());
      formData.append('comment', comment || '');
      formData.append('paymentProof', paymentProof);

      const response = await fetch(`${BASE_URL}/reviews/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const closeResponse = await fetch(
          `${BASE_URL}/chats/chatrooms/${chatRoomId}/close/`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const closeData = await closeResponse.json();

        if (closeData.success) {
          toast.success('Service completed successfully!');
          router.push('/home');
        } else {
          throw new Error(closeData.error || 'Failed to close chatroom');
        }
      } else {
        throw new Error(data.error || 'Failed to complete service');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to complete service';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="space-y-6 ">
          <Card>
            <CardHeader className="pb-0">
              <h2 className="text-xl font-semibold text-black">Rate the Service</h2>
            </CardHeader>
            <CardBody>
              <div className="flex justify-center">
                <ButtonGroup>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant={rating === value ? "solid" : "bordered"}
                      onPress={() => setRating(value)}
                      className={`min-w-14 h-14 ${
                        rating === value ? 'bg-green-600 text-white' : ''
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <Star 
                          className={rating >= value ? 'fill-current' : ''} 
                          size={20} 
                        />
                        <span className="text-xs mt-1">{value}</span>
                      </div>
                    </Button>
                  ))}
                </ButtonGroup>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="pb-0">
              <h2 className="text-xl font-semibold text-black">Write a Review</h2>
            </CardHeader>
            <CardBody>
              <Textarea
                placeholder="Share your experience..."
                value={comment}
                onValueChange={setComment}
                minRows={4}
                variant="bordered"
                className='text-black'
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="pb-0">
              <h2 className="text-xl font-semibold text-black">Bank Account Information</h2>
            </CardHeader>
            <CardBody>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-gray-700">Bank: Woori Bank</p>
                <p className="text-gray-700">Account Holder: John Doe</p>
                <p className="text-gray-700">Account Number: 1234-5678-9012</p>
              </div>
            </CardBody>
          </Card>

          {/* Payment Proof Section */}
          <Card>
            <CardHeader className="pb-0">
              <h2 className="text-xl font-semibold text-black">Upload Payment Proof</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="payment-proof"
              />
              <Button
                color="success"
                className="w-full"
                startContent={<Upload size={20} />}
                onPress={() => document.getElementById('payment-proof')?.click()}
              >
                {paymentProof ? 'Change Image' : 'Select Image'}
              </Button>

              {previewUrl && (
                <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt="Payment proof"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </CardBody>
          </Card>

          <Button
            type="submit"
            color="success"
            size="lg"
            className="w-full"
          >
            Complete Service
          </Button>
        </form>
      </div>
    </div>
  );
}