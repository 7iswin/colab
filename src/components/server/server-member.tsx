"use client"

import { Member, MemberRole, Profile, Server } from "@prisma/client"
import { useParams, useRouter } from "next/navigation";

import IconSetup from "../icon-setup";
import { channel_role } from "@/lib/icon";
import { cn } from "@/lib/utils";
import UserAvatar from "../user-avatar";


interface ServerMemberProps{
    member: Member & { profile: Profile };
    server: Server;
}   

export default function ServerMember({
    member,
    server,
 
}:ServerMemberProps){
    const params = useParams()
    const router = useRouter()

    const onClick = () =>{
        router.push(`/servers/${server.id}/conversations/${member.id}`)
    }
    return(
        <button
        onClick={onClick}
        className={cn(
            "group px-2 py-2 rounded-md flex items-center gap-x w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
            params?.memberId === member.id && "bg-indigo-700/20 dark:bg-indigo-700"
        )}
        >
            <UserAvatar 
            src={member.profile.imageUrl} 
            className="h-8 w-8 md:h-8 md:w-8"
            />
            <p className={cn(
                "font-semibold text-xs text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                params?.memberId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            )}>
                {member.profile.name}
            </p>
            <IconSetup icons={channel_role} target={member.role}  className={cn(
                "h-4 w-4 ml-2" ,
                member.role === MemberRole.ADMIN ? "text-indigo-500" : "text-rose-500"
            )}/>
        </button>
    )
    
}


