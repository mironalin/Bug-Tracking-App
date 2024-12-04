import { pgTable, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  repositoryUrl: text("repository_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projectMembers = pgTable("project_members", {
  id: integer("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  userId: text("user_id").notNull(),
  role: text("role").notNull(), // 'PM' or 'TST'
});

export const bugs = pgTable("bugs", {
  id: integer("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  reporterId: text("reporter_id").notNull(),
  assigneeId: text("assignee_id"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(), // 'low', 'medium', 'high', 'critical'
  status: text("status").notNull(), // 'open', 'in_progress', 'resolved', 'closed'
  commitUrl: text("commit_url").notNull(),
  solutionCommitUrl: text("solution_commit_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
