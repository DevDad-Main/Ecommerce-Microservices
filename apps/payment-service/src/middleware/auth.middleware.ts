import { getAuth } from "@hono/clerk-auth";
import { createMiddleware } from "hono/factory";
import type { CustomJwtSessionClaims } from "@repo/types";

export const isUserAuthenticated = createMiddleware<{
  Variables: {
    userId: string;
  };
}>(async (c, next) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({
      message: "You are not logged in",
    });
  }

  c.set("userId", auth.userId);

  return next();
});

export const isAdminAuthenticated = createMiddleware<{
  Variables: {
    userId: string;
  };
}>(async (c, next) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({
      message: "You are not logged in",
    });
  }

  const claims = auth.sessionClaims as CustomJwtSessionClaims;

  if (claims.metadata?.role !== "admin") {
    return c.json({
      message: "Unauthorized, You do not have the required role.",
    });
  }

  c.set("userId", auth.userId);

  return next();
});
