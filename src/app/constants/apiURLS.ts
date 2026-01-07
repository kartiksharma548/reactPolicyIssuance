import { BaseAppKYCURL, BaseAppPGURL, BaseURL } from './baseURL'

export const COMMON_API_URL = {
    login: `${BaseURL}/api/Login/ValidateLoginV2/`,
    generateNewToken: `${BaseURL}/api/Login/GenerateJwtToken/`,
    updateMispDeclaration: `${BaseURL}/api/Login/UpdateMispDeclaration/`,
    getModules: `${BaseURL}/api/Masters/GetModulebyIdForReact`,

    //Policy Master
    getICsbyOemDealerId: `${BaseURL}/api/Masters/GetICsbyOEMId`,
    getVehiclebyOemId: `${BaseURL}/api/Policy/GetVehicleTypeByOEM`,
    getMakebyOemId: `${BaseURL}/api/Policy/GetMakeByOemId`,
    getModelbyMakeId: `${BaseURL}/api/Policy/GetModelbyMakeId`,
    getVariantsbyModel: `${BaseURL}/api/Policy/GetVariantsbyModel`,
    getVariantDetailsbyId: `${BaseURL}/api/Policy/GetVariantDetailsbyId`,
    getDMSCustomerDetials: `${BaseURL}/api/Policy/GetDMSCustomerDetials`,
    getMappedFinancierDealers: `${BaseURL}/api/Masters/GetMappedFinanciarDealer`,
    saveMappedFinancierDealers: `${BaseURL}/api/Masters/SaveMappedFinanciarDealer`,

    //Policy
    salutation: `${BaseURL}/api/Masters/GetActiveSalutation`,
    masterforPolicy: `${BaseURL}/api/Policy/GetMastersforPolicy`,
    policyIssuance: `${BaseURL}/api/Policy/SaveFirstPageData`,
    createPolicy: `${BaseURL}/api/Policy/SavePolicyData`,
    getApplicableCoverTypes: `${BaseURL}/api/Policy/GetApplicableCoverTypes`,
    getVehicleSubTypes: `${BaseURL}/api/Policy/GetVehicleSubTypes`,
    //Proposal Details
    getProposalDetails: `${BaseURL}/api/Policy/GetProposalSessionValue`,
    sendOTP: `${BaseURL}/api/Policy/SendOTP`,
    verifyOTP: `${BaseURL}/api/Common/ValidateOTP`,
    uploadMandateForm: `${BaseURL}/api/Policy/UploadVerifyMandateFOrm`,
    checkIcService: `${BaseURL}/api/Policy/CheckICService`,
    //Quotation
    getQuotes: `${BaseURL}/api/Policy/GetQuotesNew`,
    getSavedQuotesList: `${BaseURL}/api/Policy/GetSavedQuote`,
    saveQuoteProposalForIC: `${BaseURL}/api/Policy/UpdateQuoteforICProposal`,
    getAddonPackages: `${BaseURL}/api/Policy/GetAddonPackages`,
    editProposal: `${BaseURL}/api/Policy/EditProposal`,
    getBreakinProposal: `${BaseURL}/api/Policy/GetBreakinProposalData`,
    updateHOProposalStatus: `${BaseURL}/api/Policy/UpdateHOProposalStatus`,
    //Addons
    getAddons: `${BaseURL}/api/Policy/Getaddon`,

    //Questionnaire
    getQuestionnaire: `${BaseURL}/api/Masters/GetQuestionnaire`,
    saveAnswers: `${BaseURL}/api/Masters/SaveAnswers`, //OK

    //Proposer Details
    getDetailsMasters: `${BaseURL}/api/Policy/GetDetailsMasters`, //OK
    getHardCodedValues: `${BaseURL}/api/Policy/GetHardCodedValues`, //OK
    getAllActiveBanks: `${BaseURL}/api/Masters/GetAllActiveBanks`, //OK
    getPolicyBaseData: `${BaseURL}/api/Policy/Getpolicybasedata`, //OK
    getProposalInfo: `${BaseURL}/api/Policy/GetProposalInfoV1`, //OK
    getFinanciers: `${BaseURL}/api/Masters/GetFinanciersListByDealerV1`, //OK
    getMisp: `${BaseURL}/api/Policy/GetMisp`, //OK
    getPaymentMode: `${BaseURL}/api/Policy/GetPaymentModeV1`, //OK
    getPGType: `${BaseURL}/api/PG_Payment/GetPGType`, //OK
    getProductByIc: `${BaseURL}/api/Policy/GetProductByIc`,
    getNonRenewBuyProposalInfobyPolicyNo: `${BaseURL}/api/Policy/GetNonRenewBuyProposalInfobyPolicyNo`,
    getEng_NoForChassisAllowStatus: `api/MaintenanceTask/GetEngineNumberForChassisAllowStatus`,
    getProposalInfobyPolicyNo: `${BaseURL}/api/Policy/GetProposalInfobyPolicyNo`,
    saveProposerDetails: `${BaseURL}/api/Policy/SaveProposerDetails`,
    getPreviousPolicyNcbDetails: `${BaseURL}/api/Policy/GetPreviousPolicy`,

    //Proposal Preview`
    getProposalPreviewDetails: `${BaseURL}/api/Policy/GetProposalDetailsForPreview`,
    uploadBreakinImages: `${BaseURL}/api/Policy/UpdateBreakinImages`,

    //KYC
    verifyKYC: `${BaseAppKYCURL}/api/KYC/Verify_Customer_KYC`,
    getKYC_CustomerData: `${BaseURL}/api/Policy/GetKYCrequestData`,
    updateProposalData: `${BaseURL}/api/Policy/UpdateProposalData`,
    getKYC_StatusListing: `${BaseURL}/api/Policy/GetKYCStatus`,
    getMasterDropDowns: `${BaseURL}/api/Masters/GetMastersForScheme`,
  queryCustomerKYC: `${BaseAppKYCURL}/api/KYC/Query_Customer_KYC`,
    //Payment
    getPendingProposals: `${BaseURL}/api/Policy/GetProposalDetailsForPreview`,

    getPinCodeStateWise: `${BaseURL}/api/Masters/GetPinCode`,
    getActiveCity: `${BaseURL}/api/Masters/GetActiveCity`,
    getDealerPaymentData: `${BaseURL}/api/Policy/GetDealerPaymentData`,
    sendQuoteToCustomer: `${BaseURL}/api/CustomerConsent/SendQuoteToCustomer`,
    updatePaymentMode: `${BaseURL}/api/Policy/UpdatePaymentMode`,
    updateConsentDate: `${BaseURL}/api/Policy/UpdateConsentDate`,
    sendPayLink: `${BaseURL}/api/PG_Payment/SendPayLinkToCustomer`,
    isCUGApplicable: `${BaseURL}/api/Policy/IsCUGApplicable`,
    doCUGPayment: `${BaseURL}/api/PG_Payment/DoCugPayment`,
    doNONCUGPayment: `${BaseURL}/api/PG_Payment/DoNonCugPayment`,
    getChequeLists: `${BaseURL}/api/Policy/GetChequeApprovalForQC`,
    rejectApproveChq: `${BaseURL}/api/Policy/ApproveRejectChequeQC`,
    chequePayment: `${BaseURL}/api/Policy/ChequePayment`,
    //Dealer
    getFirstPageData: `${BaseURL}/api/Policy/GetPolicyData`,
    sendQuotesVerificationOTP: `${BaseURL}/api/CustomerConsent/SendQuotesVerificationOTP`,
    validateVerificationOTP: `${BaseURL}/api/CustomerConsent/ValidateVerificationOTP`,
    getCustomerDealerDetails: `${BaseURL}/api/CustomerConsent/GetCustomerDealerDetails`,
    getActiveStates: `${BaseURL}/api/Masters/GetActiveStates`,
    getPOSCityRTOFromfromCity: `${BaseURL}/api/Masters/GetPOSCityRTOFromfromCity`,
    saveMappedRTOV1: `${BaseURL}/api/Masters/SaveMappedRTOV1`,
    getCoverTypeOnPolicyType: `${BaseURL}/api/Policy/GetCoversTypebyIdforRenew`,
    getProductbyCoverPolicyType: `${BaseURL}/api/Policy/GetProductbyCoverPolicyType`,
    getVISoFPrevPolicyData: `${BaseURL}/api/Policy/GetVISoFPrevPolicyData`,
    // getCoverTypeOnPolicyType : `${BaseURL}/api/Masters/getCoverTypeOnPolicyType`,
    APDPayment: `${BaseURL}/api/Policy/APDPayment`,
    getYOM: `${BaseURL}/api/Policy/GetYOM`,
    getTenureDetails: `${BaseURL}/api/Policy/GetTenureDetails`,
    getEffectiveDate: `${BaseURL}/api/Policy/GetEffectiveDate`,
    checkDuplicateChassis: `${BaseURL}/api/Policy/IsPolicyAvailable`,
    
    checkChassisPayment: `${BaseURL}/api/Policy/ValidateChassisforPayment`,
    checkDupMobileEmail: `${BaseURL}/api/Policy/IsPolicyAvailableEMAIL_Mobile`,
    validateEngineChassisNo: `${BaseURL}/api/Policy/ValidateEngineChassisNo`,
    validateSpclRegistrationNo: `${BaseURL}/api/Policy/ValidateSpclRegistrationNo`,
    getStateCode: `${BaseURL}/api/Masters/GetStateCode`,
    checkRtoCodeEnabled: `${BaseURL}/api/Masters/CheckRTOCodeEnabled`,
    isQuoteLinkExpired: `${BaseURL}/api/CustomerConsent/IsQuoteLinkExpired`,
    getGstStateCode: `${BaseURL}/api/Policy/GetGstStateCode`,
    generateQuoteComparisonPDF: `${BaseURL}/api/Policy/GenerateQuoteComparisonPDF`,
    generatePremiumbreakUpPDF: `${BaseURL}/api/Policy/GeneratePremiumbreakUpPDF`,
    printPreviewPDF: `${BaseURL}/api/Policy/ConvertHtmlToPdf`,
    cancelProposal: `${BaseURL}/api/PG_Payment/CancelProposal`,

    //common

    getBase64: `${BaseURL}/api/Common/GetBase64String`,
    sendEmailTemplateWise: `${BaseURL}/api/Common/SendEmailTemplateWise`,
    checkDealerMismatch: `${BaseURL}/api/Policy/CheckDealerMismatch`,

    ///dashBoard
    getDashboardData: `${BaseURL}/api/DashBoard/GetDashboardData`,
    getMaintainenceMessage: `${BaseURL}/api/Masters/AddMaintainanceMessage`,

    //Get Cancelled Proposal
    getCencelledProposal: `${BaseURL}/api/Policy/FetchCancelledProposal`,

     validateInvoiceDateRange : `${BaseURL}/api/Policy/validateInvoiceDateRange`,
     getPaymentTimeMinutes: `${BaseURL}/api/Policy/GetPaymentTimeMinutes`

}
