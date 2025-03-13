"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Button,
  Chip,
  Drawer,
  useDisclosure,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { Role } from "@/types/user";
import Checkout from "@/components/Payment/Checkout";

const PricingPage = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<Role | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubscribe = (plan: Role) => {
    setSelectedPlan(plan);
    onOpen();
  };

  return (
    <div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                <span className="text-4xl font-bold">€20</span>
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
                <span className="text-4xl font-bold">€50</span>
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
        </div>

        <div className="mt-16 text-center">
          <p className="text-default-500">
            All plans include a 7-day free trial.
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
      {/* Checkout Drawer */}
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement="right"
        size="lg"
        motionProps={{
          variants: {
            enter: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.3 },
            },
            exit: {
              x: 100,
              opacity: 0,
              transition: { duration: 0.3 },
            },
          },
        }}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader>Subscribing to {selectedPlan} plan</DrawerHeader>
              <DrawerBody>
                <div className="p-6 h-full overflow-y-auto">
                  {selectedPlan && <Checkout plan={selectedPlan} />}
                  <div className="mt-8 text-center">
                    <Button variant="light" onPress={onClose} className="mt-4">
                      Close
                    </Button>
                  </div>
                </div>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default PricingPage;
