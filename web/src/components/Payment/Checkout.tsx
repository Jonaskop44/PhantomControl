"use client";
import { FC, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { STRIPE_PUBLIC_KEY } from "@/lib/constants";
import { Role } from "@/types/user";
import ApiClient from "@/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CheckoutProps {
  plan: Role | null;
}

const apiClient = new ApiClient();

const Checkout: FC<CheckoutProps> = ({ plan }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  const router = useRouter();

  useEffect(() => {
    apiClient.payment.helper.createCheckoutSession(plan).then((response) => {
      console.log(response);
      if (response.status) {
        setClientSecret(response.data.client_secret);
      } else if (response.data === 403) {
        router.push("/dashboard");
        toast.warning(
          "You are already subscribed to a plan. Please cancel your current subscription to subscribe to a new plan."
        );
      }
    });
  }, [plan, router]);

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-blackho">
          Subscribe to {plan}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          You are about to subscribe to the {plan} plan. Please enter your
          payment details below to proceed.
        </p>

        <div className="mt-8">
          <EmbeddedCheckout />
        </div>
      </div>
    </EmbeddedCheckoutProvider>
  );
};

export default Checkout;
