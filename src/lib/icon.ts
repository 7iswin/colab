import { MemberRole } from "@prisma/client"
import { Hash, Mic, ShieldAlert, ShieldCheck, ShieldQuestion, Video, } from "lucide-react"

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
        value:"TEXT",
        label:"TEXT CHANNEL",
        icon:Hash,
    },
    {
        value:"AUDIO",
        label:"AUDIO CHANNEL",
        icon:Mic,
    },
    {
        value:"VIDEO",
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