import { Queue } from "bullmq";
import { connection } from "../../configs/client";
import type { StripeProductUploadJobData } from "./stripeProductCreation.types.ts";

class StripeProductQueue {
  private static instance: Queue;

  static getQueue(): Queue {
    if (!this.instance) {
      this.instance = new Queue("stripe-product-creation", {
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

  static async add(data: StripeProductUploadJobData, opts = {}) {
    return this.getQueue().add("stripe-product-creation", data, {
      jobId: data.id ? `upload:${data.name}:${data.price}` : undefined,
      ...opts,
    });
  }
}

export const stripeProductQueue = StripeProductQueue.getQueue();

//NOTE: Again this is one of those issues with javasc/typesc this context, as we loose it when we re-asign so we could add a wrapper arrow function or just use the .bind to bind contexts
export const addStripeProductUploadJob =
  StripeProductQueue.add.bind(StripeProductQueue);
