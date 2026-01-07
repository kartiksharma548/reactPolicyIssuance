import { COMMON_API_URL } from '../../constants/apiURLS'
import { IProposal } from '../../models/IProposal'

import { ErrorModel } from '../../models/types/errorModelType'
import axiosInstance from '../../utils/axiosInstance'
import axios, { AxiosResponse } from 'axios'

export const getProposalPreviewDetails = async (data: IProposal) => {
    const result = await axiosInstance.post<IProposal, AxiosResponse<any>>(
        COMMON_API_URL.getProposalPreviewDetails,
        { ...data }
    )

    return result.data
}


export const uploadBreakinImages = async (data: any) => {
    const result = await axiosInstance.post<any, AxiosResponse<ErrorModel>>(
        COMMON_API_URL.uploadBreakinImages,
        data,{
            headers:{"Content-Type": "multipart/form-data","Accept":"*/*"}
          }
    )

    return result.data
}