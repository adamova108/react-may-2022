import { useRouter } from "next/router"
import { useEffect } from "react"
import { useAuthConext, UserAuthState } from "./AuthContext"

export const AuthGuard = (props: { children: React.ReactNode }) => {
    const { authState } = useAuthConext()
    const router = useRouter()

    useEffect(() => {
        if ( authState === UserAuthState.NOT_AUTH ) {
            router.push('/login')
        }
    }, [authState, router])

    if ( 
        authState === UserAuthState.UNDECIDED 
        || authState === UserAuthState.NOT_AUTH 
    ) {
        // loading state for the entire page
        return null
    }

    return <>{props.children}</>
}
