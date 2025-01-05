'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import toast from 'react-hot-toast';
import { BASE_URL, IMAGE_PREFIX } from '../BASE_URL';
import { countryCodes } from '../constants';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState('+82');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer === 0) return;

    const countdown = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  const handleSendCode = async () => {
    if (!phoneNumber) {
      toast.error('Please enter your phone number.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/accounts/forgot-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone_number: `${selectedCountry}${phoneNumber}` 
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsCodeSent(true);
        setTimer(180);
        toast.success('Verification code has been sent to your phone.');
      } else {
        toast.error(data.message || 'Failed to send verification code.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode) {
      toast.error('Please enter the verification code.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/accounts/reset-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: `${selectedCountry}${phoneNumber}`,
          reset_code: verificationCode,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Your password has been reset. You can now log in.');
        router.push('/login');
      } else {
        toast.error(data.message || 'Failed to reset password.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
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
              alt="Reset Password background"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <Card className="w-full md:p-12 lg:shadow-none">
                <CardHeader className="flex flex-col gap-1 pb-6">
                  <h1 className="text-2xl font-semibold text-gray-800">Reset Password</h1>
                  <p className="text-sm text-gray-600 text-center mt-2">
                    Enter your phone number to receive a verification code, then reset your password.
                  </p>
                </CardHeader>

                <CardBody>
                  <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                    <div className="flex gap-2 items-center">
                      <Dropdown>
                        <DropdownTrigger>
                          <Button 
                            variant="bordered" 
                            className="w-36 bg-gray-100 py-6 text-black"
                          >
                            {selectedCountry}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu 
                          aria-label="Country Code Selection"
                          selectionMode="single"
                          selectedKeys={[selectedCountry]}
                          onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0];
                            if (typeof selected === 'string') {
                              setSelectedCountry(selected);
                            }
                          }}
                          items={countryCodes}
                        >
                          {(item) => (
                            <DropdownItem key={item.key}>{item.name}</DropdownItem>
                          )}
                        </DropdownMenu>
                      </Dropdown>

                      <Input
                        type="tel"
                        label="Phone Number"
                        value={phoneNumber}
                        onValueChange={setPhoneNumber}
                        variant="bordered"
                        className="flex-1 text-black placeholder-gray-500"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        color="primary"
                        className="bg-green-600"
                        onPress={handleSendCode}
                        isDisabled={isLoading || timer > 0}
                      >
                        {timer > 0
                          ? `Resend in ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}`
                          : isCodeSent ? 'Resend Code' : 'Send Code'}
                      </Button>
                    </div>

                    <Input
                      type="text"
                      label="Verification Code"
                      value={verificationCode}
                      onValueChange={setVerificationCode}
                      variant="bordered"
                      className="flex-1 text-black placeholder-gray-500"
                    />

                    <Input
                      type="password"
                      label="New Password"
                      value={newPassword}
                      onValueChange={setNewPassword}
                      variant="bordered"
                      className="flex-1 text-black placeholder-gray-500"
                    />

                    <Input
                      type="password"
                      label="Confirm Password"
                      value={confirmPassword}
                      onValueChange={setConfirmPassword}
                      variant="bordered"
                      className="flex-1 text-black placeholder-gray-500"
                    />

                    <Button
                      type="submit"
                      className="w-full bg-green-600 text-white mt-4"
                      isLoading={isLoading}
                      isDisabled={!phoneNumber || !verificationCode || !newPassword || !confirmPassword}
                    >
                      Reset Password
                    </Button>

                    <div className="mt-4 text-center">
                      <Button
                        variant="light"
                        className="text-green-600"
                        onPress={() => router.push('/login')}
                      >
                        Back to Login
                      </Button>
                    </div>
                  </form>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}