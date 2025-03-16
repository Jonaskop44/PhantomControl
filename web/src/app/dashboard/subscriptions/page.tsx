"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { Card, CardFooter, Button, Chip } from "@heroui/react";
import { useFormat } from "@/hooks/use-format";
import {
  containerVariants,
  itemVariants,
  tabVariants,
} from "@/components/Dashboard/Subscriptions/animations";
import { useSubscription } from "@/hooks/use-subscription";
import DetailsTab from "@/components/Dashboard/Subscriptions/DetailsTab";
import BillingTab from "@/components/Dashboard/Subscriptions/BillingTab";
import LoadingState from "@/components/Dashboard/Subscriptions/LoadingState";
import EmptyState from "@/components/Dashboard/Subscriptions/EmptyState";

const Subscriptions = () => {
  const [activeTab, setActiveTab] = useState("details");
  const {
    currentSubscription,
    isLoading,
    getDaysRemaining,
    getProgressPercentage,
    getStatusColor,
  } = useSubscription();
  const { formatDate, formatAmount } = useFormat();

  if (isLoading) return <LoadingState />;
  if (!currentSubscription) return <EmptyState />;

  const { subscription, product, paymentMethod } = currentSubscription;
  const daysRemaining = getDaysRemaining(subscription.current_period_end);
  const progressPercentage = getProgressPercentage(
    subscription.current_period_start,
    subscription.current_period_end
  );

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
                    <div className="px-9 py-2">
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
                    <Icon icon="solar:card-linear" className="w-4 h-4" />
                    <span>Billing</span>
                  </motion.button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "details" && (
                  <DetailsTab
                    subscription={subscription}
                    paymentMethod={paymentMethod}
                    daysRemaining={daysRemaining}
                    progressPercentage={progressPercentage}
                  />
                )}

                {activeTab === "billing" && (
                  <BillingTab paymentMethod={paymentMethod} />
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
                    <Icon
                      icon="solar:close-circle-linear"
                      className="w-4 h-4"
                    />
                  }
                  isDisabled={
                    subscription.status === "canceled" ||
                    subscription.cancel_at_period_end
                  }
                  id="cancel-subscription-button"
                >
                  Cancel subscription
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
