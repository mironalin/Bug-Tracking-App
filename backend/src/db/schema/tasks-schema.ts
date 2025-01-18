import { pgTable, text, integer, timestamp, index, varchar, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const statusEnum = pgEnum("status", ["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]);

enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export const tasks = pgTable("tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  slug: varchar()
    .$default(() => generateUniqueString(16))
    .notNull(),
  name: text("name").notNull(),
  workspaceId: varchar().notNull(),
  projectId: varchar().notNull(),
  assigneeId: varchar().notNull(),
  description: text("description"),
  dueDate: timestamp("dueDate").notNull(),
  status: statusEnum().notNull(),
  position: integer().notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const insertTasksSchema = createInsertSchema(tasks, {
  slug: z.string().optional(),
  name: z.string().trim().min(1, "Required"),
  workspaceId: z.string().trim().min(1, "Required"),
  projectId: z.string().trim().min(1, "Required"),
  assigneeId: z.string().trim().min(1, "Required"),
  description: z.string().optional(),
  dueDate: z.coerce.date(),
  status: z.nativeEnum(TaskStatus, { required_error: "Required" }),
  position: z.number().int().positive().default(1000),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date().default(() => new Date()),
});

export const selectTasksSchema = createSelectSchema(tasks);

export const updateTasksSchema = createInsertSchema(tasks)
  .pick({ name: true, status: true, projectId: true, dueDate: true, assigneeId: true, description: true })
  .partial();

export function generateUniqueString(length: number = 12): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uniqueString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueString += characters[randomIndex];
  }

  return uniqueString;
}
