"use client";

import ApiClient from "@/api";
import Loader from "@/components/Loader";
import { Customer, Product } from "@/types/customer";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
} from "@heroui/react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

const apiClient = new ApiClient();
type Status = "SUCCESS" | "LOADING" | "ERROR";

const ReturnPage = () => {
  const [status, setStatus] = useState<Status>("LOADING");
  const [customer, setCustomer] = useState<Customer>();
  const [product, setProduct] = useState<Product>();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) return;

    apiClient.stripe.helper.getSessionStatus(sessionId).then((response) => {
      if (response.status) {
        if (response.data.status === "paid") {
          setStatus("SUCCESS");
        } else {
          setStatus("ERROR");
        }
        setCustomer(response.data.customer);
        setProduct(response.data.product);
      } else {
        router.push("/dashboard");
      }
    });
  }, [searchParams, router]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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

  return (
    <>
      {status === "LOADING" ? (
        <Loader />
      ) : status === "SUCCESS" ? (
        <div className="flex justify-center items-center min-h-screen p-6">
          {/* Animated gradient background */}
          <motion.div
            className="fixed inset-0 bg-gradient-to-br from-primary-50 to-success-50 dark:from-primary-900/30 dark:to-success-900/20 pointer-events-none"
            animate={{
              background: [
                "linear-gradient(to bottom right, rgba(var(--primary-50), 0.3), rgba(var(--success-50), 0.3))",
                "linear-gradient(to bottom right, rgba(var(--success-50), 0.3), rgba(var(--primary-50), 0.3))",
                "linear-gradient(to bottom right, rgba(var(--primary-50), 0.3), rgba(var(--success-50), 0.3))",
              ],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />

          {/* Floating circles */}
          <motion.div
            className="fixed w-64 h-64 rounded-full bg-success-200/20 dark:bg-success-800/10 pointer-events-none"
            animate={{
              x: ["-20vw", "10vw", "-20vw"],
              y: ["-10vh", "30vh", "-10vh"],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="fixed w-96 h-96 rounded-full bg-primary-200/20 dark:bg-primary-800/10 pointer-events-none right-0"
            animate={{
              x: ["10vw", "-20vw", "10vw"],
              y: ["20vh", "-10vh", "20vh"],
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-2xl z-10"
          >
            <Card className="w-full shadow-xl">
              <CardHeader className="flex gap-5 bg-success-50 dark:bg-success-900/20 p-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{
                    scale: 1,
                    rotate: [0, 10, 0, -10, 0],
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.3,
                    rotate: {
                      delay: 1,
                      duration: 2,
                      times: [0, 0.2, 0.5, 0.8, 1],
                      repeat: 1,
                    },
                  }}
                >
                  <Icon
                    icon="akar-icons:check"
                    className="text-success"
                    fontSize={36}
                  />
                </motion.div>
                <div className="flex flex-col">
                  <motion.p
                    variants={itemVariants}
                    className="text-2xl font-bold"
                  >
                    Payment Successful
                  </motion.p>
                  <motion.p
                    variants={itemVariants}
                    className="text-medium text-default-500"
                  >
                    Thank you for your purchase
                  </motion.p>
                </div>
              </CardHeader>

              <CardBody className="p-8">
                <motion.div variants={itemVariants} className="space-y-6">
                  {product && (
                    <div>
                      <h3 className="text-base font-medium text-default-500 mb-2">
                        Product
                      </h3>
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-xl">{product.name}</p>
                        <Chip
                          color="primary"
                          variant="flat"
                          size="lg"
                          className="text-lg px-4 py-2 h-auto"
                        >
                          ${product.price.toFixed(2)}
                        </Chip>
                      </div>
                    </div>
                  )}

                  <Divider className="my-4" />

                  {customer && (
                    <div>
                      <h3 className="text-base font-medium text-default-500 mb-2">
                        Customer Details
                      </h3>
                      <p className="font-semibold text-xl">{customer.name}</p>
                      <p className="text-default-500 text-lg">
                        {customer.email}
                      </p>

                      {customer.address && (
                        <div className="mt-3 text-base text-default-500">
                          <p>{customer.address.line1}</p>
                          {customer.address.line2 && (
                            <p>{customer.address.line2}</p>
                          )}
                          <p>
                            {customer.address.city},{" "}
                            {customer.address.state || ""}{" "}
                            {customer.address.postal_code}
                          </p>
                          <p>{customer.address.country}</p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </CardBody>

              <CardFooter className="p-8">
                <motion.div
                  variants={itemVariants}
                  className="w-full"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    color="primary"
                    endContent={
                      <Icon icon="solar:arrow-right-linear" fontSize={20} />
                    }
                    onClick={() => router.push("/dashboard")}
                    fullWidth
                    size="lg"
                    className="text-lg h-14"
                  >
                    Continue to Dashboard
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Confetti effect on success */}
          {status && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="fixed inset-0 pointer-events-none z-0"
            >
              {Array.from({ length: 50 }).map((_, i) => {
                const size = Math.random() * 15 + 5;
                const color = [
                  "bg-primary-300",
                  "bg-success-300",
                  "bg-primary-200",
                  "bg-success-200",
                ][Math.floor(Math.random() * 4)];

                return (
                  <motion.div
                    key={i}
                    className={`absolute rounded-md ${color}`}
                    style={{
                      width: size,
                      height: size * (Math.random() * 0.8 + 0.2),
                      top: "-5%",
                      left: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      top: "105%",
                      rotate:
                        Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1),
                      x: Math.random() * 100 - 50,
                    }}
                    transition={{
                      duration: Math.random() * 5 + 5,
                      delay: Math.random() * 5,
                      ease: [0.1, 0.4, 0.8, 1],
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: Math.random() * 5,
                    }}
                  />
                );
              })}
            </motion.div>
          )}
        </div>
      ) : (
        <div>
          <h1>Payment Failed</h1>
        </div>
      )}
    </>
  );
};

export default ReturnPage;
