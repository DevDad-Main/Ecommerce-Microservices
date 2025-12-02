import "dotenv/config";
import { OrderType } from "@repo/types";
import { Order } from "@repo/order-db";
import { addNewelyCreatedOrderEmailJob } from "@repo/bullmq";

export const createOrder = async (order: OrderType) => {
  const newOrder = new Order(order);

  if (!order) {
    throw new Error("Order is not defined");
  }

  try {
    const order = await newOrder.save();

    await addNewelyCreatedOrderEmailJob({
      toEmail: order.email,
      orderId: order._id.toString(),
      amount: order.amount,
      status: order.status,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
