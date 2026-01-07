import { AxiosResponse } from 'axios'
import { COMMON_API_URL } from '../../constants/apiURLS'
import {
    ProposalInputModel,
    TenureDetailsInputModel,
    EffectiveDateModel,
    CitySearchModel
} from '../../models/PolicyProposalMDL'
import axiosInstance from '../../utils/axiosInstance'

export const getDashboardData = async (data: DashBoard_Type) => {
    const result = await axiosInstance.post<DashBoard_Type, AxiosResponse<any>>(
        COMMON_API_URL.getDashboardData,
        {
            ...data
        }
    )
    return result.data
}

export const getMaintainenceMessage = async (data: MaintainanceMessageModel) => {
    const result = await axiosInstance.post<MaintainanceMessageModel, AxiosResponse<any>>(
        COMMON_API_URL.getMaintainenceMessage,
        {
            ...data
        }
    )
    return result.data
}
