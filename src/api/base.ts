import axios, { AxiosError } from "axios";
import { gql, GraphQLClient } from 'graphql-request'

export const invoiceBackendAPI = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
    // headers: {
    //     "x-access-token": "111"
    // }
});

export const invoiceGraphQLAPI = new GraphQLClient(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`
)

export interface ClientsDTO {
    companyDetails: {
        address: string;
        name: string;
        regNumber: string;
        vatNumber: string;
    };
    email: string;
    id: string;
    invoicesCount: number;
    name: string;
    totalBilled: number;
    user_id: string;
}

export type ClientsRestApiResponse = {
    clients: Array<ClientsDTO>,
    total: number
}

export type ClientsGraphqlApiResponse = {
    clients: {
        results: Array<ClientsDTO>,
        total: number    
    }
}

export type InvoiceByIdResponse = {
    invoice: {
        client_id: string;
        date: number;
        dueDate: number;
        id: string;
        invoice_number: string;
        user_id: string;
        value: number;
    };
    success: boolean;
}

export interface FetchClientsParams {
    page: number;
    sort: string;
    sortBy: string | null;
};

export const fetchClients = async (params: FetchClientsParams) => {
    const queryObject = params.sortBy ? {
        page: params.page,
        sort: {
            [params.sortBy]: params.sort.toString()
        }
    } : { page: params.page };

    return await invoiceBackendAPI.get<ClientsRestApiResponse>(`/clients?params=${encodeURIComponent(JSON.stringify(queryObject))}`)
}


export const fetchGraphQLClients = async (params: FetchClientsParams) => {

    const sortKey = params.sortBy ? params.sortBy : "creation"
    const sortOrder = params.sort.toString().toLocaleLowerCase()

    const clientListRequestQuery = gql`
    {
        clients (sort: {${sortKey}: "${sortOrder}"}) {
            results {
                id,
                name,
                email,
                totalBilled,
                companyDetails{
                    name
                }
                }
                total
            }
        }
    `

    const graphqlRespone = await invoiceGraphQLAPI.request<ClientsGraphqlApiResponse>(
        clientListRequestQuery,
    )

    // return restApiResponse.data
    return {
        clients: graphqlRespone.clients.results,
        total: graphqlRespone.clients.total
    }
}


export const getInvoiceById = async (id: string) => {
    const result =  await invoiceBackendAPI.get<InvoiceByIdResponse>(`/invoices/${id}`)
    return result.data.invoice;
}

export const UserAPI = {

    _reqRef: NaN,
    _responseRef: NaN,

    initApiToken (token: string, handleTokenExpired: () => unknown) {
        invoiceBackendAPI.interceptors.request.eject(this._reqRef)
        invoiceBackendAPI.interceptors.request.use((req) => {
            if ( !req.headers ) {
                req.headers = {}
            }
            req.headers["x-access-token"] = token
            console.log('req.headers', req.headers, token)
            return req;
        })

        invoiceBackendAPI.interceptors.response.eject(this._responseRef)
        this._responseRef = invoiceBackendAPI.interceptors.response.use((res) => {
            return res
        }, (error) => {
            if ( error instanceof AxiosError ) {
                if ( error && error.response?.data === "Invalid Token" ) {
                    handleTokenExpired()
                }
            }
        })

        invoiceGraphQLAPI.setHeader("x-access-token", token)
    },

    login: async (params: {email: string, password: string}) => {
        
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000))
            const loginResponse = await invoiceBackendAPI.post<{
                token: string
            }>('/login', {
                email: params.email,
                password: params.password
            })
            
            return loginResponse.data
        } catch ( error ) {
            if ( error instanceof AxiosError ) {
                return Promise.reject(error.response?.data)
            }

            return Promise.reject("Unkown Error")
        }
        
    }
}

UserAPI.initApiToken.bind(UserAPI)
