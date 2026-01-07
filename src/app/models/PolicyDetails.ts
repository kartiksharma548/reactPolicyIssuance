export class PolicyMDL {
    Renew: PolicyRenewModel = {
        RENEWAL_TYPE: "";
        PREV_POLICY_ID: 0;
        PREV_POLICY_NO: "";
        PREV_CHASSIS_NO: "";
        PREV_VEH_REG1: "";
        PREV_VEH_REG2: "";
        PREV_VEH_REG3: "";
        FKISURANCE_COMP_ID: 0;
        OFFICE_ADD: "";
        INVOICE_DATE: "";
        POLICY_EFFECTIVE_DATE: "";
        POLICY_EXPIRY_DATE: "";
        ISTRANSFER: false;;
        ISCLAIM_AVAILED: false;;
        OLD_POL_NCB_PER: 0;
        OLD_POL_NCB_LEVEL: 0;
        BREAKIN_DAYS: 0;
        PREV_DEALERCODE: "";
        ISPROOF_SUBMITTED: 0;
        ISPREVPOL_COPY_SUBMT: 0;
        ISNCB_CERT_SUBMITTED: 0;
        ISCUSTOMER_UNDRTKNG_SUBMT: 0;
        IS_ADDON: false;;
        PREV_VEHICLE_TYPE: "";
        PREV_COVERTYPE_ID: 0;
        IsHavingODPolicy: 0;
        IsHavingTPPolicy: 0;
        TP_POLICY_EXPIRY_DATE: "";
        TPPOLICY_EFFECTIVE_DATE: "";
        TPPOLICY_NO: "";
        TPPOLICY_INSUR_COMP_ID: 0;
        TPPOLICY_INSUR_COMP_NAME: "";
    }
    PolicyDetails: PolicyDetailsMDL = {
        PolicyId: 0;
        PolicyType: "";
        VehClass: "";
        ProposalType: "";
        CoverTypeId: 0;
        CoverType: "";
        OdDiscPer: 0;
        OdTenure: 0;
        TPTenure: 0;
        RSD: "";
    }
    VehicleDetails: VehicleDetailsMDL = {
        MakeId: 0;
        MakeName: "";
        ModelId: 0;
        Model: "";
        VariantId: 0;
        Variant: "";
        ChassisNo: "";
        EngineNo: "";
        FuelTypeCode: "";
        FuelType: "";
        CubicCapacity: 0;
        SeatingCapacity: 0;
        ExShowroomPrice: 0;
        DateofManufacture: "";
        RTOId: 0;
        RTOName: "";
        InvoiceDate: "";
        VehicleType: "";
        Kilowatt: 0;
        OnRoadPrice: 0;
        IS_BH_REGIST_NO: 0;
        VEH_REGIST_NO: "";
        RTO_NAME: "";
        RegistrationNo1: "";
        RegistrationNo2: "";
    }
    Discounts: DiscountsMDL = {
        IsNCBForward: false;
        NCBPer: 0;
        NCBLevel: 0;
        IsAntiTheft: false;
        IsAA: false;
        IsHandicapped: false;
        IsIMT23: false;
        VoluntaryExcess: 0;
        DiscountPer: 0;
    };
    //ElectricalAccessory: AccessoryMDL[];
    //NonElectricalAccessory: AccessoryMDL[];
    BiFuelKit: BiFuelKitMDL={
        IsCoFitted: false;
        IsBioFuelKit: false;
        IsCNG: false;
        KitCost: "";
        KitInvoice: "";
        IsInvoiceSubmitted: false;
    };
    //GeographicArea: GeographicAreaMDL[];
    //AddOn: AddOnMDL[];
    Covers: CoversModel={
        IsCPACover: false;
        IsPaidDriver: false;
        IsUnnamedPassenger: false;
        CPATenure: 0;
        CoverAmount: 0;
        UnnamedPassengerCount: 0;
        OtherEmp: 0;
        LLPaidDriver: false;
    };
    //CoversV1: CoversModelV1;
    //LastYearAddOns: LastYearAddOnsModel;
    AccessoriesValue: AccessoriesValue = {
        ElectricalValue:0;
        NonElectricalValue:0;
        BiFuelValue:"";
    };
    GeoArea: number[];
    ICs: number[];
    UserID: number;
    ICList: string;
    DealerId: number;
    IsuredStateId: number;
    INSURED_GSTIN: string;
    IsStateFlood: number;
    Emiamount: number;
    IsHandicapped: number;
    GstPer: number;
    ProposalId: number;
    IDVDiff: number;
    MachineIP: string;
    PROPOSAL_STATUS: string;
    DMS_BOOKING_ID: string;
    IsNCB: number;
    OLDNCB_PER: number;
    ClaimCount: number;
    LastClaimDate: string;
    IsTestDrive: boolean;
    ODDiscount: string;
    NCBPercent: string;
    ClaimStatus: string;
    IsVoluntaryForward: boolean;
    IsExshoroomUpdated: number;
    IsBrokerDataFound: number;
    TP_PREV_TENURE: number;
    PolicyStartDate: string;
    RegistrationDate: string;
    SelectedIC: number;
    SelectedAddOnPKG: string;
    IsProposalSaved: number;
    IS_CRP: number;
    CRPLINK_PROPOSALID: string;
    CRPHOSTURL: string;
    ICListForQuoteAPI: string;
    ProposerDetails: PolicyProposerMDL;
    MdlVehicle: PolicyVehicleMDL;
    IS_BH_REGIST_NO: number;
    PreviousPolicyAddons: string;
    FKOEM_ID: number;
    SpecialRegistartionNo: string;
    BHNumberSeries1: string;
    BHNumberSeries2: string;
    BHNumberSeries3: string;
    RegistrationNo1: string;
    RegistrationNo2: string;
    RegistrationNo3: string;
}

export interface PolicyRenewModel {
    RENEWAL_TYPE: string;
    PREV_POLICY_ID: number;
    PREV_POLICY_NO: string;
    PREV_CHASSIS_NO: string;
    PREV_VEH_REG1: string;
    PREV_VEH_REG2: string;
    PREV_VEH_REG3: string;
    FKISURANCE_COMP_ID: number;
    OFFICE_ADD: string;
    INVOICE_DATE: string;
    POLICY_EFFECTIVE_DATE: string;
    POLICY_EXPIRY_DATE: string;
    ISTRANSFER: boolean;
    ISCLAIM_AVAILED: boolean;
    OLD_POL_NCB_PER: number;
    OLD_POL_NCB_LEVEL: number;
    BREAKIN_DAYS: number;
    PREV_DEALERCODE: string;
    ISPROOF_SUBMITTED: number;
    ISPREVPOL_COPY_SUBMT: number;
    ISNCB_CERT_SUBMITTED: number;
    ISCUSTOMER_UNDRTKNG_SUBMT: number;
    IS_ADDON: boolean;
    PREV_VEHICLE_TYPE: string;
    PREV_COVERTYPE_ID: number;
    IsHavingODPolicy: number;
    IsHavingTPPolicy: number;
    TP_POLICY_EXPIRY_DATE: string;
    TPPOLICY_EFFECTIVE_DATE: string;
    TPPOLICY_NO: string;
    TPPOLICY_INSUR_COMP_ID: number;
    TPPOLICY_INSUR_COMP_NAME: string;
}
export interface PolicyDetailsMDL {
    PolicyId: number;
    PolicyType: string;
    VehClass: string;
    ProposalType: string;
    CoverTypeId: number;
    CoverType: string;
    OdDiscPer: number;
    OdTenure: number;
    TPTenure: number;
    RSD: string;
}
export interface VehicleDetailsMDL {
    MakeId: number;
    MakeName: string;
    ModelId: number;
    Model: string;
    VariantId: number;
    Variant: string;
    ChassisNo: string;
    EngineNo: string;
    FuelTypeCode: string;
    FuelType: string;
    CubicCapacity: number;
    SeatingCapacity: number;
    ExShowroomPrice: number;
    DateofManufacture: string;
    RTOId: number;
    RTOName: string;
    InvoiceDate: string;
    VehicleType: string;
    Kilowatt: number;
    OnRoadPrice: number;
    IS_BH_REGIST_NO: number;
    VEH_REGIST_NO: string;
    RTO_NAME: string;
    RegistrationNo1: string;
    RegistrationNo2: string;
}
export interface DiscountsMDL {
    IsNCBForward: boolean;
    NCBPer: number;
    NCBLevel: number;
    IsAntiTheft: boolean;
    IsAA: boolean;
    IsHandicapped: boolean;
    IsIMT23: boolean;
    VoluntaryExcess: number;
    DiscountPer: number;
}
export interface AccessoryMDL {
    MFD: string;
    Make: string;
    AccessoryName: string;
    AccessoryType: string;
    InvoiceValue: number;
    IsInvoiceSubmitted: boolean;
}
export interface BiFuelKitMDL {
    IsCoFitted: boolean;
    IsBioFuelKit: boolean;
    IsCNG: boolean;
    KitCost: string;
    KitInvoice: string;
    IsInvoiceSubmitted: boolean;
}
export interface AddOnMDL {
    PackageId: number;
    AddOnPremium: number;
    PackageDetailId: number;
    AddOnTypeId: number;
    AddOnType: string;
    AddOnTenure: number;
    Action: number;
    AddOnName: string;
    PackageName: string;
}
export interface CoversModel {
    IsCPACover: boolean;
    IsPaidDriver: boolean;
    IsUnnamedPassenger: boolean;
    CPATenure: number;
    CoverAmount: number;
    UnnamedPassengerCount: number;
    OtherEmp: number;
    LLPaidDriver: boolean;
}
export interface CoversModelV1 {
    IsCPACover: boolean;
    IsPaidDriver: boolean;
    IsOverTurn: boolean;
    IsUnnamedPassenger: boolean;
    CPATenure: number;
    CoverAmount: number;
    UnnamedPassengerCount: number;
    OtherEmp: number;
    LLPaidDriver: boolean;
    PC_UNNAMED_COUNT: number;
    PAAmtEmployee: number;
    EmiCoverAmt: number;
    PA_PAID_DRIVER: number;
    IsCPACleaner: boolean;
    PACoverCleaner: number;
    IsCPAConductor: boolean;
    PACoverConductor: number;
    IsCPAHelper: boolean;
    PACoverHelper: number;
    LLIAB_PAID_DRIVER: number;
    IsLLICleaner: boolean;
    LLICleaner: number;
    IsLLIEmployee: boolean;
    LLIEmployee: number;
    IsLLIConductor: boolean;
    LLIConductor: number;
    IsLLIHelper: boolean;
    LLIHelper: number;
    IsLLINFPP: boolean;
    LLINFPP: number;
}
export interface LastYearAddOnsModel {
    ZeroDep:false;
    ReturnToInvoice:false;
    EngineProtect:false;
}
export interface AccessoriesValue {
    ElectricalValue:number;
    NonElectricalValue:number;
    BiFuelValue:string;
}
