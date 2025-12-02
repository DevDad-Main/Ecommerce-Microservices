import { Worker } from "bullmq";
import { connection } from "../../../configs/client";
import type { NewUserEmailJobData } from "./newUserEmail.types";
import sendEmail from "../../../utils/nodemailer.utils";

export const sendNewUserEmailWorker = new Worker<NewUserEmailJobData>(
  "send-new-user-email",
  async (job): Promise<void> => {
    const { toEmail, username } = job.data;

    if ([toEmail, username].some((s) => !s || s.trim() === "")) {
      throw new Error(
        `Invalid job data: Missing Requred Fields: To Email:${toEmail} Username:${username}`,
      );
    }
    job.log(
      `Required Field Received: To Email:${toEmail} Username:${username}`,
    );

    // console.log(`Sending Email To: ${toEmail}`);

    await sendEmail({
      toEmail,
      subject: "Welcome to MicroMart!",
      text: `Welcome ${username}, Your account has been created!`,
    });

    job.log(`Deleted Stripe Prroduct: ${job.id}`);
  },
  { connection },
);

sendNewUserEmailWorker.on("failed", (job, err) => {
  console.error(`Send Email job ${job?.id} failed:`, err.message);
});

sendNewUserEmailWorker.on("completed", (job) => {
  console.log(
    `Send Email job ${job.id} completed → Sent Email To: ${job.data.toEmail}`,
  );
});
