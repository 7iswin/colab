import db from "@/db/db";
import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";




export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string} }
){

    try{
        const { name, imageUrl } = await req.json()
        const profile = await currentProfile()

        if(!profile){
            return new NextResponse("Unauthorized",{ status: 401})
        }

        if (!params.serverId){
            return new NextResponse("Missing Server ID",{status: 400})
        }

        const ExistServerId = await db.server.findUnique({
            where:{
                id: params.serverId,
                profileId: profile.id
            }
        })
        
        if(!ExistServerId){
            return new NextResponse("Server Not Found",{ status: 404})
        }

        const server = await db.server.update({
            where:{
                id: params.serverId,
                profileId: profile.id
                
            },
            data:{

                name: name,
                imageUrl: imageUrl
            }
        })
        return NextResponse.json(server)

    }catch(err){

        console.log("[SERVER_ID_PATCH]",err);
        return new NextResponse("Internal Server Error",{ status: 500 })
    }



}




export async function DELETE(
    req: Request,
    { params }: { params: { serverId: string} }
){

    try{
        const profile = await currentProfile()

        if(!profile){
            return new NextResponse("Unauthorized",{ status: 401})
        }

        if (!params.serverId){
            return new NextResponse("Missing Server ID",{status: 400})
        }

        const ExistServerId = await db.server.findUnique({
            where:{
                id: params.serverId,
                profileId: profile.id
            }
        })
        if(!ExistServerId){
            return new NextResponse("Server Not Found",{ status: 404})
        }

        const server = await db.server.delete({
            where:{
                id: params.serverId,
                profileId: profile.id
            },
          
        })
        return NextResponse.json(server)

    }catch(err){

        console.log("[SERVER_ID_DELETE]",err);
        return new NextResponse("Internal Server Error",{ status: 500 })
    }

}