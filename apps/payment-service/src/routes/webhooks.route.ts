import { Hono } from "hono";
import Stripe from "stripe";
import stripe from "../utils/stripe.utils";

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

      //TODO: Create Order
      console.log("WEBHOOK RECEIVED", session);
      break;

    default:
      break;
  }

  return c.json({ received: true });
});

export default webhookRoute;
