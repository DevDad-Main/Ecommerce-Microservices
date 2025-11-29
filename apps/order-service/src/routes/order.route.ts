import { FastifyInstance } from "fastify";
import {
  isAdminAuthenticated,
  isUserAuthenticated,
} from "../middleware/auth.middleware";
import { Order } from "@repo/order-db";
import { startOfMonth, subMonths } from "date-fns";
import { OrderChartType } from "@repo/types";

const MONTHS: Array<string> = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const orderRoute = async (fastify: FastifyInstance) => {
  //#region GET: Get User Orders -> User Dashboard
  fastify.get(
    "/user-orders",
    { preHandler: isUserAuthenticated },
    async (request, reply) => {
      const orders = await Order.find({ userId: request.userId });

      return reply.send(orders);
    },
  );
  //#endregion

  //#region GET: Get All Orders -> Admin Dashboard
  fastify.get(
    "/orders",
    { preHandler: isAdminAuthenticated },
    async (request, reply) => {
      const { limit } = request.query as { limit: number };
      const orders = await Order.find().limit(limit).sort({ createdAt: -1 });

      return reply.send(orders);
    },
  );
  //#endregion

  //#region GET: Get Order Chart
  fastify.get(
    "/order-chart",
    { preHandler: isAdminAuthenticated },
    async (request, reply) => {
      const now = new Date();
      const sixMonthsAgo = startOfMonth(subMonths(now, 5));

      const aggregation = await Order.aggregate([
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

      const results: OrderChartType[] = [];

      for (let i = 5; i >= 0; i--) {
        const d = subMonths(now, i);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;

        const isAMatch = aggregation.find(
          (item) => item.year === year && item.month === month,
        );

        results.push({
          month: MONTHS[month - 1] as string,
          total: isAMatch ? isAMatch.total : 0,
          successful: isAMatch ? isAMatch.successful : 0,
        });
      }

      return reply.send(results);
    },
  );
  //#endregion
};
