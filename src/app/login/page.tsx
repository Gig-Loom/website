'use client';

import { useState } from 'react';
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
import { BASE_URL } from '../BASE_URL';
import { countryCodes } from '../constants';

export default function LoginPage() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState('+82');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      toast.error("Please provide a phone number.");
      return;
    }

    if (!password) {
      toast.error("Please provide a password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/accounts/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone_number: `${selectedCountry}${phoneNumber}`, 
          password 
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        try {
          const myInfo = await fetch(`${BASE_URL}/accounts/get-my-info/`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${data.token}`,
              'Content-Type': 'application/json',
            },
          });

          const profile = await myInfo.json();
          
          localStorage.setItem('userInfo', JSON.stringify({
            token: data.token,
            name: profile.user.name,
            phone_number: profile.user.phone_number,
            id: profile.user.id,
          }));
          
          toast.success('Successfully logged in!');
          router.push('/home');
        } catch (tokenError) {
          toast.error('Failed to store authentication token. Please try logging in again.');
        }
      } else {
        toast.error(data.message || 'Invalid login credentials. Please check your details and try again.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred while logging in. Please try again.');
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
              src="/grab-TaHwKzcN5QU-unsplash.jpg"
              alt="Login background"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <Card className="w-full md:p-12 lg:shadow-none">
                <CardHeader className="flex flex-col gap-1 pb-6">
                  <h1 className="text-2xl font-semibold text-gray-800">Welcome to GigLoom</h1>
                </CardHeader>

                <CardBody className="flex flex-col gap-4">
                  <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
                        placeholder="Enter your number"
                      />
                    </div>

                    <Input
                      label="Password"
                      type="password"
                      value={password}
                      onValueChange={setPassword}
                      variant="bordered"
                      className="w-full text-black placeholder-gray-500"
                    />

                    <div className="flex justify-end">
                      <a
                        className="text-green-600 font-medium px-0 hover:underline cursor-pointer"
                        onClick={() => router.push('/forgot-password')}
                      >
                        Forgot Password?
                      </a>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-green-600 text-white"
                      isLoading={isLoading}
                    >
                      Sign in
                    </Button>
                  </form>

                  <div className="mt-6 text-center text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <a
                      className="text-green-600 font-medium px-1 hover:underline cursor-pointer"
                      onClick={() => router.push('/signup')}
                    >
                      Sign Up now
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