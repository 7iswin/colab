import InitialModal from "@/components/modal/initial-modal"
import db from "@/db/db"
import { initialProfile } from "@/lib/initial-profile"
import { redirect } from "next/navigation"


export default async function SetupPage(){
    const profile = await initialProfile()
    const server = await db.server.findFirst({
        where: {
         member:{
            some:{
                profileId: profile.id
            }
         }
        },
    })

    if (server){
        return redirect(`/servers/${server.id}`)
    }

    return(
        <InitialModal />
    )
}