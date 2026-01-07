import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { login } from "../redux/features/auth/authApi";

import { AuthModel } from "../redux/features/auth/authInterface";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import localService from '../utils/localStorage'


function Login() {

  const loginSelector = useAppSelector<AuthModel>((state: any) => state.auth.loginData);
  const navigate = useNavigate();

  const [value, setValue] = useLocalStorage("loginData", JSON.stringify(loginSelector))

  const loginInput = {
    userName: "",
    userPassword: "",
    actualPassword: "",
    Captcha: ""
  }


  const [credentials, setcredentials] = useState(loginInput);


  const dispatch = useAppDispatch();




  const loginUser = (e: any) => {
    e.preventDefault()
    dispatch(
      login({
        body: { ...credentials }
      })
    )
  };

  useEffect(() => {
    if (loginSelector != undefined && loginSelector != null) {
      if (loginSelector.ErrorCode == 3) {
        toast.error("Invalid Id and Password");
      }
      else if (loginSelector.ErrorCode == 1) {
        localService.set("loginData", loginSelector);
        toast.success("Logged In");
        setValue(JSON.stringify("loginSelector"));
        navigate("/dashboard");
      }
    }
    else {
      toast.error("There is some server error.");
    }

  }, [loginSelector]);



  return (
    <>

      <section className="vh-100">
        <div className="container py-5 h-100">
          <div className="row d-flex align-items-center justify-content-center h-100">
            <div className="col-md-8 col-lg-7 col-xl-6">
              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                className="img-fluid" alt="Phone image" />
            </div>
            <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
              <form>
                <div className="form-outline mb-4">
                  <input type="email" id="form1Example13" onChange={(e) => { setcredentials({ ...credentials, userName: e.target.value }) }} className="form-control form-control-lg" />
                  <label className="form-label" htmlFor="form1Example13">Email address</label>
                </div>


                <div className="form-outline mb-4">
                  <input type="password" id="form1Example23" onChange={(e) => { setcredentials({ ...credentials, userPassword: e.target.value }) }} className="form-control form-control-lg" />
                  <label className="form-label" htmlFor="form1Example23">Password</label>
                </div>




                <button type="submit" className="btn btn-primary btn-lg btn-block" onClick={loginUser}>Log in</button>

                <Toaster />



              </form>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

export default Login;