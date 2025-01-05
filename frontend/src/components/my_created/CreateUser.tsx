import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
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
import { Label } from "@/components/ui/label"
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { format } from "date-fns"

import { Select } from '@radix-ui/react-select';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Toaster } from '@/components/ui/toaster';
import { Textarea } from '../ui/textarea'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '../ui/calendar'
// import { Toaster } from '../ui/toaster'
type Props = {

}

const formSchema = z.object({
    name: z.string().min(2).max(100),
    address: z.string().min(10, {
        message: "Bio must be at least 10 characters.",
    }),
    age: z.coerce.number().min(1, { message: "The price value must be greater than 0" }).max(110, { message: "Maximum limit reached" }),
    email: z.string().email(),
    role: z.string(),
    dob: z.date({
        required_error: "A date of birth is required.",
    })
});
function CreateUser() {

    const queryClient = useQueryClient();
    const ac_token = localStorage.getItem('accessToken');
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            address: '',
            age: 1,
            email: '',
            role: "0",
            dob: new Date("2000-01-01"),

        },
    });
    function onSubmit(values: z.infer<typeof formSchema>) {
        const stringified_date = values.dob.toLocaleString("sv-SE");
        let formData = new FormData();
        formData.append('name', values.name);
        formData.append('address', values.address);
        formData.append('age', values.age.toString());
        formData.append('role', values.role);
        formData.append('dob', stringified_date.substring(0, 11));
        formData.append('email', values.email);
        mutate(formData);
    }
    // const { data, isLoading, isError } = useQuery({
    //     queryKey: ['user', { id }],
    //     queryFn: () => {
    //         return axios.get(`/api/get_user/${id}`, {
    //             headers: {
    //                 token: ac_token
    //             }
    //         });
    //     },
    // });
    const createUser = async (user: FormData) => {
        return axios.post(`/api/create_user/`, user, {
            headers: {
                token: ac_token
            }
        });
    }
    const { mutate } = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            toast({
                className: "bg-gray-300 border-none  fixed w-96 pr-5 top-10 right-5  text-black text-2xl",
                title: "User created successfully ",
                duration: 1000
            });
            queryClient.invalidateQueries({ queryKey: ['users'] });
            form.reset();
            // queryClient.invalidateQueries({ queryKey: ['users', { id }] });
        },
        onError: () => {
            toast({
                className: "bg-gray-300 border-none   fixed w-96 top-10 right-5 pr-5  text-black text-2xl",
                title: "Please retry  ",
                duration: 1000
            });
        }
    });

    // useEffect(() => {
    //     if (data?.data[0]) {
    //         // console.log("The data i found is",data.data[0]);
    //         form.reset({
    //             name: data?.data[0].name,
    //             email: data?.data[0].email,
    //             address: data?.data[0].address,
    //             age: data?.data[0].age,
    //             role: data?.data[0].role.toString(),
    //             dob: new Date(data?.data[0].dob)
    //         });
    //     }
    // }, [data]);
    // if (isLoading) {
    //     return <h1>loading ...</h1>
    // }
    // if (isError) {
    //     return <h1>Error...</h1>
    // }
    return (
        <Dialog>
            <Toaster />
            <DialogTrigger asChild>
                <Button className='w-28 rounded-sm'>Create Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[825px]">
                <DialogHeader>
                    <DialogTitle>CREATE </DialogTitle>
                    <DialogDescription>
                        Create a new user here . Click save when you're done.
                    </DialogDescription>
                    <Form {...form}>
                        <div className="grid gap-4 py-4">
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input   {...field} />
                                            </FormControl>
                                            <FormDescription>
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
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
                                    name="age"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Age</FormLabel>
                                            <FormControl>
                                                <Input  {...field} type='number' />
                                            </FormControl>
                                            <FormDescription>
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
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
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem >
                                            <FormLabel >Role</FormLabel>
                                            <FormControl  >
                                                <Select
                                                    onValueChange={field.onChange} value={field.value}
                                                    disabled={field.value == "1" ? true : false}
                                                >
                                                    <SelectTrigger className="w-[380px] ">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className=""  >
                                                        <SelectItem value="0">0</SelectItem>
                                                        <SelectItem value="1">1</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dob"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Date of birth</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[240px] pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </form>
                        </div>
                    </Form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default CreateUser