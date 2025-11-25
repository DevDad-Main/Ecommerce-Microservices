import { Hono } from "hono";
import stripe from "../utils/stripe.utils";
import { isUserAuthenticated } from "../middleware/auth.middleware";
import { CartItemsType } from "@repo/types";
import { getStripeProductPrice } from "../utils/stripeProduct.utils";

const sessionRoute = new Hono();

//#region POST Create Checkout Session
sessionRoute.post(
  "/create-checkout-session",
  isUserAuthenticated,
  async (c) => {
    const { cart }: { cart: CartItemsType } = await c.req.json();
    const userId = c.get("userId");

    if (!userId) {
      return c.json({ message: "User not found" }, 404);
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

    // console.log(lineItems);

    try {
      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        client_reference_id: userId,
        mode: "payment",
        ui_mode: "custom",
        return_url:
          "http://localhost:3002/return?session_id={CHECKOUT_SESSION_ID}",
      });

      console.log("Stripe Created Session: ", session);

      return c.json({ checkoutSessionClientSecret: session.client_secret });
    } catch (error) {
      console.log(error);
      return c.json(error);
    }
  },
);
//#endregion

//#region GET: Get Session ID
sessionRoute.get("/:session_id", async (c) => {
  const { session_id } = c.req.param();
  console.log(session_id);
  const session = await stripe.checkout.sessions.retrieve(
    session_id as string,
    {
      expand: ["line_items"],
    },
  );

  console.log(session);

  return c.json({
    status: session.status,
    paymentStatus: session.payment_status,
  });
});
//#endregion

export default sessionRoute;
