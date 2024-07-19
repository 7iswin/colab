"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import qs from "query-string"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import FileUpload from "@/components/file-upload"
import axios  from "axios"
import { useRouter } from "next/navigation"
import { useModal } from "@/../../hooks/use-modal-store"


const formSchema = z.object({
    fileUrl: z.string().min(1,{message:"Attachment is required"})
})


export default function MessageFileModal(){
    const { onClose,isOpen,type,data } = useModal()
    const isModalOpen = isOpen && type === "messageFile"
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues:{
            fileUrl:"",
        }
    })
    const { apiUrl,query } = data
    
    const handleClose = () =>{
        form.reset()
        onClose()
    }
    
    const router = useRouter()
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query
            })
            await axios.post(url,{
                ...values,
                content: values.fileUrl
            })
            form.reset()
            router.refresh()
            handleClose()
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
                        Add an Attactment
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500" >
                        Add a file to your message.  
                        File formats: .jpg,.png,.gif  
                        File size: 5MB or less
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField 
                                control = {form.control}
                                name="fileUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload 
                                            endpoint="messageFile"  
                                            value={field.value}
                                            onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                                />

                                
                            </div>
                        
                        </div>
                        <DialogFooter
                        className="bg-gray-100 px-6 py-4"
                        >
                            <Button
                            variant="secondary"
                            disabled={isLoading}
                            >
                                Send
                            </Button>
                        </DialogFooter>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}