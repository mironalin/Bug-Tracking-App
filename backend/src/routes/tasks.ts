import { Hono } from "hono";
import { getSessionAndUser } from "../middleware/get-session-and-user.js";
import { zValidator } from "@hono/zod-validator";
import { insertTasksSchema, tasks as tasksTable, updateTasksSchema } from "../db/schema/tasks-schema.js";
import { projects as projectsTable } from "../db/schema/projects-schema.js";
import { members as membersTable } from "../db/schema/members-schema.js";
import { user as userTable } from "../db/schema/auth-schema.js";
import { getMember } from "../lib/utils.js";
import { db } from "../db/index.js";
import { and, desc, eq, ilike, inArray, SQL } from "drizzle-orm";
import { z } from "zod";
import { TaskStatus } from "../sharedTypes.js";

export const tasksRoute = new Hono()
  .get(
    "/",
    getSessionAndUser,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
      })
    ),
    async (c) => {
      const user = c.var.user;
      if (!user) return c.body(null, 401);

      const { workspaceId, projectId, assigneeId, status, search, dueDate } = c.req.valid("query");

      const member = await getMember({
        db,
        userId: user.id,
        workspaceId: workspaceId,
      });

      if (!member) return c.json({ error: "Unauthorized" }, 401);

      const query: SQL[] = [eq(tasksTable.workspaceId, workspaceId)];

      if (projectId) {
        console.log("projectId: ", projectId);
        query.push(eq(tasksTable.projectId, projectId));
      }

      if (assigneeId) {
        console.log("assigneeId: ", assigneeId);
        query.push(eq(tasksTable.assigneeId, assigneeId));
      }

      if (status) {
        console.log("status: ", status);
        query.push(eq(tasksTable.status, status));
      }

      if (dueDate) {
        console.log("dueDate: ", dueDate);
        query.push(eq(tasksTable.dueDate, new Date(dueDate)));
      }

      if (search) {
        console.log("search: ", search);
        query.push(ilike(tasksTable.name, `%${search}%`));
      }

      const tasks = await db
        .select()
        .from(tasksTable)
        .where(and(...query))
        .orderBy(desc(tasksTable.createdAt));

      const projectIds = tasks.map((task) => task.projectId);
      const assigneeIds = tasks.map((task) => task.assigneeId);

      const projects = await db.select().from(projectsTable).where(inArray(projectsTable.slug, projectIds));
      const members = await db.select().from(membersTable).where(inArray(membersTable.slug, assigneeIds));

      const assignees = await Promise.all(
        members.map(async (member) => {
          const user = await db
            .select()
            .from(userTable)
            .where(eq(userTable.id, member.userId))
            .then((res) => res[0]);
          return { ...member, name: user.name, email: user.email };
        })
      );

      const populatedTasks = tasks.map((task) => {
        const project = projects.find((project) => project.slug === task.projectId);
        const assignee = assignees.find((assignee) => assignee.slug === task.assigneeId);

        return { ...task, project, assignee };
      });

      return c.json({
        // data: {
        //   ...tasks,
        //   populatedTasks: tasks,
        // },
        data: populatedTasks,
      });
    }
  )
  .get("/:taskSlug", getSessionAndUser, async (c) => {
    const currentUser = c.var.user;
    if (!currentUser) return c.body(null, 401);

    const users = await db.select().from(userTable);

    const { taskSlug } = c.req.param();

    const task = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.slug, taskSlug))
      .then((res) => res[0]);

    const currentMember = await getMember({ db, workspaceId: task.workspaceId, userId: currentUser.id });

    if (!currentMember) return c.json({ error: "Unauthorized" }, 401);

    const project = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.slug, task.projectId))
      .then((res) => res[0]);

    const member = await db
      .select()
      .from(membersTable)
      .where(eq(membersTable.slug, task.assigneeId))
      .then((res) => res[0]);

    const user = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, member.userId))
      .then((res) => res[0]);

    const assignee = { ...member, name: user.name, email: user.email };

    return c.json({
      data: {
        ...task,
        project,
        assignee,
      },
    });
  })
  .post("/", getSessionAndUser, zValidator("json", insertTasksSchema), async (c) => {
    const user = c.var.user;
    if (!user) return c.body(null, 401);

    const { name, status, workspaceId, projectId, dueDate, assigneeId } = c.req.valid("json");

    const member = await getMember({
      db,
      userId: user.id,
      workspaceId: workspaceId,
    });

    if (!member) return c.json({ error: "Unauthorized" }, 401);

    const highestPositionTask = await db
      .select()
      .from(tasksTable)
      .where(and(eq(tasksTable.workspaceId, workspaceId), eq(tasksTable.status, status)))
      .orderBy(desc(tasksTable.position))
      .limit(1);

    const newPosition = highestPositionTask.length > 0 ? highestPositionTask[0].position + 1000 : 1000;

    const validatedTask = insertTasksSchema.parse({
      name,
      status,
      workspaceId,
      projectId,
      dueDate,
      assigneeId,
      position: newPosition,
    });

    const result = await db
      .insert(tasksTable)
      .values(validatedTask)
      .returning()
      .then((res) => res[0]);

    return c.json(result);
  })
  .patch("/:taskId", getSessionAndUser, zValidator("json", insertTasksSchema.partial()), async (c) => {
    const user = c.var.user;
    if (!user) return c.body(null, 401);

    const { name, status, projectId, dueDate, assigneeId, description } = c.req.valid("json");
    const { taskId } = c.req.param();

    const existingTask = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.slug, taskId))
      .then((res) => res[0]);

    const member = await getMember({
      db,
      userId: user.id,
      workspaceId: existingTask.workspaceId,
    });

    if (!member) return c.json({ error: "Unauthorized" }, 401);

    const validatedTaskUpdate = updateTasksSchema.parse({
      name: name,
      status: status,
      projectId: projectId,
      dueDate: dueDate,
      assigneeId: assigneeId,
      description: description,
    });

    console.log("dueDate: ", dueDate);

    const task = await db
      .update(tasksTable)
      .set(validatedTaskUpdate)
      .where(eq(tasksTable.slug, taskId))
      .returning()
      .then((res) => res[0]);

    return c.json({ data: task });
  })
  .delete("/:taskId", getSessionAndUser, async (c) => {
    const user = c.var.user;
    if (!user) return c.body(null, 401);

    const { taskId } = c.req.param();

    const task = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.slug, taskId))
      .then((res) => res[0]);

    const member = await getMember({ db, workspaceId: task.workspaceId, userId: user.id });

    if (!member) return c.json({ error: "Unauthorized" }, 401);

    await db.delete(tasksTable).where(eq(tasksTable.slug, taskId));

    return c.json({
      data: {
        slug: taskId,
      },
    });
  });
