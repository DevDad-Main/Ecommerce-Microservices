import { Worker } from "bullmq";
import { connection } from "../../../configs/client";
import type { NewelyCreatedOrderJobData } from "./newOrderCreated.types";
import sendEmail from "../../../utils/nodemailer.utils";

export const sendNewelyCreatedOrderEmailWorker =
  new Worker<NewelyCreatedOrderJobData>(
    "send-new-order-email",
    async (job): Promise<void> => {
      const { toEmail, amount, status, orderId } = job.data;
      if (!amount) {
        throw new Error("Invalid job data: Missing Requred Fields: Amount");
      }

      if ([toEmail, status, orderId].some((s) => !s || s.trim() === "")) {
        throw new Error(
          `Invalid job data: Missing Requred Fields: To Email:${toEmail} Username:${status}`,
        );
      }

      job.log(
        `Required Field Received: To Email:${toEmail} Username:${status}`,
      );

      console.log(`Sending Email To: ${toEmail}`);

      await sendEmail({
        toEmail,
        subject: `Order #${orderId} has been created!`,
        text: `Your order has been created! Amount: ${amount} Status: ${status}.`,
      });

      job.log(`Deleted Stripe Prroduct: ${job.id}`);
    },
    { connection },
  );

sendNewelyCreatedOrderEmailWorker.on("failed", (job, err) => {
  console.error(`Send Email job ${job?.id} failed:`, err.message);
});

sendNewelyCreatedOrderEmailWorker.on("completed", (job) => {
  console.log(
    `Send Email job ${job.id} completed → Sent Email To: ${job.data.toEmail}`,
  );
});
