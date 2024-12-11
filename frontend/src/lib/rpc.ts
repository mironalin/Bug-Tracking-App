import { hc } from "hono/client";
import type { ApiRoutes } from "@server/app";

// @ts-ignore
const client = hc<ApiRoutes>("http://localhost:3000", {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => {
    return fetch(input, {
      ...init,
      credentials: "include",
      headers: {
        ...init?.headers,
        "Content-Type": "application/json",
      },
    });
  },
});

export const api = client.api;
