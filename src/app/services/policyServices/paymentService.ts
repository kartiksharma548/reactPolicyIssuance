import axios, { AxiosResponse } from "axios";
import { COMMON_API_URL } from "../../constants/apiURLS";
import axiosInstance from "../../utils/axiosInstance";
import { IProposalModel } from "../../models/IProposalModel";
import { IProposal } from "../../models/IProposal";

export const getDealerPaymentData = async (data: DealerPaymentMDL) => {
    const result = await axiosInstance.post<
        DealerPaymentMDL,
        AxiosResponse<DealerPaymentMDL[]>
    >(COMMON_API_URL.getDealerPaymentData,{...data});

    result.data.length>0? result.data[0].DealerPaymentData.forEach((data)=>{data.UpdatedPaymentMode=data["PaymentModeId"]; data.ShowBulkCheckbox=false,data.ShowPayButton=true,data.MappedPaymentModes=[]}):[]
    
    return result.data[0];
}


export const updatePaymentMode = async (data: any) => {
    const result = await axiosInstance.post<
        any,
        AxiosResponse<any>
    >(COMMON_API_URL.updatePaymentMode,{...data});
    return result.data;
}

export const sendPayLinkToCustomer = async (data: OrderModel_Type) => {
    const result = await axiosInstance.post<
        OrderModel_Type,
        AxiosResponse<any>
    >(COMMON_API_URL.sendPayLink,{...data});
    return result.data;
}
export const updateConsentDate = async (data: IProposal) => {
    const result = await axiosInstance.post<
    IProposal,
        AxiosResponse<any>
    >(COMMON_API_URL.updateConsentDate,{...data});
    return result.data;
}
export const IsCUGApplicable = async (data: any) => {
    const result = await axiosInstance.post<
    any,
        AxiosResponse<any>
    >(COMMON_API_URL.isCUGApplicable,{...data});
    return result.data;
}
export const doCUGPayment = async (data: any) => {
    const result = await axiosInstance.post<
    any,
        AxiosResponse<any>
    >(COMMON_API_URL.doCUGPayment,{...data});
    return result;
}
export const doNonCUGPayment = async (data: any) => {
    const result = await axiosInstance.post<
    any,
        AxiosResponse<any>
    >(COMMON_API_URL.doNONCUGPayment,{...data});
    return result;
}

export const getChequeLists = async (data: ChequeModelType) => {
    const result = await axiosInstance.post<
    ChequeModelType,
        AxiosResponse<ChequeModelType>
    >(COMMON_API_URL.getChequeLists,{...data});
    return result.data;
}

export const rejectApproveChq = async (data: any) => {
    const result = await axiosInstance.post<
    any,
        AxiosResponse<any>
    >(COMMON_API_URL.rejectApproveChq,{...data});
    return result;
}

export const chequePayment=async (data:any)=>{
    const result=await axios.post<any,AxiosResponse<any>>(COMMON_API_URL.chequePayment,data,{
      headers:{"Content-Type": "multipart/form-data","Accept":"*/*"}
    });
    
    return result.data;
}
export const APDPayment = async (data: OrderModel_Type) => {
    const result = await axiosInstance.post<
        OrderModel_Type,
        AxiosResponse<any>
    >(COMMON_API_URL.APDPayment,{...data});
    return result;
}
export const CancelProposal = async (data: OrderModel_Type) => {
    const result = await axiosInstance.post<
        OrderModel_Type,
        AxiosResponse<any>
    >(COMMON_API_URL.cancelProposal,{...data});
    return result.data;
}

export const getPaymentTimeMinutes = async (data: any) => {
    const result = await axiosInstance.post<
        any,
        AxiosResponse<any>
    >(COMMON_API_URL.getPaymentTimeMinutes,{...data});
    return result.data;
}