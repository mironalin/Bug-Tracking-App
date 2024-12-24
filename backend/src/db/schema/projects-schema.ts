import { pgTable, text, integer, timestamp, index, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  slug: varchar()
    .$default(() => generateUniqueString(16))
    .notNull(),
  name: text("name").notNull(),
  workspaceId: varchar().notNull(),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const insertProjectsSchema = createInsertSchema(projects, {
  slug: z.string().optional(),
  name: z.string().trim().min(1, "Required"),
  workspaceId: z.string().trim().min(1, "Required"),
  imageUrl: z
    .string()
    .transform((value) => (value === "" ? undefined : value))
    .optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const selectProjectsSchema = createSelectSchema(projects);

export const updateProjectsSchema = createInsertSchema(projects).pick({ name: true, imageUrl: true }).partial();

export function generateUniqueString(length: number = 12): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uniqueString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueString += characters[randomIndex];
  }

  return uniqueString;
}
