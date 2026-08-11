import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { encodeId, graph } from "./graph.js";

const server = new McpServer({ name: "microsoft-todo", version: "0.1.0" });
const result = (value) => ({ content: [{ type: "text", text: JSON.stringify(value, null, 2) }] });

server.tool("list_task_lists", "列出当前 Microsoft To Do 的任务列表", {}, async () => {
  const data = await graph("/me/todo/lists");
  return result(data.value);
});

server.tool(
  "list_tasks",
  "列出一个 To Do 列表中的任务",
  {
    listId: z.string().describe("任务列表 ID"),
    includeCompleted: z.boolean().optional().default(false)
  },
  async ({ listId, includeCompleted }) => {
    const data = await graph(`/me/todo/lists/${encodeId(listId)}/tasks`);
    const tasks = includeCompleted ? data.value : data.value.filter((task) => task.status !== "completed");
    return result(tasks);
  }
);

server.tool(
  "create_task",
  "在 Microsoft To Do 中创建任务",
  {
    listId: z.string().describe("任务列表 ID"),
    title: z.string().min(1),
    body: z.string().optional(),
    dueDateTime: z.string().optional().describe("ISO 8601 本地时间，例如 2026-08-15T15:00:00"),
    timeZone: z.string().optional().default("Asia/Shanghai"),
    reminderDateTime: z.string().optional().describe("ISO 8601 本地提醒时间"),
    importance: z.enum(["low", "normal", "high"]).optional()
  },
  async ({ listId, title, body, dueDateTime, timeZone, reminderDateTime, importance }) => {
    const payload = { title };
    if (body) payload.body = { content: body, contentType: "text" };
    if (dueDateTime) payload.dueDateTime = { dateTime: dueDateTime, timeZone };
    if (reminderDateTime) {
      payload.isReminderOn = true;
      payload.reminderDateTime = { dateTime: reminderDateTime, timeZone };
    }
    if (importance) payload.importance = importance;
    return result(await graph(`/me/todo/lists/${encodeId(listId)}/tasks`, { method: "POST", body: JSON.stringify(payload) }));
  }
);

server.tool(
  "update_task",
  "修改 Microsoft To Do 任务的标题、正文、重要性、截止时间或提醒",
  {
    listId: z.string(),
    taskId: z.string(),
    title: z.string().min(1).optional(),
    body: z.string().optional(),
    importance: z.enum(["low", "normal", "high"]).optional(),
    dueDateTime: z.string().optional(),
    reminderDateTime: z.string().optional(),
    timeZone: z.string().optional().default("Asia/Shanghai")
  },
  async ({ listId, taskId, title, body, importance, dueDateTime, reminderDateTime, timeZone }) => {
    const payload = {};
    if (title !== undefined) payload.title = title;
    if (body !== undefined) payload.body = { content: body, contentType: "text" };
    if (importance !== undefined) payload.importance = importance;
    if (dueDateTime !== undefined) payload.dueDateTime = { dateTime: dueDateTime, timeZone };
    if (reminderDateTime !== undefined) {
      payload.isReminderOn = true;
      payload.reminderDateTime = { dateTime: reminderDateTime, timeZone };
    }
    return result(await graph(`/me/todo/lists/${encodeId(listId)}/tasks/${encodeId(taskId)}`, { method: "PATCH", body: JSON.stringify(payload) }));
  }
);

server.tool(
  "complete_task",
  "将 Microsoft To Do 任务标记为已完成",
  { listId: z.string(), taskId: z.string() },
  async ({ listId, taskId }) => result(await graph(`/me/todo/lists/${encodeId(listId)}/tasks/${encodeId(taskId)}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "completed" })
  }))
);

const transport = new StdioServerTransport();
await server.connect(transport);
