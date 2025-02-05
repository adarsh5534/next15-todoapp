import { formatDueDate } from "@/helper/formatDate";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Trash2Icon } from "lucide-react";
import ConfirmBox from "./ConfirmationBox";
import { useState } from "react";
import { apiRequest } from "../../utils/apiRequest";

export default function TodoList({ tasks, onTasksUpdate }) {
  const [confirmationState, setConfirmationState] = useState({
    isOpen: false,
    taskId: null,
    isDeleting: false
  });

  const handleDeleteClick = (taskId) => {
    setConfirmationState({
      isOpen: true,
      taskId,
      isDeleting: false
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmationState.taskId || confirmationState.isDeleting) return;

    try {
      setConfirmationState(prev => ({ ...prev, isDeleting: true }));
      
      const response = await apiRequest(`deleteTask?id=${confirmationState.taskId}`, "POST");
      
      if (response.message) {
        onTasksUpdate?.(tasks.filter(task => task._id !== confirmationState.taskId));
      } else {
        throw new Error(response.error || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setConfirmationState({
        isOpen: false,
        taskId: null,
        isDeleting: false
      });
    }
  };

  const handleCancelDelete = () => {
    setConfirmationState({
      isOpen: false,
      taskId: null,
      isDeleting: false
    });
  };

  return (
    <div className="grid gap-4">
      {tasks.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-32 text-gray-500">
            No tasks created yet. Click "Create New Task" to get started.
          </CardContent>
        </Card>
      ) : (
        tasks.map((task) => (
          <Card
            key={task._id}
            className="flex items-center p-4 shadow-md rounded-lg border border-gray-200"
          >
            <div
              className={`w-4 h-4 rounded-full ${
                task.completed ? "bg-gray-300" : "bg-indigo-500"
              } mr-4`}
            />
            <CardContent className="flex-1 p-0">
              <h2 className="text-lg font-semibold">{task.task}</h2>
              <p className="text-sm text-gray-500">{formatDueDate(task.dueDate)}</p>
            </CardContent>
            <Badge
              className={`px-3 py-1 mr-5 text-sm ${
                task.category === "Work"
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {task.category}
            </Badge>
            <Trash2Icon 
              className="hover:opacity-70 cursor-pointer" 
              onClick={() => handleDeleteClick(task._id)}
            />
          </Card>
        ))
      )}
      
      <ConfirmBox
        open={confirmationState.isOpen}
        setOpen={(isOpen) => setConfirmationState(prev => ({ ...prev, isOpen }))}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}