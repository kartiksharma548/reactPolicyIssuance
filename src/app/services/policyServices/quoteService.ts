import { COMMON_API_URL } from '../../constants/apiURLS'
import { AddOnMDL } from '../../models/AddonMDL'

import { IProposal } from '../../models/IProposal'
import { QuoteInputRequest, QuoteLists } from '../../models/PolicyMDL'
import { PolicyProposalMDL } from '../../models/ProposarDetails'
import { NcbCarryFrwrd } from '../../models/types/NCB/NcbCarryForwardType'
import { SavedQuoteList } from '../../models/types/Quotations/quoteListType'

import { ErrorModel } from '../../models/types/errorModelType'
import axiosInstance from '../../utils/axiosInstance'
import axios, { AxiosResponse } from 'axios'

export const getAddons = async (data: QuoteInputRequest) => {
    const result = await axiosInstance.post<
        QuoteInputRequest,
        AxiosResponse<AddOnMDL[]>
    >(COMMON_API_URL.getAddons, { ...data })
    let addonArray: AddOnMDL[] = JSON.parse(
        JSON.stringify(result.data)
    ) as AddOnMDL[]
    addonArray.forEach((element) => {
        element.isChecked = false
        element.CoverValue = ''
        element.IsCoverValue = false
    })
    return addonArray
}

export const fetchQuotations = async (data: QuoteInputRequest) => {
    const result = await axiosInstance.post<
        QuoteInputRequest,
        AxiosResponse<QuoteLists>
    >(COMMON_API_URL.getQuotes, { ...data })
    result.data.quoteList.forEach((element) => {
        element.checked = false
    })
    return result.data
}

export const generateQuoteComparisonPDF = async (data: any) => {
    const result = await axiosInstance.post(
        COMMON_API_URL.generateQuoteComparisonPDF,
        { ...data }
    )
    return result
}

//generateQuoteComparisonPDF({name:'kartik'})
export const generatePremiumbreakUpPDF = async (data: any) => {
    const result = await axiosInstance.post(
        COMMON_API_URL.generatePremiumbreakUpPDF,
        { ...data }
    )
    return result
}

export const getAddonPackages = async (data: IProposal) => {
    const result = await axiosInstance.post<
        IProposal,
        AxiosResponse<AddOnPackageType[]>
    >(COMMON_API_URL.getAddonPackages, { ...data })

    return result.data
}

export const editProposalAPI = async (data: any) => {
    const result = await axiosInstance.post<any, AxiosResponse<any>>(
        COMMON_API_URL.editProposal,
        { ...data }
    )

    return result.data
}

export const PrintPreviewPDF = async (data: any) => {
    const result = await axiosInstance.post(COMMON_API_URL.printPreviewPDF, {
        ...data
    })
    return result
}
