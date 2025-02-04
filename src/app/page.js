
'use client'
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import TaskForm from "@/components/TaskForm";
import { useState } from "react";
import { useUser } from "@/context/UserContext";

export default function TodoList() {
  const {state, dispatch} = useUser();
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Create New Task</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <TaskForm setOpen={setOpen} />
            </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32 text-gray-500">
              No tasks created yet. Click "Create New Task" to get started.
            </CardContent>
          </Card>
        ) : (
          tasks.map((task, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                Task content would go here
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}