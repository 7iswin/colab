"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useModal } from "@/../../hooks/use-modal-store"
import { useForm } from "react-hook-form"

import qs from "query-string"

import { z } from "zod"
import axios  from "axios"

import { useParams, useRouter } from "next/navigation"
import { ChannelType } from "@prisma/client"


const formSchema = z.object({
    name: z.string().min(1,{ message: "Channel name is required"}).refine(name => name.toLowerCase() !== "general", { message: "Channel name cannot be 'general'"}),
    type: z.nativeEnum(ChannelType)
})


export default function CreateChannelModal(){
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues:{
            name:"",
            type: ChannelType.Text,
        }
    })
    

    const { isOpen, onClose, type } = useModal()
    const isModalOpen = isOpen && type === "createChannel"
    const handleClose = () =>{
        form.reset()
        onClose()
    }

    const params = useParams()
    const router = useRouter()
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            const url = qs.stringifyUrl({
                url:"/api/channels",
                query:{
                    serverId: params?.serverId
                }
            })  
            await axios.post(url,values)
            form.reset()
            router.refresh()
            onClose()
        }
        catch(error){
            console.error(error)        
        }
    }
    
    const isLoading = form.formState.isSubmitting
    return(
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className=" text-2xl text-center">
                        Create Channel
                    </DialogTitle>
                    <DialogDescription
                     className="text-center text-zinc-500" >
                        Create a new channel in your server.   
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">

                            <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                    className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                    >
                                        Channel Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                        disabled={isLoading}
                                        className="bg-zinc-500 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                        placeholder="Enter Channel Name"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Channel Type</FormLabel>
                                    <Select
                                    disabled={isLoading}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                            className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                                            >
                                                <SelectValue placeholder="Select a channel type"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(ChannelType).map((type) => (
                                                <SelectItem
                                                key={type}
                                                value={type}
                                                className="capitalize"
                                                >
                                                {type.toLowerCase()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>

                                    </Select>
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