import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useMemo } from 'react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
const formSchema = z.object({
    name: z.string().min(2).max(100),
    description: z
        .string()
        .min(10, {
            message: "Bio must be at least 10 characters.",
        }),
    price: z.coerce.number().min(1, { message: "The price value must be greater than 0" }),
    category: z.string()
})
type Props = {}

function IndividualProduct({ }: Props) {
    const { id } = useParams();
    const ac_token = localStorage.getItem('accessToken');
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
            category: "none"
        },
    })
    const { mutate } = useMutation({
        mutationFn: updateProduct
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
        }
    })

    // CALLING OF ALL HOOKS MUST BE SAME ACROSS ALL THE CYCLES AND NOT CONDITIONAL DUDE 
    useEffect(() => {
        if (data?.data.msg) {
            form.reset({
                name: data?.data.msg.name,
                description: data?.data.msg.description,
                price: data?.data.msg.price,
                category: data?.data.msg.category,
            })
        }
    }, [data]);
    if (isLoading) {
        return <div>Loading...</div>
    }
    if (isError) {
        return <div>Error Found...</div>
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        mutate(values);
    }
    const product_info = data?.data.msg;
    const moveBack = () => {
        navigate(-1);
    }
    return (
        <div className='flex justify-center items-center h-full' >
            <div>
                <div> <Button className='m-5' onClick={moveBack}>Back</Button></div>
                <div className='flex gap-3' >
                    <div
                        className="bg-white rounded-sm p-4 flex justify-center hover:shadow-pink-500 hover:shadow-lg" >
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
                                                <Select

                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger className="w-[380px] ">
                                                        <SelectValue
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent className=""  >
                                                        <SelectItem value="none">none</SelectItem>
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
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default IndividualProduct