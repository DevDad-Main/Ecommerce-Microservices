import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { clerkMiddleware } from "@hono/clerk-auth";
import stripe from "./utils/stripe.utils";
import { cors } from "hono/cors";
import sessionRouter from "./routes/session.route";

const app = new Hono();

app.use("*", clerkMiddleware());
app.use("*", cors({ origin: ["http://localhost:3002"] }));

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.route("/sessions", sessionRouter);

//#region Test Stripe Routes
// app.post("/create-stripe-product", async (c) => {
//   const res = await stripe.products.create({
//     id: "123",
//     name: "Test Product",
//     description: "Test Product Description",
//     default_price_data: {
//       currency: "pln",
//       unit_amount: 10 * 100,
//     },
//   });
//
//   return c.json(res);
// });
//
// app.get("/stripe-product-price", async (c) => {
//   const res = await stripe.prices.list({
//     product: "123",
//   });
//
//   return c.json(res);
// });
//#endregion

const start = async () => {
  try {
    serve(
      {
        fetch: app.fetch,
        port: 8002,
      },
      (info) => {
        console.log(`Payment Service is running on port ${info.port}`);
      },
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
