import { z } from 'zod'

const phoneNoRegex = new RegExp(/(0|91)?[6-9][0-9]{9}/)
const sendQuoteToCustomerSchema = z.object({
    CustomerEmail: z.string().email({ message: 'Please enter valid email.' }),
    CustomerMobileNo: z
        .string()
        .min(10, { message: 'Please enter valid mobile no.' })
        .max(10, { message: 'Please enter valid mobile no.' })
        .regex(phoneNoRegex, { message: 'Invalid Mobile No.' })
})

export const ccfSchema = sendQuoteToCustomerSchema
export type CCFSchemaType = z.infer<typeof ccfSchema>
