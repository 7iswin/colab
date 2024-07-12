"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { Check, Copy, RefreshCcw } from "lucide-react"

import { useState } from "react"

import axios from "axios"

import { useModal } from "@/../../hooks/use-modal-store"
import { useOrigin } from "@/../../hooks/use-origin"



export default function InviteModal(){
    

    const { onOpen,isOpen, onClose, type, data } = useModal()
    const origin = useOrigin()
    const { server } = data
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`

    const isModalOpen = isOpen && type === "invite"

    const [ copied, SetCopied ] = useState(false)
    const [ isLoading, SetLoading ] = useState(false)

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl)
        SetCopied(true)
        setTimeout(() => SetCopied(false), 2000)
    }

    const onNew = async () => {
        try{
            SetLoading(true)
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`)
            onOpen("invite",{ server: response.data})

        }
        catch(error){
            console.error("Internal Server Error:",error)
        }
        finally{
            SetLoading(false)
        }
    }


    return(
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className=" text-2xl text-center">
                        Invite Friends
                    </DialogTitle>
                    <DialogDescription>
                        
                    </DialogDescription>
                </DialogHeader>
                <div
                className="p-6"
                >
                    <Label>
                        Server Invite Link
                    </Label>
                    <div
                    className="flex items-center mt-2 gap-x-2"
                    >
                        <Input 
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        value={inviteUrl}
                        readOnly
                        />
                        <Button 
                        disabled={isLoading}
                        onClick={onCopy}
                        size="icon"
                        >
                        { copied ?
                         <Check className="w-4 h-4" /> 
                         : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                    <Button
                    onClick={onNew}
                    disabled={isLoading}
                    variant="link"
                    className="text-xs text-zinc-500 mt-4 hover:text-blue-700/70"
                    >
                        Generate a new link
                        <RefreshCcw className="w-4 h-4 ml-2"/>
                    </Button>
                </div>
               
            </DialogContent>
        </Dialog>
    )
}