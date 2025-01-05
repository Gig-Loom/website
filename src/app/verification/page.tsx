'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Spinner,
} from "@nextui-org/react";
import toast from 'react-hot-toast';
import { BASE_URL, IMAGE_PREFIX } from '../BASE_URL';

export default function VerificationPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <Spinner color="success" size="lg" />
        </div>
      }
    >
      <Verification />
    </Suspense>
  );
}

function Verification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get('phoneNumber');
  
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(180);

  useEffect(() => {
    if (!phoneNumber) {
      toast.error('No phone number provided');
      router.push('/signup');
      return;
    }

    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer, phoneNumber, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode) {
      toast.error('Please enter the verification code!');
      return;
    }

    if (!phoneNumber) {
      toast.error('No phone number provided');
      router.push('/signup');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/accounts/verify-phone/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verification_code: verificationCode,
          phone_number: `+${phoneNumber.trim()}`,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Account created successfully. Please Login.');
        router.push('/login');
      } else {
        toast.error('The verification code is incorrect or expired. Please Signup Again!');
      }
    } catch (error) {
      toast.error('An error occurred while verifying the code. Try Again Later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!phoneNumber) {
      toast.error('No phone number provided');
      router.push('/signup');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/accounts/resend-verification/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone_number: `+${phoneNumber.trim()}` }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('A new verification code has been sent.');
        setResendTimer(180);
      } else {
        toast.error('Failed to resend the verification code.');
      }
    } catch (error) {
      toast.error('An error occurred while resending the verification code. Try Again Later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 to-green-500 p-4">
        <div className="w-full lg:flex lg:max-w-5xl lg:shadow-2xl lg:rounded-xl lg:min-h-[600px] lg:bg-white">
          <div className="hidden lg:block lg:w-1/2 relative rounded-l-xl overflow-hidden">
            <Image
              src={`${IMAGE_PREFIX}/grab-TaHwKzcN5QU-unsplash.jpg`}
              alt="Verification background"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <Card className="w-full md:p-12 lg:shadow-none">
                <CardHeader className="flex flex-col gap-1 pb-6">
                  <h1 className="text-2xl font-semibold text-gray-800">
                    Activate Your GigLoom Account
                  </h1>
                  <p className="text-gray-600 text-center mt-2">
                    A verification code has been sent to your phone number. Please enter the code below.
                  </p>
                </CardHeader>

                <CardBody className="flex flex-col gap-6">
                  <form onSubmit={handleVerify} className="flex flex-col gap-6">
                    <Input
                      type="text"
                      label="Verification Code"
                      value={verificationCode}
                      onValueChange={setVerificationCode}
                      variant="bordered"
                      maxLength={6}
                      placeholder="Enter 6-digit code"
                      className="w-full text-black placeholder-gray-500"
                    />

                    <Button
                      type="submit"
                      className="w-full bg-green-600 text-white hover:bg-green-700"
                      isLoading={isLoading}
                    >
                      Verify Code
                    </Button>

                    <Button
                      className={`w-full ${resendTimer > 0 ? 'bg-gray-300' : 'bg-green-600 text-white hover:bg-green-700'}`}
                      onPress={handleResendCode}
                      isDisabled={resendTimer > 0 || isLoading}
                    >
                      {resendTimer > 0
                        ? `Resend Code in ${Math.floor(resendTimer / 60)}:${String(
                            resendTimer % 60
                          ).padStart(2, '0')}`
                        : 'Resend Verification Code'}
                    </Button>
                  </form>

                  <div className="text-center text-sm text-gray-600">
                    By verifying your number, you agree to our{' '}
                    <a
                      className="text-green-600 font-medium px-1 text-sm hover:underline cursor-pointer"
                      onClick={() => router.push('/terms')}
                    >
                      Terms of Service
                    </a>
                    {' '}and{' '}
                    <a
                      className="text-green-600 font-medium px-1 text-sm hover:underline cursor-pointer"
                      onClick={() => router.push('/privacy')}
                    >
                      Privacy Policy
                    </a>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}