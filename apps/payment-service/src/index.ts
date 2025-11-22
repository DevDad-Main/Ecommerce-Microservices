import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { arch } from "os";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const start = async () => {
  try {
    serve(
      {
        fetch: app.fetch,
        port: 8002,
      },
      (info) => {
        console.log(`Payment Service is running on port ${info.port}`);
      },
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
