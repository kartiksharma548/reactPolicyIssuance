import { z } from 'zod'
import {
    isNoPrevPolicy,
    isPrevPolicyTMI,
    isPrevPolicyNonTMI,
    isPolicyTypeNew,
    policyDetails,
    isPrevPolicyNonTMITP,
    IsSATPPolicy,
    IsNotSATPPolicy,
    IsSATPPolicyNewOrNoPolicy,
    customerDetails_Taken,
    corporateCustomerDetails_Taken,
    // vehicleDetails_Taken,
    // vehicleDetails_NotTaken,
    bhRegNoType_Taken,
    specialRegNoType_Taken,
    normalRegNoType_Taken,
    IsRegistrationRequired,
    isNCBForward_Choosen,
    isNCBForward_NotChoosen,
    isVoluntaryForward_Choosen,
    isVoluntaryForward_NotChoosen,
    isPACover_UnnamedPassengerTaken,
    isPACover_UnnamedPassengerNotTaken,
    isPA_PaidDriverTaken,
    isPA_PaidDriverNotTaken,
    isCPACover_Choosen,
    isCPACover_NotChoosen,
    additionalsDiscountsDetails,
    vehicleDetailsPrivate
} from './policyDetailsSchema'
import {
    isLLCover_CleanerNotTaken,
    isLLCover_CleanerTaken,
    isLLCover_ConductorNotTaken,
    isLLCover_ConductorTaken,
    isLLCover_HelperNotTaken,
    isLLCover_HelperTaken,
    isNFPPCover_NotTaken,
    isNFPPCover_Taken,
    isPACover_CleanerNotTaken,
    isPACover_CleanerTaken,
    isPACover_ConductorNotTaken,
    isPACover_ConductorTaken,
    isPACover_HelperNotTaken,
    isPACover_HelperTaken,
    vehicleDetailsGCV,
    vehicleDetailsMis,
    vehicleDetailsPCV,
    vehicleDetailsTWP,
    isTrailer_Taken,
    isTrailer_NotTaken,
    isTrailerNo_Taken,
    isTrailerNo_NotTaken
} from './cvPolicyDetailsSchema'

let policyDataSchema = z
    .discriminatedUnion('RENEWAL_TYPE', [
        isNoPrevPolicy,
        isPrevPolicyTMI,
        isPrevPolicyNonTMI,
        isPolicyTypeNew
    ])
    .and(policyDetails)

let policyDataSchemaForTP = z
    .discriminatedUnion('RENEWAL_TYPE', [
        isNoPrevPolicy,
        isPrevPolicyTMI,
        isPrevPolicyNonTMITP,

        isPolicyTypeNew
    ])
    .and(policyDataSchema)

// let policyDataSchemaForOD = z
//     .discriminatedUnion('SAOD_POLICY', [
//         policyDataSchemaForTP,
//         isPrevPolicyNonTMIOD
//     ])
//     .and(policyDataSchema)
const unionOfSchema = z.union([policyDataSchema, policyDataSchemaForTP])

const satpUnion = z
    .discriminatedUnion('SATP_POLICY', [
        IsSATPPolicy,
        IsNotSATPPolicy,
        IsSATPPolicyNewOrNoPolicy
    ])
    .and(unionOfSchema)

// const saodUnion = z
//     .discriminatedUnion('SAOD_POLICY', [
//         IsSATPPolicy,
//         IsNotSATPPolicy,
//         IsSATPPolicyNewOrNoPolicy
//     ])
//     .and(satpUnion)

const customerDataSchema = z
    .discriminatedUnion('ProposalType', [
        customerDetails_Taken,
        corporateCustomerDetails_Taken
    ])
    .and(satpUnion)

// const vehicleDataSchema = z
//     .discriminatedUnion('IsVehicle', [
//         vehicleDetails_Taken,
//         vehicleDetails_NotTaken
//     ])
//     .and(customerDataSchema)

const RegNoSchema = z
    .discriminatedUnion('IS_BH_REGIST_NO', [
        bhRegNoType_Taken,
        specialRegNoType_Taken,
        normalRegNoType_Taken,
        IsRegistrationRequired
    ])
    .and(customerDataSchema)

const IsNCBForwardSchema = z
    .discriminatedUnion('IsNCBForward', [
        isNCBForward_Choosen,
        isNCBForward_NotChoosen
    ])
    .and(RegNoSchema)

const IsVoluntaryForwardSchema = z
    .discriminatedUnion('IsVoluntaryForward', [
        isVoluntaryForward_Choosen,
        isVoluntaryForward_NotChoosen
    ])
    .and(IsNCBForwardSchema)

const IsPACoverUnnamedPassengerSchema = z
    .discriminatedUnion('IsUnnamedPassenger', [
        isPACover_UnnamedPassengerTaken,
        isPACover_UnnamedPassengerNotTaken
    ])
    .and(IsVoluntaryForwardSchema)

const IsPaidDriverSchema = z
    .discriminatedUnion('IsPaidDriver', [
        isPA_PaidDriverTaken,
        isPA_PaidDriverNotTaken
    ])
    .and(IsPACoverUnnamedPassengerSchema)

const IsCPACoverSchema = z
    .discriminatedUnion('IsCPACover', [
        isCPACover_Choosen,
        isCPACover_NotChoosen
    ])
    .and(IsPaidDriverSchema)
    .and(additionalsDiscountsDetails)

const IsPACover_ConductorSchema = z
    .discriminatedUnion('IsPAConductor', [
        isPACover_ConductorTaken,
        isPACover_ConductorNotTaken
    ])
    .and(IsCPACoverSchema)
const IsPACover_CleanerSchema = z
    .discriminatedUnion('IsPACleaner', [
        isPACover_CleanerTaken,
        isPACover_CleanerNotTaken
    ])
    .and(IsPACover_ConductorSchema)
const IsPACover_HelperSchema = z
    .discriminatedUnion('IsPAHelper', [
        isPACover_HelperTaken,
        isPACover_HelperNotTaken
    ])
    .and(IsPACover_CleanerSchema)

const IsLLCover_ConductorSchema = z
    .discriminatedUnion('IsLLConductor', [
        isLLCover_ConductorTaken,
        isLLCover_ConductorNotTaken
    ])
    .and(IsPACover_HelperSchema)
const IsLLCover_CleanerSchema = z
    .discriminatedUnion('IsLLCleaner', [
        isLLCover_CleanerTaken,
        isLLCover_CleanerNotTaken
    ])
    .and(IsLLCover_ConductorSchema)
const IsLLCover_HelperSchema = z
    .discriminatedUnion('IsLLHelper', [
        isLLCover_HelperTaken,
        isLLCover_HelperNotTaken
    ])
    .and(IsLLCover_CleanerSchema)

const IsNFPPSchema = z
    .discriminatedUnion('IsLLNFPP', [isNFPPCover_Taken, isNFPPCover_NotTaken])
    .and(IsLLCover_HelperSchema)

const VehicleTypeSchema = z
    .discriminatedUnion('FKVehicleType_ID', [
        vehicleDetailsMis,
        vehicleDetailsPCV,
        vehicleDetailsPrivate,
        vehicleDetailsGCV,
        vehicleDetailsTWP
    ])
    .and(IsNFPPSchema)

const trailerSchema = z
    .discriminatedUnion('IsTrailer', [isTrailer_Taken, isTrailer_NotTaken])
    .and(VehicleTypeSchema)

const trailerNoSchema = z
    .discriminatedUnion('IsTrailerNo', [
        isTrailerNo_Taken,
        isTrailerNo_NotTaken
    ])
    .and(trailerSchema)

export const policyDetailsSchema = trailerNoSchema
export type PolicyDetailsSchemaType = z.infer<typeof policyDetailsSchema>
