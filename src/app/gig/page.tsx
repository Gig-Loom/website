"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Star, StarHalf, MessageCircle, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { BASE_URL } from "../BASE_URL";

type Gig = {
  id: string;
  creator: string;
  title: string;
  category: string;
  description: string;
  images: string[];
  location: string;
  price: string;
  number_of_raters: string;
  rating: string;
  created_at: Date;
  updated_at: Date;
};

export default function GigDetailsPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <Spinner color="success" size="lg" />
        </div>
      }
    >
      <GigDetails />
    </Suspense>
  );
}

function GigDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gigId = searchParams.get("id");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [gigDetails, setGigDetails] = useState<Gig | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchGigDetails();
    getCurrentUser();
  }, []);

  const handleAuthError = () => {
    localStorage.removeItem("userInfo");
    router.push("/login");
  };

  const getCurrentUser = async () => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) return;

    const { token } = JSON.parse(userInfo);

    try {
      const response = await fetch(`${BASE_URL}/accounts/get-my-info/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.user.id);
      }
    } catch (error) {
      toast.error("Something went wrong, please try again!");
    }
  };

  const fetchGigDetails = async () => {
    setLoading(true);
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) {
        handleAuthError();
        return;
      }

      const { token } = JSON.parse(userInfo);

      const response = await fetch(`${BASE_URL}/gigs/${gigId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError();
          return;
        }
        throw new Error("Failed to fetch gig details");
      }

      const data = await response.json();
      if (data.success) {
        setGigDetails(data.data);
      } else {
        toast.error(data.message || "Failed to load gig details");
      }
    } catch (error) {
      toast.error("An error occurred while fetching gig details");
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = async () => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) {
        handleAuthError();
        return;
      }

      const { token } = JSON.parse(userInfo);

      const response = await fetch(`${BASE_URL}/chats/chatrooms/create/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gig: gigId }),
      });

      const data = await response.json();
      if (data.success) {
        router.push(`/chatroom?id=${data.data.chat_room_id}`);
      } else {
        toast.error(data.message || "Failed to create chat");
      }
    } catch (error) {
      toast.error("An error occurred while creating the chat");
    }
  };

  const handleDelete = async () => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) {
        handleAuthError();
        return;
      }

      const { token } = JSON.parse(userInfo);

      const response = await fetch(`${BASE_URL}/gigs/delete/${gigId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Gig unlisted successfully.");
        router.push("/home");
      } else {
        toast.error(data.message || "Failed to delete gig");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the gig");
    }
    onClose();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner color="success" size="lg" />
      </div>
    );
  }

  if (!gigDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Gig not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="w-full">
          <CardBody className="gap-8">
            <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={`${BASE_URL}${gigDetails.images[currentImageIndex]}`}
                alt={gigDetails.title}
                fill
                className="object-contain"
              />
              {gigDetails.images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {gigDetails.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        currentImageIndex === index
                          ? "bg-green-600"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {gigDetails.title}
                </h1>
                <p className="text-xl font-semibold text-green-600 mt-2">
                  ₩{gigDetails.price.toLocaleString()}
                </p>
              </div>

              <Chip className="bg-green-100 text-green-800">
                {gigDetails.category}
              </Chip>

              {gigDetails.rating &&
                parseInt(gigDetails.number_of_raters) > 0 && (
                  <div className="flex items-center gap-1">
                    {[...Array(Math.floor(parseFloat(gigDetails.rating)))].map(
                      (_, i) => (
                        <Star
                          key={`full-${i}`}
                          className="fill-yellow-400 text-yellow-400"
                          size={20}
                        />
                      )
                    )}
                    {parseFloat(gigDetails.rating) % 1 >= 0.5 && (
                      <StarHalf
                        className="fill-yellow-400 text-yellow-400"
                        size={20}
                      />
                    )}
                    {[
                      ...Array(5 - Math.ceil(parseFloat(gigDetails.rating))),
                    ].map((_, i) => (
                      <Star
                        key={`empty-${i}`}
                        className="text-yellow-400"
                        size={20}
                      />
                    ))}
                    <span className="ml-2 text-gray-600">
                      {gigDetails.rating} ({gigDetails.number_of_raters}{" "}
                      ratings)
                    </span>
                  </div>
                )}

              <p className="text-gray-600 whitespace-pre-wrap">
                {gigDetails.description}
              </p>

              {/* Action Buttons */}
              {currentUser && gigDetails.creator === currentUser ? (
                <div className="flex gap-4">
                  <Button
                    color="primary"
                    className="flex-1"
                    startContent={<Edit2 size={20} />}
                    onPress={() => router.push(`/create-or-update-gig?id=${gigDetails.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    color="danger"
                    className="flex-1"
                    startContent={<Trash2 size={20} />}
                    onPress={onOpen}
                  >
                    Unlist
                  </Button>
                </div>
              ) : (
                currentUser && (
                  <Button
                    color="success"
                    className="w-full"
                    startContent={<MessageCircle size={20} />}
                    onPress={handleMessage}
                  >
                    Go to Chat
                  </Button>
                )
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent className="text-black">
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            Are you sure you want to unlist this gig? This action cannot be
            undone.
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleDelete}>
              Unlist
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
