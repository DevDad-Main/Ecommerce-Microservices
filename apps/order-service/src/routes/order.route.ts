import { FastifyInstance } from "fastify";
import {
  isAdminAuthenticated,
  isUserAuthenticated,
} from "../middleware/auth.middleware";
import { Order } from "@repo/order-db";
import { startOfMonth, subMonths } from "date-fns";

export const orderRoute = async (fastify: FastifyInstance) => {
  fastify.get(
    "/user-orders",
    { preHandler: isUserAuthenticated },
    async (request, reply) => {
      const orders = await Order.find({ userId: request.userId });

      return reply.send(orders);
    },
  );

  fastify.get(
    "/orders",
    { preHandler: isAdminAuthenticated },
    async (request, reply) => {
      const orders = await Order.find();

      return reply.send(orders);
    },
  );

  fastify.get(
    "/order-chart",
    { preHandler: isAdminAuthenticated },
    async (request, reply) => {
      const now = new Date();
      const sixMonthsAgo = startOfMonth(subMonths(now, 5));

      const raw = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: sixMonthsAgo,
              $lte: now,
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            total: { $sum: 1 },
            successful: {
              $sum: {
                // returning 1 if status is success else 0
                $cond: [{ $eq: ["$status", "success"] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            total: 1,
            successful: 1,
            month: "$_id.month",
            year: "$_id.year",
          },
        },
        {
          // Ascending order
          $sort: {
            year: 1,
            month: 1,
          },
        },
      ]);
    },
  );
};
