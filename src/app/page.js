
'use client'

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { apiRequest } from "../../utils/apiRequest";
import TodoList from "@/components/TodoList";
import TaskDialog from "@/components/TaskDialog";
import { Badge } from "@/components/ui/badge";



export default function Home() {
  const {state, dispatch} = useUser();
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilterdTasks] = useState();
  const [filterList, setFilterList] = useState({
    list: ["All Tasks", "Work", "Personal"],
    active: "All Tasks",
  });
  
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

  const filterCondition = (category) => {
    if (category === filterList.active) return;
    setFilterList((prev) => ({ ...prev, active: category }));
    const filteredTasks = tasks.filter(task =>
      task.category === category
    );
    setFilterdTasks(filteredTasks);

  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Tasks</h1>
       <div className="flex gap-x-5 cursor-pointer">
       {filterList.list.map((item, index) => {
      return (
        <Badge key={index} onClick={() => filterCondition(item)} variant={item === filterList.active ? "" : "secondary"} className={'hover:opacity-85'}>
          {item}
        </Badge>
      );
    })}
       </div>

        <TaskDialog open={open} setOpen={setOpen} title="Create New Task" triggerLabel="Create New Task" />
      </div>

      <TodoList tasks={filteredTasks?.length > 0 ? filteredTasks : tasks} />


    </main>
  );
}