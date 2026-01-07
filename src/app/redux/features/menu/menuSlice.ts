import { createSlice } from "@reduxjs/toolkit";
const initialState: boolean = false;
const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {
        update: (state, action) => {
            state = action.payload
            return state;
        }
    }
});
export const { update } = menuSlice.actions;
export default menuSlice.reducer;