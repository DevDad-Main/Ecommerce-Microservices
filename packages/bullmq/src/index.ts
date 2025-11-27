import "dotenv/config";
export { connection } from "./configs/client";

//#region Stripe Product Creation Exports
export {
  addStripeProductUploadJob,
  stripeProductQueue,
} from "./queues/products/stripeProductCreation.queue";
export { stripeProductWorker } from "./queues/products/stripeProductCreation.worker";
export type {
  StripeProductUploadJobData,
  StripeProductUploadJobReturnData,
} from "./queues/products/stripeProductCreation.types";
//#endregion

//#region Stripe Product Deletion Exports
export {
  addStripeProductDeletionJob,
  stripeProductDeletionQueue,
} from "./queues/products/stripeProductDeletion.queue";
export { stripeProductDeleteWorker } from "./queues/products/stripeProductDeletion.worker";
export type {
  StripeProductDeletionJobData,
  StripeProductDeletionJobReturnData,
} from "./queues/products/stripeProductDeletion.types";
//#endregion

console.log("All BullMQ workers started...");
