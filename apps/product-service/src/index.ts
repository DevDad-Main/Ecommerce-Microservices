import express, { Request, response, Response } from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import productRouter from "./routes/product.route";
import categoryRouter from "./routes/category.route";
import { errorHandler } from "./utils/errorHandler";

//#region Constants
const app = express();
//#endregion

//#region Middlewares
app.use(
  cors({
    origin: ["http://localhost:3002", "http://localhost:3003"],
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

app.get("/test", (req: Request, res: Response) => {
  res.json({
    message: "Product Service is Authenticated",
    userId: req.userId,
  });
});

app.use("/products", productRouter);
app.use("/categories", categoryRouter);
//#endregion

app.use(errorHandler);

app.listen(8000, () => {
  console.log("Product Service is running on port 8000");
});
