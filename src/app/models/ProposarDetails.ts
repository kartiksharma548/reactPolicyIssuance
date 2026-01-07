export class PolicyProposalMDL {
    RENEWALID: number
    IS_BH_REGIST_NO: number
    ROAD_TAX_AMT:number
    ProposerDetails: PolicyProposerMDL = {
        PROPOSAL_ID: 0,
        IC_ID: 0,
        PROPOSAL_NO: '',
        PROPOSAL_TYPE: '',
        COMPANY_SALUTATION: '',
        IS_BREAKIN: 0,
        BREAKIN_TYPE_CODE: '',
        COMPANY_NAME: '',
        STATE_ID: 0,
        CITY_ID: 0,
        PIN: '',
        STD_CODE: '',
        LANDLINE: '',
        SALUTATION_ID: 0,
        SALUTATION: '',
        FIRST_NAME: '',
        MIDDLE_NAME: '',
        LAST_NAME: '',
        GENDER: '',
        DOB: '',
        AGE: 0,
        ADDRESS1: '',
        ADDRESS2: '',
        ADDRESS3: '',
        CONCT_PER_DESIG: '',
        MOB_NO: '',
        CONCT_PER_STD: '',
        CONCT_PER_LL: '',
        CONCT_PER_EXT: '',
        EMAIL: '',
        PAN_NO: '',
        LANGUAGE_ID: 0,
        INSURED_GSTIN: '',
        FK_OFFICE_ID: 0,
        SACCODE: '',
        BUYER_STATE_CODE: '',
        INSURED_STATE_CODE: '',
        INSURED_OFFICE_CODE: '',
        MOB_COUNTRY_CODE: '',
        LOCAL_SERVICE_OFFICE_ID: 0,
        AADHAAR_NO: '',
        EI_ACCOUNT_NO: '',
        INSURED_AADHAR_NO: '',
        IS_CRM_DMS_FETCH: 0,
        COUNTRY_CODE: '',
        OCCUPATION_TYPE: '',
        ALT_COUNTRY_CODE: '',
        ALT_MOBILE_NO: '',
        IS_FLOOD_CESS: '',
        KILOWATT: '',
        PreviousPolicyType: 0,
        PREV_FKISURANCE_COMP_ID: 0,
        TP_POLICY_NO: '',
        PREV_TP_FKISURANCE_COMP_ID: 0,
        PREV_TP_POLICY_EFFECTIVE_DATE: '',
        PREV_TP_POLICY_EXPIRY_DATE: '',
        DMS_BOOKING_ID: '',
        TPPOLICY_NO: '',
        TPPOLICY_INSUR_COMP_ID: 0,
        TPPOLICY_INSUR_COMP_NAME: '',
        TPPOLICY_EFFECTIVE_DATE: '',
        TP_POLICY_EXPIRY_DATE: '',
        Prev_POLICY_NO: '',
        INSURD_NAME: '',
        CKYC_NO: '',
        DOI: '',
        AADHAAR_NO0: '',
        AADHAAR_NO1: '',
        IsKycVerified: '',
        KEY: 'ProposerDetails'
    }
    DealerDetails: PolicyDealerMDL = {
        DEALER_ID: 0,
        DEALER_USER_ID: 0,
        PSP_NAME: '',
        PSP_AADHAR_NO: '',
        PSP_PAN_NO: '',
        IS_POSP_ENABLE: 0,
        IS_CALL_CENTER_ENABLE: 0,
        FK_POSPID: 0,
        FK_IMID: 0,
        FK_CREID: 0,
        FK_RMID: 0,
        PSP_TYPE: '',
        MISP_CODE: '',
        IS_MISP: 0,
        MISP_NAME: '',
        MISP_PAN_NO: '',
        DEALER_BROKERAGE: '',
        VISOF_BROKERAGE: '',
        VISOF_REM_BROKERAGE: '',
        VISOF_REW_BROKERAGE: '',
        VISOF_TP_BROKERAGE: '',
        DEALER_TYPE: '',
        MISPOSP_TYPE: '',
        BROKER_CER_EMPID: 0
    }
    VehicleDetails: PolicyVehicleMDL = {
        PRODUCT_ID: 0,
        POLICY_TYPE: '',
        VEHICLE_CLASS: '',
        TARIFF_CODE_ID: '',
        CHASSIS_NO: '',
        ENGINE_NO: '',
        IsEngineNumberAllowed: false,
        MODEL_ID: 0,
        VARIANT_ID: 0,
        IS_CSD: 0,
        INVOICE_DATE: '',
        EXSHOWROOM_PRICE: '',
        RTO_ID: '',
        VEH_REGIST_NO: '',
        PROPOSAL_TYPE: '',
        RTO_NAME: '',
        RegistrationNo1: '',
        RegistrationNo2: '',
        SEATING_CAPACITY: '',
        CUBIC_CAPACITY: '',
        MFG_YEAR: '',
        POLICY_EFFECTIVE_DATE: '',
        POLICY_EXPIRY_DATE: '',
        IS_GOVT_VEHICLE: 0,
        IS_IMT23_CHECKED: 0,
        IS_INSPECTION_DONE: 0,
        INSPECTION_DATE: '',
        RENEW_IDV: '',
        IS_AA_CO_FITTED: '',
        VIN_NO_PATTERN: '',
        CHANNEL_PARTNER: '',
        FUEL_TYPE: '',
        IC_SHORT_CODE: '',
        REGISTRATION_DATE: '',
        RMS_LEAD_NO: '',
        IS_GST: 0,
        COVER_TYPE_CODE: '',
        COVER_TYPE_NAME: '',
        COVER_TYPE_ID: '',
        OD_TENURE: '',
        TP_TENURE: '',
        TPPOLICY_EFFECTIVE_DATE: '',
        TPPOLICY_EXPIRY_DATE: '',
        IS_DRIVING_LICENECE: 0,
        PA_COVER_TENURE: 0,
        PACOVER_EFF_FROMDATE: '',
        PACOVER_EFF_TODATE: '',
        CPA_PREV_TENURE: 0,
        ON_ROAD_PRICE: '',
        CPA_WAIVER_REASON_CODE: '',
        TPPACKAGE_POLICYNO: '',
        TPPACKAGE_TENURE: '',
        TPPACKAGE_EFFECTIVEDATE: '',
        TPPACKAGE_EXPIRYDATE: '',
        TPPACKAGE_IC_ID: '',
        EMI_AMOUNT: '',
        Count: '',
        KEY: ''
        
    }
    // AddonDetails: PolicyAddonMDL[];
    BiFuelKitDetails: PolicyBiFuelKitMDL = {
        IS_COFITTED_BIFUELKIT: 0,
        IS_BIOFUEL_KIT: 0,
        IS_CNG: 0,
        BIOFUEL_KIT_COST: '',
        BIOFUEL_KIT_INVOICE: '',
        IS_INVOICE_SUBMIT: 0
    }
    FinancerDetails: PolicyFinancerMDL = {
        FINANCER_ID: 0,
        FINANCER_NAME: '',
        BRANCH_NAME: '',
        BRANCH_CITY: '',
        AGGREMENT_TYPE: '',
        FIN_BRANCH_ACCOUNT_NUMBER: ''
    }
    // GeographicArea: PolicyGeographicAreaMDL[];
    // EAccessoryDetails: PolicyAccessoryMDL[];
    // NEAccessoryDetails: PolicyAccessoryMDL[];
    PaymentDetails: PolicyPaymentMDL = {
        PAYMENT_MODE: '',
        IS_PRE_PAID: 0,
        CHEQUE_NO: '',
        CHEQUE_DATE: '',
        BANK_ID: '',
        BANK_CITY: '',
        BANK_NAME: '',
        UBER_ID: '',
        FKPRODUCT_ID: 0,
        FKPROPOSAL_ID: 0,
        POLICY_SEQ_NO: '',
        IS_AUTOMATED: 0,
        IC_PROPOSAL_NO: '',
        PAYMENT_MODE_CODE: '',
        FKBANK_ID: 0,
        BANK_ACC_NO: '',
        PAYMENT_STATUS: 0,
        IC_PAYMENT_PROCESS_DATE: '',
        IC_PAYMENT_PROCESS_TIME: '',
        APD_PAYMENT_MODE: '',
        INS_INVOICE_NO: '',
        CHASSIS_NO: '',
        VISOF_PROPOSAL_NO: '',
        GROSS_PREM: 0,
        PGType: ''
    }
    DiscountDetails: PolicyDiscountMDL = {
        IS_NCB_CARRY_FORWARD: 0,
        VOLUNTARY_DISC: '',
        IS_ANTI_THEFT_DEVICE: 0,
        IS_AA_MEMBERSHIP: 0,
        ASSOCIATION_NAME: '',
        MEMBERSHIP_NO: '',
        AACARD_EXPIRY_DATE: '',
        AAMonth: '',
        AAYear: '',
        IS_FREE_INSURANCE: 0,
        DISCOUNT_TYPE_ID: 0,
        DISCOUNT_TYPE: '',
        SCHEME_NAME: '',
        SCHEME_ID: 0,
        BROKERAGE: 0,
        QC_FLAG: 0,
        IS_HANDICAPPED: 0,
        IS_QC_DOCMAN: 0
    }
    LiabilityDetails: PolicyLiabilityMDL = {
        IS_PAID_DRIVER: 0,
        PC_IS_UNNAMED_PERSON: 0,
        PC_UNNAMED_PER_COUNT: 0,
        PC_COVER_AMOUNT: '',
        LL_IS_DRIVER: 0,
        LL_IS_UNNAMED_PASSENGER: 0,
        LL_UNNAMED_PASSENGER_COUNT: 0,
        PC_NOMINEE_NAME: '',
        PC_AGE: 0,
        PC_GENDER: '',
        PC_RELATION: '',
        PA_OWN_DRVNOM_MINOR_NAME: '',
        PA_OWN_DRVNOM_MINOR_RELTION: ''
    }
    Nominees: NomineeModel = {
        NomineeAge: 0,
        NomineeName: '',
        NomineeRelation: '',
        NomineeGender: '',
        AppointeeAge: 0,
        AppointeeRelation: '',
        AppointeeGender: '',
        AppointeeName: ''
    }
    SolicitationDetails: SolicitationDetailsModel = {
        PolicySource: '',
        AgentID: 0
    }
    NcbCarryFrwrdDetails: PolicyNcbCarryFrwrdMDL = {
        PREV_IS_VISOF_POLICY: '0',
        PREV_IS_NONVISOF_POLICY: 0,
        PREV_VEH_CHASSIS_NO: '',
        PREV_VEH_ENGINE_NO: '',
        PREV_VEH_MODEL: '',
        PREV_VEH_VARIANT_NO: '',
        PREV_VEH_MAKE: '',
        PREV_VEH_MANU_YEAR: '',
        PREV_VEH_INVOICEDATE: '',
        PREV_VEH_REG_NO: '',
        PREV_VEH_POLICY_NO: '',
        PREV_VEH_POLICY_NONVISOF: '',
        PREV_VEH_NCB: 0,
        PREV_VEH_IC: 0,
        PREV_VEH_ISNCBCERTIFICATE: false,
        PREV_VEH_ADDRESS: '',
        PREV_VEH_POLICYSTARTDATE: '',
        PREV_VEH_POLICYENDDATE: '',
        PREV_VEH_NCB_EFFECTIVE_DATE: '',
        PREV_VEH_NCB_EFFECTIVE_DATE_NONVISOF: '',
        PRODUCT_NAME: '',
        KEY: 'NcbCarryFrwrdDetails'
    }
    ExtraFieldPropRequires: ExtraFieldPropRequires = {
        TPstatus: 0
    }
    IsPucChecked: boolean
    PucWording: string
    ISELECTRICAL: number
    PREV_FKISURANCE_COMP_ID: number
    TPPOLICY_INSUR_COMP_ID: number
    TPPOLICY_NO: string
    PREV_TP_FKISURANCE_COMP_ID: number
    TP_POLICY_NO: string
    PREV_TP_POLICY_EFFECTIVE_DATE: string
    PREV_TP_POLICY_EXPIRY_DATE: string
    IsPolDataFound: string
    IsAAMembership: boolean
    IS_NCB_CARRY_FORWARD: boolean
    ValidationError: string
    ValidationStatus: number
    TPstatus: number
    GrossPremium: number
    ProposalSaved: string
    PrevTPTenure: string
    DMSFieldsDisabled: string
    Current_coverID: string
    StateCode: string
    ODPREVINSUR: string
    ODPREVPolicy: string
    TPPREVINSUR: string
    ID_PREV_TP_FKISURANCE_COMP_ID: string
    OTHER_PREV_TP_POLICY_EFFECTIVE_DATE: string
    OTHER_PREV_TP_POLICY_EXPIRY_DATE: string
    EncProposalId: string
    TabSessionKey: string
    TabErrorMessage: string
    KYC_STATUS: number
    IsProposalSaved: number
    ManufactureYear: string
    ENC_IC_ID: string
    ENC_ADDON: string
    NEWPOLICY_EFFECTIVE_DATE: string
    NEWPOLICY_EXPIRY_DATE: string
}
export interface PolicyProposerMDL {
    PROPOSAL_ID: number
    IC_ID: number
    PROPOSAL_NO: string
    PROPOSAL_TYPE: string
    COMPANY_SALUTATION: string
    IS_BREAKIN: number
    BREAKIN_TYPE_CODE: string
    COMPANY_NAME: string
    STATE_ID: number
    CITY_ID: number
    PIN: string
    STD_CODE: string
    LANDLINE: string
    SALUTATION_ID: number
    SALUTATION: string
    FIRST_NAME: string
    MIDDLE_NAME: string
    LAST_NAME: string
    GENDER: string
    DOB: string
    AGE: number
    ADDRESS1: string
    ADDRESS2: string
    ADDRESS3: string
    CONCT_PER_DESIG: string
    MOB_NO: string
    CONCT_PER_STD: string
    CONCT_PER_LL: string
    CONCT_PER_EXT: string
    EMAIL: string
    PAN_NO: string
    LANGUAGE_ID: number
    INSURED_GSTIN: string
    FK_OFFICE_ID: number
    SACCODE: string
    BUYER_STATE_CODE: string
    INSURED_STATE_CODE: string
    INSURED_OFFICE_CODE: string
    MOB_COUNTRY_CODE: string
    LOCAL_SERVICE_OFFICE_ID: number
    AADHAAR_NO: string
    EI_ACCOUNT_NO: string
    INSURED_AADHAR_NO: string
    IS_CRM_DMS_FETCH: number
    COUNTRY_CODE: string
    OCCUPATION_TYPE: string
    ALT_COUNTRY_CODE: string
    ALT_MOBILE_NO: string
    IS_FLOOD_CESS: string
    KILOWATT: string
    PreviousPolicyType: number
    PREV_FKISURANCE_COMP_ID: number
    TP_POLICY_NO: string
    PREV_TP_FKISURANCE_COMP_ID: number
    PREV_TP_POLICY_EFFECTIVE_DATE: string
    PREV_TP_POLICY_EXPIRY_DATE: string
    DMS_BOOKING_ID: string
    TPPOLICY_NO: string
    TPPOLICY_INSUR_COMP_ID: number
    TPPOLICY_INSUR_COMP_NAME: string
    TPPOLICY_EFFECTIVE_DATE: string
    TP_POLICY_EXPIRY_DATE: string
    Prev_POLICY_NO: string
    INSURD_NAME: string
    CKYC_NO: string
    DOI: string
    AADHAAR_NO0: string
    AADHAAR_NO1: string
    IsKycVerified: string
    KEY: string,
    EIACCOUNTNO :string
}
export interface PolicyDealerMDL {
    DEALER_ID: number
    DEALER_USER_ID: number
    PSP_NAME: string
    PSP_AADHAR_NO: string
    PSP_PAN_NO: string
    IS_POSP_ENABLE: number
    IS_CALL_CENTER_ENABLE: number
    FK_POSPID: number
    FK_IMID: number
    FK_CREID: number
    FK_RMID: number
    PSP_TYPE: string
    MISP_CODE: string
    IS_MISP: number
    MISP_NAME: string
    MISP_PAN_NO: string
    DEALER_BROKERAGE: string
    VISOF_BROKERAGE: string
    VISOF_REM_BROKERAGE: string
    VISOF_REW_BROKERAGE: string
    VISOF_TP_BROKERAGE: string
    DEALER_TYPE: string
    MISPOSP_TYPE: string
    BROKER_CER_EMPID: number
}
export interface PolicyVehicleMDL {
    PRODUCT_ID: number
    POLICY_TYPE: string
    VEHICLE_CLASS: string
    TARIFF_CODE_ID: string
    CHASSIS_NO: string
    ENGINE_NO: string
    IsEngineNumberAllowed: boolean
    MODEL_ID: number
    VARIANT_ID: number
    IS_CSD: number
    INVOICE_DATE: string
    EXSHOWROOM_PRICE: string
    RTO_ID: string
    VEH_REGIST_NO: string
    PROPOSAL_TYPE: string
    RTO_NAME: string
    RegistrationNo1: string
    RegistrationNo2: string
    SEATING_CAPACITY: string
    CUBIC_CAPACITY: string
    MFG_YEAR: string
    POLICY_EFFECTIVE_DATE: string
    POLICY_EXPIRY_DATE: string
    IS_GOVT_VEHICLE: number
    IS_IMT23_CHECKED: number
    IS_INSPECTION_DONE: number
    INSPECTION_DATE: string
    RENEW_IDV: string
    IS_AA_CO_FITTED: string
    VIN_NO_PATTERN: string
    CHANNEL_PARTNER: string
    FUEL_TYPE: string
    IC_SHORT_CODE: string
    REGISTRATION_DATE: string
    RMS_LEAD_NO: string
    IS_GST: number
    COVER_TYPE_CODE: string
    COVER_TYPE_NAME: string
    COVER_TYPE_ID: string
    OD_TENURE: string
    TP_TENURE: string
    TPPOLICY_EFFECTIVE_DATE: string
    TPPOLICY_EXPIRY_DATE: string
    IS_DRIVING_LICENECE: number
    PA_COVER_TENURE: number
    PACOVER_EFF_FROMDATE: string
    PACOVER_EFF_TODATE: string
    CPA_PREV_TENURE: number
    ON_ROAD_PRICE: string
    CPA_WAIVER_REASON_CODE: string
    TPPACKAGE_POLICYNO: string
    TPPACKAGE_TENURE: string
    TPPACKAGE_EFFECTIVEDATE: string
    TPPACKAGE_EXPIRYDATE: string
    TPPACKAGE_IC_ID: string
    EMI_AMOUNT: string
    Count: string
    KEY: string
 
}
// export interface PolicyAddonMDL {
//     PACKAGE_ID: number;
//     ADDON_PREMIUM: number;
//     PACKAGE_DETAIL_ID: number;
//     ADDON_TYPE_ID: number;
//     ADDON_TYPE: string;
//     ADDON_OD_TENURE: number;
//     ACTION: number;
//     ADDON_NAME: string;
//     PACKAGE_NAME: string;
// }
export interface PolicyBiFuelKitMDL {
    IS_COFITTED_BIFUELKIT: number
    IS_BIOFUEL_KIT: number
    IS_CNG: number
    BIOFUEL_KIT_COST: string
    BIOFUEL_KIT_INVOICE: string
    IS_INVOICE_SUBMIT: number
}
export interface PolicyFinancerMDL {
    FINANCER_ID: number
    FINANCER_NAME: string
    BRANCH_NAME: string
    BRANCH_CITY: string
    AGGREMENT_TYPE: string
    FIN_BRANCH_ACCOUNT_NUMBER: string
}
// export interface PolicyGeographicAreaMDL {
//     AREA_ID: number;
//     AREA_TEXT: string;
// }
// export interface PolicyAccessoryMDL {
//     MFD: string;
//     MAKE: string;
//     ACCESSORY_NAME: string;
//     ACCESSORY_TYPE: string;
//     INVOICE_VALUE: number;
//     CATEGORY: string;
//     IS_INVOICE_SUBMITTED: number;
// }
export interface PolicyPaymentMDL {
    PAYMENT_MODE: string
    IS_PRE_PAID: number
    CHEQUE_NO: string
    CHEQUE_DATE: string
    BANK_ID: string
    BANK_CITY: string
    BANK_NAME: string
    UBER_ID: string
    FKPRODUCT_ID: number
    FKPROPOSAL_ID: number
    POLICY_SEQ_NO: string
    IS_AUTOMATED: number
    IC_PROPOSAL_NO: string
    PAYMENT_MODE_CODE: string
    FKBANK_ID: number
    BANK_ACC_NO: string
    PAYMENT_STATUS: number
    IC_PAYMENT_PROCESS_DATE: string
    IC_PAYMENT_PROCESS_TIME: string
    APD_PAYMENT_MODE: string
    INS_INVOICE_NO: string
    CHASSIS_NO: string
    VISOF_PROPOSAL_NO: string
    GROSS_PREM: number
    PGType: string
}
export interface PolicyDiscountMDL {
    IS_NCB_CARRY_FORWARD: number
    VOLUNTARY_DISC: string
    IS_ANTI_THEFT_DEVICE: number
    IS_AA_MEMBERSHIP: number
    ASSOCIATION_NAME: string
    MEMBERSHIP_NO: string
    AACARD_EXPIRY_DATE: string
    AAMonth: string
    AAYear: string
    IS_FREE_INSURANCE: number
    DISCOUNT_TYPE_ID: number
    DISCOUNT_TYPE: string
    SCHEME_NAME: string
    SCHEME_ID: number
    BROKERAGE: number
    QC_FLAG: number
    IS_HANDICAPPED: number
    IS_QC_DOCMAN: number
}
export interface PolicyLiabilityMDL {
    IS_PAID_DRIVER: number
    PC_IS_UNNAMED_PERSON: number
    PC_UNNAMED_PER_COUNT: number
    PC_COVER_AMOUNT: string
    LL_IS_DRIVER: number
    LL_IS_UNNAMED_PASSENGER: number
    LL_UNNAMED_PASSENGER_COUNT: number
    PC_NOMINEE_NAME: string
    PC_AGE: number
    PC_GENDER: string
    PC_RELATION: string
    PA_OWN_DRVNOM_MINOR_NAME: string
    PA_OWN_DRVNOM_MINOR_RELTION: string
}
export interface NomineeModel {
    NomineeAge: number
    NomineeName: string
    NomineeRelation: string
    NomineeGender: string
    AppointeeAge: number
    AppointeeRelation: string
    AppointeeGender: string
    AppointeeName: string
}
export interface SolicitationDetailsModel {
    PolicySource: string
    AgentID: number
}
export interface PolicyNcbCarryFrwrdMDL {
    PREV_IS_VISOF_POLICY: string
    PREV_IS_NONVISOF_POLICY: number
    PREV_VEH_CHASSIS_NO: string
    PREV_VEH_ENGINE_NO: string
    PREV_VEH_MODEL: string
    PREV_VEH_VARIANT_NO: string
    PREV_VEH_MAKE: string
    PREV_VEH_MANU_YEAR: string
    PREV_VEH_INVOICEDATE: any
    PREV_VEH_REG_NO: string
    PREV_VEH_POLICY_NO: string
    PREV_VEH_POLICY_NONVISOF: string
    PREV_VEH_NCB: number
    PREV_VEH_IC: number
    PREV_VEH_ISNCBCERTIFICATE: boolean
    PREV_VEH_ADDRESS: string
    PREV_VEH_POLICYSTARTDATE: any
    PREV_VEH_POLICYENDDATE: any
    PREV_VEH_NCB_EFFECTIVE_DATE: any
    PREV_VEH_NCB_EFFECTIVE_DATE_NONVISOF: any
    PRODUCT_NAME: string
    KEY: string
}
export interface ExtraFieldPropRequires {
    TPstatus: number
}
