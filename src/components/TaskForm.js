import
    {
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
import
    {
        Form,
        FormControl,
        FormDescription,
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
import { useState } from "react";
import { useUser } from "@/context/UserContext";

export default function TaskForm({setOpen}) {

    const { toast } = useToast();
    const {state, dispatch} = useUser();
    const [selectedCategory, setSelectedCategory] = useState("");
    const form = useForm({
        resolver: zodResolver(TaskFormSchema),
        defaultValues: { task: "", description: "", dueDate: "", priority: "medium", category: "Work" },
    });

    const onSubmit = async (data) =>
    {
        console.log(data);
        if (!data)
        {
            return toast({
                title: "Falied",
                description: "",
                variant: "destructive",
            });
        }
        const updatedData = { ...data, category: selectedCategory, userId:state._id }
        const response = await apiRequest("create-task", "POST", updatedData);
        if (response)
            {
            setOpen(false);
            toast({
                title: "Success!",
                description: response?.message,
                variant: "success",
            });
        } else
        {
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

                {/* Task Title */}
                <FormField
                    name="task"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="task">Task Title</FormLabel>
                            <FormControl>
                                <Input {...field} id="task" placeholder="Enter task title..." />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Description */}
                <FormField
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="description">Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} id="description" placeholder="Add description..." className="h-24" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Due Date */}
                <FormField
                    name="dueDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="dueDate">Due Date</FormLabel>
                            <FormControl>
                                <Input {...field} id="dueDate" type="datetime-local" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Priority */}
                <FormField
                    name="priority"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="priority">Priority</FormLabel>
                            <FormControl>
                                <Select {...field} id="priority">
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

                {/* Category */}
                <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                        <div className="flex gap-2 mt-1">
                            {["Work", "Personal"].map((category) => (
                                <Badge
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`cursor-pointer px-4 py-2 ${selectedCategory === category ? "bg-primary text-white" : "bg-gray-500"
                                        }`}
                                >
                                    {category}
                                </Badge>
                            ))}
                        </div>
                    </FormControl>
                </FormItem>

                <Button className="w-full">Create Task</Button>
            </form>
        </Form>
    );
}
