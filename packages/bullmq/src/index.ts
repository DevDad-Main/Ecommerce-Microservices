import "dotenv/config";
export { connection } from "./configs/client";

//#region Stripe Product Creation Exports
export {
  addStripeProductUploadJob,
  stripeProductQueue,
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
} from "./queues/products/SuccessfullOrderCreation/stripeSuccessfullPaymentOrder.queue";
export { stripeSuccessfulPaymentWorker } from "./queues/products/SuccessfullOrderCreation/stripeSuccessfullPaymentOrder.worker";
//#endregion

console.log("All BullMQ workers started...");
