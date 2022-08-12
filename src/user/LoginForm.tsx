import { useForm } from "react-hook-form"

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from "zod"
import { TextField } from "@mui/material"

const loginSchema = z.object({
    email: z.string().min(1, { message: "This field is required"}).email(),
    password: z.string().min(1, { message: "This field is required"}),
})

type LoginValues = z.infer<typeof loginSchema>

interface LoginFormProps {
    onLoginRquest: (data: LoginValues) => Promise<void>
    submitDisabled?: boolean
}

export const LoginForm = (props: LoginFormProps) => {

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema)
    })

    return (
        <div>
            isSubmitting - {isSubmitting.toString()}
            <form
                style={{
                    padding: 10,
                    display: 'flex',
                    flexFlow: "column",
                    gap: 10
                }}
                onSubmit={handleSubmit(props.onLoginRquest)}>
                {/* register your input into the hook by invoking the "register" function */}
                <TextField
                    {...register("email")}
                    label='email'
                    error={!!errors.email}
                    helperText={errors.email?.message ?? "your work email"}   
                />
                {/* include validation with required or other standard HTML validation rules */}
                <TextField type={'password'} {...register("password")} />
                {/* errors will return when field validation fails  */}
                {errors.password && <span>This field is required</span>}
    
                <input disabled={props.submitDisabled} type="submit" value={props.submitDisabled ? "loading" : "submit"} />
            </form>
        </div>
    )
}

