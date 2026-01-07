import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { COMMON_API_URL } from '../../constants/apiURLS'
import localService from '../../utils/localStorage'
import { BasePath } from '../../constants/baseURL';

const baseQuery = (baseQueryOptions: any) => async (args: any, api: any, extraOptions: any) => {
    const result = await fetchBaseQuery(baseQueryOptions)(args, api, extraOptions);

    if (result.meta?.response?.status == 403) {
                       window.location.href = BasePath + '/#/logout'
    }

    return result;
};


export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQuery({
        baseUrl: "",
        prepareHeaders: (headers: any, { getState }: any) => {
            headers.set('Access-Control-Allow-Origin', '*');
            headers.set('Content-Type', 'application/json')
            headers.set('Authorization', localService.get("token") || "")
            let authDataString: string = localStorage.getItem('loginData') || '{}'
            const authData = JSON.parse(authDataString)

            headers.set('SessionId', Object.keys(authData).length > 0 ? authData['SessionId'].toUpperCase() : "")
            return headers
        },




    }),
    endpoints: () => ({

    }),

})

