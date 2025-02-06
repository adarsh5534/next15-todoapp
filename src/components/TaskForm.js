import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskFormSchema } from "../../zodSchema/TaskFormSchema";
import { apiRequest } from "../../utils/apiRequest";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";

export default function TaskForm({ setOpen, taskData }) {
    const { toast } = useToast();
    const { state, dispatch } = useUser();
    const [selectedCategory, setSelectedCategory] = useState(taskData?.category || "Work");
    console.log(taskData,'taskdata')
    // Initialize form with empty strings instead of undefined values
    
    const form = useForm({
        resolver: zodResolver(TaskFormSchema),
        defaultValues: {
            task: taskData?.task || "",
            description: taskData?.description || "",
            dueDate: taskData?.dueDate || "",
            priority: taskData?.priority || "medium",
            category: taskData?.category || "Work"
        },
        shouldUnregister: true,
    });

    useEffect(() => {
        if (taskData) {
            const formattedDueDate = taskData.dueDate 
            ? new Date(taskData.dueDate).toISOString().slice(0, 16) // Convert to proper format
            : "";
            const formattedData = {
                task: taskData.task || "",
                description: taskData.description || "",
                dueDate:formattedDueDate || "",
                priority: taskData.priority || "medium",
                category: taskData.category || "Work"
            };
            form.reset(formattedData);
            setSelectedCategory(taskData.category || "Work");
        }
    }, [taskData, form]);

    const onSubmit = async (data) => {
        if (!data) {
            return toast({
                title: "Failed",
                description: "Form data is missing",
                variant: "destructive",
            });
        }
        const updatedData = { ...data, category: selectedCategory, userId: state._id };
        const endpoint = taskData ? `updateTask?id=${taskData._id}`: "create-task";

        const response = await apiRequest(endpoint, "POST", updatedData);
        if (response) {
            dispatch({ type: 'RENDER_TODOLIST', payload: !state.render_list });
            setOpen(false);
            toast({
                title: "Success!",
                description: response?.message,
                variant: "success",
            });
        } else {
            toast({
                title: "Failed!",
                description: response?.error,
                variant: "destructive",
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="task"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="task">Task Title</FormLabel>
                            <FormControl>
                                <Input 
                                    {...field}
                                    id="task"
                                    placeholder="Enter task title..."
                                    value={field.value || ""} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="description">Description</FormLabel>
                            <FormControl>
                                <Textarea 
                                    {...field}
                                    id="description"
                                    placeholder="Add description..."
                                    className="h-24"
                                    value={field.value || ""} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="dueDate">Due Date</FormLabel>
                            <FormControl>
                                <Input 
                                    {...field}
                                    id="dueDate"
                                    type="datetime-local"
                                    value={field.value || ""} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="priority">Priority</FormLabel>
                            <FormControl>
                                <Select 
                                    value={field.value || "medium"}
                                    onValueChange={field.onChange}
                                    id="priority"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                        <div className="flex gap-2 mt-1">
                            {["Work", "Personal"].map((category) => (
                                <Badge
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`cursor-pointer px-4 py-2 ${
                                        selectedCategory === category 
                                            ? "bg-primary text-white" 
                                            : "bg-gray-500"
                                    }`}
                                >
                                    {category}
                                </Badge>
                            ))}
                        </div>
                    </FormControl>
                </FormItem>

                <Button className="w-full">
                    {taskData ? "Update Task" : "Create Task"}
                </Button>
            </form>
        </Form>
    );
}