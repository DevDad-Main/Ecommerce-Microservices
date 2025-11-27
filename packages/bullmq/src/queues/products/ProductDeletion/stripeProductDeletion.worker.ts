import { Worker } from "bullmq";
import { connection } from "../../../configs/client";
import type { StripeProductDeletionJobData } from "./stripeProductDeletion.types";
import { deleteStripeProduct } from "../../../utils/stripeProduct.utils";

export const stripeProductDeleteWorker =
  new Worker<StripeProductDeletionJobData>(
    "stripe-product-deletion",
    async (job): Promise<void> => {
      const { id } = job.data;

      if (!id) {
        throw new Error("Invalid job data: missing id");
      }

      job.log(`Deleting product: ${id}`);

      await deleteStripeProduct(id);

      job.log(`Deleted Stripe Prroduct: ${id}`);
    },
    { connection },
  );

stripeProductDeleteWorker.on("failed", (job, err) => {
  console.error(`Delete job ${job?.id} failed:`, err.message);
});

stripeProductDeleteWorker.on("completed", (job) => {
  console.log(`Delete job ${job.id} completed → ${job.data.id}`);
});
