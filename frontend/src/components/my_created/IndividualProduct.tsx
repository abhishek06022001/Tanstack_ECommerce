import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useMemo, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../ui/button';
"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { number, z } from "zod"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '../ui/toaster';
const formSchema = z.object({
    name: z.string().min(2).max(100),
    description: z
        .string()
        .min(10, {
            message: "Bio must be at least 10 characters.",
        }),
    price: z.coerce.number().min(1, { message: "The price value must be greater than 0" }),
    category: z.string(),
    file: z.any()
})
type Props = {}
function IndividualProduct({ }: Props) {
    const queryClient = useQueryClient();
    const fileInput = useRef<HTMLInputElement>(null);
    const { id } = useParams();
    const ac_token = localStorage.getItem('accessToken');
    const { toast } = useToast();
    const updateProduct = async (product: any) => {
        return axios.put(`/api/update_product/${id}`, product, {
            headers: {
                token: ac_token
            }
        });
    }
    const navigate = useNavigate();
    const role = localStorage.getItem('user_role');
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: ' ',
            price: 0,
            category: ""
        },
    })
    const { mutate } = useMutation({
        mutationFn: updateProduct,
        onSuccess: () => {
            toast({
                className: "bg-gray-300 border-none  fixed w-96 pr-5 top-10 right-5  text-black text-2xl",
                title: "Product edited successfully "
            });
            queryClient.invalidateQueries({ queryKey: ['products', id] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: () => {
            toast({
                className: "bg-gray-300 border-none   fixed w-96 top-10 right-5 pr-5  text-black text-2xl",
                title: "Please retry with correct inputs  "
            });
        }
    });
    // const ac_token = localStorage.getItem('accessToken');
    const { data, isLoading, isError } = useQuery({
        queryKey: ['products', id],
        queryFn: () => {
            return axios.get(`/api/get_product/${id}`, {
                headers: {
                    token: ac_token
                }
            });
        },
    })
    // CALLING OF ALL HOOKS MUST BE SAME ACROSS ALL THE CYCLES AND NOT CONDITIONAL DUDE 
    useEffect(() => {
        if (data?.data.msg) {
            // console.log("Use effect called", data?.data.msg.category);
            form.reset({
                name: data?.data.msg.name,
                description: data?.data.msg.description,
                price: data?.data.msg.price,
                category: data?.data.msg.category,
            })
        }
    }, [data]);
    if (isLoading) {
        return <div>loading . . . </div>
    }
    if (isError) {
        navigate('/login');
    }
    function onSubmit(values: z.infer<typeof formSchema>) {
        // console.log(values)
        if (fileInput?.current?.files && fileInput?.current?.files.length > 0) {
            values.file = fileInput?.current?.files[0];
        }
        let formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('price', values.price.toString());
        formData.append('category', values.category);
        formData.append('file', values.file);
        mutate(formData);
    }
    const product_info = data?.data.msg;
    const moveBack = () => {
        navigate(-1);
    }
    return (
        <div className='flex justify-center items-center h-full' >
            <Toaster />
            <div>

                {/* <div> <Button className='m-5' onClick={moveBack}>Back</Button></div> */}
                <div className='flex gap-3' >
                    {product_info.image &&
                        <div
                            className="bg-white rounded-sm p-4 flex justify-center " >
                            <img className={`md:h-96 h-24`} src={"http://localhost:8080/" + product_info.image} alt="" />
                        </div>}

                    <div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="file"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input className=""  {...field}
                                                    /// <reference path="fileInput" />
                                                    type="file"
                                                    accept="image/*, application/pdf"
                                                    ref={fileInput}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                This is your product Image .
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Products price here</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="resize-none"
                                                    type='number'
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem >
                                            <FormLabel >Category</FormLabel>
                                            <FormControl  >
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="w-[380px] ">
                                                        <SelectValue
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent className=""  >
                                                        <SelectItem value="jewelary">Jewelary</SelectItem>
                                                        <SelectItem value="mens">Men's Clothing</SelectItem>
                                                        <SelectItem value="electronics">Electronics</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormDescription>
                                                This is your product category.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Submit</Button>
                                <Button type="button" className='mx-3'
                                    onClick={moveBack}
                                >Back</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default IndividualProduct