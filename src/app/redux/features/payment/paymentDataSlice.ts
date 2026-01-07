import { createSlice } from "@reduxjs/toolkit";
const initialState:any = {
    ChassisNo:"",
    VisofProposalNo:"",
    InsProposalNo:"",
    PaymentMode:"",
    Premium:0,
    DealerCode:"",
    DealerId:0,
    ProductId:0,
    ProposalId:"",
    UserId:0,
    IsBulk:false
};
const paymentData = createSlice({
    name: "payment",
    initialState,
    reducers: {
        update: (state, action) => {
            state = {...state,...action.payload}
            return state;
        }
    }
});
export const { update } = paymentData.actions;
export default paymentData.reducer;