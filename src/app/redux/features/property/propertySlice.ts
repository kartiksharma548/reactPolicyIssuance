import { createSlice } from "@reduxjs/toolkit";
const initialState :any={
    PolicyType:"N",
    RENEWAL_TYPE:1,
}
const propertySlice = createSlice({
    name:"updateProperty",
    initialState,
    reducers:{
        updateProperty:(state,action)=>{
            let name = action.payload.name;
            let data = action.payload.data
            state={...state,[name]:data}
            return state;
        }
    }
});
export const { updateProperty } = propertySlice.actions;
export default propertySlice.reducer;