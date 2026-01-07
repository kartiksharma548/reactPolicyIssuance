import { createSlice } from '@reduxjs/toolkit'
import { AuthModel } from './authInterface'
import { login } from './authApi'

const initialState: any = {
    loginData: {
        IsCurrentUser: false,
        PwsExpiredDaysLeft: 0,
        SessionId: '',
        IsFirstLoginToday: 0,
        //  int DealerId
        UserId: 0,
        IsForcedReset: false,
        Name: '',
        RoleId: 0,

        PwsExpiryDate: '',
        LastLoginTime: '',

        IsActive: false,
        HitCount: 0,
        RoleActive: false,
        DealerId: 0,
        DealerCode: '',
        DealerName: '',
        Product_Id: 0,
        CompanyId: 0,
        UserType: '',
        DealerUserType: '',
        Mob_No: '',
        HideDashboard: 0,
        LoginName: '',
        DPId: 0,
        UserSalesType: '',
        FkOEMID: 0,
        ErrorCode: 0,
        IsSendQuoteEnable: 0,
        POSP_ID: 0,
        IS_MISP_DECL_SUBMIT: 0,
        ACC_NO: '',
        BANK: '',
        PAN: '',
        LOCATION: ''
    }
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        update: (state, action) => {
            state.loginData = { ...action.payload }
            return state
        }
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state, action) => {
            //state.login.status = "pending";
        })
        builder.addCase(login.fulfilled, (state, action) => {
            state.loginData = action.payload
        })
    }
})

export const { update } = authSlice.actions
export default authSlice.reducer
