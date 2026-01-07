import { COMMON_API_URL } from '../../constants/apiURLS'
import { IProposal } from '../../models/IProposal'
import { SavedQuoteList } from '../../models/types/Quotations/quoteListType'

import { ErrorModel } from '../../models/types/errorModelType'
import axiosInstance from '../../utils/axiosInstance'
import axios, { AxiosResponse } from 'axios'

export const getDealerPaymentData = async (data: DealerPaymentMDL) => {
    const result = await axiosInstance.post<
        DealerPaymentMDL,
        AxiosResponse<DealerPaymentMDL[]>
    >(COMMON_API_URL.verifyKYC, { ...data })

    return result.data
}
