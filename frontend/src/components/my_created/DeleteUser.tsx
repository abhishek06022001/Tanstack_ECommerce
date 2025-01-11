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
import { AlertDialog } from '@radix-ui/react-alert-dialog'
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
// import { Toaster } from '../ui/toaster'
type Props = {
    id: number
}


function DeleteUser({ id }: Props) {

    const queryClient = useQueryClient();
    const ac_token = localStorage.getItem('accessToken');
 

    const deleteProductApi = () => {
        return axios.delete(`/api/delete_user/${id}`, {
            headers: {
                token: ac_token
            }
        });
    }
    const { mutate } = useMutation({
        mutationFn: deleteProductApi,
        onSuccess: () => {
            // queryClient.invalidateQueries({ queryKey: ['products', id] });
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    });
    function delete_product() {
        mutate();
    }

    return (
        <AlertDialog >
            <Toaster/>
            <AlertDialogTrigger><Button
                className=" rounded-sm"

            >Delete Profile</Button></AlertDialogTrigger>
            <AlertDialogContent className=" sm:rounded-none " >
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="" >
                        This action cannot be undone. This will permanently delete your product
                        and remove it from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="sm:rounded-none">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="sm:rounded-none"
                        onClick={delete_product}
                    >Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteUser