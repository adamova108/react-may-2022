import { AuthApi } from "../api/auth"
import { AsyncState, useAsync } from "../hooks/useAsync"
import { useAuthConext } from "./AuthContext"
import { LoginForm } from "./LoginForm"

export const LoginFormContainer = () => {
    const { status, execute } = useAsync(AuthApi.login)
    const authContext = useAuthConext()
    return (
        <LoginForm 
            submitDisabled={status === AsyncState.PENDING}
            onLoginRquest={async (values) => {
                // sets some flag to loading
                const result = await execute(values)
                console.log(result)
                // JSON check, see if result is valid
                // result contains token???
                authContext.login(result!.token)
            }} />
    )
}

