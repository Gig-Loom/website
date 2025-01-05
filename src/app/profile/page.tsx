"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardBody,
  Button,
  Spinner,
  User,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Navbar,
  useDisclosure,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { Phone, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { BASE_URL, IMAGE_PREFIX } from "../BASE_URL";

interface Profile {
  token: string | null;
  name: string | null;
  phoneNumber: string | null;
  id: string | null;
}

interface Gig {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
}

export default function ProfilePage() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [profile, setProfile] = useState<Profile>({
    token: null,
    name: null,
    phoneNumber: null,
    id: null,
  });
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileAndGigs = async () => {
    try {
      setIsLoading(true);
      const userInfo = localStorage.getItem("userInfo");

      if (!userInfo) {
        handleLogout();
        return;
      }

      const { token } = JSON.parse(userInfo);

      const response = await fetch(`${BASE_URL}/accounts/get-my-info/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      if (data.success) {
        setProfile({
          token,
          name: data.user.name,
          phoneNumber: data.user.phone_number,
          id: data.user.id,
        });
        setGigs(data.gigs || []);
      } else {
        throw new Error(data.message || "Failed to fetch profile");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndGigs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" color="success" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500">{error}</p>
        <Button color="primary" onPress={fetchProfileAndGigs}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isBordered className="h-16">
        <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-between">
          <NavbarBrand>
            <Image
              src={`${IMAGE_PREFIX}/icon.png`}
              alt="icon"
              width={75}
              height={50}
              className="object-cover"
            />
          </NavbarBrand>
          <NavbarContent justify="center" className="flex gap-8">
            <NavbarItem
              onClick={() => router.push("/home")}
              className="cursor-pointer hover:text-green-600 text-gray-500"
            >
              Home
            </NavbarItem>
            <NavbarItem
              onClick={() => router.push("/chat")}
              className="cursor-pointer hover:text-green-600 text-gray-500"
            >
              Chat
            </NavbarItem>
            <NavbarItem isActive className="cursor-pointer text-green-600">
              Profile
            </NavbarItem>
          </NavbarContent>
        </div>
      </Navbar>

      <div className="max-w-4xl mx-auto px-4 space-y-6 mt-4">
        <Card className="w-full">
          <CardBody className="p-6 space-y-4">
            <div className="flex flex-col items-center gap-4">
              <User
                className="text-black"
                name={profile.name || "User"}
                description={profile.phoneNumber || "No phone number"}
              />
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={20} />
                <span>{profile.phoneNumber || "Not provided"}</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">My Gigs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gigs.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center py-8">
                No gigs available.
              </p>
            ) : (
              gigs.map((gig) => (
                <Card
                  key={gig.id}
                  isPressable
                  onPress={() => router.push(`/gig?id=${gig.id}`)}
                  className="w-full"
                >
                  <CardBody className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {gig.title}
                        </h3>
                        <p className="text-green-600 font-medium">
                          ₩{gig.price.toLocaleString()}
                        </p>
                        <span className="text-sm text-gray-500">
                          {gig.category}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        </div>

        <Button
          color="danger"
          variant="flat"
          startContent={<LogOut size={20} />}
          className="w-full"
          onPress={onOpen}
        >
          Logout
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent className="text-black">
            <ModalHeader>Confirm Logout</ModalHeader>
            <ModalBody>Are you sure you want to logout?</ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="danger" onPress={handleLogout}>
                Logout
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
