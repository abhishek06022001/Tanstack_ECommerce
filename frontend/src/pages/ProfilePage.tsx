import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { useForm } from 'react-hook-form';

import { number, z } from "zod"
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
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@radix-ui/react-select';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
type Props = {}
const formSchema = z.object({
  name: z.string().min(2).max(100),
  address: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    }),
  age: z.coerce.number().min(1, { message: "The price value must be greater than 0" }).max(110, { message: "Maximum limit reached" }),
  email: z.string().email(),
  role: z.string(),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  // file: z.any()
})
function ProfilePage({ }: Props) {
  const ac_token = localStorage.getItem('accessToken');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
      age: 1,
      email: '',
      role: "0",
      dob: new Date("2000-01-01")
    },
  });
  const navigate = useNavigate();
  const moveBack = () => {
    navigate(-1);
  }
  const user_string = localStorage.getItem('user');
  const user_obj = user_string ? JSON.parse(user_string) : null;
  const id = user_obj?.id;
  function onSubmit(values: z.infer<typeof formSchema>) {
    const stringified_date = values.dob.toLocaleString("sv-SE");
    console.log("The values received are", (stringified_date.substring(0,11)));
  }
  const { data, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: () => {
      return axios.get(`/api/get_user/${id}`, {
        headers: {
          token: ac_token
        }
      });
      // data?.data[0] have received the data here
    },
  });
  if (isLoading) {
    return <>Loading...</>
  };
  if (isError) {
    return <>Error found ...</>
  }
  return (
    <div className='flex justify-center items-center h-full p-5' >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-[380px] ">
                      <SelectValue
                      />
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
                <FormDescription>
                  Your date of birth is used to calculate your age.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
          <Button type="button" className='mx-3' onClick={moveBack}>Back</Button>
        </form>
      </Form>
    </div>
  )
}

export default ProfilePage