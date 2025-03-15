"use client";

import ApiClient from "@/api";
import type { StripeResponse } from "@/types/payment";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Spinner,
  Progress,
} from "@heroui/react";
import { useFormat } from "@/hooks/useFormat";

const apiClient = new ApiClient();

const Subscriptions = () => {
  const [currentSubscription, setCurrentSubscription] =
    useState<StripeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const { formatDate, formatAmount } = useFormat();

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = () => {
    apiClient.payment.helper
      .getCurrentSubscription()
      .then((response) => {
        if (response.status) {
          setCurrentSubscription(response.data);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "trialing":
        return "primary";
      case "past_due":
        return "warning";
      case "canceled":
        return "danger";
      default:
        return "default";
    }
  };

  // Calculate days remaining in subscription
  const getDaysRemaining = (endTimestamp: number) => {
    const now = new Date();
    const end = new Date(endTimestamp * 1000);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate percentage of subscription period completed
  const getProgressPercentage = (
    startTimestamp: number,
    endTimestamp: number
  ) => {
    const now = new Date().getTime();
    const start = startTimestamp * 1000;
    const end = endTimestamp * 1000;
    const total = end - start;
    const elapsed = now - start;
    return Math.min(Math.max(Math.floor((elapsed / total) * 100), 0), 100);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Spinner size="lg" color="primary" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 text-primary font-medium"
          >
            Deine Abonnementdaten werden geladen...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!currentSubscription) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-md overflow-hidden border-none bg-white shadow-xl">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
            />
            <CardBody className="flex flex-col items-center gap-6 py-10 relative z-10">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.3,
                }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-xl opacity-30" />
                <Icon
                  icon="solar:sad-circle-bold"
                  className="w-24 h-24 text-purple-500 relative z-10"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-center"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Kein aktives Abonnement
                </h2>
                <p className="text-gray-600 mb-6">
                  Du hast derzeit kein aktives Abonnement. Entdecke unsere Pläne
                  und genieße alle Premium-Funktionen.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    color="primary"
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-blue-500 font-medium text-white shadow-lg"
                    startContent={
                      <Icon icon="solar:star-bold" className="w-5 h-5" />
                    }
                  >
                    Pläne entdecken
                  </Button>
                </motion.div>
              </motion.div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    );
  }

  const { subscription, product, paymentMethod } = currentSubscription;
  const daysRemaining = getDaysRemaining(subscription.current_period_end);
  const progressPercentage = getProgressPercentage(
    subscription.current_period_start,
    subscription.current_period_end
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const tabVariants = {
    inactive: { opacity: 0.7, y: 0 },
    active: { opacity: 1, y: 0, scale: 1.05 },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto"
      >
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-black">Your subscription</h1>
          <p className="text-gray-500 mt-2">
            Manage your {product.name} subscription
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-none shadow-xl bg-white">
            <div className="p-6 pt-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white shadow-md px-9 py-2 rounded-3xl">
                      <h2 className="text-2xl font-bold text-gray-800">
                        {product.name} Plan
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Chip
                          color={getStatusColor(subscription.status)}
                          variant="flat"
                          size="sm"
                        >
                          {subscription.status.charAt(0).toUpperCase() +
                            subscription.status.slice(1)}
                        </Chip>
                        {subscription.cancel_at_period_end && (
                          <Chip color="warning" variant="flat" size="sm">
                            Ends at{" "}
                            {formatDate(subscription.current_period_end)}
                          </Chip>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mt-4 md:mt-0"
                >
                  <div className="flex items-center justify-center md:justify-end gap-2">
                    <div className="bg-gradient-to-r from-blue-500 to-violet-500 p-[1px] rounded-full">
                      <div className="bg-white rounded-full px-4 py-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                          {formatAmount(
                            subscription.plan.amount / 100,
                            subscription.currency
                          )}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">
                          / {subscription.plan.interval}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="flex justify-center mb-6">
                <div className="flex space-x-4 bg-gray-100 rounded-full p-1">
                  <motion.button
                    variants={tabVariants}
                    animate={activeTab === "details" ? "active" : "inactive"}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab("details")}
                    className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                      activeTab === "details"
                        ? "bg-white shadow-md"
                        : "text-gray-500"
                    }`}
                  >
                    <Icon icon="solar:info-circle-linear" className="w-4 h-4" />
                    <span>Details</span>
                  </motion.button>

                  <motion.button
                    variants={tabVariants}
                    animate={activeTab === "billing" ? "active" : "inactive"}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab("billing")}
                    className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                      activeTab === "billing"
                        ? "bg-white shadow-md"
                        : "text-gray-500"
                    }`}
                  >
                    <Icon icon="solar:card-bold" className="w-4 h-4" />
                    <span>Abrechnung</span>
                  </motion.button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "details" && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-500">
                            Subscription period
                          </span>
                          <span className="text-sm font-medium">
                            {daysRemaining} days remaining
                          </span>
                        </div>
                        <Progress
                          value={progressPercentage}
                          size="md"
                          radius="full"
                          classNames={{
                            indicator:
                              "bg-gradient-to-r from-purple-500 to-blue-500",
                          }}
                        />
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>
                            {formatDate(subscription.current_period_start)}
                          </span>
                          <span>
                            {formatDate(subscription.current_period_end)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                          variants={itemVariants}
                          className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-3">
                            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-2 rounded-lg">
                              <Icon
                                icon="solar:calendar-bold"
                                className="w-6 h-6 text-purple-500"
                              />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Next settlement
                              </p>
                              <p className="font-semibold">
                                {formatDate(subscription.current_period_end)}
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          variants={itemVariants}
                          className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-3">
                            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-2 rounded-lg">
                              <Icon
                                icon="solar:calendar-mark-bold"
                                className="w-6 h-6 text-blue-500"
                              />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Subscribed since
                              </p>
                              <p className="font-semibold">
                                {formatDate(subscription.current_period_start)}
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          variants={itemVariants}
                          className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-3">
                            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-2 rounded-lg">
                              <Icon
                                icon="solar:refresh-circle-bold"
                                className="w-6 h-6 text-green-500"
                              />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Billing cycle
                              </p>
                              <p className="font-semibold capitalize">
                                {subscription.plan.interval_count === 1
                                  ? ""
                                  : subscription.plan.interval_count}{" "}
                                {subscription.plan.interval === "month"
                                  ? "Monthly"
                                  : "Yearly"}
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          variants={itemVariants}
                          className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-3">
                            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-2 rounded-lg">
                              <Icon
                                icon="solar:card-recive-bold"
                                className="w-6 h-6 text-orange-500"
                              />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Payment method
                              </p>
                              <p className="font-semibold">
                                {paymentMethod.type === "card"
                                  ? `•••• •••• •••• ${paymentMethod.card.last4}`
                                  : "PayPal"}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "billing" && (
                  <motion.div
                    key="billing"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">
                          Zahlungsübersicht
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-500">Abonnement</span>
                            <span className="font-medium">{product.name}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-500">Preis</span>
                            <span className="font-medium">
                              {formatAmount(
                                subscription.plan.amount / 100,
                                subscription.currency
                              )}{" "}
                              / {subscription.plan.interval}
                            </span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-500">
                              Next settlement
                            </span>
                            <span className="font-medium">
                              {formatDate(subscription.current_period_end)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">
                              Zahlungsmethode
                            </span>
                            <span className="font-medium">
                              {subscription.default_payment_method
                                ? "Kreditkarte •••• 0000"
                                : "Keine Zahlungsmethode"}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1"
                          >
                            <Button
                              color="primary"
                              variant="flat"
                              className="w-full"
                              startContent={
                                <Icon
                                  icon="solar:card-edit-bold"
                                  className="w-4 h-4"
                                />
                              }
                            >
                              Zahlungsmethode ändern
                            </Button>
                          </motion.div>

                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1"
                          >
                            <Button
                              color="primary"
                              variant="flat"
                              className="w-full"
                              startContent={
                                <Icon
                                  icon="solar:document-text-bold"
                                  className="w-4 h-4"
                                />
                              }
                            >
                              Rechnungen anzeigen
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <CardFooter className="flex justify-between px-6 py-4 bg-gray-50">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  color="primary"
                  variant="flat"
                  startContent={
                    <Icon icon="solar:star-bold" className="w-4 h-4" />
                  }
                >
                  Upgrade Plan
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  color="danger"
                  variant="flat"
                  startContent={
                    <Icon icon="solar:close-circle-bold" className="w-4 h-4" />
                  }
                  isDisabled={
                    subscription.status === "canceled" ||
                    subscription.cancel_at_period_end
                  }
                  id="cancel-subscription-button"
                >
                  Abonnement kündigen
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Subscriptions;
