import { backendAPI } from "./base"

export const AuthApi = {
    login: async (params?: { email:string, password: string }) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 10000))
            const loginResponse = await backendAPI.post('/login', params)
            // JSON validation
            return loginResponse.data as Record<string, string>
        } catch (err) {
            console.log("handle errors", err)
        }
        return null
    }
}