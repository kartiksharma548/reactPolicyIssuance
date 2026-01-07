import { IDiscountsAndAdditionalCoversMDL } from './Discounts'

export class QuoteInputRequest {
    GeoArea: number[] = []
    ICs: number[] = []
    UserID: number = 0
    ICList: string = ''
    DealerId: number = 0
    IsuredStateId: number = 0
    INSURED_GSTIN: string = ''
    IsStateFlood: number = 0
    emiamount: number = 0
    IsHandicapped: number = 0
    GstPer: number = 0
    ProposalId: number = 0
    IDVDiff: number = 0
    MachineIP: string = ''
    PROPOSAL_STATUS: string = ''
    DMS_BOOKING_ID: string = ''
    IsNCB: number = 0
    OLDNCB_PER: number = 0
    ClaimCount: number = 0
    LastClaimDate: string = ''
    IsTestDrive: boolean = false
    ODDiscount: string = ''
    NCBPercent: string = ''
    ClaimStatus: string = ''
    IsVoluntaryForward: boolean = false
    IsExshoroomUpdated: number = 0
    IsBrokerDataFound: number = 0
    TP_PREV_TENURE: number = 0
    PolicyStartDate: string = ''
    RegistrationDate: string = ''
    SelectedIC: number = 0
    SelectedAddOnPKG: string = ''
    IsProposalSaved: number = 0
    IS_CRP: number = 0
    AddOns: string = ''
    ReCalculateQuote: boolean = true
    IsOnlineQuote: number = 0
    additionalCoversandDiscounts: IDiscountsAndAdditionalCoversMDL = {
        IsNCBForward: false,
        NCBPer: 0,
        NCBLevel: 0,
        IsAntiTheft: false,
        IsAA: false,
        IsHandicapped: false,
        IsIMT23: false,
        VoluntaryExcess: 0,
        DiscountPer: 0,
        Electrical: 0,
        NonElectrical: 0
    }
}

export class PremiumInput {
    PremiumInput: QuoteInputRequest = new QuoteInputRequest()
}

export interface QuoteLists {
    preferredQuoteList: any[]
    quoteList: any[]
    quoteFailedList: any[]
    QuoteNo: string
}
