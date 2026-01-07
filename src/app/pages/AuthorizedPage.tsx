import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { login } from '../redux/features/auth/authApi'
import useLocalStorage from '../hooks/useLocalStorage'
import { AuthModel } from '../redux/features/auth/authInterface'
import toast from 'react-hot-toast'
import localService from '../utils/localStorage'
import { LoginInputModel } from '../models/loginInputModel'
import { update } from '../redux/features/auth/authSlice'

function AuthorizedRoute() {
    const [searchParams] = useSearchParams()
    const token: string = searchParams.get('AuthData') || ''
    const dispatch = useAppDispatch()
    // const [value, setValue] = useLocalStorage('token', token)

    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )

    const model: LoginInputModel = {
        UserName: '',
        UserPassword: '',
        MachineIP: '',
        CaptchaId: '',

        ISAuthenticatedByOIDC: 0,
        AuthenticationToken: ''
    }
    const navigate = useNavigate()

    useEffect(() => {
        //localStorage.clear()
        redirectionLogic()
    }, [token, loginSelector])

    function JsonString(str) {
        try {
            JSON.parse(str)
        } catch (e) {
            return str
        }
        return JSON.parse(str)
    }

    function redirectionLogic() {
        let localToken =
            localService.get('token') != null
                ? JsonString(localService.get('token'))
                : null
        if (
            loginSelector != undefined &&
            loginSelector.ErrorCode != undefined &&
            loginSelector.ErrorCode == 1 &&
            localToken == token
        ) {
            localStorage.clear()
            localService.set('loginData', loginSelector)
            localService.set('token', token)
            navigate('/dashboard')
        } else {
            if (token && token != '' && localToken != token) {
                model.AuthenticationToken = token
                localService.set('token', token)

                dispatch(update({ ...loginSelector, ['ErrorCode']: 0 }))

                dispatch(
                    login({
                        model
                    })
                )
            }
        }
    }

    return <></>
}

export default AuthorizedRoute
