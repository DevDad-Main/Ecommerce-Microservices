import GenericQueue from "../StripeQueue";
import type { StripeProductDeletionJobData } from "./stripeProductDeletion.types.ts";

const stripeProductDeletionQueue = GenericQueue.getQueue<
  StripeProductDeletionJobData,
  any,
  "process-stripe-product-deletion"
>("stripe-product-deletion", {
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export const stripeSuccessfulDeletionQueue =
  stripeProductDeletionQueue.rawQueue;

export const addStripeProductDeletionJob = (
  data: StripeProductDeletionJobData,
  opts?: Parameters<typeof stripeProductDeletionQueue.add>[2],
) => {
  return stripeProductDeletionQueue.add(
    "process-stripe-product-deletion",
    data,
    {
      ...opts,
    },
  );
};
