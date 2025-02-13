'use client'

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { apiRequest } from "../../utils/apiRequest";
import TodoList from "@/components/TodoList";
import TaskDialog from "@/components/TaskDialog";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const { state, dispatch } = useUser();
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filterList, setFilterList] = useState({
    list: ["All Tasks", "Work", "Personal"],
    active: "All Tasks",
  });

  console.log(state, 'state');

  // Fetch tasks when user ID is available
  useEffect(() => {
    if (!state?._id) return; // Only proceed if state._id is defined

    const fetchData = async () => {
      try {
        const response = await apiRequest(`get-user-task?id=${state._id}&page=${state.page}&cat=${state.category}`);
        console.log(response);
        setTasks(response.data);
        dispatch({ type: 'USER_TASK_DATA', payload: response })
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchData();
  }, [state?._id, state?.render_list]);

  // Update `filteredTasks` when tasks or filter changes
  // useEffect(() => {
  //   if (filterList.active === "All Tasks") {
  //     setFilteredTasks(tasks); // Show all tasks
  //   } else {
  //     dispatch({ type: 'CATEGORY', payload: filterList.active });
  //     setFilteredTasks(tasks.filter(task => task.category === filterList.active));
  //   }
  // }, [tasks, filterList.active]);

  const handleFilterChange = (category) => {
    if (category !== filterList.active ) {
      setFilterList(prev => ({ ...prev, active: category }));
      const q = category === "All Tasks" ? "" :category
      dispatch({ type: 'CATEGORY', payload: q });
      dispatch({ type: 'RENDER_TODOLIST', payload: !state.render_list });
    }
  };

  console.log(tasks, "tasks", filteredTasks);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Tasks</h1>

        {/* Filter Buttons */}
        <div className="flex gap-x-5 cursor-pointer">
          {filterList.list.map((item, index) => (
            <Badge
              key={index}
              onClick={() => handleFilterChange(item)}
              variant={item === filterList.active ? "" : "secondary"}
              className="hover:opacity-85"
            >
              {item}
            </Badge>
          ))}
        </div>

        {/* Task Creation Dialog */}
        <TaskDialog
          open={open}
          setOpen={setOpen}
          title="Create New Task"
          triggerLabel="Create New Task"
        />
      </div>

      {/* Task List */}
      <TodoList tasks={tasks} />
    </main>
  );
}
