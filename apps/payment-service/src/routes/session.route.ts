import { Hono } from "hono";
import stripe from "../utils/stripe.utils";
import { isUserAuthenticated } from "../middleware/auth.middleware";

const sessionRoute = new Hono();

sessionRoute.post(
  "/create-checkout-session",
  isUserAuthenticated,
  async (c) => {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "pln",
              product_data: {
                name: "T-Shirt",
              },
              unit_amount: 2000,
            },
            quantity: 1,
          },
        ],
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
