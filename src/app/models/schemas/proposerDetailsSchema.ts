import dayjs from 'dayjs'
import { z } from 'zod'
import common from '../../utils/common'

const phoneNoRegex = new RegExp(/(0|91)?[6-9][0-9]{9}/)
const panCardRegex = new RegExp(/^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/)
const numberRegex = new RegExp(/^[0-9]*$/)
const alphanumricRegex = new RegExp(/^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$/)
const alphabetRegex = new RegExp(/^[a-zA-Z]+$/)
const discardSpecialCharactersRegex = new RegExp(/^[0-9a-zA-Z''-'\s]{1,40}$/) ///^[a-zA-Z0-9-]+$/
const allowDashedCharacter = new RegExp(/^[0-9a-zA-Z \/_?:.,\s-]+$/)
const onlyNumber = new RegExp(/^[0-9]+$/)
const alphabetWithSpace = new RegExp(/^[a-zA-Z.\s]+$/)
// const addressRegex = /^(?! )[A-Za-z0-9,\/\- ]*(?<! )$/;
// const addressRegex = /^[A-Za-z0-9\s,\/\-\.\#\&\(\):@'\"-]+$/;
const addressRegex = /^(?!.*~)[\x20-\x7E]+$/;

const proposalDetailsSchema = z.object({
    SALUTATION: z
        .string({ invalid_type_error: 'Please select Salutation.' })
        .min(1, { message: 'Please select Salutation.' }),
    FIRST_NAME: z
        .string()
        .min(1, 'Please enter First name.')
        .regex(alphabetWithSpace, {
            message: 'Please enter valid first name.'
        }),
    MIDDLE_NAME: z
        .string()
        .min(1, 'Please enter Middle name.')
        .regex(alphabetWithSpace, {
            message: 'Please enter valid middle name.'
        })
        .optional()
        .or(z.literal('')),
    LAST_NAME: z
        .string()
        .min(1, 'Please enter Last name.')
        .regex(alphabetWithSpace, { message: 'Please enter valid last name.' })
        .optional()
        .or(z.literal('')),
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
        .or(z.literal('')),
    STATE_ID: z.number().gt(0, { message: 'Please choose a state.' }),
    CITY_ID: z.number().gt(0, { message: 'Please choose a city.' }),
    PIN: z
        .number({ invalid_type_error: 'Please choose a pincode.' })
        .gt(0, { message: 'Please choose a pincode.' }),
    PAN_NO: z
        .string()
        .min(10, { message: 'Please enter a valid PAN Card No.' })
        .max(10, { message: 'Please enter a valid PAN Card No.' })
        .superRefine((val, ctx) => {
                if (val.toLowerCase().includes("xxx")) {
                    return;
                }
                if (!panCardRegex.test(val)) {
                ctx.addIssue({
                code : z.ZodIssueCode.custom,
                message: "Invalid PAN Card No.",
            });
            }
        })
        //.regex(panCardRegex, { message: 'Invalid PAN Card No.' })
        .optional()
        .or(z.literal('')),

    ADDRESS1: z
        .string({ required_error: 'Please enter Address.' })
        .min(5, { message: 'Please enter Address.' })
        .max(50, { message: 'Address must not exceed 50 characters.' })
        .regex(addressRegex, { message: 'Invalid Address.' }),

    ADDRESS2: z
        .string()
        .max(50, { message: 'Address must not exceed 50 characters.' })
        .regex(addressRegex, { message: 'Invalid Address.' })
        .optional()
        .or(z.literal('')),

    CPA_PREV_TENURE: z.number(),
    PAYMENT_MODE: z
        .string({
            required_error: 'Please select Payment Mode.',
            invalid_type_error: 'Please select Payment Mode.'
        })
        .min(1, { message: 'Please select Payment Mode.' }),
    CKYC_NO: z
        .string()
        .min(5, { message: "CKYC No. can't be less than 5 character." })
        .max(25, { message: "CKYC No. can't be greater than 25 character." })
        .optional()
        .or(z.literal('')),
    AADHAAR_NO: z
        .number()
        .min(4, { message: "Aadhaar No can't be less than 4 digit." })
        .max(4, { message: "Aadhaar No can't be greater than 4 digit." })
        .optional()
        .or(z.literal('')),

    AgentID: z.coerce
        .number({ required_error: 'Please select DP.' })
        .gt(0, { message: 'Please select DP.' })
        .optional()
       ,
        // EI_Account_No :z
        // .string()        
        // .max(15, { message: 'EI Account No. should be maximum 15 digit.' })
        // .regex(alphanumricRegex, {
        //     message: 'EI Account No. should be alphanumeric'
        // }).or(z.literal(''))
})

const proposalDetailsForIndividual = z.object({
    PROPOSER_TYPE: z.literal('I'),
    DOB: z.any().refine(
        (arg) => {
            if (arg == undefined || !arg.isValid()) {
                return false
            } else {
                let dateBefore = new Date().setFullYear(
                    new Date().getFullYear() - 18
                )

                if (dayjs(dateBefore).isBefore(arg)) {
                    return false
                }

                return true
            }
        },
        { message: 'Date of Birth cannot be less than 18 years.' }
    )
})

const proposalDetailsForCorporate = z.object({
    PROPOSER_TYPE: z.literal('C'),
    COMPANY_NAME: z.string().min(1, { message: 'Please enter Company Name.' }),
    COMPANY_SALUTATION: z
        .string({ invalid_type_error: 'Please select Company Salutation.' })
        .min(1, { message: 'Please select Company Salutation.' }),
    DOI: z.any().refine(
        (arg) => {
            if (arg == undefined || !arg.isValid()) {
                return false
            } else {
                let date = new Date()

                if (
                    dayjs(arg).isAfter(dayjs(date)) ||
                    dayjs(arg).isSame(dayjs(date))
                ) {
                    return false
                }

                return true
            }
        },
        { message: 'Date of Incorporation cannot be greater than today.' }
    )
})

const AA_Taken = z.object({
    IS_AA_MEMBERSHIP: z.literal(1),
    MEMBERSHIP_NO: z
        .string()
        .min(1, { message: 'Please enter AA membership No.' }),
    ASSOCIATION_NAME: z
        .string({
            errorMap: () => ({ message: 'Please select Association Name.' })
        })
        .min(1, { message: 'Please select Association Name.' }),

    AAYear: z
        .string()
        .min(4, { message: 'Please enter valid year.' })
        .max(4, { message: 'Please enter valid year.' })
        .regex(numberRegex, { message: 'Please enter AA Card Validity Year.' }),

    AAMonth: z.coerce.number({
        errorMap: () => ({ message: 'Please choose AA Card Validity Month.' })
    })
})

const AA_NotTaken = z.object({
    IS_AA_MEMBERSHIP: z.literal(0)
})

const NCB_NotTaken = z.object({
    PREV_IS_VISOF_POLICY: z.literal('2')
})

const NCB_SchemaForVisofPolicy = z.object({
    PREV_IS_VISOF_POLICY: z.literal('1'),
    PREV_VEH_POLICY_NO: z
        .string()
        .min(1, { message: 'Please enter Previous Policy No.' }),

    PREV_VEH_POLICYSTARTDATE: z.any().refine(
        (arg) => {
            if (arg == undefined) return false

            return true
        },
        { message: 'Please select NCB Policy Start Date.' }
    ),

    PREV_VEH_NCB: z.coerce.string(),
    PREV_VEH_IC: z.number({
        errorMap: () => ({ message: 'Please choose IC.' })
    }),
    PREV_VEH_POLICYENDDATE: z.any().refine(
        (arg) => {
            if (arg == undefined) return false

            return true
        },
        { message: 'Please select NCB Policy End Date.' }
    ),
    PREV_VEH_NCB_EFFECTIVE_DATE: z.any().refine(
        (arg) => {
            let dt = common.getJsFormattedDate(new Date())

            if (arg == undefined || !dayjs(arg).isValid()) return false
        else if (dayjs(arg).isAfter(new Date()) || dayjs(arg).isSame(dayjs(dt))) return false
            else if (dayjs(arg).isBefore(dayjs(new Date()).subtract(3, 'year')) ) return false
            return true
        },
        { message: 'Please select correct NCB Effective Date.' }
    )
})

const NCB_SchemaForNonVisofPolicy = z.object({
    PREV_IS_VISOF_POLICY: z.literal('0'),
    //PREV_VEH_POLICY_NO:z.string().min(1,{"message":"Please enter Previous Policy No."}),
    PREV_VEH_CHASSIS_NO: z
        .string()
        .min(16, { message: 'Chassis No. should be minimum 16 digit.' })
        .max(25, { message: 'Chassis No. should be maximum 25 digit.' })
        .regex(alphanumricRegex, {
            message: 'Chassis No. should be alphanumeric'
        }),
    PREV_VEH_ENGINE_NO: z
        .string({ required_error: 'Engine number is required.' })
        .min(7, { message: 'Engine No. should be minimum 7 digit.' })
        .max(25, { message: 'Engine number can not be greater than 25' })
        .regex(alphanumricRegex, {
            message: 'Engine No. should be alphanumeric'
        }),
    PREV_VEH_MODEL: z.string().min(1, { message: 'Please enter Model.' }),
    PREV_VEH_VARIANT_NO: z
        .string()
        .min(1, { message: 'Please enter Variant.' }),
    PREV_VEH_MAKE: z.string().min(1, { message: 'Please enter Make' }),
    PREV_VEH_MANU_YEAR: z.coerce
        .number({ required_error: 'Please select Manufacturer Year.' })
        .gt(0, { message: 'Please select Manufacturer Year.' }),
    PREV_VEH_REG_NO: z
        .string({ required_error: 'Please enter Previous Vehicle Reg No.' })
        .regex(allowDashedCharacter, {
            message: 'Only Dashed Special Characters are allowed.'
        })
        .min(4, { message: 'Please enter minimum 4 digits.' })
        .max(12, { message: 'Please enter maximum 12 digits.' }),
    PREV_VEH_POLICY_NONVISOF: z
        .string({
            invalid_type_error: 'Please enter Previous Policy No.',
            required_error: 'Please enter Previous Policy No.'
        })

        .min(1, { message: 'Please enter Previous Policy No.' }),

    PREV_VEH_POLICYSTARTDATE: z.any().refine(
        (arg) => {
            if (arg == undefined || !dayjs(arg).isValid()) return false
            else if (dayjs(arg).isAfter(new Date())) return false
            return true
        },
        { message: 'Please select valid NCB Policy Start Date.' }
    ),
    // PREV_VEH_INVOICEDATE: z.any().refine(
    //     (arg) => {
    //         if (arg == undefined) return false

    //         return true
    //     },
    //     { message: 'Please select Vehicle Invoice Date.' }
    // ),

    PREV_VEH_INVOICEDATE: z.any()
    .refine(
        (arg) => arg !== undefined && arg !== null && dayjs(arg).isValid(),
        { message: 'Please select Vehicle Invoice Date.' }
    )
    .refine(
        (arg) => !dayjs(arg).isAfter(dayjs(), 'day'),
        { message: "Invoice Date should not be more than today's date." }
    ),
    PREV_VEH_NCB: z.coerce
        .number({ required_error: 'Please select NCB.' })
        .gt(0, { message: 'Please select NCB.' }),
    PREV_VEH_IC: z
        .number()
        .gt(0, { message: 'Please choose Previous Insurance Company.' }),
    PREV_VEH_ISNCBCERTIFICATE: z.literal(true, {
        errorMap: () => ({ message: 'Please check NCB Document Submitted.' })
    }),
    PREV_VEH_ADDRESS: z.string().min(1, { message: 'Please enter Address.' }),

    PREV_VEH_POLICYENDDATE: z.any().refine(
        (arg) => {
            if (arg == undefined || !dayjs(arg).isValid()) return false

            return true
        },
        { message: 'Please select valid NCB Policy End Date.' }
    ),
    PREV_VEH_NCB_EFFECTIVE_DATE: z.any(),
    // PREV_VEH_NCB_EFFECTIVE_DATE_NONVISOF: z
    //     .any()
    //     .nullable()
    //     .refine(
    //         (arg) => {

    //             let dt = common.getJsFormattedDate(new Date())

    //             if (arg == undefined || !dayjs(arg).isValid()) return false
    //         else if (dayjs(arg).isAfter(new Date()) || dayjs(arg).isSame(dayjs(dt))) return false
    //         else if (dayjs(arg).isBefore(dayjs(new Date()).subtract(3, 'year'))) return false
    //         return true

    //             return true
    //         },
    //         { message: "NCB Certificate Effective Date should not be more than 3 years" }
    //     ),

    PREV_VEH_NCB_EFFECTIVE_DATE_NONVISOF: z
    .any()
    .refine(arg => arg !== undefined && arg !== null && dayjs(arg).isValid(), {
        message: 'Please select NCB Effective Date.',
    })
    .refine(arg => dayjs(arg).isBefore(dayjs(), 'day'), {
        message: "NCB certificate effective date should be less than today's date.",
    })
    .refine(arg => dayjs(arg).isAfter(dayjs().subtract(3, 'year')), {
        message: 'NCB Certificate Effective Date should not be more than 3 years old.',
    }),

   
    FromAndInvoiceDateCheck: z.boolean({
        required_error:
            'Policy From Date cannot be less than Invoice Date.'
    }),
    MFGYearAndNCBCert: z.boolean({
        required_error:
            'NCB Effective Date cannot be less than Invoice Date.'
    }),
    
    MFGYearAndInvoice: z.boolean({
        required_error:
            'Invoice Date cannot be less than Manufacturer Year.'
    })
    
})


const AppointeeSchema = z.object({
    Is_AppointeeRequired: z.literal(1),
    AppointeeAge: z.coerce
        .number()
        .gt(18, { message: 'Age must be greater than 18.' })
        .transform((e) =>
            e == undefined ? '' : e.toString() == '' ? undefined : e
        ),
    AppointeeRelation: z
        .string({
            invalid_type_error: 'Please Select Appointee Relation',
            required_error: 'Please Select Appointee Relation'
        })
        .min(1, { message: 'Please select Appointee Relation' }),
    AppointeeGender: z
        .string({
            invalid_type_error: 'Please Select Appointee Gender',
            required_error: 'Please Select Appointee Gender'
        })
        .min(1, { message: 'Please select Appointee Gender' }),
    AppointeeName: z
        .string()
        .min(1, { message: 'Please enter Appointee Name' })
        .regex(alphabetWithSpace, {
            message: 'Please Enter valid Appointee Name'
        })
})

const AppointeeNotSchema = z.object({
    Is_AppointeeRequired: z.literal(0)
})

const CPA_SchemaTrue = z.object({
    CPA_PREV_TENURE: z.literal(1),
    NomineeAge: z.coerce
        .number({
            errorMap: () => ({ message: 'Please Enter valid age.' })
        })
        .positive({ message: 'Nominee age can not be blank or 0' }),
    NomineeName: z
        .string()
        .min(1, { message: 'Please Enter Nominee Name' })
        .regex(alphabetWithSpace, {
            message: 'Please Enter valid Nominee Name'
        }),
    NomineeRelation: z
        .string({
            invalid_type_error: 'Please Select Nominee Relation',
            required_error: 'Please Select Nominee Relation'
        })
        .min(1, { message: 'Please select Nominee Relation' }),
    NomineeGender: z
        .string({
            invalid_type_error: 'Please Select Nominee Gender',
            required_error: 'Please Select Nominee Gender'
        })
        .min(1, { message: 'Please select Nominee Gender' })
})

const CPA_SchemaFalse = z.object({
    CPA_PREV_TENURE: z.literal(0)
})

const ChequeSchema = z.object({
    PAYMENT_MODE: z.enum(['D']),
    CHEQUE_NO: z
        .string({ required_error: 'Please enter Cheque No.' })
        .min(1, { message: 'Please enter Cheque No.' }),
    CHEQUE_DATE: z.any().refine(
        (arg) => {
            if (arg == undefined) {
                return false
            } else {
                if (dayjs(arg).isBefore(new Date())) {
                    return false
                }

                return true
            }
        },
        { message: 'Please select valid Cheque Date.' }
    ),
    BANK_ACC_NO: z
        .string({ required_error: 'Please enter Bank Account No.' })
        .min(1, { message: 'Please enter Bank Account No.' })
})

const ChequeSchemaWithBank = z.object({
    PAYMENT_MODE: z.enum(['I']),
    CHEQUE_NO: z
        .string({ required_error: 'Please enter Cheque No.' })
        .min(1, { message: 'Please enter Cheque No.' }),
    CHEQUE_DATE: z.any().refine(
        (arg) => {
            if (arg == undefined) {
                return false
            } else {
                if (dayjs(arg).isBefore(new Date())) {
                    return false
                }

                return true
            }
        },
        { message: 'Please select valid Cheque Date.' }
    ),
    BANK_ACC_NO: z
        .string({ required_error: 'Please enter Bank Account No.' })
        .min(1, { message: 'Please enter Bank Account No.' }),
    FKBANK_ID: z.coerce
        .number({ required_error: 'Please select Bank.' })
        .gt(0, { message: 'Please select Bank.' }),
    BANK_CITY: z
        .string({ required_error: 'Please enter Bank City.' })
        .min(1, { message: 'Please enter Bank City.' })
})

const NotChequeSchema = z.object({
    PAYMENT_MODE: z.enum(['C', 'P', 'A', 'G'])
})

const OtherTPDetailsSchema = z.object({
    TP_TENURE_AVAILABLE: z.literal('0'),
    TP_POLICY_NO: z
        .string({ required_error: 'Please enter Policy No.' })
        .min(1, { message: 'Please enter Policy No.' }),
    PREV_TP_FKISURANCE_COMP_ID: z.coerce
        .number({ required_error: 'Please select Insurance Company.' })
        .gt(0, { message: 'Please select Insurance Company.' }),
    PREV_TP_POLICY_EFFECTIVE_DATE: z.any().refine(
        (arg) => {
            if (arg == undefined) return false

            return true
        },
        { message: 'Please select Previous TP Policy Start Date.' }
    ),
    PREV_TP_POLICY_EXPIRY_DATE: z.any().refine(
        (arg) => {
            if (arg == undefined) return false

            return true
        },
        { message: 'Please select Previous TP Policy End Date.' }
    ),
    FromandToDateCheckForOtherTP: z.boolean({
        required_error:
            'Other TP Policy End Date cannot be less than Other TP Policy Start Date.'
    }),
    PREV_OTHER_TP_TENURE: z.string({
        required_error: 'Please select Other TP Tenure.',
        invalid_type_error: 'Please select Other TP Tenure.'
    })
})

const NotOtherTPDetailsSchema = z.object({
    TP_TENURE_AVAILABLE: z.literal('1')
})

const financierSchema = z.object({
    IS_AGREEMENT_TYPE: z.literal('1'),
    FINANCER_ID: z.coerce.number().gt(0, { message: 'Please select Bank.' })
})

const financierNotSchema = z.object({
    IS_AGREEMENT_TYPE: z.literal('0')
})

const hypothecationSchema = z.object({
    IS_HYPOTHECATION: z.literal('1'),

    FINANCER_ID: z.coerce.number().gt(0, { message: 'Please select Bank.' }),
    FIN_BRANCH_ACCOUNT_NUMBER: z
        .string({ required_error: 'Please enter Account No.' })
        .min(1, { message: 'Please enter Account No.' })
        .max(20, { message: 'Cannot enter more than 20 digits.' })
        .regex(discardSpecialCharactersRegex, {
            message: 'Please enter Correct Account No.'
        })
        .optional()
        .or(z.literal('')),
    BRANCH_NAME: z
        .string({ required_error: 'Please enter Branch Name.' })
        .min(1, { message: 'Please enter Branch Name.' })
        .regex(alphabetWithSpace, {
            message: 'Please enter Correct Branch Name.'
        }),
    BRANCH_CITY: z
        .string({ required_error: 'Please enter Branch City.' })
        .min(1, { message: 'Please enter Branch City.' })
        .regex(alphabetWithSpace, {
            message: 'Please enter Correct Branch City.'
        })
})

const hypothecationNotSchema = z.object({
    IS_HYPOTHECATION: z.literal('0')
})

const Emi_AddonY = z.object({
    ISEMIADDON: z.literal('1'),
    AGGREMENT_TYPE: z.string({
        required_error: 'Cannot be left blank, if you have selected EMI Cover Add-on.',
        invalid_type_error: 'Cannot be left blank, if you have selected EMI Cover Add-on.'
    })
    .min(2, {message:'Cannot be left blank, if you have selected EMI Cover Add-on.'})
})

const Emi_AddonN = z.object({
    ISEMIADDON: z.literal('0')
})


// const financierAndHypothecationUnion = z.union([
//     financierUnion,alphabetWithSpace
//     hypothecationUnion
// ])

const proposerDetailsWithNCB = z
    .discriminatedUnion('PREV_IS_VISOF_POLICY', [
        NCB_SchemaForVisofPolicy,
        NCB_SchemaForNonVisofPolicy,
        NCB_NotTaken
    ])
    .and(proposalDetailsSchema)

const proposerDetailsWithAA = z
    .discriminatedUnion('IS_AA_MEMBERSHIP', [AA_Taken, AA_NotTaken])
    .and(proposerDetailsWithNCB)

const proposerDetailsWithCPA_Appointee = z
    .discriminatedUnion('Is_AppointeeRequired', [
        AppointeeSchema,
        AppointeeNotSchema
    ])
    .and(proposerDetailsWithAA)

const proposerDetailsWithCPA = z
    .discriminatedUnion('CPA_PREV_TENURE', [CPA_SchemaTrue, CPA_SchemaFalse])
    .and(proposerDetailsWithCPA_Appointee)

const proposerDetailsWithProposerType = z
    .discriminatedUnion('PROPOSER_TYPE', [
        proposalDetailsForIndividual,
        proposalDetailsForCorporate
    ])
    .and(proposerDetailsWithCPA)

const proposerDetailsWithOtherTPDetails = z
    .discriminatedUnion('TP_TENURE_AVAILABLE', [
        OtherTPDetailsSchema,
        NotOtherTPDetailsSchema
    ])
    .and(proposerDetailsWithProposerType)


    const financierValidation = z.discriminatedUnion('ISEMIADDON',[
        Emi_AddonY,Emi_AddonN
    ]).and(proposerDetailsWithOtherTPDetails)


const financierUnion = z
    .discriminatedUnion('IS_AGREEMENT_TYPE', [
        financierSchema,
        financierNotSchema
    ])
    .and(financierValidation)


const hypothecationUnion = z
    .discriminatedUnion('IS_HYPOTHECATION', [
        hypothecationSchema,
        hypothecationNotSchema
    ])
    .and(financierUnion)


    
// const proposerDetailsWithCheque = z.discriminatedUnion("PAYMENT_MODE",[
//     ChequeSchema,
//     ChequeSchemaWithBank,
//     NotChequeSchema,
// ],{errorMap: () => ({ message: "Please select Payment Mode." })}).and(proposerDetailsWithProposerType)

export const proposerDetails = hypothecationUnion

export type PolicyProposalSchemaType = z.infer<typeof proposerDetails>
