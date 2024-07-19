
import { Server as NetServer, Socket } from "net"
import { NextApiResponse } from "next"
import { Server as SocketIOServer } from "socket.io"

import { Member, Profile, Server } from "@prisma/client";

export type ServerWithMembersWithProfile = Server & {
    member: (Member & { profile: Profile})[]
}

export type NextApiReponseServerIO = NextApiResponse & {
    socket: Socket &{
        server: NetServer & {
            io: SocketIOServer
        }
    }
}
