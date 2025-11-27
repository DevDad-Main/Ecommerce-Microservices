import "dotenv/config";
import { OrderType } from "@repo/types";
import { Order } from "@repo/order-db";
import mongoose from "mongoose";

export const createOrder = async (order: OrderType) => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("Worker connected to MongoDB");
  }

  const newOrder = new Order(order);

  try {
    await newOrder.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};
