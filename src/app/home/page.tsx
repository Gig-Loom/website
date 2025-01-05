"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardBody,
  Button,
  Input,
  Spinner,
  Dropdown,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { BASE_URL } from "../BASE_URL";
import { categories } from "../constants";

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

export default function HomePage() {
  const router = useRouter();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleAuthError = async () => {
    localStorage.removeItem("userInfo");
    router.push("/login");
  };

  const fetchGigsWithQueries = async () => {
    if (page !== 1 && (page > totalPages || !hasMore)) return;

    setIsLoading(true);
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) {
        handleAuthError();
        return;
      }

      const { token } = JSON.parse(userInfo);

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        search: searchQuery,
        category: selectedCategory === "All" ? "" : selectedCategory,
      }).toString();

      const response = await fetch(`${BASE_URL}/gigs/?${queryParams}`, {
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
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data.success) {
        if (page === 1) setGigs(data.data.gigs);
        else setGigs((prev) => [...prev, ...data.data.gigs]);

        setTotalPages(data.data.totalPages);
        setHasMore(data.data.hasMore);
      } else {
        toast.error(data.message || "Failed to fetch gigs");
      }
    } catch (error) {
      toast.error("An error occurred while fetching gigs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGigsWithQueries();
  }, [selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchGigsWithQueries();
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      if (!isLoading && hasMore) {
        setPage((prev) => prev + 1);
        fetchGigsWithQueries();
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {" "}
      <Navbar isBordered className="h-16">
        <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-between">
          <NavbarBrand>
            <Image
              src="/icon.png"
              alt="icon"
              width={75}
              height={50}
              className="object-cover"
            />
          </NavbarBrand>
          <NavbarContent justify="center" className="flex gap-8">
            <NavbarItem isActive className="cursor-pointer text-green-600 ">
              Home
            </NavbarItem>
            <NavbarItem
              onClick={() => router.push("/chat")}
              className="cursor-pointer hover:text-green-600 text-gray-500"
            >
              Chat
            </NavbarItem>
            <NavbarItem
              onClick={() => router.push("/profile")}
              className="cursor-pointer hover:text-green-600 text-gray-500"
            >
              Profile
            </NavbarItem>
          </NavbarContent>
        </div>
      </Navbar>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <form onSubmit={handleSearch} className="flex items-center gap-4">
          <Input
            placeholder="Search gigs..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            startContent={
              <svg
                aria-hidden="true"
                fill="none"
                focusable="false"
                height="1em"
                role="presentation"
                viewBox="0 0 24 24"
                width="1em"
              >
                <path
                  d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <path
                  d="M22 22L20 20"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            }
            className="flex-1"
          />
          <Button color="primary" type="submit" className="bg-green-600">
            Search
          </Button>

          {/* Category Dropdown */}
          <Dropdown className="text-black">
            <DropdownTrigger className="cursor-pointer text-black ">
              <Button variant="bordered">{selectedCategory}</Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Categories"
              onAction={(key) => setSelectedCategory(key as string)}
            >
              {[...categories].map((category) => (
                <DropdownItem key={category}>{category}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </form>
      </div>
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        onScroll={handleScroll}
      >
        {isLoading && page === 1 ? (
          <div className="flex justify-center items-center h-64">
            <Spinner color="success" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig) => (
              <Card
                key={gig.id}
                isPressable
                onPress={() => router.push(`/gig?id=${gig.id}`)}
                className="hover:shadow-lg transition-shadow"
              >
                <CardBody className="p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src={`${BASE_URL}${gig.images[0]}`}
                      alt={gig.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {gig.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {gig.description}
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      ₩{gig.price.toLocaleString()}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {isLoading && hasMore && page !== 1 && (
          <div className="flex justify-center mt-6">
            <Spinner color="success" />
          </div>
        )}
      </div>
      <Button
        size="lg"
        className="fixed bottom-6 right-6 bg-green-600 text-white rounded-full w-14 h-14 p-0 min-w-0"
        onPress={() => router.push("/create-or-update-gig")}
      >
        <span className="text-2xl">+</span>
      </Button>
    </div>
  );
}
