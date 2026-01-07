import axios, {
    AxiosError,
    AxiosInstance,
    InternalAxiosRequestConfig
} from 'axios'
import toast from 'react-hot-toast'
import { BaseURL, BasePath } from '../constants/baseURL'
import common from '../utils/common'
import { COMMON_API_URL } from '../constants/apiURLS'
//import { history } from '../helpers/history';
//   import {
//     getApiResponseErrorMessage,
//     getResponseFromApiResponse,
//   } from "./common";
//import { APP_USER_URLS } from "../constants/urls";

const axiosInstance: AxiosInstance = axios.create()

axios.defaults.baseURL = ''
axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        let userSessionActive = localStorage.getItem('token').replace('"', '')
        const jwtTokenTimeExpire = common.checkJwtExpiration(userSessionActive)

        // if (jwtTokenTimeExpire == 2) {
        //     await generateNewToken()
        //     userSessionActive = localStorage.getItem('token').replace('"', '')
        // }
        // else if (jwtTokenTimeExpire == 2) {
        //     window.location.href = BasePath + '/#/logout'
        // }

        if (config.headers) {
            config.headers['Access-Control-Allow-Origin'] = '*'

            if (!config.headers['Content-Type']) {
                config.headers['Content-Type'] = 'application/json'
            }
            // config.withCredentials = true;
            if (userSessionActive && config.headers) {
                config.headers['Authorization'] = `Bearer ${userSessionActive}`
                let authDataString: string = localStorage.getItem('loginData') || '{}'
                const authData = JSON.parse(authDataString)
                config.headers['SessionId'] = Object.keys(authData).length > 0 ? authData['SessionId'].toUpperCase() : ""
            }
        }

        return config
    }
)
axiosInstance.interceptors.response.use(
    (response): any => {
        return response
    },
    async (error: AxiosError): Promise<never> => {
        console.log(error)

        if (
            error.message &&
            error.message === 'Network error' &&
            !error.response
        ) {
            //toast.error("Newtwork error - Make Sure Api is runnung");
        }
        if (error.response) {
            const { status, data }: any = error.response
            //const message = getApiResponseErrorMessage(data);
            if (status === 400) {
                localStorage.clear()
            }
            if (error.message && error.message === 'Network Error' && !data) {
                //toast.error(error.message)
            }
            if (data?.data?.message) {
                toast.error(data?.data?.message)
            }
            if (status === 404) {
                //window.location.pathname= APP_USER_URLS.notFound;
            }
            if (status === 401) {
                await generateNewToken()

                return axiosInstance(error.config);

            } else if (status === 403) {
                window.location.href = BasePath + '/#/logout'

            }
            // } else if (status === 404) {
            //   toast.error("404 Not Found");
            // } else if (status === 405) {
            //   toast.error("Method Not Allowed");
            // } else if (status === 408) {
            //   toast.error("Request Timeout");
            // } else if (status === 500) {
            //   toast.error("Internal Server Error");
            // } else if (status === 502) {
            //   toast.error("Bad Gateway");
            // } else if (status === 503) {
            //   toast.error(" Service Unavailable");
            // } else if (status === 504) {
            //   toast.error("Gateway Timeout");
            // } else if (status === 417) {
            //   if (data.errors?.service) {
            //     const errors = Object.values(data?.errors?.service);
            //     if (errors) {
            //       //errors?.map((value: any) => toast.error(value));
            //     }
            //   } else {
            //     //message && toast.error(message);
            //   }
            // }
            else {
                // message && toast.error(message);
            }
        }
        return Promise.reject({
            status: error?.response?.status
            // message: getApiResponseErrorMessage(error?.response?.data),
        })
    }
)

const generateNewToken = async () => {
    let authDataString: string = localStorage.getItem('loginData') || '{}'
    const authData = JSON.parse(authDataString)

    let data = await axios.get(
        COMMON_API_URL.generateNewToken + '?userName=' + authData['DealerCode']
    )
    if (data.data != '' || data.data != null) {
        localStorage.setItem('token', data.data)
    }
}

export default axiosInstance
