import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
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
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRef, useState } from "react"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "../ui/toaster"
const formSchema = z.object({
    name: z.string().min(2).max(100),
    description: z
        .string()
        .min(10, {
            message: "Bio must be at least 10 characters.",
        }),
    price: z.coerce.number().min(1, { message: "The price value must be greater than 0" }),
    category: z.string(),
    // if refine accepts true then no message will be shown below 
    file: z.any()
})
export function CreateProduct() {
    const queryClient = useQueryClient();
    const fileInput = useRef<HTMLInputElement>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: ' ',
            price: 0,
            category: "",
        },
    })
    const { toast } = useToast();
    const [product_info, setProduct_info] = useState(null);
    const ac_token = localStorage.getItem('accessToken');
    const createProduct = async (product: any) => {
        return axios.post(`/api/create_product/`, product, {
            headers: {
                token: ac_token
            }
        });
    }
    const { mutate } = useMutation({
        mutationFn: createProduct,
        onSuccess: (data) => {
            setProduct_info(data.data.product?.image);
            queryClient.invalidateQueries({ queryKey: ['products'] });
            setTimeout(() => {
                clearForm();
            }, 2000);
            toast({
                className: "bg-gray-300 border-none  fixed w-96  bottom-5 pr-5  text-black text-2xl",
                title: "Product created successfully "
            });
        },
        onError: (error) => {
            toast({
                className: "bg-gray-300 border-none   fixed w-96  pr-5  text-black text-2xl",
                title: "Please retry with correct inputs  "
            });
        }
    });
    function clearForm() {
        if (fileInput.current) {
            fileInput.current.value = '';
        }
        setProduct_info(null);
        form.reset();
    }
    function onSubmit(values: z.infer<typeof formSchema>) {
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
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="rounded-none">create new product</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[825px]">
                <Toaster />
                <div className="p-2">
                    {product_info &&
                        <div
                            className="bg-white rounded-sm p-4  flex justify-center " >
                            <img className={`md:h-24 h-24`} src={"http://localhost:8080/" + product_info} alt="" />
                        </div>
                    }
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
                                            <FormDescription>x
                                                This is your product category.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Submit</Button>
                                <Button type="button" className="mx-5" onClick={clearForm} >Clear</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
