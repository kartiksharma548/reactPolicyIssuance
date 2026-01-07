import { COMMON_API_URL } from "../../../constants/apiURLS";
import { IProposal } from "../../../models/IProposal";
import { SavedQuoteDetails, SavedQuoteList } from "../../../models/types/Quotations/quoteListType";

import { apiSlice } from "../apiSlice";

export const extendedSavedQuotesListApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSavedQuotesList: builder.query<SavedQuoteList, SavedQuoteList>({
            query: (obj) => ({
                url: COMMON_API_URL.getSavedQuotesList,
                method: 'POST',
                body: { ...obj },

            }),
            // transformResponse: (response: any[], meta: any): AddOnMDL[] => {
            //     console.log(meta)
            //     let addonArray: AddOnMDL[] = response;

            //     addonArray.forEach(element => {
            //         element.checked = false;
            //     });

            //     return addonArray;
            //     //return response;
            // }


        })

    }),
    overrideExisting: false,
})

export const { useLazyGetSavedQuotesListQuery } = extendedSavedQuotesListApi