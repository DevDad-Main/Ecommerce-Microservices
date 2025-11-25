"use client";

import { useAuth } from "@clerk/nextjs";
import useCartStore from "@/stores/cartStore";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const StripeRedirectButton = () => {
  const { cart } = useCartStore();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const token = await getToken();

      // Call backend to create a Stripe Checkout session
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cart }),
        },
      );

      const data = await res.json();

      console.log("Stripe Created Session: ", data);
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      // Redirect to Stripe's hosted checkout page
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.id,
      });
      if (error) console.error(error);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || cart.length === 0}
      className="w-full mt-4 bg-gray-800 hover:bg-gray-900 transition-all duration-300 text-white p-2 rounded-lg cursor-pointer flex items-center justify-center gap-2"
    >
      {loading ? "Redirecting..." : "Pay with Stripe"}
    </button>
  );
};

export default StripeRedirectButton;
