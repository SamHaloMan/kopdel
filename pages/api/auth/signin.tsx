import { signIn, signOut, useSession } from "next-auth/client";

export default function SignIn() {
    const [session, loading] = useSession()
    if (session) {
        return (
            <>
                <p>Signed in as {session.user.email}</p>
                <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }
    return (
        <>
            <p>Not signed in</p>
            <button onClick={() => signIn()}>Sign in</button>
        </>
    )
}