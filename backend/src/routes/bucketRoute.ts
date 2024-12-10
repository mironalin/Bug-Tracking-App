import { Hono } from "hono";
import { auth } from "../lib/auth.js";
import AWS from "aws-sdk";
import "dotenv/config";

AWS.config.update({
  accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
  secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY,
  region: process.env.AMAZON_REGION,
});

const s3 = new AWS.S3();

export const bucketRoute = new Hono<{
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
  .post("/", async (c) => {
    try {
      const user = c.get("user");
      if (!user) return c.body(null, 401);

      const { fileName, fileType } = await c.req.json();

      if (!fileName || !fileType) {
        return c.json({ error: "Missing fileName or fileType" }, 400);
      }

      const bucketName = process.env.AMAZON_BUCKET_NAME;
      const key = `uploads/${user.id}/${fileName}`;

      const params = {
        Bucket: bucketName,
        Fields: {
          key,
        },
        Conditions: [
          { bucket: bucketName },
          ["starts-with", "$key", `uploads/${user.id}`],
          ["content-length-range", 0, 10485760],
        ],
        Expires: 300,
      };

      const presignedPost = s3.createPresignedPost(params);

      return c.json(presignedPost);
    } catch (error) {
      console.error("Error generating pre-signed URL:", error);
      return c.json({ error: "Could not generate pre-signed URL" }, 500);
    }
  });