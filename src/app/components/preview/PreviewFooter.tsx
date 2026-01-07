import { Grid, Button, Typography } from '@mui/material'
import dayjs from 'dayjs';
import { Stack } from '@mui/system'
import OTPSection from './otpSection'
import {
    checkICServiceValidation,
    sendOTP,
    uploadMandateForm,
    verifyOTP
} from '../../services/policyServices/proposerService'
import { AuthModel } from '../../redux/features/auth/authInterface'
import { useAppSelector } from '../../hooks/reduxHooks'
import { createSearchParams, useNavigate } from 'react-router-dom'
import Breakin from './breakinImages'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    BreakinSchemaType,
    breakinSchema
} from '../../models/schemas/breakinSchema'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { uploadBreakinImages } from '../../services/policyServices/proposalPreviewService'
import NcbDoc from './NcbDoc'
import useTimer from '../../hooks/useTimer'
import ChassisDiscountDoc from './chassisDiscountDoc'
import HandicappedDoc from './handicappedDoc'
import { JsonHubProtocol } from '@microsoft/signalr'
import PrintIcon from '@mui/icons-material/Print'
import { PrintPreviewPDF } from '../../services/policyServices/quoteService'
import { sendEmail } from '../../services/common/commonService'
import { encrypt } from '../../utils/encryption'
import { doNonCUGPayment } from '../../services/policyServices/paymentService'

function PreviewFooter({
    proposalDtls,
    data,
    verifyKYC,
    handleICKyc,
    state,
    dispatch,
    requestFor
}: any) {
    const [ncbDetails] = data['Table1']
    const [premiumDetails] = data['Table6']

    const [timer, startTimer] = useTimer()

    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )

    const navigate = useNavigate()
    const [breakinType, setBreakinType] = useState('')

    useEffect(() => {
        reset({
            IsBreakin:
                proposalDtls['ISBREAKIN'] == 1
                    ? 1
                    : proposalDtls['IsAddonInspection'],
            ISNCB:
                ncbDetails != undefined &&
                ncbDetails != null &&
                ncbDetails['NCB_ID'].toString() != '0'
                    ? 1
                    : 0,
            ISCHASSISDISCOUNT: proposalDtls['IsChassisDiscount'],
            IS_HANDICAPPED: proposalDtls['IS_HANDICAPPED'],

            InspectionTime: dayjs().format('HH:mm'),
        })

        let type = ''
        if (proposalDtls['ISBREAKIN'] == 1) type += ' + Breakin'
        if (proposalDtls['IS_HANDICAPPED'] == 1) type += ' + Handicapped'
        if (proposalDtls['IsChassisDiscount'] == 1)
            type += ' + Chassis Discount'
        if (proposalDtls['IsAddonInspection'] == 1)
            type += ' + Addon Inspection'
        if (
            ncbDetails != undefined &&
            ncbDetails != null &&
            ncbDetails['NCB_ID'].toString() != '0'
        )
            type += ' + NCB carry forward'

        type = type.substring(2)
        setBreakinType(type)
    }, [])
    
    const [resendTimer, setResendTimer] = useState(0);
    const resendIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const startResendTimer = () => {
        setResendTimer(300); // 5 minutes in seconds
        if (resendIntervalRef.current) clearInterval(resendIntervalRef.current);
        resendIntervalRef.current = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) {
                    clearInterval(resendIntervalRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        
        return () => {
            if (resendIntervalRef.current) clearInterval(resendIntervalRef.current);
        };
    }, []);

    const getOTP = async () => {
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
        let proposalOTP: ProposalOTPInputModel = {
            ProposalId: proposalDtls['PROPOSAL_ID'],
            ProposalNo: proposalDtls['PROPOSAL_NO'],
            MobileNo: proposalDtls['MOB_NO'],
            CPATENURE: proposalDtls['CPA_TENURE'],
            OTPMISPNAME:proposalDtls['OTPMISPNAME'],
            SMSType: 'PROPOSAL_OTP',
            userid: loginSelector.UserId
        }
        dispatch({
            type: 'setLoading',
            value: true
        })
        let otpStatus = await sendOTP(proposalOTP)
        dispatch({
            type: 'setLoading',
            value: false
        })

        dispatch({ type: 'setShowVerifyButton', value: true })
        dispatch({ type: 'setShowResendOTP', value: true })
        dispatch({ type: 'setShowTimer', value: true })
        startTimer();
        startResendTimer();
    }
    const handleBackButton = () => {
        navigate({
            pathname: '/ProposerDetails/',
            search: createSearchParams({
                ProposalId: encrypt(proposalDtls['PROPOSAL_ID'].toString())
            }).toString()
        })
    }

    const uploadBreakinDocs = async (formData: FormData) => {
        const proposalInnerHtml =
            document.getElementsByClassName('printableArea')[0].innerHTML
        formData.append('ProposalId', proposalDtls['PROPOSAL_ID'])
        formData.append('ProductId', proposalDtls['PRODUCT_ID'])
        formData.append('UserId', loginSelector.UserId.toString())
        formData.append('ICServiceEnabled', proposalDtls['ISPROPOSALSRVACTIVE'])
        formData.append('GridHtml', proposalInnerHtml)
        formData.append(
            'IS_HO_APPROVAL_REQ',
            proposalDtls['IS_HO_APPROVAL_REQ']
        )
        formData.append(
            'IS_CC_APPROVAL_REQ',
            proposalDtls['IS_CC_APPROVAL_REQ']
        )
        if (
            control._formValues['IsBreakin'] == 1 &&
            control._formValues['ISNCB'] == 1 &&
            control._formValues['ISCHASSISDISCOUNT'] == 1
        ) {
            formData.append('IsBreakin', control._formValues['IsBreakin'])
            formData.append(
                'IsAddonInspection',
                proposalDtls['IsAddonInspection']
            )
            formData.append('Front', control._formValues['Front'][0])
            formData.append('Rear', control._formValues['Rear'][0])
            formData.append('Left', control._formValues['Left'][0])
            formData.append('Right', control._formValues['Right'][0])
            formData.append('Chassis', control._formValues['Chassis'][0])
            formData.append('Odometer', control._formValues['Odometer'][0])
            formData.append('Inspection', control._formValues['Inspection'][0])
            formData.append('RCCopy', control._formValues['RCCopy'][0])
            formData.append(
                'ChassisTrace',
                control._formValues['ChassisTrace'][0]
            )
            formData.append(
                'UnderChassisImage',
                control._formValues['UnderChassisImage'][0]
            )
            formData.append(
                'EngineImage',
                control._formValues['EngineImage'][0]
            )
            formData.append(
                'InspectionDate',
                control._formValues['InspectionDate'].format('MM/DD/YYYY')
            )
            // formData.append(
            //     'InspectionTime',
            //     control._formValues['InspectionTime'].format('HH:mm')
            // )

            const inspectionTime = control._formValues['InspectionTime'];
            let inspectionTimeValue = '';

            if (inspectionTime && typeof inspectionTime.format === 'function') {
                inspectionTimeValue = inspectionTime.format('HH:mm');
            } else if (typeof inspectionTime === 'string') {
                inspectionTimeValue = inspectionTime;
            }

            formData.append('InspectionTime', inspectionTimeValue);

            


            formData.append('IsNCB', control._formValues['ISNCB'])
            formData.append(
                'IS_HANDICAPPED',
                control._formValues['IS_HANDICAPPED']
            )
            formData.append(
                'ISCHASSISDISCOUNT',
                control._formValues['ISCHASSISDISCOUNT']
            )

            formData.append(
                'ChassisDiscountImage',
                control._formValues['ChassisDiscountImage'][0]
            )
            formData.append(
                'NCBCertificate',
                control._formValues['NCBCertificate'][0]
            )
            formData.append('H1', control._formValues['H1'][0])
            formData.append('H2', control._formValues['H2'][0])
        } else {
            if (control._formValues['IsBreakin'] == 1) {
                formData.append('IsBreakin', control._formValues['IsBreakin'])
                formData.append(
                    'IsAddonInspection',
                    proposalDtls['IsAddonInspection']
                )
                formData.append('Front', control._formValues['Front'][0])
                formData.append('Rear', control._formValues['Rear'][0])
                formData.append('Left', control._formValues['Left'][0])
                formData.append('Right', control._formValues['Right'][0])
                formData.append('Chassis', control._formValues['Chassis'][0])
                formData.append('Odometer', control._formValues['Odometer'][0])
                formData.append(
                    'Inspection',
                    control._formValues['Inspection'][0]
                )
                formData.append('RCCopy', control._formValues['RCCopy'][0])
                formData.append(
                    'ChassisTrace',
                    control._formValues['ChassisTrace'][0]
                )
                formData.append(
                    'UnderChassisImage',
                    control._formValues['UnderChassisImage'][0]
                )
                formData.append(
                    'EngineImage',
                    control._formValues['EngineImage'][0]
                )
                formData.append(
                    'InspectionDate',
                    control._formValues['InspectionDate'].format('MM/DD/YYYY')
                )
                // formData.append(
                //     'InspectionTime',
                //     control._formValues['InspectionTime'].format('HH:mm')
                // )

                const inspectionTime = control._formValues['InspectionTime'];
                let inspectionTimeValue = '';

                if (inspectionTime && typeof inspectionTime.format === 'function') {
                    inspectionTimeValue = inspectionTime.format('HH:mm');
                } else if (typeof inspectionTime === 'string') {
                    inspectionTimeValue = inspectionTime;
                }

                formData.append('InspectionTime', inspectionTimeValue);
                                
                


            }
            if (control._formValues['ISNCB'] == 1) {
                formData.append(
                    'NCBCertificate',
                    control._formValues['NCBCertificate'][0]
                )

                formData.append('IsNCB', control._formValues['ISNCB'])
            }
            if (control._formValues['ISCHASSISDISCOUNT'] == 1) {
                formData.append(
                    'ChassisDiscountImage',
                    control._formValues['ChassisDiscountImage'][0]
                )

                formData.append(
                    'ISCHASSISDISCOUNT',
                    control._formValues['ISCHASSISDISCOUNT']
                )
            } else if (control._formValues['IS_HANDICAPPED'] == 1) {
                formData.append('H1', control._formValues['H1'][0])
                formData.append('H2', control._formValues['H2'][0])
                formData.append(
                    'IS_HANDICAPPED',
                    control._formValues['IS_HANDICAPPED']
                )
            }
        }
        //formData.append("GridHTML",)
        //formData.append("GridHTML",)
        let status = await uploadBreakinImages(formData)
        return status
    }

    const preValidate = async () => {
        const proposalInnerHtml =
            document.getElementsByClassName('printableArea')[0].innerHTML
        let obj: ProposalOTPInputModel = {
            ICServiceEnabled: proposalDtls['ISPROPOSALSRVACTIVE'],
            ProposalId: proposalDtls['PROPOSAL_ID'],
            ProductId: proposalDtls['PRODUCT_ID'],
            userid: loginSelector.UserId,
            Gridhtml: proposalInnerHtml
        }
        dispatch({
            type: 'setLoading',
            value: true
        })

        let ICServiceStatus = await checkICServiceValidation(obj)
        dispatch({
            type: 'setLoading',
            value: false
        })

        return ICServiceStatus
    }

    const verifyOTPValue = async (data: any) => {
        let proposalOTP: any = {
            ProposalId: proposalDtls['PROPOSAL_ID'],
            MobileTo: '91' + proposalDtls['MOB_NO'],
            SMSType: 'PROPOSAL_OTP',
            CPATENURE: proposalDtls['CPA_TENURE'],
            OTPMISPNAME:proposalDtls['OTPMISPNAME'],
            OTP: state.otp
        }

        let verificationStatus = await verifyOTP(proposalOTP)
        if (verificationStatus['Status'] == '1') {
            if (
                data['IsBreakin'] == 1 ||
                data['ISNCB'] == 1 ||
                data['IS_HANDICAPPED'] == 1 ||
                data['ISCHASSISDISCOUNT'] == 1 ||
                proposalDtls['IS_HO_APPROVAL_REQ'] == 1 ||
                proposalDtls['IS_CC_APPROVAL_REQ'] == 1
            ) {
                dispatch({
                    type: 'setLoading',
                    value: true
                })
                const formData = new FormData()
                formData.append('IsMandate', '0')

                let status = await uploadBreakinDocs(formData)
                dispatch({
                    type: 'setLoading',
                    value: false
                })
                if (status.ErrorCode == 0) {
                    dispatch({
                        type: 'setDialog',
                        value: {
                            ...state.dialogProps,
                            ['open']: true,
                            ['title']: 'Failed',
                            ['content']: status.ErrorMessage,
                            data: null,
                            dialogType: 'alert'
                        }
                    })

                    return
                } else {
                    dispatch({
                        type: 'setDialog',
                        value: {
                            ...state.dialogProps,
                            ['open']: true,
                            ['title']: 'Success',
                            ['content']: 'Proposal has been Sent For Approval.',
                            data: 'Breakin',
                            dialogType: 'alert'
                        }
                    })
                }
            } else {
                let ICServiceStatus = await preValidate()
                if (ICServiceStatus['ErrorCode'] != 1) {
                    dispatch({
                        type: 'setDialog',
                        value: {
                            ...state.dialogProps,
                            ['open']: true,
                            ['title']: 'Failed',
                            ['content']: ICServiceStatus['ErrorMessage'],
                            data: null,
                            dialogType: 'alert'
                        }
                    })
                } else if (ICServiceStatus['ErrorCode'] == 1) {
                    if (
                        proposalDtls['PAYMENT_MODE_CODE'] == 'F' &&
                        ProposalForInspection() == 0
                    ) {
                        sendProposalToCustomer()
                    } else {
                        dispatch({
                            type: 'setDialog',
                            value: {
                                ...state.dialogProps,
                                ['open']: true,
                                ['title']: 'Success',
                                ['content']:
                                    'Proposal created successfully and sent for payment.',
                                data: 'Payment',
                                dialogType: 'alert'
                            }
                        })
                    }
                }
            }
        } else {
            dispatch({
                type: 'setDialog',
                value: {
                    ...state.dialogProps,
                    ['open']: true,
                    ['title']: 'Failed',
                    ['content']: 'Please enter valid OTP.',
                    data: null,
                    dialogType: 'alert'
                }
            })
        }
    }

    const uploadMandate = async (data: any) => {
        const proposalInnerHtml =
            document.getElementsByClassName('printableArea')[0].innerHTML
        if (
            data.IsBreakin == 1 ||
            data.ISNCB == 1 ||
            data.IS_HANDICAPPED == 1 ||
            data.ISCHASSISDISCOUNT == 1 ||
            proposalDtls['IS_HO_APPROVAL_REQ'] == 1 ||
            proposalDtls['IS_CC_APPROVAL_REQ'] == 1
        ) {
            dispatch({
                type: 'setLoading',
                value: true
            })
            const formData = new FormData()
            formData.append('IsMandate', '1')
            formData.append('file', state.mandatefiles)

            let status = await uploadBreakinDocs(formData)
            dispatch({
                type: 'setLoading',
                value: false
            })
            if (status.ErrorCode == 0) {
                dispatch({
                    type: 'setDialog',
                    value: {
                        ...state.dialogProps,
                        ['open']: true,
                        ['title']: 'Failed',
                        ['content']: status.ErrorMessage,
                        data: null,
                        dialogType: 'alert'
                    }
                })

                return
            } else {
                dispatch({
                    type: 'setDialog',
                    value: {
                        ...state.dialogProps,
                        ['open']: true,
                        ['title']: 'Success',
                        ['content']: 'Proposal has been Sent For Approval.',
                        data: 'Breakin',
                        dialogType: 'alert'
                    }
                })
            }
        } else {
            const formData = new FormData()
            const proposalInnerHtml =
                document.getElementsByClassName('printableArea')[0].innerHTML
            formData.append('ProposalId', proposalDtls['PROPOSAL_ID'])
            formData.append('ProductId', proposalDtls['PRODUCT_ID'])
            formData.append('userid', loginSelector.UserId.toString())
            formData.append(
                'ICServiceEnabled',
                proposalDtls['ISPROPOSALSRVACTIVE']
            )
            formData.append('file', state.mandatefiles)

            formData.append('GridHtml', proposalInnerHtml)
            dispatch({
                type: 'setLoading',
                value: true
            })
            let status = await uploadMandateForm(formData)
            dispatch({
                type: 'setLoading',
                value: false
            })
            if (status['ErrorCode'] == 1) {
                if (
                    proposalDtls['PAYMENT_MODE_CODE'] == 'F' &&
                    ProposalForInspection() == 0
                ) {
                    sendProposalToCustomer()
                } else {
                    dispatch({
                        type: 'setDialog',
                        value: {
                            ...state.dialogProps,
                            ['open']: true,
                            ['title']: 'Success',
                            ['content']:
                                'Proposal created successfully and sent for payment.',
                            data: 'Payment',
                            dialogType: 'alert'
                        }
                    })
                }
            } else {
                dispatch({
                    type: 'setDialog',
                    value: {
                        ...state.dialogProps,
                        ['open']: true,
                        ['title']: 'Failed',
                        ['content']: status['ErrorMessage'],
                        data: null,
                        dialogType: 'alert'
                    }
                })
            }
        }
    }

    const sendToHO_ForApproval = () => {}

    const submitPolicy: SubmitHandler<BreakinSchemaType> = async (data) => {
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
        } else {
            if (state.mandateType.toString() == '2') {
                uploadMandate(data)
            } else {
                verifyOTPValue(data)
            }
        }
    }

    useEffect(() => {
        if (timer == '00:00') {
            dispatch({ type: 'setShowTimer', value: false })
        }
    }, [timer])

    const {
        handleSubmit,
        control,
        setFocus,
        register,
        formState: { errors },
        setValue,

        setError,
        reset
    } = useForm<BreakinSchemaType>({
        mode: 'all',
        resolver: zodResolver(breakinSchema)
    })

    const saveProposal = () => {}
    const PrintPreviewPDFFN = async (callfrom: string, type: string) => {
        const proposalInnerHtml =
            document.getElementsByClassName('printableArea')[0].innerHTML
        const ProposalId = proposalDtls.PROPOSAL_ID
        let object = {
            ProposalId: 0,
            HTMLString: '',
            CallFrom: '',
            IsSendDownload: ''
        }
        object.ProposalId = ProposalId
        object.HTMLString = proposalInnerHtml
        object.CallFrom = callfrom
        object.IsSendDownload = type
        dispatch({
            type: 'setLoading',
            value: true
        })
        const response = await PrintPreviewPDF(object)
        if (response.status == 200) {
            dispatch({
            type: 'setLoading',
            value: false
        })
            if (response.data.StatusCode == 1) {
                alert(response.data.StatusMessage)
            } else if (response.data.StatusCode == 2) {
                alert(response.data.StatusMessage)
                downloadPDF(response.data.PdfInBase64)
            } else {
                alert(response.data.StatusMessage)
            }
        }
    }
    function downloadPDF(pdf: any) {
        const linkSource = `data:application/pdf;base64,${pdf}`
        const downloadLink = document.createElement('a')
        const fileName = 'ProposalCopy.pdf'

        downloadLink.href = linkSource
        downloadLink.download = fileName
        downloadLink.click()
    }

    async function sendProposalToCustomer() {
        let otherParamsArr = { ProposalId: proposalDtls.PROPOSAL_ID }

        const email: TEmail = {
            TemplateName: 'ProposalForward',
            otherParams: otherParamsArr
        }
        const response = await sendEmail(email)
        if (response.ErrorCode == 1) {
            dispatch({
                type: 'setDialog',
                value: {
                    ...state.dialogProps,
                    ['open']: true,
                    ['title']: 'Alert',
                    ['content']: 'Proposal sent to the customer on Email.',
                    data: 'Policy',
                    dialogType: 'alert'
                }
            })
        }
    }
    const [dialogData, setDialogData] = useState('')
    const [paymentButtonDisabled, setPaymentButtonDisabled] = useState(false)
    const divRef = useRef<HTMLDivElement>()
    useLayoutEffect(() => {
        const range = document.createRange()
        range.selectNode(divRef.current)
        const documentFragment = range.createContextualFragment(dialogData)

        // Inject the markup, triggering a re-run!
        divRef.current.innerHTML = ''
        divRef.current.append(documentFragment)
    }, [dialogData])
    const handlePayment = async () => {
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
        let paymentObj = {
            Payment_Unique_ID: '',
            ENC_IC_ID: encrypt(proposalDtls['FKPRODUCT_ID']),
            ENC_PROPOSAL_ID: encrypt(proposalDtls.PROPOSAL_ID),
            ENC_PGCODE: encrypt('HDFCNONCUG'),
            PaymentGroup: 'SINGLE',
            PayableAmount: premiumDetails['GROSS_PREM'],
            DealerId: proposalDtls['FKDEALER_ID'],
            UserId: proposalDtls['FKUSER_ID'],
            ICServiceEnabled: proposalDtls['ISPROPOSALSRVACTIVE'],
            ConsentType: state.mandateType
        }
        dispatch({
            type: 'setLoading',
            value: true
        })
        let result = await doNonCUGPayment(paymentObj)
        dispatch({
            type: 'setLoading',
            value: false
        })
        setPaymentButtonDisabled(false)
        if (result.status == 200) {
            setDialogData(result.data)
        } else {
            dispatch({
                type: 'setDialog',
                value: {
                    ...state.dialogProps,
                    ['open']: true,
                    ['title']: 'Failed',
                    ['content']: 'Service Error.',
                    data: null,
                    dialogType: 'alert'
                }
            })
        }
    }

    const renderPaymentButtonsForCustomer = () => {
        if (
            requestFor == 'Customer' &&
            proposalDtls['ValidProposalMessage'] == ''
        ) {
            switch (true) {
                case proposalDtls['IsCreateDisplay'] == 1 &&
                    proposalDtls['ISPAYMENTDONE'] == 1:
                    return (
                        <Button
                            variant="contained"
                            type="button"
                            disabled={paymentButtonDisabled}
                            onClick={handlePayment}
                        >
                            Create Policy
                        </Button>
                    )

                case proposalDtls['IsCreateDisplay'] == 0 &&
                    proposalDtls['ISPAYMENTDONE'] == 1:
                    return (
                        <Button
                            variant="contained"
                            type="button"
                            disabled={true}
                        >
                            Payment has been done.
                        </Button>
                    )

                default:
                    return (
                        <Button
                            variant="contained"
                            type="button"
                            disabled={paymentButtonDisabled}
                            onClick={handlePayment}
                        >
                            <Typography>
                                Pay: &nbsp; <span>&#8377;</span> &nbsp;{' '}
                                {premiumDetails['GROSS_PREM'].toLocaleString(
                                    'en-US'
                                )}
                            </Typography>
                        </Button>
                    )
            }
        } else if (
            requestFor == 'Customer' &&
            proposalDtls['ValidProposalMessage'] != ''
        ) {
            return (
                <Button variant="contained" type="button" disabled={true}>
                    {proposalDtls['ValidProposalMessage']}
                </Button>
            )
        }
    }

    function ProposalForInspection() {
        if (
            proposalDtls['ISBREAKIN'] == 1 ||
            proposalDtls['IS_HANDICAPPED'] == 1 ||
            proposalDtls['IsChassisDiscount'] == 1 ||
            proposalDtls['IsAddonInspection'] == 1 ||
            proposalDtls['IS_HO_APPROVAL_REQ'] == 1 ||
            proposalDtls['IS_CC_APPROVAL_REQ'] == 1 ||
            (ncbDetails != undefined &&
                ncbDetails != null &&
                ncbDetails['NCB_ID'].toString() != '0')
        ) {
            return 1
        }
        return 0
    }

    return (
        <>
            <div
                ref={divRef}
                dangerouslySetInnerHTML={{ __html: dialogData }}
            ></div>
            <form onSubmit={handleSubmit(submitPolicy)}>
                <div className="customer Data">
                    <>
                        {/* <Breakin control={control} reset={reset} /> */}
                        {control._formValues['IsBreakin'] == 1 && (
                            <Breakin control={control} reset={reset} />
                        )}

                        {/* {proposalDtls['IsAddonInspection'].toString() ==
                            '1' && <Breakin control={control} reset={reset} />} */}
                        {proposalDtls['IS_HANDICAPPED'].toString() != null &&
                            proposalDtls['IS_HANDICAPPED'].toString() ==
                                '1' && (
                                <HandicappedDoc
                                    control={control}
                                    reset={reset}
                                />
                            )}
                        {ncbDetails != undefined &&
                            ncbDetails != null &&
                            ncbDetails['NCB_ID'].toString() != '0' && (
                                <NcbDoc control={control} reset={reset} />
                            )}

                        {proposalDtls['IsChassisDiscount'].toString() != null &&
                            proposalDtls['IsChassisDiscount'].toString() ==
                                '1' && (
                                <ChassisDiscountDoc
                                    control={control}
                                    reset={reset}
                                />
                            )}

                        <Grid container alignItems={'center'} p={2}>
                            {state.showOTP && requestFor != 'Customer' && (
                                <>
                                    <OTPSection
                                        state={state}
                                        dispatch={dispatch}
                                    />
                                    {state.showTimer &&
                                        state.mandateType == '1' && (
                                            <>
                                                <Grid container>
                                                    <Grid item xs={2}></Grid>
                                                    <Grid item>
                                                        <Typography
                                                            style={{
                                                                color: 'darkred'
                                                            }}
                                                        >
                                                            {/* {timer} */}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        )}
                                </>
                            )}

                            {/* <Grid
                                xs={
                                    12
                                }
                                md={
                                    4
                                }
                            >
                                <FormInputDate
                                    minDate={policyData.Renew.POLICY_EXPIRY_DATE?.subtract(
                                        3,
                                        'years'
                                    )}
                                    maxDate={
                                        policyData
                                            .Renew
                                            .POLICY_EXPIRY_DATE
                                    }
                                    control={
                                        control
                                    }
                                    name="LastClaimDate"
                                    onChangeFn={
                                        getDate1
                                    }
                                    label="Last Claim Date"
                                />
                            </Grid> */}

                            <Grid item xs={12} alignItems={'center'}>
                                <Stack
                                    direction={'row'}
                                    spacing={1}
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                >
                                    {requestFor != 'Customer' && (
                                        <Button
                                            variant="contained"
                                            onClick={handleBackButton}
                                        >
                                            Back
                                        </Button>
                                    )}

                                    {/* {state.showOTPButton && (
                                        <Button
                                            variant="contained"
                                            onClick={getOTP}
                                            disabled={
                                                state.showTimer &&
                                                state.showResendOTP
                                            }
                                        >
                                            {state.showResendOTP
                                                ? 'Re-send OTP'
                                                : 'Get OTP'}
                                        </Button>
                                    )} */}
                                    {state.showOTPButton && (
                                        <Button
                                            variant="contained"
                                            onClick={getOTP}
                                            disabled={resendTimer > 0}
                                        >
                                            {state.showResendOTP
                                                ? resendTimer > 0
                                                    ? `Re-send OTP (${Math.floor(resendTimer / 60)
                                                        .toString()
                                                        .padStart(2, '0')}:${(resendTimer % 60)
                                                        .toString()
                                                        .padStart(2, '0')})`
                                                    : 'Re-send OTP'
                                                : 'Get OTP'}
                                        </Button>
                                    )}
                                

                                    {state.showVerifyButton &&
                                        state.mandateType == '1' && (
                                            <Button
                                                variant="contained"
                                                type="submit"
                                            >
                                                {proposalDtls['ISBREAKIN'] ==
                                                    1 ||
                                                proposalDtls[
                                                    'IS_HANDICAPPED'
                                                ] == 1 ||
                                                proposalDtls[
                                                    'IsChassisDiscount'
                                                ] == 1 ||
                                                proposalDtls[
                                                    'IsAddonInspection'
                                                ] == 1 ||
                                                proposalDtls[
                                                    'IS_HO_APPROVAL_REQ'
                                                ] == 1 ||
                                                proposalDtls[
                                                    'IS_CC_APPROVAL_REQ'
                                                ] == 1 ||
                                                (ncbDetails != undefined &&
                                                    ncbDetails != null &&
                                                    ncbDetails[
                                                        'NCB_ID'
                                                    ].toString() != '0')
                                                    ? 'Send For Approval'
                                                    : 'Submit'}
                                            </Button>
                                        )}
                                    {(() => {
                                        if (
                                            proposalDtls['ISBREAKIN'] != null &&
                                            proposalDtls['ISBREAKIN']
                                                .toString()
                                                .trim() == '1' &&
                                            proposalDtls[
                                                'OD_TENURE'
                                            ].toString() != '0'
                                        ) {
                                            return (
                                                <Button
                                                    variant="contained"
                                                    sx={{ display: 'none' }}
                                                >
                                                    Send PayLink
                                                </Button>
                                            )
                                        } else {
                                            if (
                                                proposalDtls['PAYMENT_MODE'] ==
                                                'P'
                                            )
                                                return (
                                                    <Button
                                                        variant="contained"
                                                        sx={{
                                                            display: 'none'
                                                        }}
                                                    >
                                                        Send PayLink
                                                    </Button>
                                                )
                                            else {
                                                if (
                                                    proposalDtls[
                                                        'PAYMENT_MODE'
                                                    ].toString() == 'G'
                                                ) {
                                                    if (
                                                        proposalDtls['PGType']
                                                            .toString()
                                                            .toUpperCase() ==
                                                        'HDFCNONCUG'
                                                    ) {
                                                        return (
                                                            <>
                                                                <Button
                                                                    variant="contained"
                                                                    sx={{
                                                                        display:
                                                                            'none'
                                                                    }}
                                                                >
                                                                    Create
                                                                    Policy/Pay
                                                                    Now
                                                                </Button>
                                                                <Button
                                                                    variant="contained"
                                                                    sx={{
                                                                        display:
                                                                            'none'
                                                                    }}
                                                                >
                                                                    Save
                                                                    proposal/Pay
                                                                    Later
                                                                </Button>
                                                            </>
                                                        )
                                                    } else {
                                                        return (
                                                            <Button
                                                                variant="contained"
                                                                sx={{
                                                                    display:
                                                                        'none'
                                                                }}
                                                            >
                                                                Create Policy
                                                            </Button>
                                                        )
                                                    }
                                                } else {
                                                    return (
                                                        <Button
                                                            variant="contained"
                                                            sx={{
                                                                display: 'none'
                                                            }}
                                                        >
                                                            Create Policy
                                                        </Button>
                                                    )
                                                }
                                            }
                                        }
                                    })()}
                                    {proposalDtls['KYC_STATUS'].toString() !=
                                        '1' &&
                                        proposalDtls['KYC_STATUS'].toString() !=
                                            '3' &&
                                        proposalDtls[
                                            'IS_KYC_APPLICABLE'
                                        ].toString() == '1' && (
                                            <>
                                                {state.showVerifyKyc && (
                                                    <Button
                                                        variant="contained"
                                                        onClick={() =>
                                                            verifyKYC(
                                                                proposalDtls[
                                                                    'PROPOSAL_ID'
                                                                ]
                                                            )
                                                        }
                                                    >
                                                        Verify KYC
                                                    </Button>
                                                )}
                                                {state.showIcKycPortalButton && (
                                                    <Button
                                                        variant="contained"
                                                        onClick={handleICKyc}
                                                    >
                                                        IC KYC PORTAL
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    {(proposalDtls['PAYMENT_MODE_CODE'] ==
                                        'F' &&
                                        state.mandateType == '2' &&
                                        state.mandatefiles != undefined &&
                                        state.mandatefiles.name != undefined) ||
                                    (state.showVerifyButton &&
                                        state.mandateType == '1') ? (
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            disabled={
                                                ProposalForInspection() == 1
                                            }
                                        >
                                            {ProposalForInspection() == 1
                                                ? 'Inspection Proposal cannot be Forwarded'
                                                : 'Forward Proposal To Customer'}
                                        </Button>
                                    ) : (
                                        <>
                                            {renderPaymentButtonsForCustomer()}
                                            {state.mandateType == '2' &&
                                                state.mandatefiles !=
                                                    undefined &&
                                                state.mandatefiles.name !=
                                                    undefined && (
                                                    <Button
                                                        variant="contained"
                                                        type="submit"
                                                    >
                                                        {proposalDtls[
                                                            'ISBREAKIN'
                                                        ] == 1 ||
                                                        proposalDtls[
                                                            'IS_HANDICAPPED'
                                                        ] == 1 ||
                                                        proposalDtls[
                                                            'IsChassisDiscount'
                                                        ] == 1 ||
                                                        proposalDtls[
                                                            'IsAddonInspection'
                                                        ] == 1 ||
                                                        proposalDtls[
                                                            'IS_HO_APPROVAL_REQ'
                                                        ] == 1 ||
                                                        proposalDtls[
                                                            'IS_CC_APPROVAL_REQ'
                                                        ] == 1 ||
                                                        (ncbDetails !=
                                                            undefined &&
                                                            ncbDetails !=
                                                                null &&
                                                            ncbDetails[
                                                                'NCB_ID'
                                                            ].toString() != '0')
                                                            ? 'Send For Approval'
                                                            : 'Submit'}
                                                    </Button>
                                                )}
                                        </>
                                    )}

                                    <Button
                                        variant="contained"
                                        type="button"
                                        startIcon={<PrintIcon />}
                                        onClick={() =>
                                            PrintPreviewPDFFN(
                                                'downloadPreview',
                                                'download'
                                            )
                                        }
                                    >
                                        Print
                                    </Button>
                                </Stack>
                                {proposalDtls['ISBREAKIN'] == 1 ||
                                proposalDtls['IS_HANDICAPPED'] == 1 ||
                                proposalDtls['IsChassisDiscount'] == 1 ||
                                proposalDtls['IsAddonInspection'] == 1 ||
                                (ncbDetails != undefined &&
                                    ncbDetails != null &&
                                    ncbDetails['NCB_ID'].toString() != '0') ? (
                                    <Stack
                                        direction={'row'}
                                        justifyContent={'end'}
                                        alignItems={'center'}
                                        spacing={1}
                                    >
                                        <Typography
                                            sx={{
                                                color: 'red',
                                                fontWeight: '700'
                                            }}
                                        >
                                            Inspection Type :
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: 'darkred',
                                                fontSize: 'medium'
                                            }}
                                        >
                                            {breakinType}
                                        </Typography>
                                    </Stack>
                                ) : (
                                    <></>
                                )}
                            </Grid>
                        </Grid>
                    </>
                </div>
            </form>
        </>
    )
}

export default PreviewFooter
