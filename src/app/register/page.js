'use client';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import Link from "next/link";
import { apiRequest } from "../../../utils/apiRequest";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});


export default function Register() {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", email: "", password: "" },
    });


    const onSubmit = async (data) => {
    
        console.log("Form Data:", data);
    
        try {
            const response = await apiRequest("register", "POST", data);
        
            if (response?.message) {
                toast({
                    title: "Success!",
                    description: response.message,
                    variant: "success",
                });
                router.push("/login");
            } else if (response?.error) {
                toast({
                    title: "Registration Failed",
                    description: response.error,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Registration Failed",
                    description: "An unexpected error occurred.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.log("API Request Error:", error);
            toast({
                title: "Registration Failed",
                description: "An error occurred. Please try again.",
                variant: "destructive",
            });
        }
        
    };
    

    return (
        <main className="flex justify-center items-center h-screen">
            <Card className="w-96 p-4 shadow-md">
                <CardHeader>
                    <CardTitle className="uppercase text-center">Register</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {["name", "email", "password"].map((field) => (
                                <FormField
                                    key={field}
                                    control={form.control}
                                    name={field}
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="capitalize">{field.name}</Label>
                                            <FormControl>
                                                <Input {...field} type={field.name === "password" ? "password" : "text"} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                            <Button type="submit" className="w-full">Register</Button>
                        </form>
                    </Form>
                    <p className="text-sm text-center mt-4">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-500 hover:underline">
                            Login
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </main>
    );
}
