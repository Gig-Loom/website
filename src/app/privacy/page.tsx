"use client";

import Image from "next/image";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen">
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 to-green-500 p-4">
        <div className="w-full lg:flex lg:max-w-5xl lg:shadow-2xl lg:rounded-xl lg:min-h-[600px] lg:bg-white">

          <div className="w-full flex items-center justify-center p-8">
            <Card className="w-full md:p-12 lg:shadow-none">
              <CardHeader className="flex flex-col gap-1 pb-6">
                <h1 className="text-3xl font-bold text-center text-gray-800">
                  Privacy Policy
                </h1>
              </CardHeader>

              <CardBody>
                <ScrollShadow className="h-[500px]">
                  <div className="space-y-6 text-gray-700">
                    <p className="leading-relaxed">
                      At GigLoom, we prioritize your privacy and are committed
                      to protecting the personal information you share with us.
                      This Privacy Policy explains how we collect, use, and
                      protect your information when you use our services.
                    </p>

                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-gray-800">
                        1. Information We Collect
                      </h2>
                      <p className="leading-relaxed">
                        We collect various types of information to enhance your
                        experience and improve our services:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>
                          <span className="font-medium">
                            Personal Information:
                          </span>{" "}
                          Including your name, phone number, and payment
                          details.
                        </li>
                        <li>
                          <span className="font-medium">
                            Job-Related Information:
                          </span>{" "}
                          Details about the gigs you post or apply for,
                          including your job preferences, location, and hourly
                          rates.
                        </li>
                        <li>
                          <span className="font-medium">Usage Data:</span>{" "}
                          Information about how you interact with our platform,
                          including device information, IP address, and browsing
                          behavior.
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-gray-800">
                        2. How We Use Your Information
                      </h2>
                      <p className="leading-relaxed">
                        Your information helps us provide and improve our
                        services in the following ways:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>Creating and managing your account</li>
                        <li>
                          Matching you with relevant job opportunities and gig
                          workers
                        </li>
                        <li>Processing payments to compensate workers</li>
                        <li>Providing customer support and resolving issues</li>
                        <li>
                          Improving platform functionality and user experience
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-gray-800">
                        3. Data Security
                      </h2>
                      <p className="leading-relaxed">
                        We implement robust security measures to protect your
                        personal information:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>Industry-standard encryption protocols</li>
                        <li>
                          Secure server practices and regular security audits
                        </li>
                        <li>
                          Strict access controls and authentication measures
                        </li>
                        <li>Regular security updates and monitoring</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-gray-800">
                        4. Your Rights and Choices
                      </h2>
                      <p className="leading-relaxed">
                        You have control over your personal information:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>
                          Access, update, or delete your gig information through
                          your account
                        </li>
                        <li>
                          Opt out of marketing communications via notification
                          preferences
                        </li>
                        <li>Request a copy of your personal data</li>
                        <li>
                          Submit privacy-related questions or concerns to our
                          support team
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-gray-800">
                        5. Updates to Privacy Policy
                      </h2>
                      <p className="leading-relaxed">
                        We may update this Privacy Policy periodically to
                        reflect changes in our practices or for legal,
                        operational, or regulatory reasons. We will notify you
                        of any material changes through the app or via email.
                        Continued use of our services after such modifications
                        constitutes acceptance of the updated Privacy Policy.
                      </p>
                    </div>
                  </div>
                </ScrollShadow>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
