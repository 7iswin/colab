import { Member, Profile, Server } from "@prisma/client";

export type ServerWithMembersWithProfile = Server & {
    member: (Member & { profile: Profile})[]
}


