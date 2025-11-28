import express, { Request, response, Response } from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { errorHandler } from "./utils/errorHandler";
import {
  stripeSuccessfulDeletionQueue,
  stripeSuccessfulProductQueue,
  stripeSuccessfulPaymentQueue,
} from "@repo/bullmq";
import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { isUserAuthenticated } from "./middleware/auth.middleware";
import userRouter from "./routes/user.route";

//#region Constants
const app = express();
//#endregion

//#region Middlewares
app.use(
  cors({
    origin: ["http://localhost:3003"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(clerkMiddleware());
//#endregion

//#region End Points
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use("/users", userRouter);
//#endregion

app.use(errorHandler);

app.listen(8003, () => {
  console.log("Authentication Service is running on port 8000");
});
