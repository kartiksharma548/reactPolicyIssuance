import { COMMON_API_URL } from '../../../constants/apiURLS'
import { IProposal } from '../../../models/IProposal'
import { IProposalModel } from '../../../models/IProposalModel'

import { apiSlice } from '../apiSlice'

export const extendedProposalDetailsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProposalDetails: builder.query<IProposalModel, IProposal>({
            query: (obj) => ({
                url: COMMON_API_URL.getProposalDetails,
                method: 'POST',
                body: { ...obj }
            })
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
    overrideExisting: false
})

export const { useLazyGetProposalDetailsQuery } = extendedProposalDetailsApi
