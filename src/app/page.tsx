"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Input,
  Button,
  Card,
  CardBody,
} from "@nextui-org/react";
import { Search, ArrowRight, Mail } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar
        maxWidth="xl"
        className="bg-white/70 backdrop-blur-md border-b border-gray-200"
      >
        <NavbarBrand className="hidden md:flex">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/icon.png"
              alt="Gigloom Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
            <span className="font-extrabold text-xl text-green-800">
              Gigloom
            </span>
          </Link>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Link
              href="#features"
              className="text-gray-600 hover:text-green-800 font-medium"
            >
              Features
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              href="#about"
              className="text-gray-600 hover:text-green-800 font-medium"
            >
              About
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              href="#contact"
              className="text-gray-600 hover:text-green-800 font-medium"
            >
              Contact
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} href="/login" color="success" variant="flat">
              Login
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <main className="flex flex-col items-center justify-center min-h-screen px-4 pb-16 pt-24">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-6 max-w-3xl">
          Your Gateway to Professional Gig Opportunities
        </h1>

        <div className="relative w-full max-w-2xl mb-8">
          <Image
            src="/gigs.gif"
            alt="Search Icon"
            width={120}
            height={120}
            className="absolute -top-16 -left-16 z-10"
            priority
          />
          <Input
            classNames={{
              base: "h-12",
              mainWrapper: "h-12",
              input: "text-lg",
            }}
            placeholder="Find your next gig opportunity..."
            size="lg"
            startContent={<Search className="text-gray-400" />}
            variant="bordered"
            isDisabled
          />
        </div>

        <p className="text-xl text-gray-700 max-w-2xl text-center mb-8">
          Connect with professional opportunities and talented individuals.
          Create or find the perfect gig that matches your skills and
          requirements.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            as={Link}
            href="/signup"
            color="success"
            className="px-8 py-6 text-lg font-semibold"
            endContent={<ArrowRight />}
          >
            Get Started
          </Button>
          <Button
            as={Link}
            href="/login"
            variant="bordered"
            className="px-8 py-6 text-lg font-semibold text-black"
          >
            Browse Gigs
          </Button>
        </div>
      </main>

      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-green-800 text-center mb-16">
            Why Choose Gigloom
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-50">
              <CardBody className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-4 text-black">
                  Easy Connection
                </h3>
                <p className="text-gray-600">
                  Connect with professionals or clients seamlessly through our
                  intuitive platform.
                </p>
              </CardBody>
            </Card>
            <Card className="bg-gray-50">
              <CardBody className="p-6 text-center ">
                <h3 className="text-xl font-semibold mb-4 text-black">
                  Secure Transactions
                </h3>
                <p className="text-gray-600">
                  Safe and secure payment processing for all your gig
                  transactions.
                </p>
              </CardBody>
            </Card>
            <Card className="bg-gray-50">
              <CardBody className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-4 text-black">
                  Quality Assurance
                </h3>
                <p className="text-gray-600">
                  Verified profiles and rating system to ensure quality service
                  delivery.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      <section id="about" className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-green-800 text-center mb-8">
            About Gigloom
          </h2>
          <p className="text-lg text-gray-600 text-center">
            Gigloom is a professional platform that bridges the gap between
            service providers and clients. We&aposre committed to making the gig
            economy more accessible, efficient, and rewarding for everyone
            involved. Whether you&aposre offering services or seeking professional
            assistance, Gigloom provides the tools and platform you need to
            succeed.
          </p>
        </div>
      </section>

      <section id="contact" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-green-800 text-center mb-12">
            Contact Us
          </h2>
          <Card className="max-w-2xl mx-auto">
            <CardBody className="flex flex-col items-center gap-6 p-8">
              <Mail className="w-10 h-10 text-green-600" />
              <p className="text-lg text-gray-600 text-center">
                Have questions or need assistance? Our team is here to help!
                Reach out to us for any inquiries about our platform.
              </p>
              <Link
                href="mailto:gigloombusiness@gmail.com"
                className="flex items-center gap-2 text-lg text-green-800 hover:bg-green-50 px-4 py-2 rounded-lg transition-colors"
              >
                <Mail className="w-5 h-5" />
                gigloombusiness@gmail.com
              </Link>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Gigloom</h3>
              <p className="text-gray-400 text-sm">
                Your trusted platform for professional gig services.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="flex flex-col gap-2">
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex flex-col gap-2">
                <Link
                  href="#contact"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Contact Us
                </Link>
                <Link
                  href="#about"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  About Us
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © 2025 Gigloom. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
