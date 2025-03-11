"use client";

import ApiClient from "@/api";
import {
  Card,
  CardBody,
  Chip,
  Skeleton,
  Tab,
  Tabs,
  Pagination,
} from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { type Key, useEffect, useState } from "react";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import {
  containerVariants,
  headerVariants,
  itemVariants,
} from "@/components/Dashboard/Billing/animations";

interface BillingProps {
  amount_paid: number;
  amount_due: number;
  status: "paid" | "unpaid";
  createdAt: number;
}

type Filter = "all" | "paid" | "open";

const apiClient = new ApiClient();

const Billing = () => {
  const [billing, setBilling] = useState<BillingProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;

  useEffect(() => {
    apiClient.payment.helper.getAllInvoices().then((response) => {
      if (response.status) {
        setBilling(response.data);
        setIsLoading(false);
      } else {
        toast.error("There was an error while getting invoices");
      }
    });
  }, []);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const filteredRecords = billing.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Icon
            icon="solar:bill-list-linear"
            fontSize={30}
            className="text-blue-600"
          />
          <h1 className="text-3xl font-bold text-blackho">Billing History</h1>
        </div>
        <p className="text-gray-500">
          Overview of all invoices and their current status
        </p>
      </motion.div>

      <div className="mb-8">
        <Tabs
          aria-label="Billing filter options"
          selectedKey={filter}
          onSelectionChange={(key: Key) =>
            setFilter(key as "all" | "open" | "paid")
          }
          color="primary"
          variant="underlined"
          classNames={{
            base: "w-full max-w-md",
            tabList: "gap-6",
          }}
        >
          <Tab key="all" title="All" />
          <Tab key="paid" title="Paid" />
          <Tab key="open" title="Open" />
        </Tabs>
      </div>

      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {[1, 2].map((i) => (
            <Card key={i} className="w-full">
              <CardBody className="p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div>
                      <Skeleton className="w-32 h-5 rounded mb-2" />
                      <Skeleton className="w-24 h-4 rounded" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-20 h-6 rounded" />
                    <Skeleton className="w-24 h-7 rounded" />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </motion.div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${filter}-${currentPage}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="space-y-4"
            >
              {currentRecords.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Icon
                      icon="solar:bill-list-linear"
                      className="h-8 w-8 text-gray-500"
                    />
                  </div>
                  <h3 className="text-lg font-medium mb-1">
                    No invoices found
                  </h3>
                  <p className="text-gray-500">
                    No invoices were found with the selected filter.
                  </p>
                </motion.div>
              ) : (
                currentRecords.map((record, index) => (
                  <motion.div
                    key={`${record.createdAt}-${index}`}
                    variants={itemVariants}
                    layout
                    whileHover={{
                      scale: 1.01,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Card className="w-full" shadow="sm" isPressable>
                      <CardBody className="p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex items-center gap-4">
                            <div
                              className={`
                              flex items-center justify-center w-12 h-12 rounded-full
                              ${
                                record.status === "paid"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-amber-100 text-amber-600"
                              }
                            `}
                            >
                              {record.status === "paid" ? (
                                <Icon
                                  icon="solar:check-circle-broken"
                                  className="h-6 w-6"
                                />
                              ) : (
                                <Icon
                                  icon="solar:clock-circle-bold-duotone"
                                  className="h-6 w-6"
                                />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-lg">
                                Invoice #{indexOfFirstRecord + index + 1}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDate(record.createdAt)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 ml-16 sm:ml-0">
                            <Chip
                              color={
                                record.status === "paid" ? "success" : "warning"
                              }
                              variant="flat"
                              className="px-3 py-1"
                            >
                              {record.status === "paid" ? "Paid" : "Open"}
                            </Chip>

                            {/* Clean amount display */}
                            <p className="font-bold text-lg tabular-nums">
                              {formatAmount(
                                record.amount_due > 0
                                  ? record.amount_due
                                  : record.amount_paid
                              )}
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>

          {/* Pagination component */}
          {filteredRecords.length > recordsPerPage && (
            <div className="flex justify-center mt-8">
              <Pagination
                total={totalPages}
                initialPage={1}
                page={currentPage}
                onChange={setCurrentPage}
                color="primary"
                showControls
                showShadow
                size="lg"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Billing;
