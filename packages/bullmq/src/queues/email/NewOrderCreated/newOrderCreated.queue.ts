import GenericQueue from "../../../configs/GenericQueue";
import type { NewelyCreatedOrderJobData } from "./newOrderCreated.types.ts";

const newOrderCreatedQueue = GenericQueue.getQueue<
  NewelyCreatedOrderJobData,
  "send-new-order-creation-email"
>("send-new-order-email", {
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export const sendOrderCreatedEmailQueue = newOrderCreatedQueue.rawQueue;

export const addNewelyCreatedOrderEmailJob = (
  data: NewelyCreatedOrderJobData,
  opts?: Parameters<typeof newOrderCreatedQueue.add>[2],
) => {
  return newOrderCreatedQueue.add("send-new-order-email", data, {
    ...opts,
  });
};
