"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import FileUpload from "@/components/file-upload"
import axios  from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"


const formSchema = z.object({
    name: z.string().min(1,{ message: "Server name is required"}),
    imageUrl: z.string().min(1,{message:"Server image is required"})
})


export default function InitialModal(){
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues:{
            name:"",
            imageUrl:"",
        }
    })
    
    const router = useRouter()
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            await axios.post("api/servers",values)
            form.reset()
            router.refresh()
            window.location.reload()
        }
        catch(error){
            console.error(error)
        }
    }
    
    
    
    const isLoading = form.formState.isSubmitting
    
    
    const [ isMounted, SetMounted ] = useState(false)
    
    useEffect(()=>{
        SetMounted(true)
    },[])
    
    if (!isMounted){
        return null
    }
    
    return(
        <Dialog open>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className=" text-2xl text-center">
                        Customize your Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500" >
                        Give your design look of your server. you can change that later on.   
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField 
                                control = {form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload 
                                            endpoint="serverImage"  
                                            value={field.value}
                                            onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                                />

                                
                            </div>
                            <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                    className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                    >
                                        Server Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                        disabled={isLoading}
                                        className="bg-zinc-500 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                        placeholder="Enter Server Name"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />

                        </div>
                        <DialogFooter
                        className="bg-gray-100 px-6 py-4"
                        >
                            <Button
                            variant="secondary"
                            disabled={isLoading}
                            >
                                Create
                            </Button>
                        </DialogFooter>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}