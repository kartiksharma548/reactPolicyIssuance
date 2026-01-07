import dayjs from 'dayjs';
import { z } from 'zod'

const breakin = z.object({
    IsBreakin : z.literal(1),
    Front:z.instanceof(FileList,{message:"Upload Front Image."}),
    Rear:z.instanceof(FileList,{message:"Upload Rear Image."}),
    Left:z.instanceof(FileList,{message:"Upload Left Image."}),
    Right:z.instanceof(FileList,{message:"Upload Right Image."}),
    Chassis:z.instanceof(FileList,{message:"Upload Chassis No."}),
    Odometer:z.instanceof(FileList,{message:"Upload Odometer Image"}),
    Inspection:z.instanceof(FileList,{message:"Upload Inspection Report."}),
    RCCopy:z.instanceof(FileList,{message:"Upload RC Copy."}),
    ChassisTrace:z.instanceof(FileList,{message:"Upload Chassis Trace."}),
    UnderChassisImage:z.instanceof(FileList,{message:"Upload Under Chassis Image."}),
    EngineImage:z.instanceof(FileList,{message:"Upload Engine Image."}),
    InspectionDate : z.any().refine(
        (arg) => {
            if (arg == undefined) return false
 
            return true
        },
        { message: 'Please select Inspection Date.' }
    ),
    // InspectionTime : z.any().refine(
    //     (arg) => {
    //         if (arg == undefined) return false
 
    //         return true
    //     },
    //     { message: 'Please select Inspection Time.' }
    // ),

   InspectionTime: z
    .any()
    .refine(
        (arg) => {
            if (typeof arg === 'string' && arg.trim() !== '') return true;
            if (arg && typeof arg === 'object' && typeof arg.format === 'function') {
                return dayjs(arg).isValid();
            }
            return false;
        },
        { message: 'Please select Inspection Time.' }
    ),
  
        
})

const notBreakinSchema = z.object({
    IsBreakin : z.literal(0)
})

const NCBSchema= z.object({
    ISNCB:z.literal(1),
    NCBCertificate:z.instanceof(FileList,{message:"Upload NCB Certificate."}),
})

const NotNCBSchema= z.object({
    ISNCB:z.literal(0)
})

const HandicappedSchema= z.object({
    IS_HANDICAPPED:z.literal(1),
    H1:z.instanceof(FileList,{message:"Upload Handicapped Registration Document."}),
    H2:z.instanceof(FileList,{message:"Upload Handicapped Govt. Document."}),
})

const NotHandicappedSchema= z.object({
    IS_HANDICAPPED:z.literal(0)
})


const ChassisDiscountSchema= z.object({
    ISCHASSISDISCOUNT:z.literal(1),
    ChassisDiscountImage:z.instanceof(FileList,{message:"Upload Chassis Discount Approval."}),
})

const ChassisNotDiscountSchema= z.object({
    ISCHASSISDISCOUNT:z.literal(0)
})

const chassisDiscountUnion = z.discriminatedUnion("ISCHASSISDISCOUNT",[
    ChassisDiscountSchema,
    ChassisNotDiscountSchema
])

const ncbUnion = z.discriminatedUnion("ISNCB",[
    NCBSchema,
    NotNCBSchema
]).and(chassisDiscountUnion)

const handicappedUnion = z.discriminatedUnion("IS_HANDICAPPED",[
    HandicappedSchema,
    NotHandicappedSchema
]).and(ncbUnion)


const breakinUnion = z.discriminatedUnion("IsBreakin",[
    breakin,
    notBreakinSchema
]).and(handicappedUnion)





export const breakinSchema = breakinUnion

export type BreakinSchemaType = z.infer<typeof breakinSchema>