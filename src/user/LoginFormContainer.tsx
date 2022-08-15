import { AuthApi } from "../api/auth"
import { AsyncState, useAsync } from "../hooks/useAsync"
import { LoginForm } from "./LoginForm"

export const LoginFormContainer = () => {
    const { status, execute } = useAsync(AuthApi.login)

    return (
        <LoginForm 
            submitDisabled={status === AsyncState.PENDING}
            onLoginRquest={async (values) => {
                // sets some flag to loading
                await execute(values)
            }} />
    )
}

