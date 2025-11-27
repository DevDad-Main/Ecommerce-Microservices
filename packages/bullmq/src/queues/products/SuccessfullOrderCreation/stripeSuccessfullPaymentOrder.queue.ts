import { Queue } from "bullmq";
import { connection } from "../../../configs/client";
import { OrderType } from "@repo/types";

class StripeSuccessfulPaymentQueue {
  private static instance: Queue;

  static getQueue(): Queue {
    if (!this.instance) {
      this.instance = new Queue("stripe-payment-success-order", {
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

  static async add(data: OrderType, opts = {}) {
    return this.getQueue().add("stripe-payment-success-order", data, {
      jobId: data._id ? `Delete:${data._id}` : undefined,
      ...opts,
    });
  }
}

export const stripeSuccessfulPaymentQueue =
  StripeSuccessfulPaymentQueue.getQueue();

//NOTE: Again this is one of those issues with javasc/typesc this context, as we loose it when we re-asign so we could add a wrapper arrow function or just use the .bind to bind contexts
export const addStripeSuccessfulPaymentOrderJob =
  StripeSuccessfulPaymentQueue.add.bind(StripeSuccessfulPaymentQueue);
