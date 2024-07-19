import ChatHeader from "@/components/chat/chat-header"
import ChatInput from "@/components/chat/chat-input"
import ChatMessages from "@/components/chat/chat-messages"
import db from "@/db/db"
import { getOrCreateConversation } from "@/lib/conversation."
import { currentProfile } from "@/lib/current-profile"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

interface ConversationPageProps{
    params: { 
        serverId: string,
        memberId: string
    }
}   

export default async function ConversationPage({
    params
}:ConversationPageProps){
    const profile = await currentProfile()

    if(!profile){
        return auth().redirectToSignIn()
    }

    const currentMember = await db.member.findFirst({
        where:{
            serverId: params.serverId,
            profileId: profile.id
        },
        include: {
            profile:true,
        },
    })

    if(!currentMember){
        redirect("/")
    }




    const conversation = await getOrCreateConversation(currentMember.id,params.memberId)

    if(!conversation){
        redirect(`/servers/${params.serverId}`)
    }

    const { memberOne,memberTwo } = conversation

    const otherMember = memberOne.profile.id === profile.id ? memberTwo : memberOne
    


    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full fixed w-full  md:pr-80">
            <ChatHeader 

             imageUrl={otherMember.profile.imageUrl}
             name={otherMember.profile.name}
             serverId={params.serverId}
             type="conversation"
             
            />
            <ChatMessages 
                member={currentMember}
                name={otherMember.profile.name}
                chatId={conversation.id}
                apiUrl="/api/direct-messages"
                paramKey="conversationId"
                paramValue={conversation.id}
                socketQuery={{
                    conversationId: conversation.id,
                }}
                socketUrl="/api/socket/direct-messages"
                type="conversation"
            />
            <ChatInput 
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
                conversationId: conversation.id,
            }}
            />
        </div>
    )
}