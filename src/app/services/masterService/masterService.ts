import { COMMON_API_URL } from '../../constants/apiURLS'
import { IProposal } from '../../models/IProposal'

import { ErrorModel } from '../../models/types/errorModelType'
import axiosInstance from '../../utils/axiosInstance'
import axios, { AxiosResponse } from 'axios'

export const getMasterDropdowns = async () => {
    const result = await axiosInstance.get(COMMON_API_URL.getMasterDropDowns, {
        params: {
            IsActive: 1
        }
    })

    return result.data
}

export const getPaymentMode = async (data: any) => {
    const result = await axiosInstance.post<any, AxiosResponse<PaymentMode>>(
        COMMON_API_URL.getPaymentMode,
        { ...data }
    )
    return result.data
}

export const getFinanciers = async (data: any) => {
    const result = await axiosInstance.post<any, AxiosResponse<any>>(
        COMMON_API_URL.getFinanciers,
        { ...data }
    )
    return result.data
}

export const getActiveBanks = async () => {
    const result = await axiosInstance.get(COMMON_API_URL.getAllActiveBanks)
    return result.data
}

export const GetPGTypes = async (data: any) => {
    const result = await axiosInstance.post(COMMON_API_URL.getPGType, {
        ...data
    })
    return result.data
}

export const GetMisps = async (data: any) => {
    const result = await axiosInstance.post(COMMON_API_URL.getMisp, { ...data })
    return result.data
}

export const GetFinanciers = async (data: any) => {
    const result = await axiosInstance.post(
        COMMON_API_URL.getMappedFinancierDealers,
        { ...data }
    )
    return result.data
}

export const SaveFinanciers = async (data: any) => {
    const result = await axiosInstance.post(
        COMMON_API_URL.saveMappedFinancierDealers,
        { ...data }
    )
    return result
}

export const updateMispDeclaration = async (data: any) => {
    const result = await axiosInstance.get(
        COMMON_API_URL.updateMispDeclaration + '?DealerId=' + data
    )
    return result
}

export const getQuestionnaire = async (type: string = 'CUSTOMER') => {
    const result = await axiosInstance.get(
        `${COMMON_API_URL.getQuestionnaire}?type=${type}`
    );
    return result.data;
};

export const saveAnswers = async (proposalId: number, answers: any[]) => {
  const response = await axiosInstance.post(
    COMMON_API_URL.saveAnswers,
    {
      ProposalId: proposalId,
      QuestionJson: JSON.stringify(answers),
    }
  );
  return response.data;
};


