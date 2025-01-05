"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen">
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 to-green-500 p-4">
        <div className="w-full lg:flex lg:max-w-5xl lg:shadow-2xl lg:rounded-xl lg:min-h-[600px] lg:bg-white">
          <div className="w-full flex items-center justify-center p-8">
            <Card className="w-full md:p-12 lg:shadow-none">
              <CardHeader className="flex flex-col gap-1 pb-6">
                <h1 className="text-3xl font-bold text-center text-gray-800">
                  Terms of Service
                </h1>
              </CardHeader>

              <CardBody>
                <ScrollShadow className="h-[500px]">
                  <div className="space-y-6 text-gray-700">
                    <p className="leading-relaxed">
                      Welcome to GigLoom! By using our app and services, you
                      agree to be bound by these Terms of Service. Please read
                      these terms carefully before using our platform. If you
                      disagree with any part of these terms, you should not use
                      our services.
                    </p>

                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-gray-800">
                        1. User Responsibilities
                      </h2>
                      <p className="leading-relaxed">
                        By using GigLoom, you agree to provide accurate and
                        truthful information when registering and creating your
                        account. You also commit to keeping your account
                        credentials confidential and notifying us immediately of
                        any unauthorized use. Additionally, you agree to comply
                        with all local, state, and international laws applicable
                        to your activities while using our services and to be
                        respectful and fair in your interactions with other
                        users on the platform.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-gray-800">
                        2. Services Offered
                      </h2>
                      <p className="leading-relaxed">
                        GigLoom provides a platform for workers (gig workers)
                        and clients (employers) to connect and complete tasks or
                        projects in the gig economy. Our platform facilitates
                        the connection between skilled professionals and those
                        seeking their services, ensuring a seamless and
                        efficient marketplace for the gig economy.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-gray-800">
                        3. Payment Terms
                      </h2>
                      <p className="leading-relaxed">
                        GigLoom handles payment transactions between workers and
                        clients. Payments for completed tasks will be processed
                        through our platform. We ensure secure and timely
                        transactions while maintaining transparency throughout
                        the payment process. Our platform implements
                        industry-standard security measures to protect all
                        financial transactions.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-gray-800">
                        4. Platform Usage
                      </h2>
                      <p className="leading-relaxed">
                        Users must utilize the platform in accordance with its
                        intended purpose and maintain professional conduct in
                        all interactions. We reserve the right to suspend or
                        terminate accounts that violate our terms of service or
                        engage in inappropriate behavior.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-gray-800">
                        5. Privacy and Data Protection
                      </h2>
                      <p className="leading-relaxed">
                        We are committed to protecting your privacy and personal
                        data. All information collected through our platform is
                        handled in accordance with our Privacy Policy and
                        applicable data protection laws. Users are encouraged to
                        review our Privacy Policy for detailed information about
                        data handling practices.
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
