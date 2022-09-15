import { useEffect } from "react"
import { fetchClients } from "../api/base"
import { SkeletonLoadingList } from "../components/SkeletonLoadingList/SkeletonLoadingList"
import { AsyncState, useAsync } from "../hooks/useAsync"
import { useAuthConext } from "../user/AuthContext"

export const ClientsContainer = () => {
    const { status, data, error, execute } = useAsync(
        fetchClients
    )

    const { authState } = useAuthConext()

    useEffect(() => {
        execute(undefined)
    }, [execute])

    return (
        <div>
            {authState}
            {
                status === AsyncState.PENDING ? (
                    <SkeletonLoadingList />
                ) : null
            }

            {
                (status === AsyncState.SUCCESS && data?.length === 0) ? (
                    <div>CTA to add clients</div>
                ) : null
            }

            {
                data?.map((client) => {
                    return (
                        <div key={client.id}>
                            {client.name}
                        </div>
                    )
                })
            }
        </div>
    )
}