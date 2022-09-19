import { AxiosError } from "axios"
import { getCookie, removeCookies } from "cookies-next"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { setAPIUserToken } from "../src/api/auth"
import { fetchInvoice, InvoiceDTO } from "../src/api/base"
import { USER_TOKEN_COOKIE_KEY } from "../src/user/AuthContext"

export default function Invoices (props: {
    page: number,
    invoices: InvoiceDTO[],
    total: number
}) {
    const router = useRouter()

    return (
        <div>
            <button
                onClick={() => {
                    router.push({
                        pathname: router.pathname,
                        query: {
                            ...router.query,
                            page: (props.page ?? 1) - 1
                        }
                    })
                }}
            >Prev Page</button> 
            <button
                onClick={() => {
                    router.push({
                        pathname: router.pathname,
                        query: {
                            ...router.query,
                            page: (props.page ?? 1) + 1
                        }
                    })
                }}
            >Next Page</button> 
            <pre>{JSON.stringify(props, null, 4)}</pre>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
    try {
        const authToken = getCookie(USER_TOKEN_COOKIE_KEY, { req, res }) as string | undefined
        if (!authToken) {
            return {
                redirect: {
                    destination: "/login",
                    permanent: false
                }
            }
        }
        setAPIUserToken(authToken)
        
        const invoiceResponse = await fetchInvoice()
        

        if ( !invoiceResponse ) {
            //should handle empty response somehow
            return {
                props: {
                    page: 1,
                    invoice: [],
                    total: 0
                }
            }
        }
        
        return {
            props: {
                page: 1,
                invoice: invoiceResponse?.invoices,
                total: invoiceResponse?.total
            }
        }
    } catch (error) {
        console.log("should handle api call error or syntax erorr in try block", error)
        if ( error instanceof AxiosError ) {
            if ( error.response?.data === "Invalid Token") {
                removeCookies(USER_TOKEN_COOKIE_KEY, { req, res })
                return {
                    redirect: {
                        destination: "/login",
                        permanent: false
                    }
                }
            }
        }
        return {
            props: {
                page: 1,
                invoice: [],
                total: 0
            }
        }
    }
   
}
