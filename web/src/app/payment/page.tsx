"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Role } from "@/types/user";

const PaymentPage = () => {
  const [plan, setPlan] = useState<{ type: Role | null; valid: boolean }>({
    type: null,
    valid: false,
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const planParam = searchParams.get("plan");

    if (
      planParam &&
      Object.values(Role).includes(planParam.toUpperCase() as Role) &&
      planParam !== Role.USER &&
      planParam !== Role.ADMIN
    ) {
      setPlan({ type: planParam.toUpperCase() as Role, valid: true });
    } else {
      setPlan({ type: null, valid: false });
    }
  }, [searchParams]);

  return (
    <div className="flex justify-center items-center h-screen">
      {plan.valid ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-blackho">
            Subscribe to {plan.type}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            You are about to subscribe to the {plan.type} plan. Click the button
            below to proceed.
          </p>
          <button
            onClick={() => router.push(`/payment/`)}
            className="mt-8 bg-primary text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition hover:bg-primary/90"
          >
            Subscribe to {plan.type}
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-blackho">Invalid Plan</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The plan you are trying to subscribe to is invalid. Please try
            again.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
