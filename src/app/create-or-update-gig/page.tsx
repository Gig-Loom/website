"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Textarea,
  Select,
  SelectItem,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { BASE_URL } from "../BASE_URL";
import { categories } from "../constants";

interface ImageAsset {
  uri: string;
  file?: File;
  isNew?: boolean;
}

export default function CreateOrUpdateGigPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gigId = searchParams.get("id");
  const isEditMode = !!gigId;

  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Lifestyle");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [hasNewImages, setHasNewImages] = useState(false);

  useEffect(() => {
    if (isEditMode && gigId) {
      fetchGigData();
    }
  }, [isEditMode, gigId]);

  const fetchGigData = async () => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) {
        toast.error("Please log in again.");
        router.push("/login");
        return;
      }

      const { token } = JSON.parse(userInfo);

      const response = await fetch(
        `${BASE_URL}/gigs/${gigId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to fetch gig data");
      }

      const gig = result.data;
      setTitle(gig.title);
      setDescription(gig.description);
      setPrice(gig.price.toString());
      setCategory(gig.category || "Lifestyle");
      setLocation(gig.location);
      setImages(
        gig.images.map((url: string) => ({
          uri: `${BASE_URL}${url}`,
          isNew: false,
        }))
      );
    } catch (error) {
      toast.error("Something went wrong while fetching gig data");
    }
  };

  const validateNumericInput = (text: string): boolean => {
    return /^\d*\.?\d*$/.test(text);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (files.length > 5) {
      toast.error("You can only upload up to 5 images.");
      return;
    }

    const newImages: ImageAsset[] = Array.from(files).map((file) => ({
      uri: URL.createObjectURL(file),
      file,
      isNew: true,
    }));

    setImages(newImages);
    setHasNewImages(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      if (
        !title.trim() ||
        !description.trim() ||
        !price.trim() ||
        !category.trim() ||
        !location.trim()
      ) {
        toast.error("All fields are required.");
        return;
      }

      if (!validateNumericInput(price)) {
        toast.error("Price must be a valid number.");
        return;
      }

      if (!isEditMode && images.length === 0) {
        toast.error("Please select at least one image.");
        return;
      }

      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) {
        toast.error("Please log in again.");
        router.push("/login");
        return;
      }

      const { token } = JSON.parse(userInfo);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("price", price);
      formData.append("category", category.trim());
      formData.append("location", location.trim());

      if (isEditMode && hasNewImages) {
        formData.append("replace_images", "true");
      }

      if (!isEditMode || hasNewImages) {
        images.forEach((image, index) => {
          if (image.isNew && image.file) {
            formData.append("images", image.file);
          }
        });
      }

      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode
        ? `${BASE_URL}/gigs/update/${gigId}/`
        : `${BASE_URL}/gigs/create/`;

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save gig");
      }

      if (result.success) {
        toast.success(
          isEditMode ? "Gig updated successfully!" : "Gig created successfully!"
        );
        router.push("/home");
      } else {
        throw new Error(result.error || "Failed to save gig");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while saving the gig";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="w-full">
          <CardHeader className="flex flex-col gap-1 px-8 pt-8">
            <h1 className="text-2xl font-semibold text-center text-black">
              {isEditMode ? "Update Gig" : "Create Gig"}
            </h1>
          </CardHeader>

          <CardBody className="gap-6 px-8 pb-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-black">
              <Input
                label="Title"
                value={title}
                onValueChange={setTitle}
                variant="bordered"
                isRequired
              />

              <Textarea
                label="Description"
                value={description}
                onValueChange={setDescription}
                variant="bordered"
                minRows={4}
                isRequired
              />

              <Input
                label="Price"
                value={price}
                onValueChange={(text) =>
                  validateNumericInput(text) && setPrice(text)
                }
                variant="bordered"
                type="number"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">₩</span>
                  </div>
                }
                isRequired
              />

              <Select
                label="Category"
                selectedKeys={[category]}
                onChange={(e) => setCategory(e.target.value)}
                variant="bordered"
                isRequired
              >
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </Select>

              <Input
                label="Location"
                value={location}
                onValueChange={setLocation}
                variant="bordered"
                isRequired
              />

              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  max={5}
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  color="primary"
                  className="w-full bg-blue-500 "
                  startContent={
                    <svg
                      width="800px"
                      height="800px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17 17H17.01M15.6 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H8.4M12 15V4M12 4L15 7M12 4L9 7"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                  onPress={() =>
                    document.getElementById("image-upload")?.click()
                  }
                  isDisabled={isLoading}
                >
                  Pick Image(s) ({images.length}/5)
                </Button>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden"
                    >
                      <Image
                        src={image.uri}
                        alt={`Gig image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                color="primary"
                className="w-full bg-green-600"
                isLoading={isLoading}
              >
                {isEditMode ? "Update Gig" : "Create Gig"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
