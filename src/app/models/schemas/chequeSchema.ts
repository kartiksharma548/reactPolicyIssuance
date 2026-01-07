import dayjs, { Dayjs } from 'dayjs';
import { z } from 'zod'
const onlyNumber = new RegExp(/^[0-9]+$/);

const cheque = z.object({
    IsCustomerCheque: z.literal(1),
    CHEQUE_NO: z
        .string()
        .min(6, { message: "Please enter 6 digit Cheque No." })
        .max(6, { message: "Please enter 6 digit Cheque No." })
        .regex(onlyNumber, { message: 'Cheque No must be digit.' }),
    CITY: z.coerce.number().gt(0, { message: "Please select City." }),
    CHEQUE_DATE: z.any().refine((arg) => {
        if (arg == undefined) {
            return false
        }
        else {
            var date = new Date();
            if (dayjs(arg).isBefore(dayjs(date).subtract('7', 'day'))) {
                return false
            }

            return true
        }
    }, { message: 'Please select valid Cheque Date.' }),
    BANK: z.coerce.number().gt(0, { message: "Please select Bank." }),
    ACCOUNT_NO: z
        .string({ required_error: 'Please enter Account No.' })
        .min(1, { message: 'Please enter Account No.' })
        .max(20, { message: "Cannot enter more than 20 digits." })
        .regex(onlyNumber, { message: 'Account No must be digit.' }),
    CHEQUE_COPY: z.instanceof(FileList, { message: "Upload Cheque Copy" }),
})

const notChequeSchema = z.object({
    IsCustomerCheque: z.literal(0)
})
const chequeUnion = z.discriminatedUnion("IsCustomerCheque", [
    cheque,
    notChequeSchema
])

export const chequeSchema = chequeUnion
export type ChequeSchemaType = z.infer<typeof chequeSchema>