
"use client"

import { SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { useParams, useRouter } from "next/navigation";


interface SearchServerProps{
    data:{
        label:string;
        type: "channel" | "member";
        data:{
            icon: React.ReactNode;
            name: string;
            id: string;
        }[] | undefined;
    }[];
}

export default function SearchServer({data}:SearchServerProps){
    const [ isOpen, SetIsOpen ] = useState(false)

    useEffect(() =>{
        const down = (e: KeyboardEvent) =>{
            if(e.key === "k" && (e.ctrlKey || e.metaKey) ){
                e.preventDefault()
                SetIsOpen((isOpen) => !isOpen)
            }
        }
        document.addEventListener("keydown",down)
        return () => document.removeEventListener("keydown", down)
    },[])


    const params = useParams()
    const router = useRouter()
    const onClick = ({id,type}:{id:string,type: "channel" | "member"}) =>{
        try{
            if(type === "member"){
                return router.push(`/servers/${params?.serverId}/conversations/${id}`)
            }
            if(type === "channel"){
                return router.push(`/servers/${params?.serverId}/channels/${id}`)
            }
        }catch(err){
            console.log(err)
            return router.push(`/servers/${params?.serverId}`)
        }
        finally{
            SetIsOpen(false)
        }
    }

    return(
        <>
            <button
            onClick={() => SetIsOpen(true) }
            className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-indigo-700/10 dark:hover:bg-zinc-700/50 transition"
            >
                <SearchIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <p
                className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition"
                >
                    Search
                </p>
                <kbd
                className="pointer-events-none inline-flex h-5 select-none items-center gap-1 
                rounded border bg-muted px-1.5 font-mono text-[10px] font-medium 
                text-muted-foreground ml-auto"
                >
                    <span className="text-xs">⌘</span>K
                </kbd>

            </button>
            <CommandDialog open={isOpen} onOpenChange={SetIsOpen}>
                <CommandInput placeholder="Search all channels and members"/>
                <CommandList>
                    <CommandEmpty>No Result found
                    </CommandEmpty>
                    {data.map(({ label, type, data }) =>{
                        if(!data?.length) return null

                        return (
                            <React.Fragment key={label}>
                                {type === "member" && (
                                    <CommandSeparator key={`${label}-sep`} />
                                )
                                }

                                <CommandGroup key={`${label}-group`} heading={`${label} (${data.length})`}>
                                    {data?.map(({ id, icon, name }) => (
                                        <CommandItem key={id} className="space-x-1" onSelect={() => onClick({ id, type })}>
                                            {icon}
                                            <span>{name}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </React.Fragment>
                        )
                    })}
                </CommandList>
            </CommandDialog>
        </>
    )
}

 