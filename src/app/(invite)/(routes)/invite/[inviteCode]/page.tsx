import db from "@/db/db"
import { currentProfile } from "@/lib/current-profile"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

interface InviteCodePageProps{
    params: {
        inviteCode: string
    }
}

export default async function InviteCodePage({ params}:InviteCodePageProps){
    const profile = await currentProfile()

    if(!profile){
        return auth().redirectToSignIn()
    }


    if(!params.inviteCode){
        return redirect("/")
    }


    const existingServer = await db.server.findFirst({
        where:{
            inviteCode: params.inviteCode,
            member:{
                some:{
                    profileId: profile.id
                }
            }
        }
    })
    

    if(existingServer){
        return redirect(`/servers/${existingServer.id}`)
    }

    const serverInviteCode = await db.server.findUnique({
        where:{
            inviteCode: params.inviteCode
        }
    })

    if(!serverInviteCode){
        return redirect("/")
    }



    const server = await db.server.update({
        where:{
            inviteCode: params.inviteCode
        },
        data:{
            member:{
                create:{
                    profileId: profile.id
                }
            }
        }
    })


    if(server){
        return redirect(`/servers/${server.id}`)
    }
    


    return null
}