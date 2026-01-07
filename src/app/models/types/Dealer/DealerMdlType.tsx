type DealerPaymentMDL = {
    ICProductId?: number
    BankID?: number
    PaymentModeId?: string
    UserID?: number
    ICList?: string
    DealerId?: number
    ProposalId?: string
    EndorsementId?: string
    PolicyId?: number
    PolicyNo?: string
    EndorsementNo?: string
    ErrorMsg?: string
    InsuredName?: string
    PolicyIssueDate?: string
    ModelVariant?: string
    Premium?: number
    SEQNO?: number
    DealerPaymentData?: DealerPaymentMDL[]
    DealerICWisePaymentModeData?: DealerICWisePaymentModeMDL[]
    MappedPaymentModes?: PaymentMode | []
    MachineIP?: string
    FKDealerId?: number
    ChequeUrnDate?: string
    ChequeNo?: string
    SelectAll?: boolean
    PaymentCheck?: string
    PolicyChequeDate?: string
    PolicyCheckUrnNo?: string
    PolicyBankId?: number
    PolicyBankCity?: string
    TransactionType?: string
    ProductName?: string
    PolicyStartDate?: string
    ValidateChequeDate?: string
    ProposalNo?: string
    ChassisNo?: string
    StartDate?: string
    EndDate?: string
    ICProposalNo?: string
    ProposalDate?: string
    ProposalType?: string
    Action?: number
    IsBulkPaymentDisable?: number
    VEH_REGIST_NO?: string
    CoverType?: string
    ISPAYMENT_DONE?: string
    Rejected_Remarks?: string
    UpdatedPaymentMode?: string
    ShowBulkCheckbox?: boolean
    CheckedBulk?: boolean
    ShowPayButton?: boolean
    BulkPaymentChecked?: boolean
    DealerCode?: string
    ICServiceEnabled?: string
    IsPayBtnDisable?: number
    ConsentType?: number
    OEM_ID?: number
}

type DealerICWisePaymentModeMDL = {
    PaymentModeForNewPolicy: string
    PaymentModeForRenewPolicy: string
    Product_ID: number
}
