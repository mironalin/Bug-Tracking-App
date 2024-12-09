import { insertWorkspacesSchema } from "./db/schema/workspaces-schema.js";
import { z } from "zod";

export const createWorkspaceSchema = insertWorkspacesSchema.omit({
  userId: true,
  createdAt: true,
  updatedAt: true,
  id: true,
  slug: true,
});

export type CreateWorkspace = z.infer<typeof createWorkspaceSchema>;
