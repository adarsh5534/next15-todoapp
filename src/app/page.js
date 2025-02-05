
'use client'
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskForm from "@/components/TaskForm";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { apiRequest } from "../../utils/apiRequest";
import { Badge } from "@/components/ui/badge";
import { formatDueDate } from "@/helper/formatDate";
import TodoList from "@/components/TodoList";
import ConfirmBox from "@/components/ConfirmationBox";

export default function Home() {
  const {state, dispatch} = useUser();
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  console.log(state._id,'state')
  
  useEffect(() => {
    if (!state?._id) return; // Only proceed if state._id is defined
  
    const fetchData = async () => {
      try {
        const response = await apiRequest(`get-user-task?id=${state._id}`);
        console.log(response);
        setTasks(response);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
  
    fetchData();
  }, [state?._id, state?.render_list]); 
  

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

    <TodoList tasks={tasks} />

    </main>
  );
}