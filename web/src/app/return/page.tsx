"use client";

import ApiClient from "@/api";
import Loader from "@/components/Loader";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const apiClient = new ApiClient();

const ReturnPage = () => {
  const [status, setStatus] = useState<boolean>(false);
  const [customer, setCustomer] = useState<string>("");
  const [product, setProduct] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) return;

    apiClient.stripe.helper.getSessionStatus(sessionId).then((response) => {
      if (response.status) {
        setStatus(true);
        setCustomer(response.data.customer);
        setProduct(response.data.product);
      } else {
        router.push("/dashboard");
      }
    });
  }, [searchParams, router]);

  return (
    <>
      {!status ? (
        <Loader />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center items-center h-screen">
            <div className="text-center">
              <motion.h1
                className="text-4xl font-bold mb-4 text-blackho"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Payment successful
              </motion.h1>
              <motion.p
                className="text-xl text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Your payment was successful. You can now access all features of
                the platform.
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ReturnPage;
