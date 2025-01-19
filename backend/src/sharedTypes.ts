import {
  insertWorkspacesSchema,
  selectWorkspacesSchema,
  updateWorkspacesSchema,
} from "./db/schema/workspaces-schema.js";
import { selectMembersSchema } from "./db/schema/members-schema.js";
import { insertProjectsSchema, selectProjectsSchema, updateProjectsSchema } from "./db/schema/projects-schema.js";
import { insertTasksSchema, selectTasksSchema } from "./db/schema/tasks-schema.js";
import { z } from "zod";

export const createWorkspaceSchema = insertWorkspacesSchema.omit({
  userId: true,
  createdAt: true,
  updatedAt: true,
  id: true,
  slug: true,
  inviteCode: true,
});

export const createProjectSchema = insertProjectsSchema.omit({
  createdAt: true,
  updatedAt: true,
  id: true,
  slug: true,
});

export const createTasksSchema = insertTasksSchema.omit({
  createdAt: true,
  updatedAt: true,
  id: true,
  slug: true,
});

export const selectAssigneeSchema = selectMembersSchema.extend({
  name: z.string(),
  email: z.string(),
});

export const selectPopulatedTasksSchema = selectTasksSchema.extend({
  project: selectProjectsSchema,
  assignee: selectAssigneeSchema,
});

export type CreateWorkspace = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspace = z.infer<typeof updateWorkspacesSchema>;
export type CreateProject = z.infer<typeof createProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectsSchema>;
export type CreateTask = z.infer<typeof createTasksSchema>;
export type WorkspaceTypeInterface = z.infer<typeof selectWorkspacesSchema>;
export type MemberTypeInterface = z.infer<typeof selectMembersSchema>;
export type ProjectTypeInterface = z.infer<typeof selectProjectsSchema>;
export type AssigneeTypeInterface = z.infer<typeof selectAssigneeSchema>;
export type TaskTypeInterface = z.infer<typeof selectTasksSchema>;
export type PopulatedTaskTypeInterface = z.infer<typeof selectPopulatedTasksSchema>;
export enum MemberRole {
  ADMIN = "admin",
  MEMBER = "member",
}

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}
