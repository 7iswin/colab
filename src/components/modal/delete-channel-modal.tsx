"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"


import { useState } from "react"



import { useModal } from "@/../../hooks/use-modal-store"
import axios from "axios"
import {  useRouter } from "next/navigation"

import qs from "query-string"



export default function DeleteChannelModal(){
    

    const { onOpen,isOpen, onClose, type, data } = useModal()
   
    const { server,channel } = data
   

    const isModalOpen = isOpen && type === "deleteChannel"

    const [ isLoading, SetIsLoading ] = useState(false)

    const router = useRouter()
    const onConfirm = async () => {
        try{
            SetIsLoading(true)
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query:{
                    serverId: server?.id
                }
                
            })
            await axios.delete(url)
            onClose()
            router.push(`/servers/${server?.id}`)
            router.refresh()
        }catch(err){
            console.error("Error deleting channel:", err)
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
                        Delete Channel
                    </DialogTitle>
                    <DialogDescription
                     className="text-center text-zinc-500" >
                        Are you sure you want to delete the channel "<span className="font-semibold text-indigo-500">#{channel?.name}</span>"? This action cannot be undone.   
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