import "dotenv/config";
import { OrderType } from "@repo/types";
import { Order } from "@repo/order-db";
import mongoose from "mongoose";

export const createOrder = async (order: OrderType) => {
  if (!order) {
    throw new Error("Order is not defined");
  }

  const newOrder = new Order(order);

  try {
    await newOrder.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};
