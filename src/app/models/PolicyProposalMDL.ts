export class ProposalInputModel {
    public PolicyNo?: string = '';;
    public ChassisNo?: string = '';;
    public ProposalId?: number = 0;
    public RtoId?: number = 0;
    public userid?: number = 0;
    public hostip?: string = '';
    public OtpValue?: string = '';
    public ConsentType?: number = 0;
    public IC?: string = '';
    public ICServiceEnabled?: string = '';
    public PolicyType?: number = 0;
    public MandateForm?: string = '';
    public Invoice_No?: string = '';
    public IC_Proposal_no?: string = '';
    public DealerId?: number = 0;
    public IS_SCHEDULER_POLICY?: number = 0;
    public ProductId?: number = 0;
    public Bulk_Proposal_IDs?: string = '';

    //For Payment Mode
    public POLICY_TYPE?: string = '';
    public DEALER_ID?: number = 0;
    public FIRST_NAME?: string = '';
}
export class HardcodedValue {
    public Field_Label?: string = '';
}
export class PincodeModel {
    PinCodeId?: number = 0;
    PinCode?: number = 0;
    StateId?: number = 0;
    IsActive?: boolean = false;
    CityId?: number = 0;
    State?: string = "";
    City?: string = "";
    MachineIP?: string = "";
    UserId?: number = 0;
    AppName?: string = "";
    DealerId?: number = 0;
}
export class CitySearchModel {
    CityId?: number = 0;
    StateId?: number = 0;
    RegionId?: number = 0;
    ZoneId?: number = 0;
    CityName?: string = "";
    CityCode?: string = "";
}
export class SendCustomerConsent {
    CustomerEmail?: string = "";
    CustomerMobileNo?: string = "";
    ProductId?: number = 0;
    AddOnsPackageId?: number = 0;
    ProposalId?: number = 0;
    Otp?: number = 0;
    Flag?: number = 0;
    MachineIp?: string = "";
    Message?: string = "";
    Remarks?: string = "";
    Reason?: number = 0;
    DealerId?: number = 0;
    UserID?: number = 0;
    Param1?: number = 0;
}
export class ValidateCustomerConsent {
    Otp?: number = 0;
    Digit1?: number = 0;
    Digit2?: number = 0;
    Digit3?: number = 0;
    Digit4?: number = 0;
    ProposalId?: number = 0;
    Flag?: number = 0;
    Message?: string = "";
}
export class CustomerDealerDetails {
    ProposalId?: number = 0;
    ProposalNo?: string = "";
    Name?: string = "";
    RegisatrationNo?: string = "";
    VehicleModel?: string = "";
    QuoteNo?: string = "";
    INS_QUOTE_NO?: string = "";
    EmailId?: string = "";
    Mobile?: string = "";
    FKDEALER_ID?: string = "";
    FKUSER_ID?: string = "";
}

export class CityRTOModel {
    RTO_ID?: number = 0;
    RTO_NAME?: string = "";
    DealerId?: number = 0;
    rtoName?: string = "";
    State?: number = 0;
    City?: number = 0;
}

export class TenureDetailsInputModel {
    DealerId?: number = 0;
    CoverType?: string = "";
    PolicyType?: string = "";
}

export class EffectiveDateModel {
    PolicyType?: string = "";
    RenewalType?: number = 0;
    CoverTypeId?: number = 0;
    ODExpiryDate?: string = "";
    TPExpiryDate?: string = "";
}

export class ValidateProposalModel {
    ProposalId?: number = 0;
    ICId?: number = 0;
    GrossPremium?: number = 0;
    UserId?: number = 0;
    ChassisNo?: string = "";
}