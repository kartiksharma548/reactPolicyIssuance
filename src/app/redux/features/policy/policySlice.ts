import { createSlice } from "@reduxjs/toolkit";
const initialState: any = {
    ProposalId: 0,
    SelectedIC:0,
    PolicyType :""
}
const policySlice = createSlice({
    name:"policy",
    initialState,
    reducers:{
        update:(state,action)=>{
            state = action.payload
            return state;
        }
    }
});
export const { update } = policySlice.actions;
export default policySlice.reducer;
