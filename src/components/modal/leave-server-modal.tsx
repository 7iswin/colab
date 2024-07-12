"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"


import { useState } from "react"



import { useModal } from "@/../../hooks/use-modal-store"
import axios from "axios"
import { useRouter } from "next/navigation"




export default function LeaveServerModal(){
    

    const { onOpen,isOpen, onClose, type, data } = useModal()
   
    const { server } = data
   

    const isModalOpen = isOpen && type === "leaveServer"

    const [ isLoading, SetIsLoading ] = useState(false)

    const router = useRouter()
    const onConfirm = async () => {
        try{
            SetIsLoading(true)
            const response = await axios.patch(`/api/servers/${server?.id}/leave`)

            onClose()
            router.refresh()
            router.push("/")
            // onOpen("leaveServer", {server: response.data})
        }catch(err){
            console.error("Error leaving server:", err)
        }
        finally{
            SetIsLoading(false)
            onClose()
        }
    }
    
    


    return(
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className=" text-2xl text-center">
                        Leave Server
                    </DialogTitle>
                    <DialogDescription
                     className="text-center text-zinc-500" >
                        Are you sure you want to leave the server "<span className="font-semibold text-indigo-500">{server?.name}</span>"? This action cannot be undone.   
                    </DialogDescription>
                    
                </DialogHeader>

                <DialogFooter
                className="bg-gray-100 px-6 py-4"
                >
                    <div
                    className="flex items-center justify-between w-full"
                    >
                        <Button
                        disabled={isLoading}
                        variant={"ghost"}
                        onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                        disabled={isLoading}
                        variant={"secondary"}
                        onClick={onConfirm}
                        >
                            Confirm
                        </Button>

                    </div>
                </DialogFooter>
               
            </DialogContent>
        </Dialog>
    )
}