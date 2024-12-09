"use client"
// Importing toastify module

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { number, z } from "zod"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
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
import { Textarea } from "./ui/textarea"
import { ProductType } from "@/types"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { Label } from "@radix-ui/react-label";
import { useRef } from "react";

const category_array = ["none", "electronics", "mens", "jewelary"] as const;
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
    name: z.string(),
    description: z.string()
        .min(10, {
            message: "Bio must be at least 10 characters.",
        })
        .max(460, {
            message: "Bio must not be longer than 100 characters.",
        }),
    price: z.coerce.number().min(10, {
        message: "Price must be atleast 10 dollars"
    }).max(10000, {
        message: "Price must be at max 10000 dollars"
    }),
    category: z.string(),
    file: z.any()

})
export function ProductForm({ product, ac_token, setProduct }: { product: ProductType, setProduct: React.Dispatch<React.SetStateAction<ProductType>>, ac_token: string | null }) {
    const showToastMessage = (bool: boolean) => {
        if (bool) {
            toast.success("Product updated Successfully!...", {
                position: "top-right"
            });
        } else {
            toast.error("InternalError please try again ...", {
                position: "top-right"
            });
        }
    };
    const navigate = useNavigate();
    // ...
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: (product.information.name) ? product.information.name : '',
            description: (product.information.description) ? product.information.description : '',
            price: (product.information.price) ? product.information.price : 0,
            category: product.information.category ? product.information.category : "none"
        },
    });
    const fileInput = useRef<HTMLInputElement>(null);
    async function onSubmit(data: z.infer<typeof formSchema>) {
        if (fileInput?.current?.files && fileInput?.current?.files.length > 0) {
            data.file = fileInput?.current?.files[0];
        }
        let formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price.toString());
        formData.append('category', data.category);
        formData.append('file', data.file);
        if (ac_token) {
            try {
                const response = await axios.put(`/api/update_product/${product.information.id}`, formData,
                    {
                        headers: {
                            token: ac_token
                        }
                    }
                )
                console.log(response.data.product);
                setProduct({ information: response.data.product, loading: false });

                showToastMessage(true);
            } catch (error) {
                console.log(error);
                showToastMessage(false);
            }
        } else {
            navigate('/')
        }
    };
    function move_back(e: React.MouseEvent<HTMLElement>) {
        navigate('/');
    }
    return (
        <>
            <ToastContainer />
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8   p-3 w-[1300px]">
                    <div className="flex gap-1" >
                        <div className="flex-1 flex justify-center flex-col bg-white rounded-lg items-center">
                            <img
                                className={`md:h-44`}
                                src={"http://localhost:8080/" + product.information.image} alt="" />
                            <FormField
                                control={form.control}
                                name="file"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input className="bg-orange-100"  {...field}
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

                        </div>
                        <div className="flex-1" >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-orange-700" >Username</FormLabel>
                                        <FormControl>
                                            <Input className="bg-orange-100"  {...field} name="name"
                                            // value={(product.information.name) ? product.information.name : ''}
                                            // onChange={(e) => handleChange(e)}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            This is your product display name.
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
                                        <FormLabel className="text-orange-700">Description</FormLabel>
                                        <FormControl>
                                            <Textarea className="bg-orange-100" rows={10} {...field} name="description"
                                            // onChange={handleTextChange}
                                            // value={product.information.description ? product.information.description : ''} 
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            This is your product description.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-orange-700">Price</FormLabel>
                                        <FormControl>
                                            <Input type="number" className="bg-orange-100" {...field} name="price"
                                            // value={product.information.price ? product.information.price : ''}
                                            //     onChange={handleChange}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            This is your product Price.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel className="text-orange-700">Category</FormLabel>
                                        <FormControl  >
                                            <Select

                                                // value={product.information.category} onValueChange={handleCatChange} 
                                                onValueChange={field.onChange} defaultValue={field.value}
                                            >
                                                <SelectTrigger className="w-[380px] bg-orange-100 ">
                                                    <SelectValue placeholder="None"

                                                    />
                                                </SelectTrigger>
                                                <SelectContent className="bg-orange-50"  >
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
                        </div>
                    </div>
                    <Button type="submit" className="rounded-none float-end">Submit</Button>
                    <Button type="button" onClick={(e) => move_back(e)} className="rounded-none float-end ">
                        Back
                    </Button>
                </form>
            </Form >
        </>
    )
}
