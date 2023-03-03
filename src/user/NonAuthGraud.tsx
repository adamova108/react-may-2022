import { useRouter } from "next/router"
import { useEffect } from "react"
import { useAuthConext, UserAuthState } from "./AuthContext"

export const NonAuthGuard = (props: { children: React.ReactNode }) => {
    const { authState } = useAuthConext()
    const router = useRouter()

    useEffect(() => {
        if ( authState === UserAuthState.AUTH ) {
            router.push('/')
        }
    }, [authState, router])

    if ( 
        authState === UserAuthState.UNDECIDED 
        || authState === UserAuthState.AUTH 
    ) {
        // loading state for the entire page
        return null
    }

    return <>{props.children}</>
}
