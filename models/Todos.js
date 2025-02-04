import mongoose from "mongoose";

const UserTaskSchema = new mongoose.Schema(
  {
    task: { type: String, required: true }, // Task title or name
    description: { type: String }, // Additional details about the task
    dueDate: { type: Date }, // Deadline for the task
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" }, // Task priority
    category: { type: String }, // Task category (e.g., Work, Personal)
    completed: { type: Boolean, default: false }, // Completion status
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user
  },
  { timestamps: true }
);

// Explicitly setting the collection name to "user-tasks"
export default mongoose.models.UserTask || mongoose.model("UserTask", UserTaskSchema, "user-tasks");
