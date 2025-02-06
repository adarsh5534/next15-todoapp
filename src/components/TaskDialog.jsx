import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TaskForm from "@/components/TaskForm";

export default function TaskDialog({ open, setOpen, taskData, title, triggerLabel }) {
  console.log(taskData,'tasdata')
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {!taskData && <Button onClick={() => setOpen(true)}>{triggerLabel}</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <TaskForm setOpen={setOpen} taskData={taskData} />
      </DialogContent>
    </Dialog>
  );
}
