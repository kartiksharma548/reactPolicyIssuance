import { createSlice } from "@reduxjs/toolkit";
const initialState: any = {
    ProposalId: 0,
    ProposalNo: "",
    Name: "",
    RegisatrationNo: "",
    VehicleModel: "",
    QuoteNo: "",
    INS_QUOTE_NO: "",
    EmailId: "",
    Mobile: "",
    FKDEALER_ID: "",
    FKUSER_ID: "",
}
const customerQuoteSlice = createSlice({
    name:"customerQuotation",
    initialState,
    reducers:{
        update:(state,action)=>{
            state = action.payload
            return state;
        }
    }
});
export const { update } = customerQuoteSlice.actions;
export default customerQuoteSlice.reducer;
