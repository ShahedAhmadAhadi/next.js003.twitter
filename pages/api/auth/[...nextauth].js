import NextAuth from "next-auth"
import googleProvider from 'next-auth/providers'

export default NextAuth({
    providers: [
        googleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks:{
        async session({session, token}){
            session.user.tag = session.user.name.split("").join("").toLocaleLowerCase();
            session.user.uid = token.sub
            return session
        }
    }
})