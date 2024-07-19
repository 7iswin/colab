import db from "@/db/db"
import { currentProfile } from "@/lib/current-profile"
import { MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"



export async function DELETE(
    req: Request,
    { params }: { params:{ channelId: string} }
){
    try{
        const profile = await currentProfile()
        const { searchParams } = new URL(req.url)
        const serverId = searchParams.get('serverId')

        if(!profile){
            return new NextResponse("Unauthorized",{status: 401})
        }
        if (!params.channelId){
            return new NextResponse("Missing Channel ID",{status: 400})
        }
        if(!serverId){
            return new NextResponse("Missing Server ID",{status: 400})
        }
        const ExistChannel = await db.server.findFirst({
            where:{
                id: serverId,
                channel:{
                    some:{
                        id: params.channelId
                    }
                }
            }
        })
        if(!ExistChannel){
            return new NextResponse("Channel Not Found",{status: 404})
        }

        const server = await db.server.update({
            where:{
                id: serverId,
                member:{
                    some:{
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data:{
                channel:{
                    delete:{
                        id: params.channelId,
                        name:{
                            not: "general"
                        }
                    }
                }
            }
        })

        return  NextResponse.json(server)
    }catch(err){
        console.log("[Channel DELETE Error]",err)
        return new NextResponse("Internal Channel Error",{status: 500})
    }
}




export async function PATCH(
    req: Request,
    { params }: { params:{ channelId: string} }
){
    try{
        const profile = await currentProfile()
        const { searchParams } = new URL(req.url)
        const serverId = searchParams.get('serverId')
        const { name, type } = await req.json()

        if(!profile){
            return new NextResponse("Unauthorized",{status: 401})
        }
        if (!params.channelId){
            return new NextResponse("Missing Channel ID",{status: 400})
        }
        if(!serverId){
            return new NextResponse("Missing Server ID",{status: 400})
        }

        if(name === "general"){
            return new NextResponse("Cannot rename a channel named general",{status: 400})
        }

        const ExistChannel = await db.server.findFirst({
            where:{
                id: serverId,
                channel:{
                    some:{
                        id: params.channelId
                    }
                }
            }
        })
        if(!ExistChannel){
            return new NextResponse("Channel Not Found",{status: 404})
        }

        const server = await db.server.update({
            where:{
                id: serverId,
                member:{
                    some:{
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data:{
                channel:{
                    update:{
                        where:{
                            id: params.channelId,
                            NOT:{
                                name: "general"
                            }
                        },
                        data: {
                            name,
                            type
                        }
                    }
                }
            }
        })

        return  NextResponse.json(server)
    }catch(err){
        console.log("[Channel UPDATE Error]",err)
        return new NextResponse("Internal Channel Error",{status: 500})
    }
}
