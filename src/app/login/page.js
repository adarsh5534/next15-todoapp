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
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", email: "", password: "" },
    });

    const onSubmit = async (data) => {
        console.log("Form Data:", data);
        const {email, password} = data;

        try {
            const response = await signIn("credentials", {
                redirect: false,
                email,
                password
            });
            if(response?.error) {
                toast({
                    title: "Login Failed",
                    description: response.error,
                    variant: "destructive",
                });
            } 
            if(response?.ok) {
                toast({
                    title: "Success!",
                    description: "Login Successful",
                    variant: "success",
                }); 
                router.push("/")
            }


        } catch (error) {
            console.log(error);
            toast({
                title: "Login Failed",
                description: "An error occurred. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <main className="flex justify-center items-center h-screen">
            <Card className="w-96 p-4 shadow-md">
                <CardHeader>
                    <CardTitle className="uppercase text-center">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {["email", "password"].map((field) => (
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
                            <Button type="submit" className="w-full">Login</Button>
                        </form>
                    </Form>
                    <p className="text-sm text-center mt-4">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-blue-500 hover:underline">
                            Register
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </main>
    );
}
