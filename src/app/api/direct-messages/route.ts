import db from "@/db/db"
import { currentProfile } from "@/lib/current-profile"
import { DirectMessage } from "@prisma/client"
import { NextResponse } from "next/server"


const MESSAGE_BATCH = 10
export async function GET(
    req:Request
){
    try{
        const profile = currentProfile()
        const { searchParams } = new URL(req.url)
        const cursor = searchParams.get('cursor')
        const conversationId = searchParams.get('conversationId')

        if(!profile){
            return new NextResponse("Unauthorized",{status: 401})
        }
        if(!conversationId){
            return new NextResponse("Missing conversation ID",{status: 400})
        }
        let messages: DirectMessage[] = []

        if(cursor){
            messages = await db.directMessage.findMany({
                take: MESSAGE_BATCH,
                skip: 1,
                cursor:{
                    id: cursor
                },
                where:{
                    conversationId
                },
                orderBy:{
                    createAt: 'desc'
                },
                include:{
                    member:{
                        include:{
                            profile: true,
                        }
                    }
                }
            })
        }else{
            messages = await db.directMessage.findMany({
                take:MESSAGE_BATCH,
                where:{
                    conversationId: conversationId
                },
                orderBy:{
                    createAt: 'desc'
                },
                include:{
                    member:{
                        include:{
                            profile: true,
                        }
                    }
                },
            })
        }

        let nextCursor = null

        if (messages.length === MESSAGE_BATCH){
            nextCursor = messages[messages.length - 1].id
        }
        return NextResponse.json({
            items: messages,
            nextCursor
        })
    }catch(err){
        console.log("[GET_DIRECTMESSAGES_ERROR]",err)
        return new NextResponse("Internal Server Error",{status: 500})
    }
}