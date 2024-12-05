import { Hono } from "hono";
import { auth } from "../lib/auth.js";

export const sessionRoute = new Hono().get("/", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });
  return c.json({ session });
});
