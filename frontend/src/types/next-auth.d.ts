import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            userId: string;
            token: string;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        userId: string;
        token: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userId: string;
        token: string;
    }
}
