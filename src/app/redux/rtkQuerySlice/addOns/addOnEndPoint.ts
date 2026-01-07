import { COMMON_API_URL } from "../../../constants/apiURLS";
import { AddOnMDL } from "../../../models/AddonMDL";
import { QuoteInputRequest } from "../../../models/PolicyMDL";
import { apiSlice } from "../apiSlice";

export const extendedAddOnApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAddons: builder.query<AddOnMDL[], QuoteInputRequest>({
            query: (obj) => ({
                url: COMMON_API_URL.getAddons,
                method: 'POST',
                body: { ...obj },

            }),
            transformResponse: (response: AddOnMDL[], meta: any): AddOnMDL[] => {
                console.log(meta)
                let addonArray: AddOnMDL[] =JSON.parse(JSON.stringify(response)) as AddOnMDL[];




                addonArray.forEach(element => {
                    element.isChecked=false
                });

                return addonArray;
                //return response;
            }


        })

    }),
    overrideExisting: false,
})

export const { useLazyGetAddonsQuery } = extendedAddOnApi