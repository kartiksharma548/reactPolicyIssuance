import { AxiosResponse } from 'axios'
import { COMMON_API_URL } from '../../constants/apiURLS'
import {
    ProposalInputModel,
    TenureDetailsInputModel,
    EffectiveDateModel,
    CitySearchModel
} from '../../models/PolicyProposalMDL'
import axiosInstance from '../../utils/axiosInstance'

export const getMasterData = async (data: any) => {
    const result = await axiosInstance.post(COMMON_API_URL.masterforPolicy, {
        ...data
    })
    return result
}
export const getSalutation = async (data: any) => {
    const result = await axiosInstance.post(COMMON_API_URL.salutation)
    return result
}
export const getFirstPageData = async (data: any) => {
    const result = await axiosInstance.post(COMMON_API_URL.getFirstPageData, {
        ...data
    })
    return result
}
export const getVehiclebyOemId = async (data: any) => {
    const result = await axiosInstance.post(COMMON_API_URL.getVehiclebyOemId, {
        ...data
    })
    return result
}
export const getMakebyOemId = async (data: any) => {
    const result = await axiosInstance.post(COMMON_API_URL.getMakebyOemId, {
        ...data
    })
    return result
}
export const getModelbyMakeId = async (data: any) => {
    const result = await axiosInstance.post(COMMON_API_URL.getModelbyMakeId, {
        ...data
    })
    return result
}
export const getVariantsbyModel = async (data: any) => {
    const result = await axiosInstance.post(COMMON_API_URL.getVariantsbyModel, {
        ...data
    })
    return result
}
export const createPolicy = async (data: ProposalInputModel) => {
    const result = await axiosInstance.post<
        ProposalInputModel,
        AxiosResponse<any>
    >(COMMON_API_URL.createPolicy, { ...data })
    return result
}

export const getApplicableCoverTypes = async (data: ProposalInputModel) => {
    const result = await axiosInstance.post<
        ProposalInputModel,
        AxiosResponse<any>
    >(COMMON_API_URL.getApplicableCoverTypes, { ...data })
    return result.data
}
export const getActiveStates = async (data: any) => {
    const result = await axiosInstance.post(COMMON_API_URL.getActiveStates, {
        ...data
    })
    return result
}
export const getActiveCity = async (data: CitySearchModel) => {
    const result = await axiosInstance.post<
        CitySearchModel,
        AxiosResponse<any>
    >(COMMON_API_URL.getActiveCity, { ...data })
    return result
}
export const getPOSCityRTOFromfromCity = async (data: any) => {
    const result = await axiosInstance.post(
        COMMON_API_URL.getPOSCityRTOFromfromCity,
        { ...data }
    )
    return result
}
export const saveMappedRTOV1 = async (data: any) => {
    const result = await axiosInstance.post(COMMON_API_URL.saveMappedRTOV1, {
        ...data
    })
    return result
}
export const getCoverTypeOnPolicyType = async (data: any) => {
    const result = await axiosInstance.post(
        COMMON_API_URL.getCoverTypeOnPolicyType,
        { ...data }
    )
    return result
}
export const getProductbyCoverPolicyType = async (data: any) => {
    const result = axiosInstance.post(
        COMMON_API_URL.getProductbyCoverPolicyType,
        { ...data }
    )
    return result
}
export const getVISoFPrevPolicyData = async (data: any) => {
    const result = axiosInstance.post(COMMON_API_URL.getVISoFPrevPolicyData, {
        ...data
    })
    return result
}
export const getTenureData = async (data: TenureDetailsInputModel) => {
    const result = axiosInstance.post<
        TenureDetailsInputModel,
        AxiosResponse<any>
    >(COMMON_API_URL.getTenureDetails, { ...data })
    return result
}
export const getYOM = async (year: number, policyType: string) => {
    const result = axiosInstance.get(COMMON_API_URL.getYOM, {
        params: {
            year: year.toString(),
            Type: policyType
        }
    })
    return result
}
export const getEffectiveDate = async (data: EffectiveDateModel) => {
    const result = axiosInstance.post<EffectiveDateModel, AxiosResponse<any>>(
        COMMON_API_URL.getEffectiveDate,
        { ...data }
    )
    return result
}
export const checkDuplicateChassis = (data: any) => {
    const result = axiosInstance.post(COMMON_API_URL.checkDuplicateChassis, {
        ...data
    })
    return result
}


export const checkChassisPayment = async (data: any) => {
    const result = axiosInstance.post(COMMON_API_URL.checkChassisPayment, {
        ...data
    })
    return result
}
export const checkDupMobileEmail = async (data: any) => {
    const result = axiosInstance.post(COMMON_API_URL.checkDupMobileEmail, {
        ...data
    })
    return result
}
export const validateEngineChassisNo = async (data: any) => {
    const result = axiosInstance.post(COMMON_API_URL.validateEngineChassisNo, {
        ...data
    })
    return result
}
export const validateSpclRegistrationNo = async (data: any) => {
    const result = axiosInstance.post(
        COMMON_API_URL.validateSpclRegistrationNo,
        { ...data }
    )
    return result
}
export const getStateCode = async (data: number) => {
    const result = axiosInstance.get(COMMON_API_URL.getStateCode, {
        params: {
            RTOId: data
        }
    })
    return result
}

export const checkRtoCodeEnabled = async (data: string) => {
    const result = axiosInstance.get(COMMON_API_URL.checkRtoCodeEnabled, {
        params: {
            RTOCode: data
        }
    })
    return result
}

export const getGSTStateCode = async (data: number) => {
    const result = axiosInstance.post(COMMON_API_URL.getGstStateCode, {
        ...data
    })
    return result
}

export const getVehicleSubTypes = async (data: any) => {
    const result = await axiosInstance.post<any, AxiosResponse<any>>(
        COMMON_API_URL.getVehicleSubTypes,
        {
            ...data
        }
    )
    return result.data
}

export const validateInvoiceDateRange = async (data: any) => {
    const result = await axiosInstance.post<any, AxiosResponse<any>>(
        COMMON_API_URL.validateInvoiceDateRange,
        {
            ...data
        }
    )
    return result.data
}


export const getICsbyOEM = async (data: any) => {
    const response = await axiosInstance.post<any, AxiosResponse<any>>(
        COMMON_API_URL.getICsbyOemDealerId,
        {
            ...data
        }
    );
    return response.data;
}
