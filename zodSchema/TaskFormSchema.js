import * as z from "zod";


export const TaskFormSchema = z.object({
    task: z.string().min(2, "Task title must be at least 2 characters"), // Task title or name
    description: z.string().optional(), // Additional details about the task
    dueDate: z.string().optional(), // Deadline for the task
    priority: z.enum(["low", "medium", "high"]).default("medium"), // Task priority
    category: z.string().optional(), // Task category (e.g., Work, Personal)
  });