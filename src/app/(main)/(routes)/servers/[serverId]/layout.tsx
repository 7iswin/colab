import ServerSidebar from "@/components/server/server-sidebar";
import db from "@/db/db";
import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";


interface ServerIdLayoutProps{
    children: React.ReactNode;
    params: { serverId: string };

}

export default async function ServerIdLayout({children, params}: ServerIdLayoutProps){
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
        }
    })


    if (!server){
        return redirect("/")
    }
    
    
    return(
        <div className="h-full ">
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                <ServerSidebar serverId={params.serverId} />
            </div>
            <main className="h-full md:pl-60">
              {children}
            </main>
        </div>
    )
    
}



