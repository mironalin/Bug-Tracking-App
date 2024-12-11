import { Hono } from "hono";
import { auth } from "../lib/auth.js";
import { getSessionAndUser } from "../middleware/get-session-and-user.js";

export const meRoute = new Hono().get("/", getSessionAndUser, async (c) => {
  const session = c.var.session;
  const user = c.var.user;
  return c.json({
    session,
    user,
  });
});
