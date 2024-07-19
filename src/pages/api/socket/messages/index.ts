import { NextApiRequest } from "next";
import { NextApiReponseServerIO } from "@/../../types";
import { currentProfilePages } from "@/lib/current-profile-pages";
import db from "@/db/db";

export default async function handler(
    req: NextApiRequest,
    res: NextApiReponseServerIO
){
    if(req.method !== "POST"){
        return res.status(405).json({ error: "Method not allowed"})
    }

    try{
        const profile = await currentProfilePages(req)

        const { content, fileUrl } = req.body
        const { serverId, channelId } = req.query

        if(!profile){
            return res.status(401).json({ error: "Unauthorized"})
        }

        if(!serverId || !channelId){
            return res.status(400).json({ error: "Missing Server or Channel ID"})
        }
        
        if(!content){
            return res.status(400).json({ error: "Missing Content"})
        }


        const server = await db.server.findFirst({
            where:{
                id: serverId as string,
                member:{
                    some:{
                        profileId: profile.id
                    }
                }
            },
            include:{
                member: true
            }

        })

        if(!server){
            return res.status(404).json({ error: "Server Not Found"})
        }
        
        const channel = await db.channel.findFirst({
            where:{
                id: channelId as string,
                serverId: server.id
            }
        })

        if(!channel){
            return res.status(404).json({ error: "Channel Not Found"})
        }

        const member = server.member.find((member) => member.profileId === profile.id)

        if(!member){
            return res.status(403).json({ error: "Forbidden"})
        }

        const message = await db.message.create({
            data:{
                content,
                fileUrl,
                channelId: channelId as string,
                memberId: member.id
            },
            include:{
                member: {
                    include:{
                         profile: true
                    }
                }
            }
        })

        const channelKey = `chat:${channelId}:messages`

        res?.socket?.server?.io?.emit(channelKey, message)

        return res.status(200).json({ message})
        
    }catch(err){

        console.log("[SOCKET_IO_HANDLER]", err)
        return res.status(500).json({ error: "Internal Server Error"})
    }

}