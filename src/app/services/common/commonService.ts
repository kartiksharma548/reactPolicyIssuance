import { AxiosResponse } from 'axios'
import { COMMON_API_URL } from '../../constants/apiURLS'

import axiosInstance from '../../utils/axiosInstance'
import { ErrorModel } from '../../models/types/errorModelType'

export const getBase64 = async (data: any) => {
    const result = await axiosInstance.post<any, AxiosResponse<any>>(
        COMMON_API_URL.getBase64,
        { ...data }
    )
    return result.data
}

export const checkDealerMismatch = async (data: any) => {
    const result = await axiosInstance.post<any, AxiosResponse<ErrorModel>>(
        COMMON_API_URL.checkDealerMismatch,
        { ...data }
    )
    return result.data
}

export const sendEmail = async (data: TEmail) => {
    const result = await axiosInstance.post<TEmail, AxiosResponse<ErrorModel>>(
        COMMON_API_URL.sendEmailTemplateWise,
        { ...data }
    )
    return result.data
}
