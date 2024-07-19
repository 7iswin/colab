"use client"

import { Member, Message, Profile } from "@prisma/client";
import ChatWelcome from "./chat-welcome";
import { Loader2, ServerCrash } from "lucide-react";
import { useChatQuery } from "@/../../hooks/use-chat-query";
import { ElementRef, Fragment, useRef } from "react";
import { format } from "date-fns";
import ChatItem from "./chat-items";
import useChatSocket from "@/../../hooks/use-chat-socket";
import { useChatScroll } from "@/../../hooks/use-chat-scroll";

const DATE_FORMAT = "d MM yyyy, HH:mm";

type MessageWithMemberWithProfile = Message & {
    member: Member & { profile: Profile }
}


interface ChatMessageProps{
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramValue: string;
    paramKey: "channelId" | "conversationId" ;
    type: "channel" | "conversation";
}


export default function ChatMessages({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type,
    
}: ChatMessageProps){
    const queryKey = `chat:${chatId}`
    const addKey = `chat:${chatId}:messages`
    const updateKey = `chat:${chatId}:messages:update`

    const chatRef = useRef<ElementRef<"div">>(null)
    const bottomRef = useRef<ElementRef<"div">>(null)

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useChatQuery({
        queryKey,   
        apiUrl,
        paramKey,
        paramValue,

    })

    //update user socket
    useChatSocket({ addKey,updateKey,queryKey })

    //auto Scroll
    useChatScroll({
        chatRef,
        bottomRef,
        loadMore: fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage.valueOf,
        count:data?.pages?.[0]?.items?.length ?? 0,
    })

    //@ts-ignore
    if (status === "pending" ) {
        return(
            <>
                <div className="flex flex-col flex-1 justify-center items-center">
                    <Loader2  className="h-7 w-7 text-zinc-700 animate-spin my-4"/>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Loading Messages ......
                    </p>
                </div>
            </>
        )
    }

    if (status === "error" ) {
        return(
            <>
                <div className="flex flex-col flex-1 justify-center items-center">
                    <ServerCrash  className="h-7 w-7 text-zinc-700 animate-ping my-4"/>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Something When Wrong!
                    </p>
                </div>
            </>
        )
    }


    return(
        <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-auto">
            {!hasNextPage && <div className="flex-1" />}
            {!hasNextPage && <ChatWelcome 
                            type= "channel"
                            name={name}
                            />
            }
            {hasNextPage && (
                <div className="flex justify-center">
                    {
                        isFetchingNextPage ? (
                            <Loader2  className="h-6 w-6 text-zinc-600 animate-spin my-4"/>
                        )
                        :
                        (
                            <button
                            onClick={() => fetchNextPage()}
                            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
                            >
                                Load More Messages...
                            </button>   
                        )
                    }

                </div>
            )}
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group, i) => (
                    <Fragment key={i}>
                        {group.items.map((message: MessageWithMemberWithProfile) => (
                             <ChatItem
                             key={message.id}
                             id={message.id}
                             currentMember={member}
                             member={message.member}
                             content={message.content}
                             fileUrl={message.fileUrl}
                             deleted={message.deleted}
                             isUpdated={message.updateAt !== message.createAt}
                             socketQuery={socketQuery}
                             socketUrl={socketUrl}
                             timestamp={format(new Date(message.createAt), DATE_FORMAT)}
                           />
                        ))}
                    </Fragment>
                ))

                }

            </div>
            <div ref={bottomRef} />
        </div>
    )
}