import "dotenv/config";
export { connection } from "./configs/client";
import mongoose from "mongoose";

let isConnected = false;

(async () => {
  if (isConnected) return;

  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is not defined in env file!");
  }

  try {
    await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
    throw error;
  }
})();

//#region Stripe Product Creation Exports
export {
  addStripeProductUploadJob,
  stripeSuccessfulProductQueue,
} from "./queues/products/ProductCreation/stripeProductCreation.queue";
export { stripeProductWorker } from "./queues/products/ProductCreation/stripeProductCreation.worker";
export type {
  StripeProductUploadJobData,
  StripeProductUploadJobReturnData,
} from "./queues/products/ProductCreation/stripeProductCreation.types";
//#endregion

//#region Stripe Product Deletion Exports
export {
  addStripeProductDeletionJob,
  stripeProductDeletionQueue,
} from "./queues/products/ProductDeletion/stripeProductDeletion.queue";
export { stripeProductDeleteWorker } from "./queues/products/ProductDeletion/stripeProductDeletion.worker";
export type { StripeProductDeletionJobData } from "./queues/products/ProductDeletion/stripeProductDeletion.types";
//#endregion

//#region Stripe Successful Payment Order Exports
export {
  addStripeSuccessfulPaymentOrderJob,
  stripeSuccessfulPaymentQueue,
} from "./queues/products/OrderCreation/stripeSuccessfullPaymentOrder.queue";
export { stripeSuccessfulPaymentWorker } from "./queues/products/OrderCreation/stripeSuccessfullPaymentOrder.worker";
//#endregion

console.log("All BullMQ workers started...");
