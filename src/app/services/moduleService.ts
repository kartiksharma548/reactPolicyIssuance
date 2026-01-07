import { COMMON_API_URL } from "../constants/apiURLS";
import axiosInstance from "../utils/axiosInstance";

export const getModules=async (data:any)=>{
    const result=await axiosInstance.post(COMMON_API_URL.getModules,{...data});
    
    return result.data["ModulesForReact"]
}