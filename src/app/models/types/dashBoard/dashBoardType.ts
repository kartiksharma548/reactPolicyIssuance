type DashBoard_Type = {
    StartDate: string
    EndDate: string
    DealerId: number
    BreakDownType: string
    BreakDownBy: number
}

type DashBoardValues_Type = {
    NewPolicy: number
    RenewPolicy: number
    TotalPolicy: number
    ClaimsOpened: number
    ClaimsClosed: number
    TotalClaims: number
    OD_Prem: number
    TP_Prem: number
    Total_Prem: number
    PenetrationPercentage: number
    PoliciesDue: number
    PoliciesRenewed: number
    InsurersCount: InsurerWiseCount[]
    AddOnPenetration: AddonPenetration[]
    BusinessPerformance: Business[]
}

type InsurerWiseCount = {
    value: number
    label: string
}

type AddonPenetration = {
    AddonPercentage: number
    AddonName: string
}

type Business = {
    PREMIUM: number
    MONTH: string
    MONTHNAME: string
}

type MaintainanceMessageModel = {
    NotificationDate: string
    NotificationHours: number
    NotificationMinutes: number
    MaintenanceDate: string
    MaintenanceHours: number
    MaintenanceMinutes: number
    DowntimeMinutes: number
    Message: string
    ErrorMsg: string
    UserId: number
    Action: number
    Read_Counter: number
    User_Read_Counter: number

}
