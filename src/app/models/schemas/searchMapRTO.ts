import { z } from 'zod'
// const rtoCodeOrCityRegex = /^([A-Z]{2}[- ]?\d{1,2}([A-Z])?([- ]?[A-Z0-9]{1,4})?|[A-Za-z ]{3,20})$/;
const alphabetWithSpace = new RegExp(/^([a-zA-Z]+\s)*[a-zA-Z]+$/)

const mapRTOData = z.object({
    RTO_NAME: z
        .string()
        .min(1, 'Minimum 1 character of RTO Code is required.')
        .max(50, 'RTO Code must be less than 12 characters.')
        .regex(alphabetWithSpace, {
            message: 'Please enter valid RTO Name.'
        })
        .optional()
        .or(z.literal('')),
    State: z.any(),
    City: z.any()
})
export const mapRTOSchema = mapRTOData
export type MapRTOSchema = z.infer<typeof mapRTOSchema>