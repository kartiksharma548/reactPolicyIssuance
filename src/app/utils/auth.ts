import { useAppDispatch,useAppSelector } from "../hooks/reduxHooks";
import { AuthModel } from "../redux/features/auth/authInterface";


class Auth {

    loginSelector = useAppSelector<AuthModel>((state: any) => state.auth.loginData);
    isAuthenticated() {
        if (this.loginSelector.ErrorCode == 1 )
            return true
        return false
    }

    // logout(){
    //     localService.clear();
        
    // }

}

export default new Auth()