import { Hono } from "hono";
import { auth } from "../lib/auth.js";

export const meRoute = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>()
  .use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
  })
  .get("/", async (c) => {
    const session = c.get("session");
    const user = c.get("user");
    return c.json({
      session,
      user,
    });
  });
