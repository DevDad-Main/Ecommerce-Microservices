import "dotenv/config";

export { connection } from "./configs/client";
export {
  addStripeProductUploadJob,
  stripeProductQueue,
} from "./queues/products/stripeProduct.queue";
export { stripeProductWorker } from "./queues/products/stripeProduct.worker";
export type {
  StripeProductUploadJobData,
  StripeProductUploadJobReturnData,
} from "./queues/products/stripeProduct.types";

console.log("All BullMQ workers started...");
