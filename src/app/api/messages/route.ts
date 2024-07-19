import db from "@/db/db"
import { currentProfile } from "@/lib/current-profile"
import { Message } from "@prisma/client"
import { NextResponse } from "next/server"


const MESSAGE_BATCH = 10
export async function GET(
    req:Request
){
    try{
        const profile = currentProfile()
        const { searchParams } = new URL(req.url)
        const cursor = searchParams.get('cursor')
        const channelId = searchParams.get('channelId')

        if(!profile){
            return new NextResponse("Unauthorized",{status: 401})
        }
        if(!channelId){
            return new NextResponse("Missing Channel ID",{status: 400})
        }
        let messages: Message[] = []

        if(cursor){
            messages = await db.message.findMany({
                take: MESSAGE_BATCH,
                skip: 1,
                cursor:{
                    id: cursor
                },
                where:{
                    channelId
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
            messages = await db.message.findMany({
                take:MESSAGE_BATCH,
                where:{
                    channelId: channelId
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
        console.log("[GET_CHANNELS_ERROR]",err)
        return new NextResponse("Internal Server Error",{status: 500})
    }
}