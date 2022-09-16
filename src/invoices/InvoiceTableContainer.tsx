import { useState, useEffect } from "react"
import { InvoiceDTO, fetchInvoice } from "../api/base"


export const InvoicesTableContainer = (props: {
    page?: number, 
    onPageChangeRequest?: (newPage: number) => unknown
}) => {

    const [ invoices, setInvoices ] = useState<null | {
        total: number,
        invoices: InvoiceDTO[]
    }>(null)

    useEffect(() => {
        console.log("should fetch invoices")
        fetchInvoice({
            // read this page info from the router
            page: props.page ?? 1
        })
            .then(setInvoices)
            .catch((err) =>{
                console.log("handle error", err)
            })
    }, [props.page])

    console.log("props.page", props.page)

    return (
        <div>
            <button
                onClick={() => {
                    props.onPageChangeRequest?.((props.page ?? 1) - 1)
                }}
            >Prev Page</button> 
            <button
                onClick={() => {
                    props.onPageChangeRequest?.((props.page ?? 1) + 1)
                }}
            >Next Page</button> 
            <pre>{JSON.stringify(invoices, null, 4)}</pre>
        </div>
    )
}
