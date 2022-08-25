import { LoginFormContainer } from "../src/user/LoginFormContainer"
import { NonAuthGuard } from "../src/user/NonAuthGraud"

const LoginPage = () => {
 
    return (
        <NonAuthGuard>
            <LoginFormContainer />
        </NonAuthGuard>
    )
}

export default LoginPage
