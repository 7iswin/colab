import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import db from "@/db/db";
import { ChannelType, MemberRole } from "@prisma/client";


import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import IconSetup from "@/components/icon-setup";
import ServerHeader from "./server-header";
import SearchServer from "./server-search";
import ServerSection from "./server-section";


import { channel_role, channel_type } from "@/lib/icon";
import ServerChannel from "./server-channel";
import ServerMember from "./server-member";


interface ServerSidebarProps{
    serverId: string;
}




export default async function ServerSidebar({
    serverId,
}:ServerSidebarProps){
    const profile = await currentProfile()

    if(!profile){
        return redirect("/")
    }

    const server = await db.server.findUnique({
        where:{
            id: serverId
        },
        include:{
            channel:{
                orderBy:{
                    createAt: "asc"
                }
            },
            member:{
                include:{
                    profile: true,

                },
                orderBy:{
                    role: "asc"
                }
            }
        }

    })

    const textChannel = server?.channel.filter((channel) => channel.type === ChannelType.TEXT )
    const audioChannel = server?.channel.filter((channel) => channel.type === ChannelType.AUDIO )
    const videoChannel = server?.channel.filter((channel) => channel.type === ChannelType.VIDEO )
    const member = server?.member.filter((member) => member.profileId !== profile.id)
    const userRole = server?.member.find((member) => member.profileId === profile.id)?.role
    if(!server){
        return redirect("/")
    }
    const role = server?.member.find((member) => member.profileId === profile.id)?.role

    return(
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader
            server={server}
            role={role}
            />
            <ScrollArea className="flex flex-1 px-3">
                <div className="mt-2">
                    <SearchServer data={[
                        {
                            label: "Text Channel",
                            type: "channel",
                            data: textChannel?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: <IconSetup icons={channel_type} target={channel.type} className="mr-2" />
                            }))
                        },
                        {
                            label: "Voice Channel",
                            type: "channel",
                            data: audioChannel?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: <IconSetup icons={channel_type} target={channel.type} className="mr-2" />
                            }))
                        },
                        {
                            label: "Video Channel",
                            type: "channel",
                            data: videoChannel?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: <IconSetup icons={channel_type} target={channel.type} className="mr-2" />
                            }))
                        },
                        {
                            label: "Members",
                            type: "member",
                            data: member?.map((member) => ({
                                id: member.id,
                                name: member.profile.name,
                                icon: <IconSetup icons={channel_role} target={member.role} className={member.role === MemberRole.ADMIN ? "text-indigo-500" : "text-rose-500"} />
                            }))
                        },
                    ]} />
                </div>
                <Separator className="bg-zinc-500 dark:bg-zinc-700 rounded-md my-2" />
                {!!textChannel?.length && (
                    <div className="mb-2">
                        <ServerSection 
                        sectionType="channels"
                        channelType={ChannelType.TEXT}
                        role={role}
                        label="Text Channel"
                        />
                         {textChannel?.map((channel) =>(
                            <ServerChannel
                                key={channel.id}
                                channel={channel}
                                server={server}
                                role={role}
                            />
                        ))

                        }
                    </div>
                )}
                 {!!audioChannel?.length && (
                    <div className="mb-2">
                        <ServerSection 
                        sectionType="channels"
                        channelType={ChannelType.AUDIO}
                        role={role}
                        label="Voice Channel"
                        />

                        <div className="space-y-[2px]">
                            {audioChannel?.map((channel) =>(
                                <ServerChannel
                                key={channel.id}
                                channel={channel}
                                server={server}
                                role={role}
                                />
                                ))
                                
                            }
                        </div>
                    </div>
                )}
                {!!videoChannel?.length && (
                    <div className="mb-2">
                        <ServerSection 
                        sectionType="channels"
                        channelType={ChannelType.VIDEO}
                        role={role}
                        label="Voice Channel"
                        />
                        <div className="space-y-[2px]">
                            {videoChannel?.map((channel) =>(
                                <ServerChannel
                                key={channel.id}
                                channel={channel}
                                server={server}
                                role={role}
                                />
                                ))
                                
                            }
                        </div>
                    </div>
                )}
                {!!member?.length && (userRole !== MemberRole.GUEST) && (
                    <div className="mb-2">
                        
                        <ServerSection 
                        sectionType="members"
                        channelType={ChannelType.VIDEO}
                        role={role} 
                        server={server}
                        label="Members"
                        />
                        <div className="space-y-[2px]">
                            {member?.map((member) =>(
                                <ServerMember
                                key={member.id}
                                member={member}
                                server={server}
                                
                                />
                                ))
                                
                            }
                        </div>
                    </div>
                )}
                
               
            </ScrollArea>
        </div>
    )
    
}