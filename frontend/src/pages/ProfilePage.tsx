import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { Toaster } from '@/components/ui/toaster';
import { useEffect, useRef } from 'react';
import { UserProp } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { error } from 'console';
type Props = {}
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
  }),
  file: z.any()
});
// ye mera schema hai z.any() for file hai yahan 
function ProfilePage({ }: Props) {
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
      file: ''
    },
  });
  const { toast } = useToast();
  const updateUser = async (user: FormData) => {
    return axios.post(`/api/update_user/${id}`, user, {
      headers: {
        token: ac_token
      }
    });
  }
  const { mutate } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast({
        className: "bg-gray-300 border-none  fixed w-96 pr-5 top-10 right-5  text-black text-2xl",
        title: "User edited successfully ",
        duration: 1000
      });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: () => {
      toast({
        className: "bg-gray-300 border-none   fixed w-96 top-10 right-5 pr-5  text-black text-2xl",
        title: "Please retry with correct inputs  ",
        duration: 1000
      });
    }
  });
  const fileInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const moveBack = () => {
    navigate(-1);
  }
  const user_string = localStorage.getItem('user');
  const user_obj = user_string ? JSON.parse(user_string) : null;
  const id = user_obj?.id;
  function onSubmit(values: z.infer<typeof formSchema>) {
    const stringified_date = values.dob.toLocaleString("sv-SE");
    if (fileInput?.current?.files && fileInput?.current?.files.length > 0) {
      values.file = fileInput?.current?.files[0];
    }
    let formData = new FormData();
    formData.append('name', values.name);
    formData.append('address', values.address);
    formData.append('age', values.age.toString());
    formData.append('role', values.role);
    formData.append('dob', stringified_date.substring(0, 11));
    formData.append('email', values.email);
    formData.append('file', values.file);
    mutate(formData);
  }
  const { data, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: () => {
      return axios.get(`/api/get_user/${id}`, {
        headers: {
          token: ac_token
        }
      });
    },
  });
  useEffect(() => {
    if (data?.data[0]) {
      form.reset({
        name: data?.data[0].name,
        email: data?.data[0].email,
        address: data?.data[0].address,
        age: data?.data[0].age,
        role: data?.data[0].role,
        dob: new Date(data?.data[0].dob)
      });
    }
  }, [data, form]);
  if (isLoading) {
    return <div>Loading</div>
  };
  if (isError) {
    return <div>Error found</div >
  }
  return (
    <div className='flex justify-center items-center h-full p-5' >
      <Toaster />
      <div>
        <Form {...form}>
          {data?.data[0].image &&
            <div
              className="bg-white rounded-sm p-4 flex justify-center " >
              <img className={`md:h-96 h-24`} src={"http://localhost:8080/" + data?.data[0].image} alt="" />
            </div>}
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
                    This is your user Image .
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
            <Button type="submit">Submit</Button>
            <Button type="button" className='mx-3' onClick={moveBack}>Back</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
export default ProfilePage