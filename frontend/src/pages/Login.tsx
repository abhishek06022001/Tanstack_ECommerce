import React, { useEffect } from 'react'
"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { jwtDecode } from 'jwt-decode'
import axios from "axios"
import { Button } from '../components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form'
import { Input } from '../components/ui/input'
import { data, Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useToast } from '../hooks/use-toast'

import { ToastAction } from '../components/ui/toast'
import { Toaster } from '../components/ui/toaster'

const formSchema = z.object({
    email: z.string().email({ message: "please enter a valid Email" }),
    password: z.string().min(4, { message: "Too Short, atleast enter 4 characters " }),
}).required();
type jwtDecodeProp = {
    id: number
}
type Props = {}
function Login({ }: Props) {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "", password: ''
        },
    })
    const navigate = useNavigate();
    const ac_token = localStorage.getItem('accessToken');

    useEffect(() => {
        if (ac_token) {
            setTimeout(() => {
                navigate('/');
            }, 2000)
        }
    }, [ac_token]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const ac_token = await axios.post('/api/login', values);
            localStorage.setItem('accessToken', ac_token.data.message);
            const { id } = jwtDecode<jwtDecodeProp>(ac_token.data.message);
            const user_info = await axios.get('/api/get_user/' + id, {
                headers: {
                    token: ac_token.data.message
                }
            });
            user_info.data = { ...user_info.data[0], id: id };
            localStorage.setItem('user', JSON.stringify(user_info.data));
            localStorage.setItem('user_role', JSON.stringify(user_info.data.role));
          
            toast({
                className: "text-secondary bg-primary border-none  fixed top-4 right-3 w-96  pr-5   text-2xl",
                title: "Logged in successfully ",
                duration: 1500
            });
        } catch (error) {
            toast({
                className: "text-secondary bg-primary border-none  fixed top-4 right-3 w-fit  text-2xl",
                title: "Please Retry with correct details . . .",
                duration: 1500
            });
            console.log(error);
        }
    }
    return (
        <div className='flex h-screen justify-center items-center text-primary bg-primary-foreground'  >
            <div className="w-96 p-5 rounded-sm">
                <Toaster />
                <div className='text-center text-3xl font-bold m-10 ' >LOGIN PAGE </div>
                <Form {...form}  >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className=' ' >Username</FormLabel>
                                    <FormControl>
                                        <Input className='bg-secondary text-secondary-foreground'  {...field} />
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
                                    <FormLabel className=''>Password</FormLabel>
                                    <FormControl>
                                        <Input className='bg-secondary text-secondary-foreground'  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex flex-col gap-5 items-center' >

                            <Link to={'/signup'} className='text-sm hover:text-muted-foreground ' >

                                New Here ? Sign up

                            </Link>
                            <Button className=' ' type="submit">Submit</Button>
                        </div>

                    </form>
                </Form>
            </div>

        </div>
    )
}

export default Login