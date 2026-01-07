import { BaseAppURL } from '../constants/baseURL'
import localService from '../utils/localStorage'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { update } from '../redux/features/auth/authSlice'

function LogOut() {
    const loginData = {
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
        ErrorCode: 0
    }

    const dispatch = useAppDispatch()
    dispatch(update(loginData))
    localService.clear()
    window.location.href = BaseAppURL

    return <></>
}

export default LogOut
