import NextAuth from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            // The name to display on the sign-in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign-in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the input tag through the object.
            credentials: {
                username: { label: "Username", type: "text", placeholder: "admin" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const user = { id: "1", name: "Admin", role: "admin", email: "admin@example.com" }

                if (user) {
                    return Promise.resolve(user)
                } else {
                    return Promise.resolve(null)
                }
            }
        })
    ],
    // Use JSON Web Tokens for session instead of database sessions.
    // This is optional but recommended if you want to scale horizontally.
    jwt: {
        secret: 'your-secret-token',
    },
})
