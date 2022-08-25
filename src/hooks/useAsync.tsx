import { useState, useCallback } from "react"

export const enum AsyncState {
    INITIAL,
    PENDING,
    SUCCESS,
    ERROR
}

export const useAsync = <T, P, E = string>(asyncOperation: (params: P) => Promise<T>) => {

    const [status, setStatus] = useState<AsyncState>(AsyncState.INITIAL)
    const [error, setError] = useState<E | null>(null)
    const [data, setData] = useState<T | null>(null)

    const execute = useCallback(async (params: P) => {
        setStatus(AsyncState.PENDING)
        try {
            const response = await asyncOperation(params)
            setStatus(AsyncState.SUCCESS)
            setData(response)

            return response
            // errors handled here should be simple text messages
            // anything more complicated should be handled in other layers
        } catch (err: any) {
            setError(err.toString())
            setStatus(AsyncState.ERROR)
        }
    }, [asyncOperation])

    return {
        status,
        data,
        error,
        execute
    }
}
