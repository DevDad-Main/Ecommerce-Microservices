import { Hono } from "hono";
import stripe from "../utils/stripe.utils";
import { isUserAuthenticated } from "../middleware/auth.middleware";
import { CartItemsType } from "@repo/types";
import { getStripeProductPrice } from "../utils/stripeProduct.utils";

const sessionRoute = new Hono();

sessionRoute.post(
  "/create-checkout-session",
  isUserAuthenticated,
  async (c) => {
    const { cart }: { cart: CartItemsType } = await c.req.json();
    const userId = c.get("userId");

    if (!userId) {
      return c.json({ status: 404, message: "User not found" });
    }

    const lineItems = await Promise.all(
      cart.map(async (item) => {
        const unitAmount = await getStripeProductPrice(item.id);
        return {
          price_data: {
            currency: "pln",
            product_data: {
              name: item.name,
            },
            unit_amount: unitAmount as number,
          },
          quantity: item.quantity,
        };
      }),
    );

    try {
      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        client_reference_id: userId,
        mode: "payment",
        ui_mode: "custom",
        return_url:
          "http://localhost:3002/return?session_id={CHECKOUT_SESSION_ID}",
      });

      console.log(session);

      return c.json({ checkoutSessionClientSecret: session.client_secret });
    } catch (error) {
      console.log(error);
      return c.json(error);
    }
  },
);

export default sessionRoute;
