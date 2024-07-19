
import { ChannelType, MemberRole } from "@prisma/client"
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react"

export const server_role = [
    {
        value:MemberRole.GUEST,
        label:"Guest",
        icon:"",
    },
    {
        value:MemberRole.MODERATOR,
        label:"Moderator",
        icon: ShieldCheck,
    },
    {
        value:MemberRole.ADMIN,
        label:"Admin",
        icon:ShieldAlert,
    }
]


export const channel_type =[
    {
        value:ChannelType.TEXT,
        label:"TEXT CHANNEL",
        icon:Hash,
    },
    {
        value:ChannelType.AUDIO,
        label:"AUDIO CHANNEL",
        icon:Mic,
    },
    {
        value:ChannelType.VIDEO,
        label:"VIDEO CHANNEL",
        icon:Video,
    }
]


export const channel_role = [
    {
        value:MemberRole.GUEST,
        label:"Guest",
        icon:"",
    },
    {
        value:MemberRole.MODERATOR,
        label:"Moderator",
        icon: ShieldCheck,
    },
    {
        value:MemberRole.ADMIN,
        label:"Admin",
        icon:ShieldAlert,
    }
]