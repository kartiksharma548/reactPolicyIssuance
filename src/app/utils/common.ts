import dayjs from 'dayjs'
const alphanumericPattern = /^[a-zA-Z0-9]*$/
class Common {
    isNotNullOrEmpty(params: any) {
        if (params != null && params != '' && params != undefined) return true
        else return false
    }

    get_CheckBlankDate(params: any) {
        if (params != null && params != '' && params != undefined) return params
        else return dayjs(new Date()).format('YYYY-MM-DD')
    }

    get_CheckEmptyString(params: any) {
        if (params != null && params != '' && params != undefined) return params
        else return ''
    }

    isInputText(params: any) {
        if (
            isNaN(parseInt(params.slice(-1), 10)) &&
            this.isNotNullOrEmpty(params)
        ) {
            return true
        }
        return false
    }

    getJwtPayload(jwt) {
        // A JWT has 3 parts separated by '.'
        // The middle part is a base64 encoded JSON
        // decode the base64
        return atob(jwt.split('.')[1])
    }

    checkJwtExpiration(jwt) {
        if (jwt == null) return 1
        const payload: any = this.getJwtPayload(jwt)
        let payLoadJson: any

        if (this.isNotNullOrEmpty(payload)) {
            payLoadJson = JSON.parse(payload)
        }

        const expiration = new Date(payLoadJson.exp * 1000)

        const now = new Date()
        const fiveMinutes = 1000 * 60 * 5

        if (expiration.getTime() - now.getTime() < 0) {
            return 2
        } else if (expiration.getTime() - now.getTime() < fiveMinutes) {
            return 0
        }
        return 1
    }

    getFormattedDate(dateObject: Date) {
        let date = dateObject.getDate()
        let month =
            dateObject.getMonth() + 1 < 10
                ? '0' + (dateObject.getMonth() + 1)
                : dateObject.getMonth() + 1
        let year = dateObject.getFullYear()

        return date + '/' + month + '/' + year
    }

    getJsFormattedDate(dateObject: Date) {
        let date = dateObject.getDate()
        let month =
            dateObject.getMonth() + 1 < 10
                ? '0' + (dateObject.getMonth() + 1)
                : dateObject.getMonth() + 1
        let year = dateObject.getFullYear()

        return year + '-' + month + '-' + date
    }

    onlyAplaNumeric(params: any) {
        if (alphanumericPattern.test(params)) {
            return true
        } else {
            return false
        }
    }

    maskString(value: string) {
        return value.substring(0, 1) + 'XXXXXXX' + value.substr(-2)
    }
    maskEmail(value: string) {
        return value.substring(0, 1) + 'XXXXXXXXXXXXX' + value.substr(-5)
    }

    replaceAll(text:string,characterToReplace:string,replaceBy:String){

    }

   
}

export default new Common()
