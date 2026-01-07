import { COMMON_API_URL } from '../../constants/apiURLS'

import { IProposal } from '../../models/IProposal'
import { IProposalModel } from '../../models/IProposalModel'
import { PolicyProposalMDL } from '../../models/ProposarDetails'
import { NcbCarryFrwrd } from '../../models/types/NCB/NcbCarryForwardType'
import { ProposalModel } from '../../models/types/Proposal/ProposalModel'
import { SavedQuoteList } from '../../models/types/Quotations/quoteListType'

import { ErrorModel } from '../../models/types/errorModelType'
import axiosInstance from '../../utils/axiosInstance'
import axios, { AxiosResponse } from 'axios'

export const getSavedQuotes = async (data: any) => {
    const result = await axiosInstance.post<
        SavedQuoteList,
        AxiosResponse<SavedQuoteList>
    >(COMMON_API_URL.getSavedQuotesList, { ...data })
    return result.data
}

export const getDetailsMasters = async (data: any) => {
    const result = await axiosInstance.post(COMMON_API_URL.getDetailsMasters, {
        ...data
    })
    return result
}
export const getPinCodeStateWise = async (data: any) => {
    const result = await axiosInstance.post(
        COMMON_API_URL.getPinCodeStateWise,
        { ...data }
    )
    return result
}
export const getActiveCity = async (data: any) => {
    const result = await axiosInstance.post(COMMON_API_URL.getActiveCity, {
        ...data
    })
    return result
}

export const sendOTP = async (data: ProposalOTPInputModel) => {
    const result = await axiosInstance.post<
        ProposalOTPInputModel,
        AxiosResponse<any>
    >(COMMON_API_URL.sendOTP, { ...data })

    return result.data
}

export const verifyOTP = async (data: any) => {
    const result = await axiosInstance.post<any, AxiosResponse<any>>(
        COMMON_API_URL.verifyOTP,
        { ...data }
    )

    return result.data
}

export const checkICServiceValidation = async (data: ProposalOTPInputModel) => {
    const result = await axiosInstance.post<
        ProposalOTPInputModel,
        AxiosResponse<any>
    >(COMMON_API_URL.checkIcService, { ...data })

    return result.data
}

export const uploadMandateForm = async (data: any) => {
    const result = await axios.post<any, AxiosResponse<any>>(
        COMMON_API_URL.uploadMandateForm,
        data,
        {
            headers: { 'Content-Type': 'multipart/form-data', Accept: '*/*' }
        }
    )

    return result.data
}

export const submitProposerDetails = async (data: any) => {
    const result = await axiosInstance.post(
        COMMON_API_URL.saveProposerDetails,
        { ...data }
    )
    return result
}

export const getProposalInfo = async (data: any) => {
    const result = await axiosInstance.post<any, AxiosResponse<any>>(
        COMMON_API_URL.getProposalInfo,
        { ...data }
    )
    return result
}

export const getPreviousPolicyNcbDetails = async (data: any) => {
    const result = await axiosInstance.post<any, AxiosResponse<NcbCarryFrwrd>>(
        COMMON_API_URL.getPreviousPolicyNcbDetails,
        { ...data }
    )
    return result.data
}

export const getProposalDetails = async (data: any) => {
    const result = await axiosInstance.post<
        IProposal,
        AxiosResponse<IProposalModel>
    >(COMMON_API_URL.getProposalDetails, { ...data })
    return result.data
}

export const getBreakinProposals = async (data: any) => {
    const result = await axiosInstance.post<
        BreakinSearchType,
        AxiosResponse<BreakinMDLType[]>
    >(COMMON_API_URL.getBreakinProposal, { ...data })
    return result.data['Breakin']
}
export const updateHOProposalStatus = async (data: any) => {
    const result = await axiosInstance.post<
        BreakinStatusUpdateMDL,
        AxiosResponse<BreakinResponse>
    >(COMMON_API_URL.updateHOProposalStatus, { ...data })
    return result.data
}

export const getCencelledProposals = async (data: any) => {
    const result = await axiosInstance.post<
        ProposalModel,
        AxiosResponse<ProposalModel[]>
    >(COMMON_API_URL.getCencelledProposal, { ...data })
    return result.data
}
