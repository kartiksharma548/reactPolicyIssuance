let BaseURL: string = ''
let BasePath: string = ''
let BaseAppURL: string = ''
let BaseWorkAreaPath: string = ''
let BaseAppKYCURL: string = ''
let BaseAppPGURL: string = ''
let BaseReactAppUrl: string = ''

if (import.meta.env.VITE_REACT_APP_ID == 'LOCAL') {
    BaseURL = 'http://localhost:62419'
    BaseWorkAreaPath = 'D:\\'
    //BaseURL="https://visof.binarysemantics.com/TMIBASL2.0API/";
    BaseAppURL = 'http://localhost:64871/'
    //BaseAppURL="https://visof.binarysemantics.com/TMIBASL2.0APP/";
    BaseAppKYCURL = 'https://localhost:44368/'
    //BaseAppKYCURL = `https://${location.hostname}/TMIBASL2.0KYCICService`
    //BaseAppKYCURL="https://oemuat1.tmibasl.in/TMIBASL2.0KYCICService";
    BaseAppPGURL = 'http://localhost:63349/'
    BaseReactAppUrl = 'http://localhost:5174'
} else if (import.meta.env.VITE_REACT_APP_ID == 'UAT') {
    BasePath = import.meta.env.VITE_REACT_APP_BASE_PATH
    BaseWorkAreaPath = 'D:\\'
    BaseURL = `https://${location.hostname}/TMIBASL2.0API/`
    BaseAppURL = `https://${location.hostname}`
    BaseAppKYCURL = `https://${location.hostname}/TMIBASL2.0KYCICService`
    BaseAppPGURL = `https://${location.hostname}/TMIBASL2.0PGAPI`
    BaseReactAppUrl = `https://${location.hostname}/TMIBASLAPP`
}
else if (import.meta.env.VITE_REACT_APP_ID == 'PRE_PROD') {
    BasePath = import.meta.env.VITE_REACT_APP_BASE_PATH
    BaseWorkAreaPath = 'D:\\'
    BaseURL = `https://${location.hostname}/TMIBASL2.0API_PreProd/`
    BaseAppURL = `https://${location.hostname}/TMIBASL2.0_PreProd/`
    BaseAppKYCURL = `https://${location.hostname}/TMIBASL2.0KYCICService`
    BaseAppPGURL = `https://${location.hostname}/TMIBASL2.0PGAPI`
    BaseReactAppUrl = `https://${location.hostname}/TMIBASLAPP`
}
else if (import.meta.env.VITE_REACT_APP_ID == 'PROD') {
    BasePath = import.meta.env.VITE_REACT_APP_BASE_PATH
    BaseWorkAreaPath = 'D:\\'
    BaseURL = `https://${location.hostname}/TMIBASL2.0API/`
    BaseAppURL = `https://${location.hostname}`
    BaseAppKYCURL = `https://${location.hostname}/TMIBASL2.0KYCICService`
    BaseAppPGURL = `https://${location.hostname}/TMIBASL2.0PGAPI`
    BaseReactAppUrl = `https://${location.hostname}/TMIBASLAPP`
}
else {
    BasePath = import.meta.env.VITE_REACT_APP_BASE_PATH
    BaseWorkAreaPath = 'D:\\'
    BaseURL = `https://${location.hostname}/TMIBASL2.0API/`
    BaseAppURL = `https://${location.hostname}/TMIBASL2.0SIT/`
    BaseAppKYCURL = `https://${location.hostname}/TMIBASL2.0KYCICService`
    BaseAppPGURL = `https://${location.hostname}/TMIBASL_REACT_PGAPI`
    BaseReactAppUrl = `https://${location.hostname}`
}

export { BaseURL }

export { BasePath }

export { BaseWorkAreaPath }
export { BaseAppURL }

export { BaseAppKYCURL }

export { BaseAppPGURL }

export { BaseReactAppUrl }
