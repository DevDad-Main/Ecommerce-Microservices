import type { StripeProductUploadJobData } from "./stripeProductCreation.types.ts";
import GenericQueue from "../StripeQueue";

const stripeProductQueue = GenericQueue.getQueue<
  StripeProductUploadJobData,
  any,
  "stripe-product-creation-success"
>("stripe-product-creation", {
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export const stripeSuccessfulProductQueue = stripeProductQueue.rawQueue;

export const addStripeProductUploadJob = (
  data: StripeProductUploadJobData,
  opts?: Parameters<typeof stripeProductQueue.add>[2],
) => {
  return stripeProductQueue.add("stripe-product-creation-success", data, {
    jobId: data.id ? `upload:${data.name}:${data.price}` : undefined,
    ...opts,
  });
};
