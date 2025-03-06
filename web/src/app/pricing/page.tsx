"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Button,
  Slider,
  Chip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { Role } from "@/types/user";

const PricingPage = () => {
  const [clientCount, setClientCount] = useState(60);
  const [customPrice, setCustomPrice] = useState(80);
  const router = useRouter();

  const calculatePrice = (clients: number) => {
    const baseClients = 60;
    const basePrice = 80;
    const pricePerClient = 0.4;

    return Math.round(basePrice + (clients - baseClients) * pricePerClient);
  };

  const handleSliderChange = (value: number | number[]) => {
    const newValue = Array.isArray(value) ? value[0] : value;
    setClientCount(newValue);
    setCustomPrice(calculatePrice(newValue));
  };

  const handleSubscribe = (plan: Role) => {
    router.push(`/payment?plan=${plan.toLowerCase()}`);
  };

  return (
    <div className="container mx-auto px-4 py-12 h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-blackho">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Select the perfect plan for your needs. Upgrade anytime as your
          business grows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Premium Plan */}
        <Card className="p-4 border-2 border-transparent hover:border-primary/20 transition-all">
          <CardHeader className="flex flex-col items-start gap-2 pb-0">
            <Chip
              color="primary"
              variant="flat"
              startContent={<Icon icon="mdi:star" className="h-4 w-4" />}
            >
              PREMIUM
            </Chip>
            <div className="flex items-baseline mt-3">
              <span className="text-4xl font-bold">$20</span>
              <span className="text-small text-default-500 ml-1">/month</span>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-default-500 mb-4">
              Perfect for small businesses and startups.
            </p>
            <Divider className="my-4" />
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Icon icon="mdi:check" className="h-5 w-5 text-primary" />
                <span>Up to 20 clients</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon icon="mdi:check" className="h-5 w-5 text-primary" />
                <span>Basic analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon icon="mdi:check" className="h-5 w-5 text-primary" />
                <span>Email support</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon icon="mdi:check" className="h-5 w-5 text-primary" />
                <span>Better performance</span>
              </li>
            </ul>
          </CardBody>
          <CardFooter>
            <Button
              color="primary"
              className="w-full"
              size="lg"
              onPress={() => handleSubscribe(Role.PREMIUM)}
            >
              Get Started
            </Button>
          </CardFooter>
        </Card>

        {/* VIP Plan */}
        <Card className="p-4 border-2 border-primary shadow-lg relative">
          <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
            MOST POPULAR
          </div>
          <CardHeader className="flex flex-col items-start gap-2 pb-0">
            <Chip
              color="primary"
              variant="solid"
              startContent={<Icon icon="mdi:crown" className="h-4 w-4" />}
            >
              VIP
            </Chip>
            <div className="flex items-baseline mt-3">
              <span className="text-4xl font-bold">$50</span>
              <span className="text-small text-default-500 ml-1">/month</span>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-default-500 mb-4">
              For growing businesses with advanced needs.
            </p>
            <Divider className="my-4" />
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Icon icon="mdi:check" className="h-5 w-5 text-primary" />
                <span>Up to 50 clients</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon icon="mdi:check" className="h-5 w-5 text-primary" />
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon icon="mdi:check" className="h-5 w-5 text-primary" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon icon="mdi:check" className="h-5 w-5 text-primary" />
                <span>Best performance</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon icon="mdi:check" className="h-5 w-5 text-primary" />
                <span>Custom reporting</span>
              </li>
            </ul>
          </CardBody>
          <CardFooter>
            <Button
              color="primary"
              className="w-full"
              size="lg"
              onPress={() => handleSubscribe(Role.VIP)}
            >
              Get Started
            </Button>
          </CardFooter>
        </Card>

        {/* Custom Plan */}
        <Card className="p-4 border-2 border-transparent hover:border-primary/20 transition-all">
          <CardHeader className="flex flex-col items-start gap-2 pb-0">
            <Chip
              color="secondary"
              variant="flat"
              startContent={
                <Icon icon="mdi:account-group" className="h-4 w-4" />
              }
            >
              CUSTOM
            </Chip>
            <div className="flex items-baseline mt-3">
              <span className="text-4xl font-bold">${customPrice}</span>
              <span className="text-small text-default-500 ml-1">/month</span>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-default-500 mb-4">
              Tailored to your exact requirements.
            </p>
            <Divider className="my-4" />

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm">Client Limit</span>
                <span className="text-sm font-semibold">
                  {clientCount} clients
                </span>
              </div>
              <Slider
                size="sm"
                step={10}
                minValue={60}
                maxValue={200}
                defaultValue={60}
                value={clientCount}
                onChange={handleSliderChange}
                className="max-w-full"
                color="secondary"
                aria-label="Client limit slider"
                showSteps={true}
                marks={[
                  { value: 60, label: "60" },
                  { value: 100, label: "100" },
                  { value: 150, label: "150" },
                  { value: 200, label: "200" },
                ]}
              />
            </div>

            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Icon icon="mdi:check" className="h-5 w-5 text-primary" />
                <span>Up to {clientCount} clients</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon icon="mdi:check" className="h-5 w-5 text-primary" />
                <span>Full analytics suite</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon icon="mdi:check" className="h-5 w-5 text-primary" />
                <span>24/7 dedicated support</span>
              </li>
            </ul>
          </CardBody>
          <CardFooter>
            <Button
              color="secondary"
              className="w-full"
              size="lg"
              aria-label="Subscribe to custom plan"
              startContent={<Icon icon="mdi:credit-card" className="h-4 w-4" />}
            >
              Subscribe Now
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-16 text-center">
        <p className="text-default-500">
          All plans include a 14-day free trial. No credit card required.
        </p>
        <p className="mt-2">
          <Button
            variant="light"
            color="primary"
            onPress={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </p>
      </div>
    </div>
  );
};

export default PricingPage;
