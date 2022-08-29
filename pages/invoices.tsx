import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { InvoicesTableContainer } from "../src/invoices/InvoiceTableContainer"
import { AuthGuard } from "../src/user/AuthGuard"

export default function Invoices () {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!router.isReady) {
            return
        }
        setIsLoading(false)
    }, [router.isReady])
    

    if ( isLoading ) {
        return null
    }
    // loading state when router is not ready?
    const page = router.query.page
        ? parseInt(Array.isArray(router.query.page) ? router.query.page[0] : router.query.page, 10) : 1


    return (
        <AuthGuard>
            <InvoicesTableContainer 
                page={page} 
                onPageChangeRequest={(newPage: number) => {
                // final form we might have a useCallback
                    router.push({
                        pathname: router.pathname,
                        query: {
                            ...router.query,
                            page: newPage
                        }
                    })
                }}
            /></AuthGuard>
    )
}
