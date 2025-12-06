import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiUrl } from "@/components/Routes/http";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { Spinner } from "@/components/ui/spinner";


const proponentSchema = z.object({
    academic_yr: z.string().min(1, "Title is required"),
    title: z.string().min(1, "Title is required"),
    semester: z.number().min(1, "Must select a semester").max(2),
    program: z.string().min(1, "Program is required"),
    adviser: z.string().min(1, "Adviser is required"),
    name1: z.string().min(1, "You must provide at least one proponent."),
    name2: z.string().optional(),
    name3: z.string().optional(),
    name4: z.string().optional(),
});
type Props = {
    onSuccess?: () => void;
}
const ProponentsAdd = ({onSuccess}: Props) => {
    const [open, setOpen] = useState(false);
    //const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    type formValues = z.infer<typeof proponentSchema>;
    const form = useForm<formValues>({
        resolver: zodResolver(proponentSchema),
        defaultValues: {
            academic_yr: "",
            title: "",
            semester: 1,
            adviser: "",
            program: "",
            name1: "",
            name2: "",
            name3: "",
            name4: "",
        }
    });
    const onSubmit = async (values: z.infer<typeof proponentSchema>) => {
        setLoading(true);

        try {
            const res = await fetch(`${apiUrl}/proponents/add`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    academic_yr: values.academic_yr,
                    title: values.title,
                    semester: values.semester,
                    adviser: values.adviser,
                    program: values.program,
                    details: [
                        {name: values.name1},
                        {name: values.name2},
                        {name: values.name3},
                        {name: values.name4},
                    ].filter(detail => detail.name)
                }),
            });
            if(!res.ok) {
                console.log("Failed to fetch data" +JSON.stringify({values}));
                return JSON.stringify({values});
            }
            form.reset();
            toast.success("Sucessfully added proponent");
            setOpen(false);
            onSuccess?.();
            
        }catch(error){
            console.log(error);
        }finally{
            setLoading(false);
        }
    } 
    return (
       <Dialog open={open} onOpenChange={setOpen}>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
        />
        <DialogTrigger asChild>
            <Button
            className="text-white cursor-pointer"
            variant="primary">
                Add Proponent <Plus/>
            </Button>
        </DialogTrigger>
        <DialogContent className="text-white">
            <DialogHeader>
                <DialogTitle>
                    Add Proponent
                </DialogTitle>
                <DialogDescription>
                    Fill in the project information and proponents members.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="title"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Title *</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Web Based Project Management System" {...field}/>
                            </FormControl>           
                        </FormItem>
                    )}/>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                        control={form.control}
                        name="academic_yr"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Adviser *
                                </FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="2024-2025" {...field}/>
                                </FormControl>
                            </FormItem>
                        )}/>
                        <FormField
                        control={form.control}
                        name="semester"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Semester *
                                </FormLabel>
                                <FormControl>
                                    
                                </FormControl>
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <FormField
                            control={form.control}
                            name="adviser"
                            render={({field})=> (
                                <FormItem>
                                    <FormLabel>
                                        Adviser *
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Ex. Jay De Sagun" {...field}/>
                                    </FormControl>
        
                                </FormItem>
                            )}/>
                        </div>
                        <FormField
                            control={form.control}
                            name="program"
                            render={({field})=> (
                                <FormItem>
                                    <FormLabel>
                                        Program *
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Ex. BSCS" {...field}/>
                                    </FormControl>
                             
                                </FormItem>
                            )}/>
                    </div>
                    <div className="pt-2 flex flex-col gap-4">
                        <h2 className="text-white text-base">Proponents</h2>
                        <FormField
                        control={form.control}
                        name="name1"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="text" placeholder="Ex. John Fritz Selloria" {...field}/>
                                </FormControl>
                     
                            </FormItem>
                        )}/>
                        <FormField
                        control={form.control}
                        name="name2"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="text" placeholder="Ex. Cedric Vhon Pidlaoan" {...field}/>
                                </FormControl>
                            </FormItem>
                        )}/>
                        <FormField
                        control={form.control}
                        name="name3"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="text" placeholder="Ex. Nathan Pabingwit" {...field}/>
                                </FormControl>
                            </FormItem>
                        )}/>
                        <FormField
                        control={form.control}
                        name="name4"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="text" placeholder="Ex. John Michael Borromeo" {...field}/>
                                </FormControl>
                            </FormItem>
                        )}/>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button className="cursor-pointer" type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="cursor-pointer" type="submit" variant="primary" disabled={loading}>
                            {loading ? <Spinner /> : ""}
                            {loading ? "Adding..."  :"Add"}
                        </Button>
                    </div>
                </form>
            </Form>
        </DialogContent>
        </Dialog>
    )
}

export default ProponentsAdd;