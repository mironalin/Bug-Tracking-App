import { insertWorkspacesSchema, selectWorkspacesSchema } from "./db/schema/workspaces-schema.js";
import { z } from "zod";

export const createWorkspaceSchema = insertWorkspacesSchema.omit({
  userId: true,
  createdAt: true,
  updatedAt: true,
  id: true,
  slug: true,
  inviteCode: true,
});

export type CreateWorkspace = z.infer<typeof createWorkspaceSchema>;
export type WorkspaceTypeInterface = z.infer<typeof selectWorkspacesSchema>;
export enum MemberRole {
  ADMIN = "admin",
  MEMBER = "member",
}
