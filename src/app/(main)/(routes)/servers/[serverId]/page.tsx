import db from "@/db/db"
import { currentProfile } from "@/lib/current-profile"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

interface ServerPageProps{
    params: { serverId: string}
}   
    
export default async function ServerPage({
    params
}:ServerPageProps){
    const profile = await currentProfile()

    if(!profile){
        return auth().redirectToSignIn()
    }
    const server = await db.server.findUnique({
        where:{
            id: params.serverId,
            member:{
                some:{
                    profileId: profile.id
                }
            }
        },
        include:{
            channel:{
                where:{
                    name: "general"
                },
                orderBy:{
                    createAt: "asc"
                }
            }
        }
    })

    const initialChannel = server?.channel[0]

    if(initialChannel?.name !== "general" ){
        return null
    }

    return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`)
   
}