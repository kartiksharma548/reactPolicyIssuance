import { createSlice } from "@reduxjs/toolkit";
const initialState: string = "P";
const previewTypeSlice = createSlice({
    name: "previewType",
    initialState,
    reducers: {
        update: (state, action) => {
            state = action.payload
            return state;
        }
    }
});
export const { update } = previewTypeSlice.actions;
export default previewTypeSlice.reducer;