"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Role } from "@/types/user";
import Checkout from "@/components/Payment/Checkout";
import Loader from "@/components/Loader";

const PaymentPage = () => {
  const [plan, setPlan] = useState<{ type: Role | null; valid: boolean }>({
    type: null,
    valid: false,
  });
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const planParam = searchParams.get("plan");

    if (
      planParam &&
      Object.values(Role).includes(planParam as Role) &&
      planParam !== Role.USER &&
      planParam !== Role.ADMIN
    ) {
      setPlan({ type: planParam as Role, valid: true });
    } else {
      setPlan({ type: null, valid: false });
      router.push("/dashboard");
    }
  }, [searchParams, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      {plan.valid ? <Checkout plan={plan.type} /> : <Loader />}
    </div>
  );
};

export default PaymentPage;
