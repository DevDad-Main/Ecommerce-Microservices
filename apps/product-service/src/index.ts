import express, { Request, response, Response } from "express";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";
import productRouter from "./routes/product.route.ts";
import categoryRouter from "./routes/category.route";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3002", "http://localhost:3003"],
    credentials: true,
  }),
);
app.use(clerkMiddleware());

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

app.listen(8000, () => {
  console.log("Product Service is running on port 8000");
});
