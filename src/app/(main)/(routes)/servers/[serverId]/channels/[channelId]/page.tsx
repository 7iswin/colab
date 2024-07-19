import ChatHeader from "@/components/chat/chat-header"
import ChatInput from "@/components/chat/chat-input"
import ChatMessages from "@/components/chat/chat-messages"
import MediaRoom from "@/components/media-room"

import db from "@/db/db"

import { currentProfile } from "@/lib/current-profile"
import { auth } from "@clerk/nextjs/server"
import { ChannelType } from "@prisma/client"

import { redirect } from "next/navigation"

interface ChannelPageProps{
    params: { 
        serverId: string,
        channelId: string
    }
}   
export default async function ChannelPage({
    params
}:ChannelPageProps){
    const profile = await currentProfile()

    if(!profile){
        return auth().redirectToSignIn()
    }

    const channel = await db.channel.findUnique({
        where:{
            id: params.channelId,
        }
    })

    const member = await db.member.findFirst({
        where:{
            profileId: profile.id,
            serverId: params.serverId
        }
    })

    if(!channel || !member){
        redirect("/")
    }


    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full fixed w-full  md:pr-80">
            <ChatHeader 
            name={channel.name}
            serverId={params.serverId}
            type="channel"
            />
            {
                channel.type === ChannelType.TEXT && (
                    <>
                    <ChatMessages 
                    member={member}
                    name={channel.name}
                    chatId={channel.id}
                    type="channel"
                    apiUrl="/api/messages"
                    socketUrl="/api/socket/messages"
                    socketQuery={{
                        channelId: channel.id,
                        serverId: params.serverId,
                    }}
                    paramKey="channelId"
                    paramValue={channel.id}
                    />
                
                    <ChatInput
                        name={channel.name}
                        type="channel"
                        query={{
                            channelId: channel.id,
                            serverId: params.serverId,
                        }}
                        apiUrl="/api/socket/messages"
                        />
                    </>
                )
            }
            {
                channel.type === ChannelType.AUDIO && (
                    <MediaRoom 
                        chatId={channel.id}
                        audio={true}
                        video={false}
                    />
                )
            }
            {
                channel.type === ChannelType.VIDEO && (
                    <MediaRoom 
                        chatId={channel.id}
                        audio={true}
                        video={true}
                    />
                )
            }
            
        </div>
    )
}