import { COMMON_API_URL } from "../../../constants/apiURLS";
import { QuoteInputRequest, PremiumInput, QuoteLists } from "../../../models/PolicyMDL";
import { apiSlice } from "../apiSlice";

export const extendedQuoteApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getQuotes: builder.mutation<QuoteLists, QuoteInputRequest>({
            query: (obj) => ({
                url: COMMON_API_URL.getQuotes,
                method: 'POST',
                body: { ...obj },

            }),
            transformResponse: (response:QuoteLists, meta: any):QuoteLists => {
                
                response.quoteList.forEach(element => {
                    element.checked=false;
                });
                
                return response;
            }


        })

    }),
    overrideExisting: false,
})

export const { useGetQuotesMutation } = extendedQuoteApi