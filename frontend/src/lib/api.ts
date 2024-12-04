import { hc } from "hono/client";
import type { ApiRoutes } from "@server/app";

const client = hc<ApiRoutes>("http://localhost:3000");

export const api = client.api;
