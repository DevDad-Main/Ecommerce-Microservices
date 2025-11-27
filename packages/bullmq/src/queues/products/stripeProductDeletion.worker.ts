import { Worker } from "bullmq";
import { connection } from "../../configs/client";
import type {
  StripeProductDeletionJobData,
  StripeProductDeletionJobReturnData,
} from "./stripeProductDeletion.types";
import { deleteStripeProduct } from "../../utils/stripeProduct.utils";

export const stripeProductDeleteWorker = new Worker<
  StripeProductDeletionJobData,
  StripeProductDeletionJobReturnData
>(
  "stripe-product-deletion",
  async (job): Promise<StripeProductDeletionJobReturnData> => {
    const { id } = job.data;

    if (!id) {
      throw new Error("Invalid job data: missing id");
    }

    job.log(`Deleting product: ${id}`);

    await deleteStripeProduct(id);

    return { id };
  },
  { connection },
);

stripeProductDeleteWorker.on("failed", (job, err) => {
  console.error(`Delete job ${job?.id} failed:`, err.message);
});

stripeProductDeleteWorker.on("completed", (job) => {
  console.log(`Delete job ${job.id} completed → ${job.data.id}`);
});
