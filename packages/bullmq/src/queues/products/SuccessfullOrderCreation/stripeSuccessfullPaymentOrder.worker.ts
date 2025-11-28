import { Worker } from "bullmq";
import { connection } from "../../../configs/client";
import { createOrder } from "../../../utils/createOrder.utils";
import { OrderType } from "@repo/types";

export const stripeSuccessfulPaymentWorker = new Worker<OrderType>(
  "stripe-payment-success-order",
  async (job): Promise<void> => {
    const { userId, email, amount, status, products } = job.data;
    job.log(`Received Job Data: ${job.data}`);
    const order = job.data;
    job.log("Creating Order...");
    await createOrder(order);

    job.log(`Order created for User: → ${order.userId}`);
  },
  { connection },
);

stripeSuccessfulPaymentWorker.on("failed", (job, err) => {
  console.error(`Order job ${job?.id} failed:`, err.message);
});

stripeSuccessfulPaymentWorker.on("completed", (job) => {
  console.log(`Order job ${job.id} completed for User: → ${job.data.userId}`);
});
