import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { getCookie, removeCookies, setCookie } from 'cookies-next'
import { setAPIUserToken } from "../api/auth"


export const enum UserAuthState {
    UNDECIDED = 'UNDECIDED',
    AUTH = 'AUTH',
    NOT_AUTH = 'NOT_AUTH'
}

export const USER_TOKEN_COOKIE_KEY = 'userToken'

interface AuthContextType {
    authState: UserAuthState,
    login: (token?: string) => unknown
    logout: () => unknown
}

export const AuthContext = createContext<null | AuthContextType>(null)


export const AuthContextProvider = (props: {
    children: React.ReactNode
}) => {
    const [authState, setAuthState] = useState(UserAuthState.UNDECIDED)

    const logout = useCallback(() => {
        removeCookies(USER_TOKEN_COOKIE_KEY)
        setAuthState(UserAuthState.NOT_AUTH)
    }, [])

    const login = useCallback((token?: string) => {    
        if ( token ) {
            setCookie(USER_TOKEN_COOKIE_KEY, token)
            setAPIUserToken(token, logout)
            setAuthState(UserAuthState.AUTH)
        } else {
            removeCookies(USER_TOKEN_COOKIE_KEY)
            setAuthState(UserAuthState.NOT_AUTH)
            // setAPIUserToken()
            console.log("unset user token")
        }
    }, [logout])

    useEffect(() => {
        const cookieToken = getCookie(USER_TOKEN_COOKIE_KEY)
        if ( cookieToken ) {
            // we never write boolean in user token cookie
            setAPIUserToken(cookieToken as string, logout)

            // api call to /me .then((result) => {
            setAuthState(UserAuthState.AUTH)
            // })

        } else {
            setAuthState(UserAuthState.NOT_AUTH)
        }
    }, [logout])

    const contextValue = useMemo(() => ({
        authState: authState,
        login,
        logout
    }), [authState, login, logout])

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    )
}

export const useAuthConext = () => {
    const ctx = useContext(AuthContext)
    if ( ctx === null ) {
        throw new Error(`You're not supposed to access auth context without an ancetor provider for it`)
    }
    return ctx
}
