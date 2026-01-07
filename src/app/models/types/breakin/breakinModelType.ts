type BreakinSearchType = {
    ProposalID?: number
    UserID?: number
    ProposalNo?: string
    ChassisNo?: string
    ProposalDate?: string
    Breakin_Type?: string
    ProposalType?: string
    ProposerName?: string
    DealerName?: string
    ChequeNo?: string
    CustomerContactNo?: string
    DealerID?: number
    FkProposalStatus?: string
    Start_Date?: string
    End_Date?: string
    ProductID?: number
    Remarks?: string
    IsApprove?: number
    HOSTIP?: string
    IsPolicyCreated?: number
}

type BreakinMDLType = {
    Proposal_Id?: number
    Proposal_No?: string
    Chassis_No?: string
    Dealer_Code?: string
    Insured?: string
    Insurance_Company?: string
    Proposal_Date?: string
    Updated_Date?: string
    Status?: string
    Remarks?: string
    Front_Image?: string
    Back_Image?: string
    Left_Image?: string
    Right_Image?: string
    Code?: string
    Approval_Status_ID?: number
    ApproveBy?: string
    NCB_Certificate?: string
    Previous_Remarks?: string
    Current_Remarks?: string
    DealerNameWithCode?: string
    ModelVariantName?: string
    BREAKIN_TYPE?: string
    BreakinTypeId?: number
    Policy_Id?: number
    Policy_No?: string
    CHASSISNUMBERPLATE?: string
    ODOMETERREADING?: string
    INSPECTIONREPORT?: string
    RC_COPY?: string
    IsProposalServiceActive?: number
    HandicappedDoc1?: string
    HandicappedDoc2?: string
    ReviewData?: string
    ChassisDiscountDoc?: string
    PRODUCT_ID?: number
}

type BreakinResponse = {
    updated_Date?: string
    Status?: string
    policyStatus?: boolean
    iSPROPOSALSRVACTIVE?: number
    remarks?: string
    errorMessage?: string
}

type BreakinStatusUpdateMDL = {
    User_ID?: number
    Proposal_Id?: number
    Remarks?: string
    Status?: number
    ApprovalType?: string
}
