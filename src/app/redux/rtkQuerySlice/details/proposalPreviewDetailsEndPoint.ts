import { COMMON_API_URL } from "../../../constants/apiURLS";
import { IProposal } from "../../../models/IProposal";

import { apiSlice } from "../apiSlice";

export const extendedProposalPreviewDetailsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProposalPreviewDetails: builder.query<any, IProposal>({
            query: (obj) => ({
                url: COMMON_API_URL.getProposalPreviewDetails,
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


        }),
        

    }),
    overrideExisting: false,
})



export const { useGetProposalPreviewDetailsQuery } = extendedProposalPreviewDetailsApi