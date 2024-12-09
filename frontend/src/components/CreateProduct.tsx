import React, { useRef, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,

} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { z } from "zod"
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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from './ui/textarea'
import { FileType, Product, ProductType } from '@/types'
import { FILE } from 'dns'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
type Props = {}
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
    file: z.any(),
})
function CreateProduct({ }: Props) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            category: 'none'
        },
    });
    const showToastMessage = (bool: boolean) => {
        if (bool) {
            toast.success("Product Created Successfully!...", {
                position: "top-right"
            });
        } else {
            toast.error("InternalError please try again ...", {
                position: "top-right"
            });
        }
    };
    const [file, setFile] = useState<FileType | null>(null);
    const [product, setProduct] = useState<Product>({
        description: '',
        name: '',
        id: null,
        category: 'none',
        price: 0,
        image: ''
    });
    const fileInput = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    async function onSubmit(data: z.infer<typeof formSchema>) {
        console.log("The data file is ", data.file);
        let formData = new FormData();
        // if (file) {
        //     data.file = file.file;
        // }
        // console.log("data file sent is ", data.file);
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price.toString());
        formData.append('category', data.category);
        formData.append('file', data.file);
        const ac_token = localStorage.getItem('accessToken');
        if (ac_token) {
            try {
                const response = await axios.post('/api/create_product', formData,
                    {
                        headers: {
                            token: ac_token
                        }
                    }
                )
                console.log(response.data.product);
                setProduct(response.data.product);
                showToastMessage(true);
                setTimeout(() => {
                    clearFeilds();
                    form.reset({
                        description: '',
                        name: '',
                        category: 'none',
                        price: 0,
                        file: null
                    });
                    
                }, 2000);
            } catch (error) {
                console.log(error);
                showToastMessage(false);
            }
        } else {
            navigate('/')
        }
    };
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target?.files?.[0];
        if (file) {
            setFile({ file: file });
        }
    }
    function clearFeilds() {
        if(fileInput.current){
            fileInput.current.value = '';
        }
        setProduct({
            description: '',
            name: '',
            id: null,
            category: 'none',
            price: 0,
            image: ''
        });
        setFile(null);
    }
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setProduct((prev_product) => ({ ...prev_product, [name]: value }));
    }
    function handleCatChange(val: string) {
        setProduct((prev_product) => ({ ...prev_product, category: val }));
    }
    return (
        <div>
            <Dialog >
                <DialogTrigger asChild>
                    <Button variant="outline">Create  Product</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[1425px] ">
                    <ToastContainer />
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Form {...form} >
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8   p-3 w-[1300px]">
                                    <div className="flex gap-1" >
                                        <div className="flex-1 flex justify-center flex-col bg-white rounded-lg items-center">
                                            <img
                                                className={`md:h-44`}
                                                src={"http://localhost:8080/" + product?.image} alt="" />
                                            {/* <FormField
                                                control={form.control}
                                                name="file"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input className="bg-orange-100"  {...field}
                                                                type="file"
                                                                onChange={handleFileChange}
                                                                ref={fileInput}
                                                                
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            This is your product Image .
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            /> */}
                                            <FormField
                                                control={form.control}
                                                name="file"
                                                render={({ field: { value, onChange, ...fieldProps } }) => (
                                                    <FormItem>
                                                        <FormLabel>Picture</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...fieldProps}
                                                                placeholder="file"
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(event) =>
                                                                    onChange(event.target.files && event.target.files[0])
                                                                }
                                                                ref={fileInput}

                                                            />
                                                        </FormControl>
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
                                                                value={field.value}
                                                            // onChange={handleChange} value={product.name}
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
                                                            <Textarea className="bg-orange-100" rows={10} {...field}
                                                                value={field.value}
                                                                // onChange={handleChange} value={product.description}
                                                                name="description" />
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
                                                            <Input type="number"
                                                                className="bg-orange-100" {...field} name="price"
                                                                value={field.value}
                                                            // onChange={handleChange} value={product.price?.toString()}

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
                                                                //  defaultValue={product.category}
                                                                onValueChange={field.onChange} defaultValue={field.value}
                                                                value={field.value}

                                                            >
                                                                <SelectTrigger className="w-[380px] bg-orange-100 ">
                                                                    <SelectValue placeholder="None" />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-orange-50"  >
                                                                    <SelectItem value="none">None</SelectItem>
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
                                    <DialogFooter>

                                        <Button type="submit"
                                        >Save changes</Button>
                                    </DialogFooter>
                                </form>
                            </Form >
                        </div>
                    </div>

                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreateProduct