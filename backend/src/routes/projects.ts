import { Hono } from "hono";
import { z } from "zod";
import { and, desc, eq, gte, lt, lte, ne } from "drizzle-orm";

import { zValidator } from "@hono/zod-validator";

import { getSessionAndUser } from "../middleware/get-session-and-user.js";
import { db } from "../db/index.js";
import { insertProjectsSchema, projects as projectsTable, updateProjectsSchema } from "../db/schema/projects-schema.js";
import { getMember } from "../lib/utils.js";

import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { tasks as tasksTable } from "../db/schema/tasks-schema.js";
import { TaskStatus } from "../sharedTypes.js";

export const projectsRoute = new Hono()
  .get("/", getSessionAndUser, zValidator("query", z.object({ workspaceId: z.string() })), async (c) => {
    const user = c.var.user;
    if (!user) return c.body(null, 401);

    const { workspaceId } = c.req.valid("query");

    const member = await getMember({
      db,
      userId: user.id,
      workspaceId: workspaceId,
    });

    if (!member) return c.json({ error: "Unauthorized" }, 401);

    const projects = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.workspaceId, workspaceId))
      .orderBy(desc(projectsTable.createdAt));

    return c.json({ projects });
  })
  .post("/", getSessionAndUser, zValidator("json", insertProjectsSchema), async (c) => {
    const user = c.var.user;
    if (!user) return c.body(null, 401);

    const { name, imageUrl, workspaceId } = c.req.valid("json");

    console.log("name", name);

    const member = await getMember({
      db,
      userId: user.id,
      workspaceId: workspaceId,
    });

    if (!member) return c.json({ error: "Unauthorized" }, 401);

    const validatedProject = insertProjectsSchema.parse({ name, imageUrl, userId: user.id, workspaceId });

    const result = await db
      .insert(projectsTable)
      .values(validatedProject)
      .returning()
      .then((res) => res[0]);

    return c.json(result);
  })
  .get("/:projectId", getSessionAndUser, async (c) => {
    const user = c.var.user;
    if (!user) return c.body(null, 401);

    const { projectId } = c.req.param();

    const project = (await db.select().from(projectsTable).where(eq(projectsTable.slug, projectId)))[0];

    const member = await getMember({ db, workspaceId: project.workspaceId, userId: user.id });

    if (!member) {
      return c.json({ project: [] });
    }

    return c.json({ data: project });
  })
  .patch("/:projectId", getSessionAndUser, zValidator("json", updateProjectsSchema), async (c) => {
    const user = c.var.user;
    if (!user) return c.body(null, 401);

    const { name, imageUrl } = c.req.valid("json");

    const { projectId } = c.req.param();

    const existingProject = (await db.select().from(projectsTable).where(eq(projectsTable.slug, projectId)))[0];

    const member = await getMember({ db, workspaceId: existingProject.workspaceId, userId: user.id });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const validatedProjectUpdate = updateProjectsSchema.parse({
      name: name,
      imageUrl: imageUrl ?? null,
    });

    console.log("Validated Update Object:", validatedProjectUpdate);

    const updatedProject = await db
      .update(projectsTable)
      .set(validatedProjectUpdate)
      .where(eq(projectsTable.slug, projectId));

    return c.json({ updatedProject });
  })
  .delete("/:projectId", getSessionAndUser, async (c) => {
    const user = c.var.user;
    if (!user) return c.body(null, 401);

    const { projectId } = c.req.param();

    const existingProject = (await db.select().from(projectsTable).where(eq(projectsTable.slug, projectId)))[0];

    const member = await getMember({ db, workspaceId: existingProject.workspaceId, userId: user.id });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await db.delete(projectsTable).where(eq(projectsTable.slug, projectId));

    return c.json({ project: { slug: projectId } });
  })
  .get("/:projectId/analytics", getSessionAndUser, async (c) => {
    const user = c.var.user;
    if (!user) return c.body(null, 401);

    const { projectId } = c.req.param();

    const project = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.slug, projectId))
      .then((res) => res[0]);

    const member = await getMember({ db, workspaceId: project.workspaceId, userId: user.id });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthTasks = await db
      .select()
      .from(tasksTable)
      .where(
        and(
          eq(tasksTable.projectId, project.slug),
          gte(tasksTable.createdAt, thisMonthStart),
          lte(tasksTable.createdAt, thisMonthEnd)
        )
      );

    const lastMonthTasks = await db
      .select()
      .from(tasksTable)
      .where(
        and(
          eq(tasksTable.projectId, project.slug),
          gte(tasksTable.createdAt, lastMonthStart),
          lte(tasksTable.createdAt, lastMonthEnd)
        )
      );

    const taskCount = thisMonthTasks.length;
    const taskDifference = taskCount - lastMonthTasks.length;

    const thisMonthAssignedTasks = await db
      .select()
      .from(tasksTable)
      .where(
        and(
          eq(tasksTable.projectId, project.slug),
          eq(tasksTable.assigneeId, member.slug as string),
          gte(tasksTable.createdAt, thisMonthStart),
          lte(tasksTable.createdAt, thisMonthEnd)
        )
      );

    const lastMonthAssignedTasks = await db
      .select()
      .from(tasksTable)
      .where(
        and(
          eq(tasksTable.projectId, project.slug),
          eq(tasksTable.assigneeId, member.slug as string),
          gte(tasksTable.createdAt, lastMonthStart),
          lte(tasksTable.createdAt, lastMonthEnd)
        )
      );

    const assignedTaskCount = thisMonthAssignedTasks.length;
    const assignedTaskDifference = assignedTaskCount - lastMonthAssignedTasks.length;

    const thisMonthIncompleteTasks = await db
      .select()
      .from(tasksTable)
      .where(
        and(
          eq(tasksTable.projectId, project.slug),
          ne(tasksTable.status, TaskStatus.DONE),
          gte(tasksTable.createdAt, thisMonthStart),
          lte(tasksTable.createdAt, thisMonthEnd)
        )
      );

    const lastMonthIncompleteTasks = await db
      .select()
      .from(tasksTable)
      .where(
        and(
          eq(tasksTable.projectId, project.slug),
          ne(tasksTable.status, TaskStatus.DONE),
          gte(tasksTable.createdAt, lastMonthStart),
          lte(tasksTable.createdAt, lastMonthEnd)
        )
      );

    const incompleteTaskCount = thisMonthIncompleteTasks.length;
    const incompleteTaskDifference = incompleteTaskCount - lastMonthIncompleteTasks.length;

    const thisMonthCompletedTasks = await db
      .select()
      .from(tasksTable)
      .where(
        and(
          eq(tasksTable.projectId, project.slug),
          eq(tasksTable.status, TaskStatus.DONE),
          gte(tasksTable.createdAt, thisMonthStart),
          lte(tasksTable.createdAt, thisMonthEnd)
        )
      );

    const lastMonthCompletedTasks = await db
      .select()
      .from(tasksTable)
      .where(
        and(
          eq(tasksTable.projectId, project.slug),
          eq(tasksTable.status, TaskStatus.DONE),
          gte(tasksTable.createdAt, lastMonthStart),
          lte(tasksTable.createdAt, lastMonthEnd)
        )
      );

    const completedTaskCount = thisMonthCompletedTasks.length;
    const completedTaskDifference = completedTaskCount - lastMonthCompletedTasks.length;

    const thisMonthOverdueTasks = await db
      .select()
      .from(tasksTable)
      .where(
        and(
          eq(tasksTable.projectId, project.slug),
          ne(tasksTable.status, TaskStatus.DONE),
          lt(tasksTable.dueDate, now),
          gte(tasksTable.createdAt, thisMonthStart),
          lte(tasksTable.createdAt, thisMonthEnd)
        )
      );

    const lastMonthOverdueTasks = await db
      .select()
      .from(tasksTable)
      .where(
        and(
          eq(tasksTable.projectId, project.slug),
          ne(tasksTable.status, TaskStatus.DONE),
          lt(tasksTable.dueDate, now),
          gte(tasksTable.createdAt, lastMonthStart),
          lte(tasksTable.createdAt, lastMonthEnd)
        )
      );

    const overdueTaskCount = thisMonthOverdueTasks.length;
    const overdueTaskDifference = overdueTaskCount - lastMonthOverdueTasks.length;

    return c.json({
      data: {
        taskCount,
        taskDifference,
        assignedTaskCount,
        assignedTaskDifference,
        incompleteTaskCount,
        incompleteTaskDifference,
        completedTaskCount,
        completedTaskDifference,
        overdueTaskCount,
        overdueTaskDifference,
      },
    });
  });
