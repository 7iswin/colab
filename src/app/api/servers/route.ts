import { v4 as uuid } from "uuid"

import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import db from "@/db/db";
import { MemberRole } from "@prisma/client";


export async function POST(req: Request){

    try{
        const { name, imageUrl } = await req.json()
        const profile = await currentProfile()

        if(!profile){
            return new NextResponse("Unauthorized",{status: 401})
        }
        
        const server = await db.server.create({
            data:{
                profileId: profile.id,
                name,
                imageUrl,
                inviteCode: uuid(),
                channel:{
                    create:[
                        { name: "general", profileId: profile.id}
                    ]
                },
                member:{
                    create:[
                        { profileId: profile.id, role: MemberRole.ADMIN}
                    ]
                }
            }
        })

        return NextResponse.json(server)

    }catch(error){
        console.log("[SERVER_POST]",error);
        return new NextResponse("Internal Server Error",{status: 500})
    }
}