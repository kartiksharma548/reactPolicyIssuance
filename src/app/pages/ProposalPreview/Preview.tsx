import FilesDragAndDrop from '../../components/common/FileDragDrop'

import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { IProposal } from '../../models/IProposal'
import { useEffect, useReducer, useRef, useState } from 'react'
import '../../../assets/styles/ProposalPreview.css'
import common from '../../utils/common'
import VehicleDetailsPreview from '../../components/preview/VehicleDetailsPreview'
import BrokerDetailsPreview from '../../components/preview/BrokerDetailsPreview'
import { width } from '@mui/system'
import {
    getKYC_CustomerData,
    queryCustomerKYC,
    updateProposalData,
    verifyCustomerKYC
} from '../../services/KYC/kycService'
import BackDropLoader from '../../components/common/backDropLoading'
import ConfirmDialog from '../../components/common/confirmDialog'

import PreviewFooter from '../../components/preview/PreviewFooter'
import { getProposalPreviewDetails } from '../../services/policyServices/proposalPreviewService'
import { BaseAppURL, BasePath } from '../../constants/baseURL'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import ChequeApprovalSection from '../../components/preview/chequeApproval'
import { BaseReactAppUrl } from '../../constants/baseURL'
import { checkDealerMismatch } from '../../services/common/commonService'
import { useAppSelector } from '../../hooks/reduxHooks'
import { AuthModel } from '../../redux/features/auth/authInterface'
import { decrypt } from '../../utils/encryption'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button } from '@mui/material'
import toast, { Toaster } from 'react-hot-toast'
function Preview() {
    const [searchParams] = useSearchParams()
    let Proposalid: string = searchParams.get('ProposalId').toString() || ''
    Proposalid = decrypt(Proposalid)
    const { Type: RequestFor } = useParams()
    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )

    const [formValues, setFormValues] = useState({
        VISoF_KYC_Req_No: '',
        IC_KYC_No: '',
        VISoF_Return_URL: '',
        Other_Add_FLD1: '',
        Other_Add_FLD2: '',
        Other_Add_FLD3: '',
        Other_Add_FLD4: '',
        Other_Add_FLD5: '',
        Other_Add_FLD6: ''
    })

    const Type: string = searchParams.get('t') || ''
    function reducer(state: any, action: any) {
        switch (action.type) {
            case 'setshowOTP':
                return {
                    ...state,
                    showOTP: action.value,
                    showOTPButton: action.value
                }
            case 'setVerifyKyc':
                return { ...state, showVerifyKyc: action.value }
            case 'setMandateType':
                return { ...state, mandateType: action.value }
            case 'setShowIcKycPortalButton':
                return { ...state, showIcKycPortalButton: action.value }
            case 'setShowOTPButton':
                return { ...state, showOTPButton: action.value }
            case 'setShowVerifyButton':
                return {
                    ...state,
                    showVerifyButton: action.value
                }
            case 'setShowMandateRadio':
                return {
                    ...state,
                    showMandateRadio: action.value
                }
            case 'setOTPVerified':
                return {
                    ...state,
                    isOTPVerified: action.value,
                    showVerifyButton: false
                }
            case 'setOTP':
                return { ...state, otp: action.value }

            case 'setShowResendOTP':
                return { ...state, showResendOTP: action.value }

            case 'setShowTimer':
                return { ...state, showTimer: action.value }

            case 'setMandateFile':
                return {
                    ...state,
                    mandatefiles: action.value
                }
            case 'setLoading':
                return {
                    ...state,
                    showLoading: action.value
                }
            case 'setDialog':
                return {
                    ...state,
                    dialogProps: { ...action.value }
                }
            case 'setTermsCheck':
                return {
                    ...state,
                    termsCheck: action.value
                }
            // case 'setTermsCheck2':
            //     return {
            //         ...state,
            //         termsCheck2: action.value
            //     }
            case 'setTermsCheck3':
                return {
                    ...state,
                    termsCheck3: action.value
                }

            default:
                return state
        }
    }
    // dispatch({type:'setShowOtp',value:true})
    const [state, dispatch] = useReducer(reducer, {
        showOTP: false,
        showVerifyKyc: true,
        showOTPButton: false,
        mandateType: '0',
        showIcKycPortalButton: false,
        isOTPVerified: false,
        showVerifyButton: false,
        showMandateRadio: true,
        showResendOTP: false,
        showTimer: false,
        otp: '',
        mandatefiles: {},
        dialogProps: {
            open: false,
            content: '',
            title: '',
            data: {},
            onClose: onConfirmDialogClose,
            dialogType: 'confirm'
        },
        showLoading: false,
        termsCheck: false,
        // termsCheck2: false,
        termsCheck3: false
    })

    const [previewData, setPreviewData] = useState<any>(null)

    const icKycURL = useRef<string>('')
    const checkDealerMismatchFn = async () => {
        if (Proposalid != '') {
            if (Type != 'C') {
                let result = await checkDealerMismatch({
                    ProposalId: Proposalid,
                    DealerId: loginSelector.DealerId
                })
                if (result.ErrorCode == 0) {
                    alert(result.ErrorMessage)
                    navigate('/logout')
                } else {
                    loadPreviewDetails()
                }
            } else {
                loadPreviewDetails()
            }
        }
    }
    useEffect(() => {
        if (RequestFor != 'Customer') checkDealerMismatchFn()
    }, [])
    const copyTextToClipBoard =(text:string)=>{
        navigator.clipboard.writeText(text);
        toast.success('Text Copied To Clipboard!');
    }
    useEffect(() => {
        if (previewData && previewData['Table'] && previewData['Table11']) {
            proposalDtls.current = previewData['Table'][0]
            kycproposalDtls.current = previewData['Table11'][0]
            if (Type == 'K') {
                if (
                    proposalDtls.current['IS_KYC_APPLICABLE'].toString() == '1'
                ) {
                    let isKYCNameMatched: boolean = false
                    if (proposalDtls.current['PROPOSER_TYPE'] == 'I') {
                        let kreqName: string = (
                            proposalDtls.current.FIRST_NAME +
                            proposalDtls.current.MIDDLE_NAME +
                            proposalDtls.current.LAST_NAME
                        )
                            .replace(' ', '')
                            .toUpperCase()
                        let kresName: string = (
                            kycproposalDtls.current.RESP_FIRSTNAME +
                            kycproposalDtls.current.RESP_MIDDLENAME +
                            kycproposalDtls.current.RESP_LASTNAME
                        )
                            .replace(' ', '')
                            .toUpperCase()
                        if (kreqName == kresName) isKYCNameMatched = true
                    } else if (proposalDtls.current['PROPOSER_TYPE'] == 'C') {
                        let kreqName: string =
                            proposalDtls.current.COMPANY_NAME.replace(' ', '')
                        let kresName: string =
                            kycproposalDtls.current.RESP_COMPANYNAME.replace(
                                ' ',
                                ''
                            )
                        if (kreqName == kresName) isKYCNameMatched = true
                    }

                    if (!isKYCNameMatched) {
                        let nameFromIc: string = ''

                        let dialogContent: string =
                            'KYC has been verified successfully.As per details recevied from IC, the '
                        dialogContent +=
                            proposalDtls.current['PROPOSER_TYPE'] == 'C'
                                ? 'Company Name is '
                                : 'Insured Name is '

                        if (
                            kycproposalDtls.current.RESP_MIDDLENAME == null &&
                            kycproposalDtls.current.RESP_LASTNAME != null
                        ) {
                            nameFromIc =
                                kycproposalDtls.current.RESP_FIRSTNAME +
                                ' ' +
                                kycproposalDtls.current.RESP_LASTNAME
                        } else if (
                            kycproposalDtls.current.RESP_LASTNAME === null &&
                            kycproposalDtls.current.RESP_MIDDLENAME === null
                        ) {
                            nameFromIc = kycproposalDtls.current.RESP_FIRSTNAME
                        } else {
                            nameFromIc =
                                kycproposalDtls.current.RESP_FIRSTNAME +
                                ' ' +
                                kycproposalDtls.current.RESP_MIDDLENAME +
                                ' ' +
                                kycproposalDtls.current.RESP_LASTNAME
                        }

                        dialogContent = dialogContent + nameFromIc
                        ;("<br> <span style='color:red; font-weight: bold;'>Would you like to continue ? ")

                        dispatch({
                            type: 'setDialog',
                            value: {
                                ...state.dialogProps,
                                ['open']: true,
                                ['title']: 'Confirm',
                                ['content']: dialogContent,
                                dialogType: 'confirm',
                                data: { ...kycproposalDtls.current },
                                onClose: onConfirmDialogClose
                            }
                        })
                    }
                }
            }
        }
    }, [previewData])
    const proposalDtls = useRef<any>()
    const kycproposalDtls = useRef<any>()
    const loadPreviewDetails = async () => {
        let proposal: IProposal = {
            ProposalId: Proposalid
        }
        let previewResponseData = await getProposalPreviewDetails(proposal)
        setPreviewData(previewResponseData)
        proposalDtls.current = previewResponseData['Table'][0]
        kycproposalDtls.current = previewResponseData['Table11'][0]
        //proposalDtls.current['KYC_STATUS'] = '1'
        if (proposalDtls.current['IS_KYC_APPLICABLE'].toString() == '1') {
            if (proposalDtls.current['KYC_STATUS'].toString() == '1') {
                if (
                    (proposalDtls.current['CPA_TENURE'] == 0 &&
                        proposalDtls.current['TP_TENURE'] != 0 &&
                        proposalDtls.current['PROPOSER_TYPE'] == 'I') ||
                    proposalDtls.current['MandateStatus'] == 0
                ) {
                    dispatch({
                        type: 'setShowMandateRadio',
                        value: false
                    })
                    dispatch({
                        type: 'setMandateType',
                        value: '1'
                    })

                    dispatch({
                        type: 'setshowOTP',
                        value: true
                    })
                } else {
                    dispatch({
                        type: 'setshowOTP',
                        value: true
                    })
                    dispatch({ type: 'setShowOTPButton', value: false })
                }
            } else {
                dispatch({
                    type: 'setshowOTP',
                    value: false
                })
                dispatch({ type: 'setShowOTPButton', value: false })
                dispatch({
                    type: 'setShowVerifyButton',
                    value: false
                })
            }
        } else {
            dispatch({
                type: 'setshowOTP',
                value: true
            })
            dispatch({ type: 'setShowOTPButton', value: false })
            dispatch({
                type: 'setShowVerifyButton',
                value: false
            })
        }
    }

    // const [openConfirmationDialog, setOpenConfirmationDialog] =
    //     useState<DialogProps>({
    //         open: false,
    //         content: '',
    //         title: '',
    //         data: {},
    //         onClose: onConfirmDialogClose,
    //         dialogType: 'confirm'
    //     })
    const navigate = useNavigate()
    function onConfirmDialogClose(
        action: boolean,
        dataKYC: IC_KYC_Response | null | string
    ) {
        // let dialogObj = { ...openConfirmationDialog, ['open']: false }
        if (dataKYC != null) {
            if (dataKYC == 'Payment') {
                navigate('/ProposalPayment')
            } else if (dataKYC == 'Policy') {
                navigate('/createPolicy')
            } else if (dataKYC == 'Breakin') {
                window.open(
                    BaseAppURL + '/policy/policy/BreakinApproval',
                    '_self'
                )
            } else {
                if (action) {
                    let proposalUpdateObj = {
                        FirstName:
                            Type == 'K'
                                ? dataKYC['RESP_FIRSTNAME']
                                : dataKYC['FirstName'],
                        MiddleName:
                            Type == 'K'
                                ? dataKYC['RESP_MIDDLENAME']
                                : dataKYC['MiddleName'],
                        LastName:
                            Type == 'K'
                                ? dataKYC['RESP_LASTNAME']
                                : dataKYC['LastName'],
                        ProposalId: Proposalid,
                        ProposerType: proposalDtls.current['PROPOSER_TYPE'],
                        CompanyName:
                            Type == 'K'
                                ? dataKYC['RESP_COMPANYNAME']
                                : dataKYC['CompanyName']
                    }
                    updateProposalData(proposalUpdateObj)
                        .then((res) => {
                            if (res != null) {
                                let tempArr = { ...previewData }
                                if (
                                    proposalDtls.current['PROPOSER_TYPE'] == 'I'
                                ) {
                                    tempArr['Table'][0]['FIRST_NAME'] =
                                        Type == 'K'
                                            ? dataKYC['RESP_FIRSTNAME']
                                            : dataKYC['FirstName']
                                    tempArr['Table'][0]['MIDDLE_NAME'] =
                                        Type == 'K'
                                            ? dataKYC['RESP_MIDDLENAME']
                                            : dataKYC['MiddleName']
                                    tempArr['Table'][0]['LAST_NAME'] =
                                        Type == 'K'
                                            ? dataKYC['RESP_LASTNAME']
                                            : dataKYC['LastName']

                                    let fullName =
                                        Type == 'K'
                                            ? dataKYC['RESP_FIRSTNAME']
                                            : dataKYC['FirstName']
                                    if (
                                        Type == 'K'
                                            ? dataKYC['RESP_MIDDLENAME']
                                            : dataKYC['MiddleName'] != null
                                    )
                                        fullName +=
                                            ' ' +
                                            (Type == 'K'
                                                ? dataKYC['RESP_MIDDLENAME']
                                                : dataKYC['MiddleName'])

                                    fullName +=
                                        ' ' +
                                        (Type == 'K'
                                            ? dataKYC['RESP_LASTNAME']
                                            : dataKYC['LastName'])

                                    tempArr['Table'][0]['INSURED_NAME'] =
                                        fullName
                                } else {
                                    tempArr['Table'][0]['COMPANY_NAME'] =
                                        Type == 'K'
                                            ? dataKYC['RESP_COMPANYNAME']
                                            : dataKYC['CompanyName']
                                }

                                setPreviewData(tempArr)
                                if (
                                    (proposalDtls.current['CPA_TENURE'] == 0 &&
                                        proposalDtls.current['TP_TENURE'] !=
                                            0 &&
                                        proposalDtls.current['PROPOSER_TYPE'] ==
                                            'I') ||
                                    proposalDtls.current['MandateStatus'] == 0
                                ) {
                                    dispatch({
                                        type: 'setShowMandateRadio',
                                        value: false
                                    })
                                }
                                dispatch({
                                    type: 'setshowOTP',
                                    value: true
                                })
                                dispatch({
                                    type: 'setMandateType',
                                    value: '1'
                                })
                                dispatch({
                                    type: 'setVerifyKyc',
                                    value: false
                                })

                                dispatch({
                                    type: 'setDialog',
                                    value: {
                                        ...state.dialogProps,
                                        ['open']: false
                                    }
                                })
                            }
                        })
                        .catch((ex) => console.log(ex))
                } else {
                    dispatch({
                        type: 'setDialog',
                        value: { ...state.dialogProps, ['open']: false }
                    })
                }
            }
        } else {
            dispatch({
                type: 'setDialog',
                value: { ...state.dialogProps, ['open']: false }
            })
        }
    }

    const saveProposal = (ProposalId: number) => {}
    const verifyKYC = async (ProposalId: number) => {
        if (!state.termsCheck  || !state.termsCheck3) {
            dispatch({
                type: 'setDialog',
                value: {
                    ...state.dialogProps,
                    ['open']: true,
                    ['title']: 'Alert',
                    ['content']:
                        'Please check the term & conditions before proceeding.',
                    data: null,
                    dialogType: 'alert'
                }
            })

            return
        }
        let kycCustomerDataInput: IProposal = {
            ProposalId: ProposalId
        }
        dispatch({
            type: 'setLoading',
            value: true
        })
        let req = await getKYC_CustomerData(kycCustomerDataInput)
        if (req != null) {
            verifyCustomerKYC(req)
                .then((res) => {
                    console.log(res)
                    if (res.KYC_Status == 1 || res.KYC_Status == 3) {
                        let isNameMatched: boolean = false

                        if (proposalDtls.current['PROPOSER_TYPE'] == 'I') {
                            let reqName: string = (
                                req.FirstName +
                                req.MiddleName +
                                req.LastName
                            )
                                .replace(' ', '')
                                .toUpperCase()
                            let resName: string = (
                                res.FirstName +
                                res.MiddleName +
                                res.LastName
                            )
                                .replace(' ', '')
                                .toUpperCase()

                            if (reqName == resName) isNameMatched = true
                        } else if (
                            proposalDtls.current['PROPOSER_TYPE'] == 'C'
                        ) {
                            let reqName: string = req.CompanyName.replace(
                                ' ',
                                ''
                            )
                            let resName: string = res.CompanyName.replace(
                                ' ',
                                ''
                            )
                            if (reqName == resName) isNameMatched = true
                        }

                        if (!isNameMatched) {
                            let nameFromIc: string = ''
                            let dateofBirth_Incor: string = ''
                            let dialogContent1: string = ''

                            let dialogContent: string =
                                'KYC has been verified successfully.As per details recevied from IC, the '
                            dialogContent +=
                                proposalDtls.current['PROPOSER_TYPE'] == 'C'
                                    ? 'Company Name is '
                                    : 'Insured Name is '

                            dialogContent1 +=
                                proposalDtls.current['PROPOSER_TYPE'] == 'C'
                                    ? ' and Date of Incorporation is '
                                    : ' and Date of Birth is '

                            if (
                                res.MiddleName == null &&
                                res.LastName != null
                            ) {
                                nameFromIc = res.FirstName + ' ' + res.LastName
                            } else if (
                                res.LastName === null &&
                                res.MiddleName === null
                            ) {
                                nameFromIc = res.FirstName
                            } else {
                                nameFromIc =
                                    res.FirstName +
                                    ' ' +
                                    res.MiddleName +
                                    ' ' +
                                    res.LastName
                            }
                            if (proposalDtls.current['PROPOSER_TYPE'] == 'I') {
                                if (res.DOB != undefined && res.DOB) {
                                    dateofBirth_Incor = res.DOB
                                } else if (
                                    proposalDtls.current['DOB'] != undefined &&
                                    proposalDtls.current['DOB']
                                ) {
                                    dateofBirth_Incor =
                                        proposalDtls.current['DOB']
                                } else {
                                    dateofBirth_Incor = '--/--/----'
                                }
                            } else {
                                if (res.DOI != undefined && res.DOI) {
                                    dateofBirth_Incor = res.DOI
                                } else if (
                                    proposalDtls.current['DOI'] != undefined &&
                                    proposalDtls.current['DOI']
                                ) {
                                    dateofBirth_Incor =
                                        proposalDtls.current['DOI']
                                } else {
                                    dateofBirth_Incor = '--/--/----'
                                }
                            }

                            dialogContent =
                                dialogContent +
                                nameFromIc +
                                dialogContent1 +
                                dateofBirth_Incor
                            ;("<br> <span style='color:red; font-weight: bold;'>Would you like to continue ? ")

                            dispatch({
                                type: 'setDialog',
                                value: {
                                    ...state.dialogProps,
                                    ['open']: true,
                                    ['title']: 'Confirm',
                                    ['content']: dialogContent,
                                    dialogType: 'confirm',
                                    data: { ...res },
                                    onClose: onConfirmDialogClose
                                }
                            })
                        } else {
                            dispatch({
                                type: 'setDialog',
                                value: {
                                    ...state.dialogProps,
                                    ['open']: true,
                                    ['title']: 'Success',
                                    ['content']: 'KYC successfully verified',
                                    data: null,
                                    dialogType: 'alert'
                                }
                            })

                            if (
                                (proposalDtls.current['CPA_TENURE'] == 0 &&
                                    proposalDtls.current['TP_TENURE'] != 0 &&
                                    proposalDtls.current['PROPOSER_TYPE'] ==
                                        'I') ||
                                proposalDtls.current['MandateStatus'] == 0
                            ) {
                                dispatch({
                                    type: 'setShowMandateRadio',
                                    value: false
                                })
                            }
                            dispatch({
                                type: 'setshowOTP',
                                value: true
                            })
                            dispatch({
                                type: 'setMandateType',
                                value: '1'
                            })
                            dispatch({
                                type: 'setVerifyKyc',
                                value: false
                            })
                        }
                    } else if (res.KYC_Status == 0) {
                         const hasICPortalUrl = !!res.IC_KYC_REG_URL;
                        dispatch({
                            type: 'setDialog',
                            value: {
                                ...state.dialogProps,
                                ['open']: true,
                                ['title']: 'Message',
                                content: hasICPortalUrl
                                    ? "As per Insurer, KYC fields provided could not be verified. Please click on <br> <span style='font-weight: bold;'>IC KYC Portal button</span> for KYC Verification at Insurers KYC Portal."
                                    : "As per Insurer, KYC fields provided could not be verified. IC KYC Portal is currently unavailable.",
                                data: null,
                                dialogType: 'alert'
                            }
                        })
                        icKycURL.current = res.IC_KYC_REG_URL

                        setFormValues({
                            VISoF_KYC_Req_No: res.VISoF_KYC_Req_No,
                            IC_KYC_No: res.IC_KYC_No,
                            VISoF_Return_URL: req.Other_Add_FLD1,
                            Other_Add_FLD1: '',
                            Other_Add_FLD2: '',
                            Other_Add_FLD3: '',
                            Other_Add_FLD4: '',
                            Other_Add_FLD5: '',
                            Other_Add_FLD6: ''
                        })

                        dispatch({
                            type: 'setShowIcKycPortalButton',
                            // value: true
                            value: hasICPortalUrl
                        })
                    } else {
                        dispatch({
                            type: 'setDialog',
                            value: {
                                ...state.dialogProps,
                                ['open']: true,
                                ['title']: 'Message',
                                ['content']: res,
                                data: null,
                                dialogType: 'alert'
                            }
                        })
                    }

                    dispatch({
                        type: 'setLoading',
                        value: false
                    })
                })
                .catch((ex) => {
                    console.log(ex)
                    dispatch({
                        type: 'setLoading',
                        value: false
                    })
                })
        }
    }

    const goToProposalDetails = () => {}
    const handleICKyc = () => {
        if(proposalDtls.current['INS_COMPNYCODE'] == 'SBI'|| proposalDtls.current['INS_COMPNYCODE'] == 'ILG'|| proposalDtls.current['INS_COMPNYCODE'] == 'EWGI' || proposalDtls.current['INS_COMPNYCODE'] == 'KMGICL' ||  proposalDtls.current['INS_COMPNYCODE'] == 'NIC')
         window.open(icKycURL.current, '_self')
        else{
            const form = document.createElement('form')
            form.method = 'POST'
            form.action = icKycURL.current
            form.target = '_self' // Open in new tab

            const fields = [
                { name: 'VISoF_KYC_Req_No', value: formValues.VISoF_KYC_Req_No },
                { name: 'IC_KYC_No', value: formValues.IC_KYC_No },
                { name: 'VISoF_Return_URL', value: formValues.VISoF_Return_URL },
                { name: 'Other_Add_FLD1', value: '' },
                { name: 'Other_Add_FLD2', value: '' },
                { name: 'Other_Add_FLD3', value: '' },
                { name: 'Other_Add_FLD4', value: '' },
                { name: 'Other_Add_FLD5', value: '' },
                { name: 'Other_Add_FLD6', value: '' }
            ]
            fields.forEach((field) => {
                const input = document.createElement('input')
                input.type = 'hidden'
                input.name = field.name
                input.value = field.value
                form.appendChild(input)
            })
            document.body.appendChild(form)
            form.submit()
            document.body.removeChild(form)
        }
        
    }

    const maskPan = (pan: string) => {
        if (!pan) return "";
        return pan.replace(/^(.{3})(.*)(.{1})$/, (_, p1, _p2, p3) => `${p1}*****${p3}`);
    }

    return (
        <>
            <BackDropLoader openDialog={state.showLoading} />
            {state.dialogProps.open && <ConfirmDialog {...state.dialogProps} />}
            {previewData && (
                <div className="main-container ProposalPre">
                    <div className="content-container">
                        <div className="printableArea">
                            <p className="rotingtxt">
                                This is a Proposal Form <br></br>&<br></br>
                                not a Policy Copy
                            </p>
                            <table
                                width="100%"
                                border={0}
                                cellSpacing={0}
                                cellPadding={0}
                                className="companytable"
                            >
                                <tr>
                                    <td
                                        width="20%"
                                        align="left"
                                        valign="middle"
                                    >
                                        <img
                                            src={
                                                BaseReactAppUrl +
                                                '/Images/Product/' +
                                                proposalDtls.current['IC_LOGO']
                                            }
                                            alt="IC Logo"
                                        />
                                    </td>
                                    <td
                                        width="70%"
                                        align="center"
                                        valign="middle"
                                        className="p-0"
                                    >
                                        <table
                                            width="100%"
                                            border={0}
                                            cellSpacing={0}
                                            cellPadding="0"
                                            style={{ textAlign: 'center' }}
                                        >
                                            <tr id="divLogo">
                                                <td id="divLogoTop">
                                                    <span className="companyname">
                                                        {' '}
                                                        {
                                                            proposalDtls
                                                                .current[
                                                                'IC_NAME'
                                                            ]
                                                        }{' '}
                                                    </span>
                                                    <br />
                                                    <strong>
                                                        Servicing Office:
                                                    </strong>{' '}
                                                    <span>
                                                        {
                                                            proposalDtls
                                                                .current[
                                                                'IC_ADDRESS1'
                                                            ]
                                                        }{' '}
                                                        {
                                                            proposalDtls
                                                                .current[
                                                                'IC_ADDRESS2'
                                                            ]
                                                        }{' '}
                                                        {
                                                            proposalDtls
                                                                .current[
                                                                'IC_ADDRESS3'
                                                            ]
                                                        }
                                                        ,{' '}
                                                        {
                                                            proposalDtls
                                                                .current[
                                                                'IC_City'
                                                            ]
                                                        }
                                                        ,{' '}
                                                        {
                                                            proposalDtls
                                                                .current[
                                                                'IC_State'
                                                            ]
                                                        }
                                                        -
                                                        {
                                                            proposalDtls
                                                                .current[
                                                                'PINCODE'
                                                            ]
                                                        }
                                                    </span>
                                                    <br />
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>
                                                    <strong>PAN:</strong>{' '}
                                                    <span>
                                                        {
                                                            proposalDtls
                                                                .current[
                                                                'PRO_PAN_NO'
                                                            ]
                                                        }
                                                    </span>
                                                    , <strong>GSTIN:</strong>{' '}
                                                    <span>
                                                        {
                                                            proposalDtls
                                                                .current[
                                                                'PROGSTIN_NO'
                                                            ]
                                                        }
                                                    </span>
                                                    , <strong>CIN:</strong>{' '}
                                                    <span>
                                                        {
                                                            proposalDtls
                                                                .current['CIN']
                                                        }
                                                    </span>
                                                    ,{' '}
                                                    <strong>
                                                        IRDAI Reg. No.:
                                                    </strong>{' '}
                                                    <span>
                                                        {
                                                            proposalDtls
                                                                .current[
                                                                'IRDA_REG_NO'
                                                            ]
                                                        }
                                                    </span>
                                                    <br />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span className="">
                                                        <strong>
                                                            Proposal Preview
                                                        </strong>
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            <table
                                border={0}
                                cellPadding="0"
                                cellSpacing="0"
                                width="100%"
                                className="VehicleDetail VehicleDetail1"
                            >
                                <tr>
                                    <td
                                        width="18%"
                                        align="left"
                                        valign="middle"
                                        className="address"
                                        style={{ backgroundColor: '#ddd' }}
                                    >
                                        <strong>Proposal No: </strong>
                                        
                                    </td>
                                    <td
                                        width="32%"
                                        align="left"
                                        valign="middle"
                                    >
                                        <span>
                                            {
                                                proposalDtls.current[
                                                    'PROPOSAL_NO'
                                                ]
                                            }
                                        </span>{' '}
                                       <Button style={{float:'right'}} onClick={()=>{copyTextToClipBoard(proposalDtls.current['PROPOSAL_NO'])}}> <ContentCopyIcon /></Button>
                                    </td>
                                    <td
                                        width="18%"
                                        align="left"
                                        valign="middle"
                                        style={{ backgroundColor: '#ddd' }}
                                    >
                                        {' '}
                                        <strong>Proposal Date: </strong>
                                    </td>
                                    <td
                                        width="32%"
                                        align="left"
                                        valign="middle"
                                    >
                                        {' '}
                                        <span>
                                            {
                                                proposalDtls.current[
                                                    'PROPOSAL_DATE'
                                                ]
                                            }
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        align="left"
                                        valign="middle"
                                        color="#ddd"
                                        className="address"
                                    >
                                        <strong>Proposer Name: </strong>
                                    </td>
                                    <td
                                        align="left"
                                        valign="middle"
                                        className="address"
                                    >
                                        <span>
                                            <b
                                                style={{
                                                    wordBreak: 'break-word'
                                                }}
                                            >
                                                {proposalDtls.current[
                                                    'PROPOSER_TYPE'
                                                ] == 'C'
                                                    ? proposalDtls.current[
                                                          'COMPANY_SALUTATION'
                                                      ]
                                                    : proposalDtls.current[
                                                          'SALUTATION'
                                                      ]}{' '}
                                                {
                                                    proposalDtls.current[
                                                        'INSURED_NAME'
                                                    ]
                                                }
                                            </b>
                                        </span>
                                    </td>
                                    <td
                                        align="left"
                                        valign="middle"
                                        color="#ddd"
                                        className="address"
                                    >
                                        <strong>Previous Policy No:</strong>
                                    </td>
                                    <td
                                        align="left"
                                        valign="middle"
                                        className="address"
                                    >
                                        <span>
                                            {
                                                proposalDtls.current[
                                                    'PREV_POLICY_NO'
                                                ]
                                            }
                                        </span>
                                    </td>
                                </tr>
                                {proposalDtls.current['VEHICAL_TYPE']
                                    .toString()
                                    .toUpperCase() == 'COMMERCIAL' && (
                                    <>
                                        <tr>
                                            <td
                                                align="left"
                                                valign="middle"
                                                color="#ddd"
                                                className="address"
                                            >
                                                <strong>Vehicle Type: </strong>
                                            </td>
                                            <td
                                                align="left"
                                                valign="middle"
                                                className="address"
                                            >
                                                <span>
                                                    <p
                                                        style={{
                                                            wordBreak:
                                                                'break-word'
                                                        }}
                                                    >
                                                        {
                                                            proposalDtls
                                                                .current[
                                                                'VEHICLE_TYPE'
                                                            ]
                                                        }
                                                    </p>
                                                </span>
                                            </td>

                                            <td
                                                align="left"
                                                valign="middle"
                                                color="#ddd"
                                                className="address"
                                            >
                                                <strong>
                                                    Vehicle Sub Type:
                                                </strong>
                                            </td>
                                            <td
                                                align="left"
                                                valign="middle"
                                                className="address"
                                            >
                                                <span>
                                                    {
                                                        proposalDtls.current[
                                                            'VehicleSubType'
                                                        ]
                                                    }
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                align="left"
                                                valign="middle"
                                                color="#ddd"
                                                className="address"
                                            >
                                                <strong>Misc Type: </strong>
                                            </td>
                                            <td
                                                align="left"
                                                valign="middle"
                                                className="address"
                                            >
                                                <span>
                                                    <p
                                                        style={{
                                                            wordBreak:
                                                                'break-word'
                                                        }}
                                                    >
                                                        {
                                                            proposalDtls
                                                                .current[
                                                                'MiscType'
                                                            ]
                                                        }
                                                    </p>
                                                </span>
                                            </td>
                                            <td
                                                align="left"
                                                valign="middle"
                                                color="#ddd"
                                                className="address"
                                            >
                                                <strong>Built Type:</strong>
                                            </td>
                                            <td
                                                align="left"
                                                valign="middle"
                                                className="address"
                                            >
                                                <span>
                                                    {
                                                        proposalDtls.current[
                                                            'BuiltType'
                                                        ]
                                                    }
                                                </span>
                                            </td>
                                        </tr>
                                    </>
                                )}

                                <tr>
                                    <td
                                        align="left"
                                        valign="middle"
                                        color="#ddd"
                                        className="address"
                                    >
                                        <strong>Vehicle Class: </strong>
                                    </td>
                                    <td
                                        align="left"
                                        valign="middle"
                                        className="address"
                                    >
                                        <span>
                                            {
                                                proposalDtls.current[
                                                    'VEHICAL_TYPE'
                                                ]
                                            }{' '}
                                        </span>
                                    </td>
                                    <td
                                        align="left"
                                        valign="middle"
                                        color="#ddd"
                                        className="address"
                                    >
                                        <strong>Previous Insurer:</strong>
                                    </td>
                                    <td
                                        align="left"
                                        valign="middle"
                                        className="address"
                                    >
                                        <span>
                                            {
                                                proposalDtls.current[
                                                    'REN_COMPANY_NAME'
                                                ]
                                            }{' '}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        rowSpan={3}
                                        style={{ backgroundColor: '#ddd' }}
                                        className="address"
                                    >
                                        <strong>Proposer Address: </strong>
                                    </td>
                                    <td
                                        rowSpan={3}
                                        align="left"
                                        valign="middle"
                                    >
                                        <span className="address">
                                            <span>
                                                {' '}
                                                {proposalDtls.current[
                                                    'ADD1'
                                                ].toUpperCase()}{' '}
                                                {proposalDtls.current[
                                                    'ADD2'
                                                ].toUpperCase()}{' '}
                                                {proposalDtls.current[
                                                    'ADD3'
                                                ].toUpperCase()}
                                                ,{' '}
                                                {proposalDtls.current[
                                                    'CITY_NAME'
                                                ].toUpperCase()}
                                                ,{' '}
                                                {proposalDtls.current[
                                                    'STATE_NAME'
                                                ].toUpperCase()}
                                                -{proposalDtls.current['PIN']}
                                            </span>
                                        </span>
                                    </td>
                                    <td
                                        align="left"
                                        valign="middle"
                                        color="#ddd"
                                    >
                                        <strong>Period of Own Damage:</strong>
                                    </td>
                                    <td align="left" valign="middle">
                                        <span>
                                            {proposalDtls.current[
                                                'POLICY_EFFECTIVE_DATE'
                                            ].toUpperCase() == 'NA' &&
                                            proposalDtls.current[
                                                'POLICY_EXPIRY_DATE'
                                            ].toUpperCase() == 'NA' ? (
                                                <b>NA</b>
                                            ) : (
                                                <b>
                                                    {' '}
                                                    {proposalDtls.current[
                                                        'POLICY_EFFECTIVE_DATE'
                                                    ].toUpperCase()}{' '}
                                                    TO{' '}
                                                    {proposalDtls.current[
                                                        'POLICY_EXPIRY_DATE'
                                                    ].toUpperCase()}
                                                </b>
                                            )}
                                        </span>
                                    </td>
                                </tr>

                                <tr>
                                    <td
                                        align="left"
                                        valign="middle"
                                        color="#ddd"
                                        className="address"
                                    >
                                        <strong>
                                            Period of Liability Cover:
                                        </strong>
                                    </td>
                                    <td
                                        align="left"
                                        valign="middle"
                                        className="address"
                                    >
                                        <span>
                                            <b>
                                                {' '}
                                                {proposalDtls.current[
                                                    'TPPOLICY_EFFECTIVE_DATE'
                                                ].toUpperCase()}
                                            </b>
                                        </span>
                                    </td>
                                </tr>

                                <tr>
                                    <td
                                        align="left"
                                        valign="middle"
                                        style={{ backgroundColor: '#ddd' }}
                                        className="address"
                                    >
                                        <strong>
                                            Period of Compulsory Personal
                                            Accident Cover:{' '}
                                        </strong>
                                    </td>
                                    <td
                                        align="left"
                                        valign="middle"
                                        className="address"
                                    >
                                        <span>
                                            {proposalDtls.current[
                                                'CPA_EFFECTIVE_DATE'
                                            ].toUpperCase() == 'NA' &&
                                            proposalDtls.current[
                                                'CPA_EXPIRY_DATE'
                                            ].toUpperCase() == 'NA' ? (
                                                <span>NA</span>
                                            ) : (
                                                <span>
                                                    {proposalDtls.current[
                                                        'CPA_EFFECTIVE_DATE'
                                                    ].toUpperCase()}{' '}
                                                    TO{' '}
                                                    {proposalDtls.current[
                                                        'CPA_EXPIRY_DATE'
                                                    ].toUpperCase()}
                                                </span>
                                            )}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        align="left"
                                        valign="middle"
                                        style={{ backgroundColor: '#ddd' }}
                                        className="address"
                                    >
                                        <strong>Proposer Details:</strong>
                                    </td>
                                    <td
                                        align="left"
                                        valign="middle"
                                        className="p-0"
                                    >
                                        <table
                                            width="100%"
                                            border={0}
                                            cellSpacing="0"
                                            cellPadding="0"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        align="left"
                                                        valign="middle"
                                                        style={{
                                                            backgroundColor:
                                                                '#ddd'
                                                        }}
                                                        className="bdrl0"
                                                    >
                                                        <strong>
                                                            Proposer Type
                                                        </strong>
                                                    </td>
                                                    <td
                                                        align="left"
                                                        valign="middle"
                                                        style={{
                                                            backgroundColor:
                                                                '#ddd'
                                                        }}
                                                        className="bdrleft"
                                                    >
                                                        <strong>PAN</strong>
                                                    </td>
                                                    <td
                                                        align="left"
                                                        valign="middle"
                                                        style={{
                                                            backgroundColor:
                                                                '#ddd'
                                                        }}
                                                        className="bdrleft"
                                                    >
                                                        <strong>GSTIN</strong>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td
                                                        align="left"
                                                        valign="middle"
                                                        className="bdrl0 bdrb0"
                                                    >
                                                        <span>
                                                            {proposalDtls
                                                                .current[
                                                                'PROPOSER_TYPE'
                                                            ] == 'I'
                                                                ? 'INDIVIDUAL'
                                                                : 'CORPORATE'}
                                                        </span>
                                                    </td>
                                                    <td
                                                        align="left"
                                                        valign="middle"
                                                        className="bdrb0"
                                                    >
                                                        <span>
                                                            {maskPan(proposalDtls.current['PAN_NO'])}
                                                        </span>
                                                    </td>
                                                    <td
                                                        align="left"
                                                        valign="middle"
                                                        className="bdrb0"
                                                    >
                                                        <span>
                                                            {
                                                                proposalDtls
                                                                    .current[
                                                                    'BUYER_GSTIN_NO'
                                                                ]
                                                            }
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td
                                        align="left"
                                        valign="middle"
                                        style={{ backgroundColor: '#ddd' }}
                                        className="address"
                                    >
                                        <strong>Nominee Details</strong>
                                    </td>
                                    <td
                                        align="left"
                                        valign="middle"
                                        className="p-0"
                                    >
                                        <table
                                            width="100%"
                                            border={0}
                                            cellSpacing="0"
                                            cellPadding="0"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        align="left"
                                                        valign="middle"
                                                        style={{
                                                            backgroundColor:
                                                                '#ddd'
                                                        }}
                                                        className="bdrl0"
                                                    >
                                                        <strong>Name</strong>
                                                    </td>
                                                    <td
                                                        align="left"
                                                        valign="middle"
                                                        style={{
                                                            backgroundColor:
                                                                '#ddd'
                                                        }}
                                                        className="bdrleft"
                                                    >
                                                        <strong>Age</strong>
                                                    </td>
                                                    <td
                                                        align="left"
                                                        valign="middle"
                                                        style={{
                                                            backgroundColor:
                                                                '#ddd'
                                                        }}
                                                        className="bdrleft"
                                                    >
                                                        <strong>
                                                            Relation
                                                        </strong>
                                                    </td>
                                                    <td
                                                        align="left"
                                                        valign="middle"
                                                        style={{
                                                            backgroundColor:
                                                                '#ddd'
                                                        }}
                                                        className="bdrleft"
                                                    >
                                                        <strong>
                                                            Gender
                                                        </strong>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td
                                                        align="left"
                                                        valign="middle"
                                                        className="bdrl0 bdrb0"
                                                    >
                                                        <span>
                                                            {' '}
                                                            {proposalDtls.current[
                                                                'PA_OWN_DRVNOM_NAME'
                                                            ].toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td
                                                        align="left"
                                                        valign="middle"
                                                        className="bdrb0"
                                                    >
                                                        <span>
                                                            {' '}
                                                            {
                                                                proposalDtls
                                                                    .current[
                                                                    'PA_OWN_DRVNOM_AGE'
                                                                ]
                                                            }
                                                        </span>
                                                    </td>
                                                    <td
                                                        align="left"
                                                        valign="middle"
                                                        className="bdrb0"
                                                    >
                                                        <span>
                                                            {' '}
                                                            {proposalDtls.current[
                                                                'PA_OWN_DRVNOM_RELATION'
                                                            ].toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td
                                                        align="left"
                                                        valign="middle"
                                                        className="bdrb0"
                                                    >
                                                        <span>
                                                            {' '}
                                                            {proposalDtls.current[
                                                                'PA_OWN_DRVNOM_GENDER'
                                                            ].toUpperCase()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            {parseInt(proposalDtls.current['FKCOVERTYPE_ID']) ==
                                6 && (
                                <table
                                    border={1}
                                    cellPadding="0"
                                    cellSpacing="0"
                                    width="100%"
                                    className="VehicleDetail1"
                                    style={{ marginTop: '2px' }}
                                >
                                    <tbody>
                                        <tr>
                                            <td
                                                align="center"
                                                colSpan={4}
                                                valign="middle"
                                            >
                                                <strong>
                                                    Previous TP Details
                                                </strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                align="left"
                                                valign="middle"
                                                style={{
                                                    backgroundColor: '#ddd'
                                                }}
                                                className="address"
                                            >
                                                <strong>
                                                    TP Insurance Company Name:{' '}
                                                </strong>
                                            </td>
                                            <td
                                                align="left"
                                                valign="middle"
                                                className="address"
                                            >
                                                <span>
                                                    {
                                                        proposalDtls.current[
                                                            'TP_ICNAME'
                                                        ]
                                                    }
                                                </span>
                                            </td>
                                            <td
                                                align="left"
                                                valign="middle"
                                                style={{
                                                    backgroundColor: '#ddd'
                                                }}
                                                className="address"
                                            >
                                                <strong>TP Policy No:</strong>
                                            </td>
                                            <td
                                                align="left"
                                                valign="middle"
                                                className="address"
                                            >
                                                <span>
                                                    {common
                                                        .get_CheckEmptyString(
                                                            proposalDtls
                                                                .current[
                                                                'TP_POLICY_NO'
                                                            ]
                                                        )
                                                        .toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                align="left"
                                                valign="middle"
                                                style={{
                                                    backgroundColor: '#ddd'
                                                }}
                                                className="address"
                                            >
                                                <strong>
                                                    TP Risk Inception Date:{' '}
                                                </strong>
                                            </td>
                                            <td
                                                align="left"
                                                valign="middle"
                                                className="address"
                                            >
                                                <span>
                                                    {
                                                        proposalDtls.current[
                                                            'PREV_TP_POLICY_EFFECTIVE_DATE'
                                                        ]
                                                    }{' '}
                                                </span>
                                            </td>
                                            <td
                                                align="left"
                                                valign="middle"
                                                style={{
                                                    backgroundColor: '#ddd'
                                                }}
                                                className="address"
                                            >
                                                <strong>
                                                    TP Risk Expiry Date:
                                                </strong>
                                            </td>
                                            <td
                                                align="left"
                                                valign="middle"
                                                className="address"
                                            >
                                                <span>
                                                    {
                                                        proposalDtls.current[
                                                            'PREV_TP_POLICY_EXPIRY_DATE'
                                                        ]
                                                    }{' '}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}

                            <VehicleDetailsPreview
                                data={previewData}
                                type={Type}
                                state={state}
                                dispatch={dispatch}
                            />
                    {common.get_CheckEmptyString(Type) == 'C' ? (
                        <ChequeApprovalSection data={previewData} />
                    ) : (
                        <>
                            <BrokerDetailsPreview data={previewData} />
                            
                        </>
                    )}

                        </div>
                    </div>
                            <PreviewFooter
                                proposalDtls={proposalDtls.current}
                                data={previewData}
                                requestFor={RequestFor}
                                handleICKyc={handleICKyc}
                                verifyKYC={verifyKYC}
                                state={state}
                                dispatch={dispatch}
                            />
                </div>
            )}
                 <Toaster />
        </>
    )
}

export default Preview
