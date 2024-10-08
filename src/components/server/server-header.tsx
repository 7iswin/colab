"use client"

import { ServerWithMembersWithProfile } from "@/../../types";
import { MemberRole } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Recycle, Settings, Trash, User, UserPlus } from "lucide-react";
import { useModal } from "@/../../hooks/use-modal-store";





interface ServerHeaderProps{
    server: ServerWithMembersWithProfile;
    role?: MemberRole;
}

export default function ServerHeader({
server,
role,
}:ServerHeaderProps){

    const isAdmin = role === MemberRole.ADMIN
    const isModerator = role === MemberRole.MODERATOR || isAdmin
    const { onOpen } = useModal()
    return(
        <DropdownMenu >
            <DropdownMenuTrigger 
            className="focus:outline-none"
            asChild
            >
                <button
                className="w-full text-md font-semibold px-3 flex items-center h-12 
                border-neutral-200 dark:border-neutral-800 border-b-2
                 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
                >
                    {server.name}
                <ChevronDown className="h-5 w-5 ml-auto"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
            className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]" 
            >
                {
                    isModerator && (
                        <DropdownMenuItem 
                        className=" text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
                        onClick={() => onOpen("invite",{server})}
                        >
                            Invite Participant
                            <UserPlus className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>

                    )
                }
                {
                    isAdmin && (
                        <DropdownMenuItem 
                        className=" px-3 py-2 text-sm cursor-pointer"
                        onClick={() => onOpen("editServer",{server})}
                        >
                            Server Settings
                            <Settings className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>

                    )
                }
                {
                    isAdmin && (
                        <DropdownMenuItem 
                        className=" px-3 py-2 text-sm cursor-pointer"
                        onClick={() => onOpen("members",{server})}
                        
                        >
                            Manage Member
                            <User className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>

                    )
                }
                {
                    isModerator && (
                        <DropdownMenuItem 
                        className=" px-3 py-2 text-sm cursor-pointer"
                        onClick={() => onOpen("createChannel",{server})}
                        >
                            Create Channel
                            <PlusCircle className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>

                    )
                }
                {
                    isModerator && (
                        <DropdownMenuSeparator />

                    )
                }
                {
                    isAdmin && (
                        <DropdownMenuItem 
                        className="text-rose-700 px-3 py-2 text-sm cursor-pointer "
                        onClick={() => onOpen("deleteServer", { server})}
                        >
                            Delete Server
                            <Trash className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>

                    )
                }
                 {
                    !isAdmin && (
                        <DropdownMenuItem 
                        onClick={() => onOpen("leaveServer", { server})}
                        className="text-rose-700 px-3 py-2 text-sm cursor-pointer "
                        >
                            Leave Server
                            <LogOut className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>

                    )
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
    
}