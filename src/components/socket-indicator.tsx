"use client"


import { useSocket } from "@/components/provider/socket-provider"
import { Badge } from "@/components/ui/badge"
import { CircleDot, Loader2 } from "lucide-react"




export default function SocketIndicator(){
    const { isConnected } = useSocket()

    if(!isConnected){
        return (
            <Badge 
            className="bg-yellow-600 text-white border-none" 
            variant={"outline"} 
            >
                <Loader2 className="animate-spin text-zinc-500 pr-1 w-4 h-4" />
                Disconnected
            </Badge>
        )
    }
    return (
        <Badge 
        className="bg-emerald-600 text-white border-none " 
        variant={"outline"} 
        >
            <CircleDot className=" text-white animate-pulse pr-1 w-4 h-4"/>
            Connected
        </Badge>
    )
}