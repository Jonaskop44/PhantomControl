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

interface CheckoutProps {
  plan: Role | null;
}

const apiClient = new ApiClient();

const Checkout: FC<CheckoutProps> = ({ plan }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  //   const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  //   const handlePayment = async (paymentIntent: unknown) => {
  //     if (!paymentIntent) return;

  //     setIsPaymentProcessing(true);

  //     try {
  //       // Hier kannst du das Backend anrufen, um die Zahlung zu verarbeiten
  //       console.log("PaymentIntent created:", paymentIntent);

  //       // Zahlungsbestätigung oder Weiterleitung nach erfolgreichem Abschluss
  //       setIsPaymentProcessing(false);
  //     } catch (error) {
  //       console.error("Payment processing failed", error);
  //       setIsPaymentProcessing(false);
  //     }
  //   };

  useEffect(() => {
    apiClient.stripe.helper.createCheckoutSession(plan).then((response) => {
      if (response.status) {
        setClientSecret(response.data.client_secret);
      }
    });
  }, [plan]);

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
