import React, { useEffect } from 'react'
"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"


import { Button } from '../components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form'
import { Input } from '../components/ui/input'
import { Link, useNavigate } from 'react-router-dom'
import axios, { AxiosError } from 'axios'
import { toast } from '../hooks/use-toast'

const formSchema = z.object({
    name: z.string().min(1, { message: "required field" }),
    email: z.string().email({ message: "please enter a valid Email" }),
    password: z.string().min(3, { message: "Too Short, atleast enter 4 characters " }),
}).required();
type Props = {}
function Signup({ }: Props) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "", password: ""
        },
    })
    const navigate = useNavigate();
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {

            const response = await axios.post("/api/register", values);
            toast({
                className: "bg-green-300 border-none  fixed top-4 right-3 w-fit  pr-5  text-black text-2xl",
                title: "User registered successfully  "
            });
            setTimeout(() => {
                navigate('/login');
            }, 2000)
        } catch (error: unknown) {
            alert("Please retry , user already exists ...");
        }
    }


    return (
        <div className='flex h-screen justify-center items-center bg-gradient-to-r from-black  to-pink-300'  >
            <div className="w-96 p-5 rounded-sm">
                <div className='text-center text-3xl font-bold m-10' >REGISTER </div>
                <Form {...form}  >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='' >Full Name</FormLabel>
                                    <FormControl>
                                        <Input className='bg-zinc-200 text-black'  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='' >Email</FormLabel>
                                    <FormControl>
                                        <Input className='bg-zinc-200 text-black'     {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input className='bg-zinc-200 text-black'  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex flex-col gap-5 items-center' >

                            <Link to={'/login'} className='text-black text-sm hover:text-muted-foreground' >

                                Already have an account ? click here to  Login In

                            </Link>
                            <Button type="submit">Submit</Button>
                        </div>

                    </form>
                </Form>
            </div>

        </div>
    )
}

export default Signup