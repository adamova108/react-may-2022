import { AxiosError } from "axios"
import { backendAPI } from "./base"

export const AuthApi = {
    login: async (params?: { email:string, password: string }) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500))
            const loginResponse = await backendAPI.post('/login', params)
            // JSON validation
            return loginResponse.data as Record<string, string>
        } catch (err) {
            console.log("handle errors", err)
        }
        return null
    }
}

let requestInterceptor: number
let responseInterceptor: number
export const setAPIUserToken = (token: string, onTokenInvliad?: () => unknown) => {
    backendAPI.interceptors.request.eject(requestInterceptor)
    backendAPI.interceptors.response.eject(responseInterceptor)

    requestInterceptor = backendAPI.interceptors.request.use(function (config) {
        console.log("interceptor running here", config)
        // Do something before request is sent
        return {
            ...config,
            headers: {
                ...config.headers,
                "x-access-token": token,
            }
        }
    }, function (error) {
        // Do something with request error
        return Promise.reject(error)
    })

    responseInterceptor = backendAPI.interceptors.response.use(function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response
    }, function (error) {
        if ( error instanceof AxiosError ) {
            if ( error.response?.data === "Invalid Token") {
                if ( onTokenInvliad ) {
                    return onTokenInvliad()
                }
            }
        }
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error)
    })
}