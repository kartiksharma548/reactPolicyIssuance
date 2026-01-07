export interface AuthModel {
    IsCurrentUser: boolean
    PwsExpiredDaysLeft: number
    SessionId: String
    IsFirstLoginToday: number

    UserId: number
    IsForcedReset: boolean
    Name: String
    RoleId: number

    PwsExpiryDate: String
    LastLoginTime: String

    IsActive: boolean
    HitCount: number
    RoleActive: boolean
    DealerId: number
    DealerCode: String
    DealerName: String
    Product_Id: number
    CompanyId: number
    UserType: String
    DealerUserType: String
    Mob_No: String
    HideDashboard: number
    LoginName: String
    DPId: number
    UserSalesType: String
    FkOEMID: number
    AuthToken: string
    ErrorCode: number
    ErrorMessage: String
    IsSendQuoteEnable: number
    POSP_ID: number
    DEALER_TYPE: string

    IS_MISP_DECL_SUBMIT: number
    ACC_NO: string
    BANK: string
    PAN: string
    LOCATION: string

    TickerDataForDealer?: TickerDataForDealer;
}
export interface PolicyModel {
    ProposalId: number
}



export interface TickerListForDealer {
    Srno: number;
    TickerID: number;
    TICKER_TYPE: string;
    TICKER_DESCRIPTION: string;
    TICKER_VALIDFROM: string;
    TICKER_VALIDTO: string;
    TEXT_FOR: string;
    TEXT_COLOR: string;
    FromTime: string;
    ToTime: string;
}

export interface TickerDataForDealer {
    TEXT_FOR: string;
    TickerListsForDealer: TickerListForDealer[];

}