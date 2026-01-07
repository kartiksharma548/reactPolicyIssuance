import { COMMON_API_URL } from '../constants/apiURLS'
import { QuoteUpdationModel } from '../models/types/Quotations/quoteUpdationType'
import { ErrorModel } from '../models/types/errorModelType'
import axiosInstance from '../utils/axiosInstance'
import axios, { AxiosResponse } from 'axios'

export const saveQuoteProposalForIC = async (data: QuoteUpdationModel) => {
    const result = await axiosInstance.post<
        QuoteUpdationModel,
        AxiosResponse<ErrorModel>
    >(COMMON_API_URL.saveQuoteProposalForIC, { ...data })

    return result.data
}
export const sendQuoteToCustomer = async (data: any) => {
    const result = await axiosInstance.post(
        COMMON_API_URL.sendQuoteToCustomer,
        { ...data }
    )
    return result.data
}
export const sendQuotesVerificationOTP = async (data: any) => {
    const result = await axiosInstance.post(
        COMMON_API_URL.sendQuotesVerificationOTP,
        { ...data }
    )
    return result.data
}
export const validateVerificationOTP = async (data: any) => {
    const result = await axiosInstance.post(
        COMMON_API_URL.validateVerificationOTP,
        { ...data }
    )
    return result.data
}
export const getCustomerDealerDetails = async (data: any) => {
    try {
        const result = await axiosInstance.post(
            COMMON_API_URL.getCustomerDealerDetails,
            { ...data }
        )
        return result
    } catch (e) {
        console.log('Exception : ' + JSON.stringify(e))
    }
}
export const IsQuoteLinkExpired = async (data: any) => {
    const result = await axiosInstance.post(COMMON_API_URL.isQuoteLinkExpired, {
        ...data
    })
    return result
}
