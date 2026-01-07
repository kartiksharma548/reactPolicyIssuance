export interface LoginInputModel
{

    UserName: string
    UserPassword:string
    MachineIP :string
    CaptchaId :string

    ISAuthenticatedByOIDC :number
    AuthenticationToken :string
    
    
}

export interface PolicyMastersInput
{
    Id: number,
    CoverType:number,
    PolicyType :string,
    VehicleType :string,
    DealerId:number,
    IsDemoVehicle :number,
    PolicyNo :string,
    Name :string,
    Mode :string 
}