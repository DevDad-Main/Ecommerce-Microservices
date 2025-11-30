import GenericQueue from "../../../configs/GenericQueue";
import type { NewUserEmailJobData } from "./newUserEmail.types.ts";

const newUserEmailQueue = GenericQueue.getQueue<
  NewUserEmailJobData,
  "send-new-user-welcome-email"
>("send-new-user-email", {
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export const sendNewUserEmailQueue = newUserEmailQueue.rawQueue;

export const addNewUserEmailJob = (
  data: NewUserEmailJobData,
  opts?: Parameters<typeof newUserEmailQueue.add>[2],
) => {
  return newUserEmailQueue.add("process-stripe-product-deletion", data, {
    ...opts,
  });
};
