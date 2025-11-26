import "dotenv/config";

interface RedisConnection {
  host: string;
  port: number;
  username?: string;
  password?: string;
  tls?: object;
}

//#region Redis Connection
export const connection: RedisConnection = {
  host: process.env.REDIS_HOST!,
  port: Number(process.env.REDIS_PORT!),
  password: process.env.REDIS_PASSWORD!,
  username: process.env.REDIS_USERNAME,
  tls: {}, // ALWAYS enable TLS for Upstash (dev + prod)
};
//#endregion
//
console.log("BullMQ connecting to:", {
  host: connection.host,
  port: connection.port,
  tls: !!connection.tls,
  password: connection.password ? "present" : "missing",
});
