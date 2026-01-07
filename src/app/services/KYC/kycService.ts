import { COMMON_API_URL } from "../../constants/apiURLS";
import { IProposal } from "../../models/IProposal";
import { SavedQuoteList } from "../../models/types/Quotations/quoteListType";

import { ErrorModel } from "../../models/types/errorModelType";
import axiosInstance from "../../utils/axiosInstance";
import axios, {
    AxiosResponse
    
  } from "axios";


export const verifyCustomerKYC=async (data:IC_KYC_Request_Type)=>{
    const result=await axiosInstance.post<IC_KYC_Request_Type,AxiosResponse<IC_KYC_Response>>(COMMON_API_URL.verifyKYC,{...data});
    
    return result.data;
}

export const getKYC_CustomerData=async (data:IProposal)=>{
    const result=await axiosInstance.post<IProposal,AxiosResponse<IC_KYC_Request_Type>>(COMMON_API_URL.getKYC_CustomerData,{...data});
    
    return result.data;
}

export const updateProposalData=async (data:any)=>{
    const result=await axiosInstance.post<any,AxiosResponse<any>>(COMMON_API_URL.updateProposalData,{...data});
    
    return result.data;
}

export const getKycListing=async (data:SavedQuoteList)=>{
    const result=await axiosInstance.post<SavedQuoteList,AxiosResponse<SavedQuoteList>>(COMMON_API_URL.getKYC_StatusListing,{...data});
    
    return result.data;
}

export const queryCustomerKYC = async (data: IC_KYC_Request_Type) => {
    const result = await axiosInstance.post<IC_KYC_Request_Type, AxiosResponse<IC_KYC_Response>>(COMMON_API_URL.queryCustomerKYC, { ...data });

    return result.data;
}


