import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { googleAuthRequest } from '../../../services/user'; // ✅ Import correct

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            console.log("SignIn callback:", { user, account, profile });

            if (account.provider === 'google') {
                try {
                    const userData = await googleAuthRequest(user.name, user.email); // ✅ Bons paramètres
                    if (userData) {
                        user.userId = userData.userId;
                        user.token = userData.token;
                        console.log('modified user: ', user);
                        return true;
                    } else {
                        return false;
                    }
                } catch (error) {
                    console.error("Error calling backend:", error);
                    return false;
                }
            }

            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.userId = user.userId;
                token.token = user.token;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },

        async session({ session, token }) {
            session.user.userId = token.userId;
            session.user.token = token.token;
            session.user.name = token.name;
            session.user.email = token.email;
            return session;
        }
    },
});