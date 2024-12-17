import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../ui/button';
"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
const formSchema = z.object({
    name: z.string().min(2).max(50),
    description: z
        .string()
        .min(10, {
            message: "Bio must be at least 10 characters.",
        })
        .max(160, {
            message: "Bio must not be longer than 30 characters.",
        }),
})
type Props = {}
function IndividualProduct({ }: Props) {
    const { id } = useParams();
    const navigate = useNavigate();
    const role = localStorage.getItem('user_role');

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: ''
        },
    })
    const ac_token = localStorage.getItem('accessToken');
    const { data, isLoading, isError } = useQuery({
        queryKey: ['products', id],
        queryFn: () => {
            return axios.get(`/api/get_product/${id}`, {
                headers: {
                    token: ac_token
                }
            });
        }
    })
    if (isLoading) {
        return <div>Loading...</div>
    }
    if (isError) {
        return <div>Error found...</div>
    }
    const product_info = data?.data.msg;

    console.log("The product info is", product_info);
    const moveBack = () => {
        navigate(-1);
    }
    // useEffect(() => {

    //     if (data?.data.msg) {
    //         form.reset({
    //             name: data?.data.msg.name
    //         })
    //     }

    // }, []);

    return (
        <div className='flex justify-center items-center h-full' >

            <div>
                <div>   <Button onClick={moveBack}>Back</Button></div>
                <div className='flex gap-3' >

                    <div
                        className="bg-white rounded-sm p-4 flex justify-center
                            hover:shadow-pink-500 hover:shadow-lg" >
                        <img className={`md:h-96 h-24`} src={"http://localhost:8080/" + product_info.image} alt="" />
                    </div>
                    <div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Name</FormLabel>
                                            <FormControl>
                                                <Input  {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                This is your product Name
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Products description here</FormLabel>
                                            <FormControl>
                                                <Textarea

                                                    className="resize-none"
                                                    rows={5} cols={70}
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>

                    </div>

                </div>
            </div>

        </div>
    )
}
export default IndividualProduct