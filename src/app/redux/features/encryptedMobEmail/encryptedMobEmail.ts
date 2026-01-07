import { createSlice } from "@reduxjs/toolkit";
const initialState: boolean = false;
const encryptedMobEmailSlice = createSlice({
    name: "encryptedMobEmail",
    initialState,
    reducers: {
        updateEncryptedMobEmail: (state, action) => {
            state = action.payload
            return state;
        }
    }
});
export const { updateEncryptedMobEmail } = encryptedMobEmailSlice.actions;
export default encryptedMobEmailSlice.reducer;