import { Worker, type JobsOptions } from "bullmq";
import { connection } from "../../configs/client";
import type {
  StripeProductUploadJobData,
  StripeProductUploadJobReturnData,
} from "./stripeProduct.types";

export const stripeProductWorker = new Worker<
  StripeProductUploadJobData,
  StripeProductUploadJobReturnData
>(
  "stripe-product-creation",
  async (job): Promise<StripeProductUploadJobReturnData> => {
    const { id, name, price } = job.data;

    if (!id || !name || !price) {
      throw new Error("Invalid job data");
    }

    job.log(`Received job: ${job.id}`);
    job.log(`Received Data: ${job.data}`);

    return { id, name, price };
  },
  {
    connection,
  },
);

stripeProductWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});

stripeProductWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed → ${job.data}`);
});
