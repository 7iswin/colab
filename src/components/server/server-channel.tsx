"use client"

import { cn } from "@/lib/utils";
import { Channel, MemberRole, Server } from "@prisma/client"

import { useParams, useRouter } from "next/navigation";

import IconSetup from "@/components/icon-setup";
import { channel_type } from "@/lib/icon";
import ActionTooltip from "../action-tooltip";
import { Edit, Lock, Trash } from "lucide-react";


interface ServerChannelProps{
    channel: Channel;
    server: Server;
    role?: MemberRole
}


export default function ServerChannel({
    channel,
    server,
    role,

}: ServerChannelProps){
    const params = useParams()
    const router = useRouter()


    
    return(
        <button
        onClick={() => {}}
        className={cn(
            "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
            params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"

        )}
        >
            <IconSetup icons={channel_type} target={channel.type}  className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-500"/>
            <p
            className={cn(
                "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                params?.channelId === channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            )}
            >
                {channel.name}
            </p>
            {channel.name !== "general" && role !== MemberRole.GUEST  &&(
                <div className="ml-auto flex items-center gap-x-2">
                    <ActionTooltip label="Edit">
                        <Edit className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" />
                    </ActionTooltip>
                    <ActionTooltip label="Delete">
                        <Trash className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" />
                    </ActionTooltip>
                </div>
            )}
            {channel.name === "general" && (
                <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            ) }
        </button>
    )
}