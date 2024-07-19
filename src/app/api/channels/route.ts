import db from "@/db/db";
import { currentProfile } from "@/lib/current-profile";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";


export async function POST(
    req: Request,
){

   try{
    const profile = await currentProfile()
    const { name,type } = await req.json()
    const {  searchParams }  = new URL(req.url)

    const serverId = searchParams.get("serverId")

    console.log(name,type,serverId)

    if(!profile){
        return new NextResponse("Unauthorized",{status: 401})
    }

    if(!serverId){
        return new NextResponse("Missing Server ID",{status: 400})
    }
    if(name === "general"){
        return new NextResponse("Cannot create a channel named general",{status: 400})
    }
    
    const server = await db.server.update({
        where:{
            id: serverId,
            member:{
                some:{
                    profileId: profile.id,
                    role:{
                        in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                    }
                    
                }
            }
        },
        data:{
            channel:{
                create:{
                    profileId: profile.id,
                    name,
                    type
                }
            }
        }
    })
    console.log(server)
    return NextResponse.json(server)
    }catch(err){
        console.log("[Channel Error]",err)
        return new NextResponse("Internal Server Error",{status: 500})
    }



}
