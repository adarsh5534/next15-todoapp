'use client';
import { useState } from "react";
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


const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", email: "", password: "" },
    });

    const onSubmit = (data) => {
        console.log("Form Data:", data);
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
