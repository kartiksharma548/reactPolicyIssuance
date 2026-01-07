import { Navigate } from 'react-router-dom';


// import { useEffect, useState } from 'react';
import localService from '../../utils/localStorage'
import LoggedInContainer from '../loggedInContainer/loggedInComponent';
//import { AuthModel } from '../../redux/features/auth/authInterface';


const PrivateRoute = ({ Component }: any) => {


    let loginDataString: string = localService.get("loginData") || "{}";
    const loginData = JSON.parse(loginDataString);
    let isLoggedIn: Boolean = false;

    if (loginData["ErrorCode"] != null && loginData["ErrorCode"] != undefined && loginData["ErrorCode"] == 1)
        isLoggedIn = true;
    else
        isLoggedIn = false;


















    //const isLogin = localStorage.getItem("IsLoggedIn");
    //console.log(isLogin);
    return isLoggedIn ? <LoggedInContainer Component={Component} /> : <Navigate to="/logout" />;

};

export default PrivateRoute;