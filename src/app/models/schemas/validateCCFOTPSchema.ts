import { z } from 'zod'
const otpRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);
const sendCCFOTPSchema = z.object({
    Digit1:z.coerce.number({invalid_type_error: "Must be a number"}).nonnegative({message:"Must be a number"}),
    Digit2:z.coerce.number({invalid_type_error: "Must be a number"}).nonnegative({message:"Must be a number"}),//.min(1, {message:"Invaild No."}).max(1,{message:"Invaild No."}).max(1).regex(otpRegex,{message:'Invalid No.'}),
    Digit3:z.coerce.number({invalid_type_error: "Must be a number"}).nonnegative({message:"Must be a number"}),//.min(1, {message:"Invaild No."}).max(1,{message:"Invaild No."}).max(1).regex(otpRegex,{message:'Invalid No.'}),
    Digit4:z.coerce.number({invalid_type_error: "Must be a number"}).nonnegative({message:"Must be a number"}),//.min(1, {message:"Invaild No."}).max(1,{message:"Invaild No."}).max(1).regex(otpRegex,{message:'Invalid No.'}),
});

export const validateCCFOTPSchema = sendCCFOTPSchema
export type ValidateCCFOTPSchemaType = z.infer<typeof validateCCFOTPSchema>