import { z } from 'zod'
import common from '../../../utils/common'

const panCardRegex = new RegExp(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
// const phoneNoRegex = new RegExp(
//     /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
// )
//const gstNoRegex = new RegExp(/^(\d{2})([a-zA-Z]{4})([0-9a-zA-Z]{1})(\d{4})([a-zA-Z]{1})([0-9a-zA-Z]{1})([a-zA-Z]{1})([0-9a-zA-Z]{1})$/)
const discardSpecialCharactersRegex = new RegExp(/^[0-9a-zA-Z''-'\s]{1,40}$/)
const gstNoRegex = new RegExp(
    /^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1}$/
)
const alphanumricRegex = new RegExp(/^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$/)
const stringSpaceRegex = new RegExp(/^[a-zA-Z.\s]+$/)
const stringOnly = new RegExp(/^[a-zA-Z]+$/)
const phoneNoRegex = new RegExp(/(0|91)?[6-9][0-9]{9}/)
const alphabetWithSpace = new RegExp(/^([a-zA-Z]+\s)*[a-zA-Z]+$/)

export const policyDetails = z.object({
    PolicyType: z.enum(['N', 'R']),
    CoverTypeId: z
        .number({
            required_error: 'Please Select Vehicle Cover',
            invalid_type_error: 'Please Select Vehicle Cover'
        })
        .positive({ message: 'Please Select Vehicle Cover' }),
    SAOD_POLICY: z.literal('0'),

    //VehClass: z.enum(['C', 'P']),

    // ChassisStatus: z.enum(['1', '0']),
    // ChassisNo: z
    //     .string({ required_error: 'VIN (Chassis No) is required.' })
    //     .max(17, {
    //         message: 'VIN (Chassis No) number can not be greater than 17'
    //     })
    //     .regex(alphanumricRegex, {
    //         message:
    //             'VIN (Chassis No) should be alphabet and numeric characters.'
    //     }),

    // EngineStatus: z.enum(['1', '0']),
    // EngineNo: z
    //     .string({ required_error: 'Engine number is required.' })
    //     .max(25, { message: 'Engine number can not be greater than 25' })
    //     .regex(alphanumricRegex, {
    //         message: 'Engine number should be alphabet and numeric characters.'
    //     })
    //     ,


    ChassisStatus: z.enum(['1', '0']),

    ChassisNo: z.string({
        required_error: 'VIN (Chassis No) is required.'
    })
        .refine((val) => val.trim() !== '', {
            message: 'VIN (Chassis No) is required.'
        }).superRefine((val, ctx) => {
            const status = (ctx as any)?.options?.data?.ChassisStatus
            if (status === '1') return
            if (status === '0' && !alphanumricRegex.test(val)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'VIN (Chassis No) should be alphabet and numeric characters.'
                })
            }
        }),

    EngineStatus: z.enum(['1', '0']),
    EngineNo: z.string({
        required_error: 'Engine number is required.'
    })
        .refine((val) => val.trim() !== '', {
            message: 'Engine number is required.'
        }).superRefine((val, ctx) => {
            const status = (ctx as any)?.options?.data?.EngineStatus
            if (status === '1') return
            if (status === '0' && !alphanumricRegex.test(val)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Engine number should be alphabet and numeric characters.'
                })
            }
        }),


    FKOEM_ID: z
        .number({ invalid_type_error: 'Please Select OEM.' })
        .positive({ message: 'Please Select OEM.' }),
    MakeId: z
        .number({ invalid_type_error: 'Please Select Make.' })
        .positive({ message: 'Please Select Make.' }),
    ModelId: z
        .number({ invalid_type_error: 'Please Select Model.' })
        .positive({ message: 'Please Select Model.' }),
    VariantId: z
        .number({ invalid_type_error: 'Please Select Variant.' })
        .positive({ message: 'Please Select Variant.' }),
    DateofManufacture: z
        .number({
            invalid_type_error: 'Please Select Year of Manufacturing.',
            required_error: 'Please Select Year of Manufacturing.'
        })
        .positive({ message: 'Please Select Year of Manufacturing.' }),
    RTOId: z
        .number({ invalid_type_error: 'Please Select Registration City.' })
        .positive({ message: 'Please Select Registration City.' }),
    IsuredStateId: z
        .number({
            invalid_type_error: 'Please Select Customer Residence State.'
        })
        .positive({ message: 'Please Select Customer Residence State.' }),
    INSURED_GSTIN: z
        .string()
        .regex(gstNoRegex, { message: 'Invalid GSTIN.' })
        .min(15, 'Please Enter Valid GSTIN.')
        .max(15, 'Please Enter Valid GSTIN.')
        .optional()
        .or(z.literal(''))
        .or(z.null()),
    InvoiceDate: z.any().refine(
        (arg) => {
            if (arg == undefined || arg == null || arg === '') return false;
            return true;
        },
        { message: 'Please Select Invoice Date.' }
    )
})

export const isPolicyTypeNew = z.object({
    RENEWAL_TYPE: z.literal('0'),

    SAOD_POLICY: z.literal('0'),

    PolicyStartDate: z.any().refine(
        (arg) => {
            if (!common.isNotNullOrEmpty(arg)) return false

            return true
        },
        { message: 'Please Select Policy Start Date' }
    )
})

export const isPrevPolicyTMI = z.object({
    RENEWAL_TYPE: z.literal('1'),

    PREV_POLICY_NO: z
        .string({ required_error: 'Please Enter Prevoius Policy No.' })
        .min(6, { message: 'Policy No should be minimum 6 character.' })
        .max(30, { message: "Policy No can't be greater than 30" })
        .regex(/^[A-Za-z0-9\/-]+$/, {
            message: 'Only alphanumeric  characters ,slash(\) and hyphen(-) are allowed.',
        }),
    PREV_COVERTYPE_ID: z
        .number({ invalid_type_error: 'Please Select Prevoius Vehicle Cover' })
        .positive({ message: 'Please select prevoius vehicle cover' }),
    // POLICY_EXPIRY_DATE: z.any().refine(
    //     (arg) => {
    //         if (!common.isNotNullOrEmpty(arg)) return false

    //         return true
    //     },
    //     { message: 'Please Select OD Policy Expiry Date' }
    // ),
    TP_POLICY_EXPIRY_DATE: z.any().refine(
        (arg) => {
            if (!common.isNotNullOrEmpty(arg)) return false

            return true
        },
        { message: 'Please Select TP Policy Expiry Date' }
    ),

    SAOD_POLICY: z.literal('0'),
    ISCLAIM_AVAILED: z.enum(['true', 'false']),
    RegistrationDate: z.any().refine(
        (arg) => {
            if (!common.isNotNullOrEmpty(arg)) return false

            return true
        },
        { message: 'Please Select Registration Date.' }
    )
})

export const isPrevPolicyNonTMITP = z.object({
    SAOD_POLICY: z.literal('1'),

    RENEWAL_TYPE: z.literal('3'),
    PREV_POLICY_NO: z
        .string({ required_error: 'Previous Policy No is required' })
        .min(6, { message: 'Policy No should be minimum 6 character.' })
        .max(30, { message: "Policy No can't be greater than 30" })
        .regex(/^[A-Za-z0-9/]+$/, {
            message: 'Only alphanumeric characters are allowed.',
        }),
    PREV_COVERTYPE_ID: z
        .number({ required_error: 'Please Select Prevoius Vehicle Cover.' })
        .positive({ message: 'Please Select Vehicle Cover.' }),
    POLICY_EXPIRY_DATE: z.any().refine(
        (arg) => {
            if (!common.isNotNullOrEmpty(arg)) return false

            return true
        },
        { message: 'Please Select OD Policy Expiry Date.' }
    ),
    TP_POLICY_EXPIRY_DATE: z.any().refine(
        (arg) => {
            if (!common.isNotNullOrEmpty(arg)) return false

            return true
        },
        { message: 'Please Select TP Policy Expiry Date.' }
    ),
    TP_PREV_TENURE: z.coerce
        .number({ invalid_type_error: 'Previous TP Tenure(Year) is required' })
        .gt(0, { message: 'Previous TP Tenure(Year) is required' }),
    ISCLAIM_AVAILED: z.enum(['true', 'false']),
    RegistrationDate: z.any().refine(
        (arg) => {
            if (!common.isNotNullOrEmpty(arg)) return false

            return true
        },
        { message: 'Please Select Registration Date.' }
    )
})

export const isPrevPolicyNonTMIOD = z.object({
    SAOD_POLICY: z.literal('0'),

    RENEWAL_TYPE: z.literal('3'),
    PREV_POLICY_NO: z
        .string({ required_error: 'Previous Policy No is required' })
        .min(6, { message: 'Policy No should be minimum 6 character.' })
        .max(30, { message: "Policy No can't be greater than 30" })
        .regex(/^[A-Za-z0-9/]+$/, {
            message: 'Only alphanumeric characters are allowed.',
        }),
    PREV_COVERTYPE_ID: z
        .number({ required_error: 'Please Select Prevoius Vehicle Cover.' })
        .positive({ message: 'Please Select Vehicle Cover.' }),
    // POLICY_EXPIRY_DATE: z.any().refine(
    //     (arg) => {
    //         if (!common.isNotNullOrEmpty(arg)) return false

    //         return true
    //     },
    //     { message: 'Please Select OD Policy Expiry Date.' }
    // ),
    TP_POLICY_EXPIRY_DATE: z.any().refine(
        (arg) => {
            if (!common.isNotNullOrEmpty(arg)) return false

            return true
        },
        { message: 'Please Select TP Policy Expiry Date.' }
    ),
    TP_PREV_TENURE: z.coerce
        .number({ invalid_type_error: 'Previous TP Tenure(Year) is required' })
        .gt(0, { message: 'Previous TP Tenure(Year) is required' }),
    ISCLAIM_AVAILED: z.enum(['true', 'false'])
})

export const isPrevPolicyNonTMI = z.object({
    RENEWAL_TYPE: z.literal('3'),

    PREV_POLICY_NO: z
        .string({ required_error: 'Please Enter Prevoius Policy No.' })
        .min(6, { message: 'Policy No should be minimum 6 character' })
        .max(30, { message: "Policy No can't be greater than 30" }),
    PREV_COVERTYPE_ID: z
        .number({ required_error: 'Please Select Previous Vehicle Cover' })
        .positive({ message: 'Please Select Previous Vehicle Cover' }),
    POLICY_EXPIRY_DATE: z.any().refine(
        (arg) => {
            if (!common.isNotNullOrEmpty(arg)) return false

            return true
        },
        { message: 'Please Select OD Policy Expiry Date' }
    ),
    TP_POLICY_EXPIRY_DATE: z.any().refine(
        (arg) => {
            if (!common.isNotNullOrEmpty(arg)) return false

            return true
        },
        { message: 'Please Select TP Policy Expiry Date' }
    ),
    SAOD_POLICY: z.literal('0'),
    ISCLAIM_AVAILED: z.enum(['true', 'false']),
    RegistrationDate: z.any().refine(
        (arg) => {
            if (!common.isNotNullOrEmpty(arg)) return false

            return true
        },
        { message: 'Please Select Registration Date.' }
    )
})

export const IsSATPPolicy = z.object({
    SATP_POLICY: z.literal('1')
})

export const IsSATPPolicyNewOrNoPolicy = z.object({
    SATP_POLICY: z.literal('2')
})

export const IsNotSATPPolicy = z.object({
    SATP_POLICY: z.literal('0'),

    POLICY_EXPIRY_DATE: z.any().refine(
        (arg) => {
            if (!common.isNotNullOrEmpty(arg)) return false

            return true
        },
        { message: 'Please Select OD Policy Expiry Date.' }
    ),

    FKISURANCE_COMP_ID: z.coerce
        .number({ invalid_type_error: 'Previous OD Policy IC is required' })
        .gt(0, { message: 'Previous OD Policy IC is required' })
})

export const isNoPrevPolicy = z.object({
    RENEWAL_TYPE: z.literal('2'),
    SAOD_POLICY: z.literal('0'),
    RegistrationDate: z.any().refine(
        (arg) => {
            if (!common.isNotNullOrEmpty(arg)) return false

            return true
        },
        { message: 'Please Select Registration Date.' }
    )
})


//#region //--- Customer/Company validation ---//
const alphabetOnly = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
export const customerDetails_Taken = z.object({
    ProposalType: z.literal('I'),
    SALUTATION: z
        .string({
            invalid_type_error: 'Please Select Salutation',
            required_error: 'Please Select Salutation'
        })
        .min(2, { message: 'Please Select Salutation' }),
    FIRST_NAME: z
        .string({ required_error: 'Please Enter First Name.' })
        .min(1, 'First Name should be minimum 1 character.')
        .max(50, 'First Name should not exceed 50 characters.')
        .regex(stringSpaceRegex, { message: 'First Name must contain only letters.' })
    ,
    MIDDLE_NAME: z
        .string()
        .min(1, 'Please Enter Valid Middle Name.')
        .max(50, 'Please Enter valid middle name.')
        .regex(stringSpaceRegex, { message: 'Invalid Middle Name.' })
        .optional()
        .or(z.literal('')),
    LAST_NAME: z
        .string()
        .min(1, 'Please Enter Valid Last Name')
        .max(50, 'Please Enter Valid Last Name.')
        .regex(stringSpaceRegex, { message: 'Invalid Last Name.' })
        .optional()
        .or(z.literal('')),
    // EMAIL: z
    //     .string({ required_error: 'Please Enter Email Id.' })
    //     .email({ message: 'Please Enter Valid Email Id.' }),
   
    EMAIL: z
        .string({ required_error: 'Please Enter Email Id.' })
        .email({ message: 'Please Enter Valid Email Id.' })
        .refine((val) => {
            if (!val) return false
            const lower = val.toLowerCase().trim()           
            if (lower.includes('xx')) return false
            const parts = lower.split('@')
            if (parts.length < 2) return false
            const local = parts[0]
            const domainToken = parts[1].split('.')[0] || ''            
            if (local === 'abc' && domainToken === 'gmail') return false
            if (local === 'test' && domainToken === 'test') return false
            return true
        }, { message: 'Please Enter Valid Email Id.' }),

    MOB_NO: z
        .string({ required_error: 'Please Enter Mobile No.' })
        .min(10, 'Please Enter Valid Mobile No.')
        .max(10, 'Please Enter Valid Mobile No.')
        .max(10)
        .regex(phoneNoRegex, { message: 'Invalid Mobile No.' }),
    ALT_MOBILE_NO: z
        .string()
        .min(10, 'Please Enter Valid Alternate Mobile No.')
        .max(10, 'Please enter valid mobile no.')
        .regex(phoneNoRegex, { message: 'Invalid Mobile No.' })
        .optional()
        .or(z.literal(''))
})
export const corporateCustomerDetails_Taken = z.object({
    ProposalType: z.literal('C'),
    COMPANY_SALUTATION: z
        .string({
            invalid_type_error: 'Please Select Company Salutation',
            required_error: 'Please Select Company Salutation'
        })
        .min(2, { message: 'Please Select Company Salutation' }),
    COMPANY_NAME: z.string().min(5, 'Company name should be greater than 5.'),
    EMAIL: z.string().email({ message: 'Please enter valid email.' }),
    MOB_NO: z
        .string()
        .min(10, 'Please enter valid mobile no.')
        .max(10, 'Please enter valid mobile no.')
        .max(10)
        .regex(phoneNoRegex, { message: 'Invalid Mobile No.' }),
    ALT_MOBILE_NO: z
        .string()
        .min(10, 'Please enter valid mobile no.')
        .max(10, 'Please enter valid mobile no.')
        .regex(phoneNoRegex, { message: 'Invalid Mobile No.' })
        .optional()
        .or(z.literal(''))
})
//#endregion

//#region //--- Vehicle details validation ---//
export const vehicleDetailsPrivate = z.object({
    //IsCommercial: z.literal('0'),
    FKVehicleType_ID: z.literal(1)
})
// export const vehicleDetails_NotTaken = z.object({
//     IsVehicle: z.literal('0'),
//     ChassisStatus: z.enum(['1', '0'])
// })
//#endregion

//#region //--- Registration number validation on behalf of selection ---//
export const IsRegistrationRequired = z.object({
    PolicyType: z.literal('N'),
    IS_BH_REGIST_NO: z.literal('0')
})
export const bhRegNoType_Taken = z.object({
    PolicyType: z.enum(['N', 'R']),
    IS_BH_REGIST_NO: z.literal('1'),
    BHNumberSeries1: z
        .string({ invalid_type_error: 'Required', required_error: 'Required' })
        .min(5, 'Minimum 5 Character Allowed')
        .max(5, 'Maximum 5 Character Allowed'),
    BHNumberSeries2: z
        .string({ invalid_type_error: 'Required', required_error: 'Required' })
        .min(1, 'Minimum 1 Character Allowed.')
        .max(3, 'Maximum 3 Character Allowed.')
        .regex(stringOnly, { message: 'Alphabet Only.' }),
    // .optional()
    // .or(z.literal(''))
    // .or(z.null())

    BHNumberSeries3: z
        .string({ invalid_type_error: 'Required', required_error: 'Required' })
        .min(4, 'Minimum 4 Digit Allowed')
        .max(4, 'Maximum 4 Digit Allowed')
})
export const specialRegNoType_Taken = z.object({
    PolicyType: z.enum(['N', 'R']),
    IS_BH_REGIST_NO: z.literal('2'),
    SpecialRegistartionNo: z
        .string({
            required_error: 'Please Enter Special Registration No.',
            invalid_type_error: 'Please Enter Special Registration No.'
        })
        .min(1, { message: 'Please Enter Special Registration No.' })
})
export const normalRegNoType_Taken = z.object({
    PolicyType: z.enum(['N', 'R']),
    IS_BH_REGIST_NO: z.literal('3'),
    RTO_NAME: z
        .string({
            invalid_type_error: 'Required',
            required_error: 'RTO Code is required'
        })
        .min(5, 'Minimum 5 Character Allowed')
        .max(5, 'Maximum 5 Character Allowed'),
    RegistrationNo1: z
        .string({ invalid_type_error: 'Required', required_error: 'Required' })
        .min(1, 'Minimum 1 Character Allowed')
        .max(3, 'Maximum 3 Character Allowed')
        .regex(stringOnly, { message: 'Alphabet Only.' })
        .optional()
        .or(z.literal(''))
        .or(z.null()),
    RegistrationNo2: z
        .string({ invalid_type_error: 'Required', required_error: 'Required' })
        .min(4, 'Minimum 4 Digit Allowed.')
        .max(4, 'Maximum 4 Digit Allowed')
})

export const additionalsDiscountsDetails = z.object({
    IsAntiTheft: z.string().optional(),
    IsAA: z.string().optional(),
    IsIMT23: z.string().optional(),
    IsIMT34: z.string().optional(),
    DiscountPer: z.number().optional()
})
export const isNCBForward_Choosen = z.object({
    IsNCBForward: z.literal('true'),
    NCBLevel: z.string({
        invalid_type_error: 'Please Select NCB Entitled %',
        required_error: 'Please Select NCB Entitled %'
    })
})
export const isNCBForward_NotChoosen = z.object({
    IsNCBForward: z.literal('false')

})

export const isVoluntaryForward_Choosen = z.object({
    IsVoluntaryForward: z.literal('true'),
    VoluntaryExcess: z
        .string({
            invalid_type_error: 'Please Select Voluntary Excess (₹)',
            required_error: 'Please Select Voluntary Excess (₹)'
        })
        .min(1, { message: 'Please Select Voluntary Excess (₹)' })
})
export const isVoluntaryForward_NotChoosen = z.object({
    IsVoluntaryForward: z.literal('false')
})
//#endregion

//#region //--- Optional details validation ---//
// export const optionalCoversDetails = z.object({
//     ElectricalValue: z.number().optional(),
//     NonElectricalValue: z.number().optional(),
//     BiFuelValue: z.number().optional(),
//     GeoArea: z.array().optional(),
//     IsCPACover: z.boolean().optional(),
//     IsPaidDriver: z.boolean().optional(),
//     IsUnnamedPassenger: z.boolean().optional(),
//     CPATenure: z.number().optional(),
//     CoverAmount: z.number().optional(),
//     UnnamedPassengerCount: z.number().optional(),
//     OtherEmp: z.number().optional(),
//     LLPaidDriver: z.boolean().optional(),
//     IsIMT34: z.string().optional()
// })
export const isCPACover_Choosen = z.object({
    IsCPACover: z.literal('true'),
    CPATenure: z.number({
        invalid_type_error: 'Please Select CPA Tenure(Year)',
        required_error: 'Please Select CPA Tenure(Year)'
    }),
    CPAReason: z
        .string({
            invalid_type_error: 'Please Select CPA Waiver Reason',
            required_error: 'Please Select CPA Waiver Reason'
        })
        .min(1, { message: 'Please Select CPA Waiver Reason' })
        .optional()
    //.gt(0, { message: 'Please Select CPA Tenure(Year)' })
})
export const isCPACover_NotChoosen = z.object({
    IsCPACover: z.literal('false')
})
export const isPACover_UnnamedPassengerTaken = z.object({
    IsUnnamedPassenger: z.literal('true'),
    CoverAmount: z.coerce
        .number({
            invalid_type_error: 'Please Select PA Cover Amount (₹)',
            required_error: 'Please Select PA Cover Amount (₹)'
        })
        .gt(1, { message: 'Please Select PA Cover Amount (₹)' })
})
export const isPACover_UnnamedPassengerNotTaken = z.object({
    IsUnnamedPassenger: z.literal('false')
})
export const isPA_PaidDriverTaken = z.object({
    IsPaidDriver: z.literal('true'),
    // CoverAmount: z.string({
    //     invalid_type_error: 'Please Select PA Unnamed Passenger(₹)',
    //     required_error: 'Please Select PA Unnamed Passenger(₹)'
    // })
    CoverAmount: z.coerce
        .number({
            invalid_type_error: 'Please Select PA Cover Amount (₹)',
            required_error: 'Please Select PA Cover Amount (₹)'
        })
        .gt(1, { message: 'Please Select PA Cover Amount (₹)' })

})
export const isPA_PaidDriverNotTaken = z.object({
    IsPaidDriver: z.literal('false')
})
//#endregion

export const lastYearAddOns = z.object({
    ZeroDep: z.boolean(),
    ReturnToInvoice: z.boolean(),
    EngineProtect: z.boolean()
})
//#endregion

//#region //--- Additonal discounts details validation ---//
