import { Hono } from "hono";
import Stripe from "stripe";
import stripe from "../utils/stripe.utils";
import { addStripeSuccessfulPaymentOrderJob } from "@repo/bullmq";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
const webhookRoute = new Hono();

webhookRoute.post("/stripe", async (c) => {
  const body = await c.req.text();
  const sig = c.req.header("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
  } catch (error) {
    console.log("Webhook Verification Failed: ", error);
    return c.json({ error: "Webhook verification failed" }, 400);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
      );

      await addStripeSuccessfulPaymentOrderJob({
        userId: session.client_reference_id as string,
        email: session.customer_details?.email as string,
        amount: session.amount_total as number,
        status: session.payment_status === "paid" ? "success" : "failed",
        products: lineItems.data?.map((item) => ({
          name: item.description as string,
          quantity: item.quantity as number,
          price: item.price?.unit_amount as number,
        })),
      });
      break;

    default:
      break;
  }

  return c.json({ received: true });
});

export default webhookRoute;
