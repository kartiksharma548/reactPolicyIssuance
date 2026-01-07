import { z } from 'zod'
const panCardRegex = new RegExp(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
// const phoneNoRegex = new RegExp(
//     /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
// )
const gstNoRegex = new RegExp(
    /^(\d{2})([a-zA-Z]{4})([0-9a-zA-Z]{1})(\d{4})([a-zA-Z]{1})([0-9a-zA-Z]{1})([a-zA-Z]{1})([0-9a-zA-Z]{1})$/
)
const alphanumricRegex = new RegExp(/^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$/)
const stringSpaceRegex = new RegExp(/^[a-zA-Z_ ]+$/)
const stringOnly = new RegExp(/^[a-zA-Z]+$/)
const phoneNoRegex = new RegExp(/(0|91)?[6-9][0-9]{9}/)
const withoutTrailingSpace = new RegExp(/^([a-zA-Z0-9])+$/)
// export const commercialSchema = {
//     IsCommercial: z.literal('1'),

//     VehicleType: z.enum(['2', '3']),
//     // .number({ invalid_type_error: 'Please Select Vehicle Type.' })
//     // .positive({ message: 'Please Select Vehicle Type.' })
//     VehicleSubType: z
//         .number({ invalid_type_error: 'Please Select Vehicle Sub Type.' })
//         .positive({ message: 'Please Select Vehicle Sub Type.' }),
//     BuiltType: z
//         .number({ invalid_type_error: 'Please Select Built Type.' })
//         .positive({ message: 'Please Select Built Type.' })
// }
export const vehicleDetailsGCV = z.object({
    FKVehicleType_ID: z.literal(2),
    FKVehicleSubType_ID: z
        .number({ invalid_type_error: 'Please Select Vehicle Sub Type.' })
        .positive({ message: 'Please Select Vehicle Sub Type.' }),
    FKBuiltType_ID: z
        .number({ invalid_type_error: 'Please Select Built Type.' })
        .positive({ message: 'Please Select Built Type.' }),

    CarrierType: z
        .string({ invalid_type_error: 'Please Select Carrier Type.' })
        .min(1, { message: 'Please Select Carrier Type.' })
})
export const vehicleDetailsMis = z.object({
    FKVehicleType_ID: z.literal(4),
    FKVehicleSubType_ID: z
        .number({ invalid_type_error: 'Please Select Vehicle Sub Type.' })
        .positive({ message: 'Please Select Vehicle Sub Type.' }),
    FKBuiltType_ID: z
        .number({ invalid_type_error: 'Please Select Built Type.' })
        .positive({ message: 'Please Select Built Type.' }),
    FKMiscType_ID: z
        .number({ invalid_type_error: 'Please Select Misc Type.' })
        .positive({ message: 'Please Select Misc Type.' })
})
export const vehicleDetailsPCV = z.object({
    FKVehicleType_ID: z.literal(3),

    // FKBuiltType_ID: z
    //     .number({ invalid_type_error: 'Please Select Built Type.' })
    //     .positive({ message: 'Please Select Built Type.' })
})

export const vehicleDetailsTWP = z.object({
    FKVehicleType_ID: z.literal(5),

    Battery_Number1: z
        .string({
            required_error: 'Please enter Battery Identification Number.'
        })
        .min(1, { message: 'Please enter Battery Identification Number.' })
        .regex(withoutTrailingSpace, {
            message: 'Please enter valid Battery Identification Number.'
        }),
    Battery_Number2: z
        .string({
            required_error: 'Please enter Battery Identification Number.'
        })
        .min(1, { message: 'Please enter Battery Identification Number.' })
        .regex(withoutTrailingSpace, {
            message: 'Please enter valid Battery Identification Number.'
        }),
    Charger_PortNumber: z
        .string({
            required_error: 'Please enter Charger & Port Number.'
        })
        .min(1, { message: 'Please enter Charger & Port Number.' })
        .regex(withoutTrailingSpace, {
            message: 'Please enter valid Charger & Port Number.'
        })
})

export const isPACover_ConductorTaken = z.object({
    IsPAConductor: z.literal('true'),
    PAConductorCount: z.coerce
        .number({
            invalid_type_error: 'Please Select PA Conductor(₹)',
            required_error: 'Please Select PA Conductor(₹)'
        })
        .gt(0, { message: 'Please Select PA Conductor(₹)' }),
    CoverAmount: z.coerce
        .number({
            invalid_type_error: 'Please Select PA Unnamed Passenger(₹)',
            required_error: 'Please Select PA Unnamed Passenger(₹)'
        })
        .gt(0, { message: 'Please Select PA Unnamed Passenger(₹)' })
})
export const isPACover_ConductorNotTaken = z.object({
    IsPAConductor: z.literal('false')
})

export const isPACover_CleanerTaken = z.object({
    IsPACleaner: z.literal('true'),
    PACleanerCount: z.coerce
        .number({
            invalid_type_error: 'Please Select PA Cleaner(₹)',
            required_error: 'Please Select PA Cleaner(₹)'
        })
        .gt(0, { message: 'Please Select PA Cleaner(₹)' }),
    CoverAmount: z.coerce
        .number({
            invalid_type_error: 'Please Select PA Unnamed Passenger(₹)',
            required_error: 'Please Select PA Unnamed Passenger(₹)'
        })
        .gt(0, { message: 'Please Select PA Unnamed Passenger(₹)' })
})
export const isPACover_CleanerNotTaken = z.object({
    IsPACleaner: z.literal('false')
})

export const isPACover_HelperTaken = z.object({
    IsPAHelper: z.literal('true'),
    PAHelperCount: z.coerce
        .number({
            invalid_type_error: 'Please Select PA Helper(₹)',
            required_error: 'Please Select PA Helper(₹)'
        })
        .gt(0, { message: 'Please Select PA Helper(₹)' }),
    CoverAmount: z.coerce
        .number({
            invalid_type_error: 'Please Select PA Unnamed Passenger(₹)',
            required_error: 'Please Select PA Unnamed Passenger(₹)'
        })
        .gt(0, { message: 'Please Select PA Unnamed Passenger(₹)' })
})
export const isPACover_HelperNotTaken = z.object({
    IsPAHelper: z.literal('false')
})
///LL Covers

export const isLLCover_ConductorTaken = z.object({
    IsLLConductor: z.literal('true'),
    LLConductorCount: z.coerce
        .number({
            invalid_type_error: 'Please Select LL Conductor(₹)',
            required_error: 'Please Select LL Conductor(₹)'
        })
        .gt(0, { message: 'Please Select LL Conductor(₹)' })
})
export const isLLCover_ConductorNotTaken = z.object({
    IsLLConductor: z.literal('false')
})

export const isLLCover_CleanerTaken = z.object({
    IsLLCleaner: z.literal('true'),
    LLCleanerCount: z.coerce
        .number({
            invalid_type_error: 'Please Select LL Cleaner(₹)',
            required_error: 'Please Select LL Cleaner(₹)'
        })
        .gt(0, { message: 'Please Select LL Cleaner(₹)' })
})
export const isLLCover_CleanerNotTaken = z.object({
    IsLLCleaner: z.literal('false')
})

export const isLLCover_HelperTaken = z.object({
    IsLLHelper: z.literal('true'),
    LLHelperCount: z.coerce
        .number({
            invalid_type_error: 'Please Select LL Helper(₹)',
            required_error: 'Please Select LL Helper(₹)'
        })
        .gt(0, { message: 'Please Select LL Helper(₹)' })
})
export const isLLCover_HelperNotTaken = z.object({
    IsLLHelper: z.literal('false')
})

export const isNFPPCover_Taken = z.object({
    IsLLNFPP: z.literal('true'),
    LLNFPPCount: z.coerce
        .number({
            invalid_type_error: 'Please Select NFPP (₹)',
            required_error: 'Please Select NFPP (₹)'
        })
        .gt(0, { message: 'Please Select NFPP (₹)' })
})
export const isNFPPCover_NotTaken = z.object({
    IsLLNFPP: z.literal('false')
})

export const isTrailer_Taken = z.object({
    IsTrailer: z.literal('1'),
    TrailerNo: z.coerce.number({
        invalid_type_error: 'Please enter Trailer No',
        required_error: 'Please enter Trailer No'
    })
})

export const isTrailer_NotTaken = z.object({
    IsTrailer: z.literal('0')
})

export const isTrailerNo_Taken = z.object({
    IsTrailerNo: z.literal('1'),

    TrailerPrice: z.coerce
        .number({
            invalid_type_error: 'Please enter Trailer Price',
            required_error: 'Please enter Trailer Price'
        })
        .gt(0, { message: 'Please enter Trailer Price' }),
    TrailerChassisNo: z
        .string({
            invalid_type_error: 'Please enter Trailer Chassis no.',
            required_error: 'Please enter Trailer Chassis no.'
        })
        .min(16, { message: 'Trailer Chassis No. should be 16 characters.' })
        .regex(alphanumricRegex, {
            message: 'Trailer Chassis No should be alphanumeric.'
        })
})

export const isTrailerNo_NotTaken = z.object({
    IsTrailerNo: z.literal('0')
})
