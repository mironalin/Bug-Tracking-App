import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import "./index.css";

import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext, useSession } from "./lib/auth-client";

const queryClient = new QueryClient();

const router = createRouter({ routeTree, context: { auth: undefined! } });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

let resolveAuthClient: (client: AuthContext) => void;
export const authSession: Promise<AuthContext> = new Promise((resolve) => {
  resolveAuthClient = resolve;
});

function App() {
  const auth = useSession();
  useEffect(() => {
    if (auth.isPending) return;
    resolveAuthClient(auth);
  }, [auth, auth.isPending]);
  return <RouterProvider router={router} context={{ auth: authSession }} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
