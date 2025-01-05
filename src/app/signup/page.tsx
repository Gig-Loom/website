"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import toast from "react-hot-toast";
import { BASE_URL } from "../BASE_URL";
import { countryCodes } from "../constants";

export default function SignUpPage() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState("+82");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phoneNumber || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/accounts/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone_number: `${selectedCountry}${phoneNumber}`,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          "Account created successfully. Please check your phone for a verification code."
        );
        router.push(
          `/verification?phoneNumber=${selectedCountry}${phoneNumber}`
        );
      } else {
        toast.error(
          data.message ||
            "An error occurred during sign-up. Please try again later!"
        );
      }
    } catch (_) {
      toast.error(
        "An error occurred while signing up. Please try again later!"
      );
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
              alt="Signup background"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <Card className="w-full md:p-12 lg:shadow-none">
                <CardHeader className="flex flex-col gap-1 pb-6">
                  <h1 className="text-xl font-semibold text-gray-800">
                    Create Your GigLoom Account
                  </h1>
                </CardHeader>

                <CardBody className="flex flex-col gap-4">
                  <form onSubmit={handleSignUp} className="flex flex-col gap-4">
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
                            if (typeof selected === "string") {
                              setSelectedCountry(selected);
                            }
                          }}
                          items={countryCodes}
                        >
                          {(item) => (
                            <DropdownItem key={item.key}>
                              {item.name}
                            </DropdownItem>
                          )}
                        </DropdownMenu>
                      </Dropdown>

                      <Input
                        type="tel"
                        label="Phone Number"
                        value={phoneNumber}
                        onValueChange={setPhoneNumber}
                        variant="bordered"
                        placeholder="Enter your number"
                        className="flex-1 text-black placeholder-gray-500"
                      />
                    </div>

                    <Input
                      label="Full Name"
                      value={name}
                      onValueChange={setName}
                      variant="bordered"
                      className="w-full text-black placeholder-gray-500"
                      placeholder="Enter your full name"
                    />

                    <Input
                      label="Password"
                      type="password"
                      value={password}
                      onValueChange={setPassword}
                      variant="bordered"
                      className="w-full text-black placeholder-gray-500"
                      placeholder="Create a password"
                    />

                    <Input
                      label="Confirm Password"
                      type="password"
                      value={confirmPassword}
                      onValueChange={setConfirmPassword}
                      variant="bordered"
                      className="w-full text-black placeholder-gray-500"
                      placeholder="Confirm your password"
                    />

                    <Button
                      type="submit"
                      className="w-full bg-green-600 text-white hover:bg-green-700"
                      isLoading={isLoading}
                    >
                      Next
                    </Button>
                  </form>

                  <div className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <a
                      className="text-green-600 font-medium px-1 cursor-pointer hover:underline"
                      onClick={() => router.push("/login")}
                    >
                      Log In
                    </a>
                  </div>

                  <div className="mt-4 text-center text-xs text-gray-500">
                    By registering, you accept our{" "}
                    <a
                      className="text-green-600 font-medium px-1 text-xs cursor-pointer hover:underline"
                      onClick={() => router.push("/terms")}
                    >
                      Terms of Use
                    </a>{" "}
                    and{" "}
                    <a
                      className="text-green-600 font-medium px-1 text-xs cursor-pointer hover:underline"
                      onClick={() => router.push("/privacy")}
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
