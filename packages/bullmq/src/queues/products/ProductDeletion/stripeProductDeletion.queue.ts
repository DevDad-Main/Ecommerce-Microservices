import { Queue } from "bullmq";
import { connection } from "../../../configs/client";
import type { StripeProductDeletionJobData } from "./stripeProductDeletion.types.ts";

class StripeProductQueueDeletion {
  private static instance: Queue;

  static getQueue(): Queue {
    if (!this.instance) {
      this.instance = new Queue("stripe-product-deletion", {
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: "exponential", delay: 5000 },
          removeOnComplete: true,
          removeOnFail: false,
        },
        connection,
      });
    }
    return this.instance;
  }

  static async add(data: StripeProductDeletionJobData, opts = {}) {
    return this.getQueue().add("stripe-product-deletion", data, {
      jobId: data.id ? `Delete:${data.id}` : undefined,
      ...opts,
    });
  }
}

export const stripeProductDeletionQueue = StripeProductQueueDeletion.getQueue();

//NOTE: Again this is one of those issues with javasc/typesc this context, as we loose it when we re-asign so we could add a wrapper arrow function or just use the .bind to bind contexts
export const addStripeProductDeletionJob = StripeProductQueueDeletion.add.bind(
  StripeProductQueueDeletion,
);
