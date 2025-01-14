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
import { Toaster } from '@/components/ui/toaster'
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
    const ac_token = localStorage.getItem('accessToken');
   useEffect(()=>{
       if (ac_token) {
           navigate('/');
       }
   },[])
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await axios.post("/api/register", values);


            toast({
                className: "bg-green-300 border-none fixed top-4 right-3 w-96 pr-5 text-black text-2xl",
                title: "Registered successfully",
                duration: 2000,
            });

            setTimeout(() => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                localStorage.removeItem('user_role');
                navigate('/login');
            }, 2000); 
            console.log("not here");
            
        } catch (error) {
            console.error("Registration Error:", error);
            toast({
                className: "text-secondary bg-red-500   border-none fixed top-4 right-3 w-fit min-w-96 text-2xl",
                title: "User Already Exists ... ",
                duration: 1500,
            });
        }
    }

    return (
        <div className='flex h-screen justify-center items-center text-primary bg-primary-foreground'  >
            <div className="w-96 p-5 rounded-sm">
                  <Toaster />
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
                                        <Input className='bg-secondary text-secondary-foreground'  {...field} />
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
                                        <Input className='bg-secondary text-secondary-foreground'     {...field} />
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
                                        <Input className='bg-secondary text-secondary-foreground'  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex flex-col gap-5 items-center' >

                            <Link to={'/login'} className=' text-sm hover:text-muted-foreground' >

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