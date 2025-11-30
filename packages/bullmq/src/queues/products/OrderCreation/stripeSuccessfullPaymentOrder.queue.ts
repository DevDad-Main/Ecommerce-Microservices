import GenericQueue from "../../../configs/GenericQueue";
import { OrderType } from "@repo/types";

const stripePaymentQueue = GenericQueue.getQueue<
  OrderType,
  any,
  "process-payment-success"
>("stripe-payment-success-order", {
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export const stripeSuccessfulPaymentQueue = stripePaymentQueue.rawQueue;

export const addStripeSuccessfulPaymentOrderJob = (
  order: OrderType,
  opts?: Parameters<typeof stripePaymentQueue.add>[2],
) => {
  return stripePaymentQueue.add("process-payment-success", order, {
    jobId: order._id ? `Order:${order._id}` : undefined,
    ...opts,
  });
};
