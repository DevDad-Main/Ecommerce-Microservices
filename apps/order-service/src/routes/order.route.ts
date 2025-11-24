import { FastifyInstance } from "fastify";
import { isUserAuthenticated } from "../middleware/auth.middleware";
import { Order } from "@repo/order-db";

export const orderRoute = async (fastify: FastifyInstance) => {
  fastify.get(
    "/user-order",
    { preHandler: isUserAuthenticated },
    async (request, reply) => {
      const orders = await Order.find({ userId: request.userId });

      return reply.send(orders);
    },
  );

  fastify.get("/orders", async (request, reply) => {
    const orders = await Order.find();

    return reply.send(orders);
  });
};
