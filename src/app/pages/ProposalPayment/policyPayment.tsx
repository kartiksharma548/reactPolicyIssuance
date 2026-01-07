import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    FormControl,
    FormControlLabel,
    Grid,
    Paper,
    Radio,
    RadioGroup,
    Stack,
    Typography,
    InputLabel,
    Select,
    MenuItem,
    TextField
} from '@mui/material'
import {useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
    IsCUGApplicable,
    doCUGPayment,
    doNonCUGPayment
} from '../../services/policyServices/paymentService'
import { encrypt } from '../../utils/encryption'
import { letterSpacing } from '@mui/system'
import ChequePolicyDetails from '../../components/Payment/chequePolicyPayment'
import dayjs from 'dayjs'
import ConfirmDialog from '../../components/common/confirmDialog'
import { useNavigate } from 'react-router-dom'
import BackDropLoader from '../../components/common/backDropLoading'
import { getPaymentMode } from '../../services/masterService/masterService'
import { ProposalInputModel } from '../../models/PolicyProposalMDL'
import { FormInputText } from '../../components/common/FormInputs/FormInputText'
import {
    APDPayment,
    sendPayLinkToCustomer,
    updateConsentDate,
    updatePaymentMode,
    getPaymentTimeMinutes
} from '../../services/policyServices/paymentService'
import { debug } from 'console'
import { update } from '../../redux/features/payment/paymentDataSlice'


function PolicyPayment() {
    const dispatchStore = useAppDispatch()
    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )
    const divRef = useRef<HTMLDivElement>()
    const [dialogData, setDialogData] = useState('')
    const [paymentModeList, setPaymentModeList] = useState<PaymentModeType[]>(
        []
    )
    const ObjProposalInputModel = new ProposalInputModel()
    ObjProposalInputModel.DealerId = loginSelector.DealerId
    const [paymentButtonDisabled, setPaymentButtonDisabled] = useState(false)

    useEffect(() => {
        loadDropdowns()
        checkCUG()
        // if(paymentData.Payment_Time < 7) {
        //     setPaymentButtonDisabled(true);
        //     setShowAlert({
        //                 ...showAlert,
        //                 ['open']: true,
        //                 ['title']: 'Message',
        //                 ['content']: "You have already processed payment with this proposal, Please try after 7 minutes.",
        //                 dialogType: 'alert'
        //             })
        // }
    }, [])

    const loadDropdowns = async () => {
        let paymentData = await getPaymentMode({ ...ObjProposalInputModel })
        if (paymentData != null) {
            setPaymentModeList(paymentData.Payment)
        }
    }

    // useEffect(() => {
    //     checkCUG()
    // }, [])

    useLayoutEffect(() => {
        const range = document.createRange()
        range.selectNode(divRef.current)
        const documentFragment = range.createContextualFragment(dialogData)

        // Inject the markup, triggering a re-run!
        divRef.current.innerHTML = ''
        divRef.current.append(documentFragment)
    }, [dialogData])

    const paymentData = useAppSelector<any>((state: any) => state.payment)
    const [paymentMode, setPaymentMode] = useState('HDFCNONCUG')
    const [showLoading, setShowLoading] = useState(false)
    const [paymentModeDefault, setPaymentModeDefault] = useState(
        paymentData['PaymentMode']
    )

    useEffect(()=>{
        if(paymentData.PaymentMode=='C')
            setPaymentMode('ICICINONCUG')

        checkCUG()

    },[paymentData])

    const [cugApplicable, setCugApplicable] = useState(0)
    const [showAlert, setShowAlert] = useState<DialogProps>({
        open: false,
        content: '',
        title: '',
        data: null,
        onClose: onConfirmDialogClose,
        dialogType: 'alert'
    })

    const checkCUG = async () => {
        let obj = {
            ProductId: paymentData['ProductId'],
            PaymentModeCode:paymentModeDefault,
            DealerID: paymentData['DealerId']
        }
        let result = await IsCUGApplicable(obj)
        setCugApplicable(result)
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentMode(e.target.value)

    }

    const handlePayment = async () => {
        let ObjMin = {
            ProposalID: paymentData['ProposalId']
        }
        let Minutes = await getPaymentTimeMinutes(ObjMin)
        if(Minutes == 3) //3 means user can proceed for payment.
        {
            setShowLoading(true)
            setPaymentButtonDisabled(true)
        
            let obj = {
                ProposalID: paymentData['ProposalId'],
                PaymentModeCode: paymentData['PaymentMode'],
                UpdatedPaymentModeCode: paymentModeDefault,
                DealerID: loginSelector.DealerId
            }
            let result = await updatePaymentMode(obj)
            setPaymentButtonDisabled(false)
        
        if (paymentModeDefault == 'A') {
            setShowLoading(true)
            let orderModel: OrderModel_Type = {
                ProposalId: paymentData['ProposalId'],
                UserID: loginSelector.UserId,
                DealerID: loginSelector.DealerId,
                TotalAmt: paymentData['Premium'],
                ProductID: paymentData['ProductId'],
                ChassisNo: paymentData['ChassisNo'],
                ICServiceEnabled: paymentData['ICServiceEnabled'],
                ConsentType: paymentData['ConsentType'],
                PaymentFor: 'P'
            }

            let APDstatus = await APDPayment(orderModel)
            setShowLoading(false)
            setPaymentButtonDisabled(false)
            if (APDstatus.status == 200) {
                if (APDstatus.data['ErrorCode'] == 1) {
                    window.open(APDstatus.data['ErrorMessage'])
                } else if (APDstatus.data['ErrorCode'] != 1) {
                    setShowAlert({
                        ...showAlert,
                        ['open']: true,
                        ['title']: 'Message',
                        ['content']: APDstatus.data['ErrorMessage'],

                        dialogType: 'alert'
                    })

                    navigate('/policyPayment')
                }
            }
        } else if (paymentModeDefault == 'P') {
            setShowLoading(true)
            
            let orderModel: OrderModel_Type = {
                ProductID: paymentData['ProductId'],
                ProposalID: paymentData['ProposalId'],
                TransactionType: 'P',
                PG_Type:  'HDFC'
            }

            let resultPayLink = await sendPayLinkToCustomer(orderModel)
            setShowLoading(false)
            setPaymentButtonDisabled(false)
            setShowAlert({
                ...showAlert,
                ['open']: true,
                ['title']: 'Message',
                ['content']: resultPayLink,

                dialogType: 'alert'
            })

            navigate('/policyPayment')
        } else {
            let PGCODE = paymentData['PaymentMode']

            let obj = {
                Payment_Unique_ID: '',
                ENC_IC_ID: encrypt(paymentData['ProductId']),
                ENC_PROPOSAL_ID: encrypt(paymentData['ProposalId']),
                ENC_PGCODE: encrypt(paymentMode),
                PaymentGroup: 'SINGLE',
                PayableAmount: paymentData['Premium'],
                DealerId: paymentData['DealerId'],
                UserId: paymentData['UserId'],
                ICServiceEnabled: paymentData['ICServiceEnabled'],
                ConsentType: paymentData['ConsentType']
            }

            if (
                paymentModeDefault == 'G' &&
                paymentData['ProposalId'].split(',').length > 1
            ) {
                obj.PaymentGroup = 'BULK'
            } else if (paymentModeDefault == 'C') {
                if (cugApplicable == 1) {
                    PGCODE = 'ICICICUG'
                } else {
                    PGCODE = 'ICICINONCUG'
                }
            }

            if (paymentMode == 'HDFCCUG' || paymentMode == 'ICICICUG') {
                setShowLoading(true)
                let result = await doCUGPayment(obj)
                setShowLoading(false)
                setPaymentButtonDisabled(false)
                if (result.status == 200) {
                    if (result.data['ErrorCode'] == 1) {
                        window.open(result.data['ErrorMessage'])
                    } else if (result.data['ErrorCode'] != 1) {
                        setShowAlert({
                            ...showAlert,
                            ['open']: true,
                            ['title']: 'Success',
                            ['content']: result.data['ErrorMessage'],

                            dialogType: 'alert'
                        })
                    }
                } else {
                    setShowAlert({
                        ...showAlert,
                        ['open']: true,
                        ['title']: 'Failed',
                        ['content']: 'Service Error.',

                        dialogType: 'alert'
                    })
                }
            } else {
                obj.ENC_PGCODE = encrypt(paymentMode)
                setShowLoading(true)
                let result = await doNonCUGPayment(obj)
                setShowLoading(false)
                setPaymentButtonDisabled(false)
                if (result.status == 200) {
                    setDialogData(result.data)
                } else {
                    setShowAlert({
                        ...showAlert,
                        ['open']: true,
                        ['title']: 'Failed',
                        ['content']: 'Service Error.',

                        dialogType: 'alert'
                    })
                }
            }
        }
        }
        else if(Minutes == 2) //2 means user have to wait for 7 minutes.
        {
        setPaymentButtonDisabled(true);
                    setShowAlert({
                                ...showAlert,
                                ['open']: true,
                                ['title']: 'Message',
                                ['content']: "You have already processed payment with this proposal, Please try after 7 minutes.",
                                dialogType: 'alert'
                            })
        }
        else{ //Status is 1 and it means payment is already done.
            setPaymentButtonDisabled(true);
            setShowAlert({
                                ...showAlert,
                                ['open']: true,
                                ['title']: 'Message',
                                ['content']: "Your payment has been done for this proposal.",
                                dialogType: 'alert'
                            })
        }
        
    }
    const navigate = useNavigate()
    function onConfirmDialogClose(
        action: boolean,
        dataKYC: IC_KYC_Response | null
    ) {
        setShowAlert({ ...showAlert, ['open']: false })
        navigate('/ProposalPayment')
    }

    const [showAPDBalance, setShowAPDBalance] = useState(
        paymentData['PaymentMode'] == 'A' ? true : false
    )
    const [showChequeDetails, setShowChequeDetails] = useState(
        paymentData['PaymentMode'] == 'I' || paymentData['PaymentMode'] == 'D'
            ? true
            : false
    )
    const [showOnlineDetails, setshowOnlineDetails] = useState(
        paymentData['PaymentMode'] == 'G' || paymentData['PaymentMode'] == 'C' ? true : false
        
    )

    const handlePaymentModeChange = (event: any) => {
        const mode = event.target.value
        const paymentTempObj = {...paymentData,"PaymentMode":mode}
        dispatchStore(update(paymentTempObj))
        setPaymentModeDefault((prev)=> mode)
        if (mode === 'A') {
            setShowAPDBalance(true)
            setshowOnlineDetails(false)
            setShowChequeDetails(false)
        } else if (mode === 'P') {
            setShowAPDBalance(false)
            setshowOnlineDetails(false)
            setShowChequeDetails(false)
        } else if (mode === 'G') {
            setShowAPDBalance(false)
            setshowOnlineDetails(true)
            setShowChequeDetails(false)
            setPaymentMode('HDFCNONCUG')

        } else if (mode === 'I' || mode === 'D') {
            setShowAPDBalance(false)
            setshowOnlineDetails(false)
            setShowChequeDetails(true)
        } 
        else if(mode === 'C'){
            setShowAPDBalance(false)
            setshowOnlineDetails(true)
            setShowChequeDetails(false)
            setPaymentMode('ICICINONCUG')
        }
        else {
            setShowAPDBalance(false)
            setshowOnlineDetails(false)
            setShowChequeDetails(false)
        }
        // setPaymentModeDefault(event.target.value)
    }

    return (
        <>
            <ConfirmDialog {...showAlert} />
            <BackDropLoader openDialog={showLoading} />
            <div className="box-header with-border mb-3">
                <h1 className="box-title pl-2  flex items-center my-2">
                    <svg
                        onClick={() => navigate(-1)}
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="cursor-pointer"
                    >
                        <path
                            d="M20 11.0005H6.82998L9.70998 8.12047C10.1 7.73047 10.1 7.10047 9.70998 6.71047C9.31998 6.32047 8.68998 6.32047 8.29998 6.71047L3.70998 11.3005C3.31998 11.6905 3.31998 12.3205 3.70998 12.7105L8.29998 17.3005C8.68998 17.6905 9.31998 17.6905 9.70998 17.3005C10.1 16.9105 10.1 16.2805 9.70998 15.8905L6.82998 13.0005H20C20.55 13.0005 21 12.5505 21 12.0005C21 11.4505 20.55 11.0005 20 11.0005Z"
                            fill="#22334F"
                        />
                    </svg>
                    <span className="ml-2">Policy Payment</span>
                </h1>
            </div>
            <Stack alignItems={'center'}>
                <Container>
                    <Card
                        sx={{
                            minWidth: '100%',
                            boxShadow: '0px 0px 0px'
                        }}
                    >
                        <Paper sx={{ backgroundColor: 'rgb(241 245 249)' }}>
                            <CardHeader title="Proposer Details" />
                        </Paper>

                        <CardContent>
                            <Stack spacing={6}>
                                <div className="flex justify-between gap-2 flex-wrap md:flex-nowrap">
                                    {!paymentData['IsBulk'] && (
                                        <>
                                            <div className="flex  gap-2 flex-col">
                                                <div>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '14px'
                                                        }}
                                                    >
                                                        <p className="">
                                                            <b className="font-semibold">
                                                                Product Name :
                                                            </b>{' '}
                                                            {
                                                                paymentData[
                                                                    'ProductName'
                                                                ]
                                                            }
                                                        </p>
                                                    </Typography>
                                                </div>

                                                <div>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '14px'
                                                        }}
                                                    >
                                                        <p>
                                                            <b className="font-semibold">
                                                                Insured Name :
                                                            </b>{' '}
                                                            {
                                                                paymentData[
                                                                    'InsuredName'
                                                                ]
                                                            }
                                                        </p>
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '14px'
                                                        }}
                                                    >
                                                        <p>
                                                            <b className="font-semibold">
                                                                Model-Variant :
                                                            </b>{' '}
                                                            {paymentData['MMV']}
                                                        </p>
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '14px'
                                                        }}
                                                    >
                                                        <p>
                                                            <b className="font-semibold">
                                                                Payment Type :
                                                            </b>{' '}
                                                            {'Single Proposal'}
                                                        </p>
                                                    </Typography>
                                                </div>
                                            </div>

                                            <div
                                                className="flex  gap-2 flex-col"
                                                style={{ marginLeft: '-100px' }}
                                            >
                                                <div>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '14px'
                                                        }}
                                                    >
                                                        <p className="">
                                                            <b className="font-semibold">
                                                                Proposal No. :
                                                            </b>{' '}
                                                            {
                                                                paymentData[
                                                                    'ProposalNo'
                                                                ]
                                                            }
                                                        </p>
                                                    </Typography>
                                                </div>

                                                <div>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '14px'
                                                        }}
                                                    >
                                                        <p>
                                                            <b className="font-semibold">
                                                                IC Proposal No.
                                                                :
                                                            </b>{' '}
                                                            {
                                                                paymentData[
                                                                    'InsProposalNo'
                                                                ]
                                                            }
                                                        </p>
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '14px'
                                                        }}
                                                    >
                                                        <p>
                                                            <b className="font-semibold">
                                                                Chassis No. :
                                                            </b>{' '}
                                                            {
                                                                paymentData[
                                                                    'ChassisNo'
                                                                ]
                                                            }
                                                        </p>
                                                    </Typography>
                                                </div>
                                                {paymentData['REGNo'] != '' && (
                                                    <div>
                                                        <Typography
                                                            sx={{
                                                                fontSize: '14px'
                                                            }}
                                                        >
                                                            <p>
                                                                <b className="font-semibold">
                                                                    Registration
                                                                    No. :
                                                                </b>{' '}
                                                                {
                                                                    paymentData[
                                                                        'REGNo'
                                                                    ]
                                                                }
                                                            </p>
                                                        </Typography>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                    {paymentData['IsBulk'] && (
                                        <>
                                            <div className="flex  gap-2 flex-col">
                                                <div>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '14px'
                                                        }}
                                                    >
                                                        <p className="">
                                                            <b className="font-semibold">
                                                                Product Name :
                                                            </b>{' '}
                                                            {
                                                                paymentData[
                                                                    'ProductName'
                                                                ]
                                                            }
                                                        </p>
                                                    </Typography>
                                                </div>

                                                <div>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '14px'
                                                        }}
                                                    >
                                                        <p>
                                                            <b className="font-semibold">
                                                                Payment Type :
                                                            </b>{' '}
                                                            {'Bulk Proposal'}
                                                        </p>
                                                    </Typography>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* { <div>
                                        <Typography sx={{ fontSize: '14px' }}>
                                            <p>
                                                <b className="font-semibold">
                                                    Dealer Code :
                                                </b>{' '}
                                                {paymentData['DealerCode']}
                                            </p>
                                        </Typography>
                                    </div>  } */}
                                </div>
                            </Stack>
                        </CardContent>
                    </Card>
                </Container>

                <Container>
                    <Card
                        sx={{
                            minWidth: '100%',
                            boxShadow: '0px 0px 0px'
                        }}
                    >
                        <Paper sx={{ backgroundColor: 'rgb(241 245 249)' }}>
                            <CardHeader title="Payment Details" />
                        </Paper>

                        <Grid
                            item
                            xs={12}
                            md={4}
                            style={{
                                'margin-top': '20px',
                                'padding-left': '20px',
                                'margin-bottom': '20px'
                            }}
                        >
                            <FormControl fullWidth>
                                {/* <InputLabel><b className="font-semibold">Payment Mode</b></InputLabel> */}
                                <b className="font-semibold">Payment Mode</b>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={paymentModeDefault}
                                    onChange={handlePaymentModeChange}
                                    fullWidth
                                    label="Status"
                                    variant="standard"
                                    style={{
                                        fontSize: '14px',
                                        'margin-top': '10px'
                                    }}
                                    //disabled={true}
                                >
                                    <MenuItem value="">
                                        <em>--Select--</em>
                                    </MenuItem>
                                    {paymentModeList.map((status) => {
                                        return (
                                            <MenuItem
                                                value={
                                                    status['PAYMENT_MODE_CODE']
                                                }
                                            >
                                                {status['PAYMENT_MODE']}
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                        {showAPDBalance && (
                            <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ 'padding-left': '20px' }}
                            >
                                <TextField
                                    fullWidth
                                    id="standard-basic"
                                    label="Avaible APD Balance"
                                    variant="standard"
                                    value={paymentData['APDBalance']}
                                    inputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>
                        )}

                        {showOnlineDetails && (
                            <CardContent>
                                <FormControl>
                                    <Stack spacing={6} direction={'row'}>
                                        <RadioGroup
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            value={paymentMode}
                                            name="radio-buttons-group"
                                            onChange={handleOnChange}
                                        >
                                            <Stack
                                                spacing={2}
                                                direction={'row'}
                                            >
                                            {paymentModeDefault !== 'C' && (
                                               <FormControlLabel
                                               value="HDFCNONCUG"
                                               control={<Radio />}
                                               label="HDFC NON CUG"
                                               />
                                              )}
                                            {paymentModeDefault === 'C' && (
                                              <FormControlLabel
                                              value="ICICINONCUG"
                                              control={<Radio />}
                                              label="ICICI NON CUG"
                                              />
                                            )}
                                                {cugApplicable == 1 && paymentModeDefault !== 'C' && (
                                                    <FormControlLabel
                                                        value="HDFCCUG"
                                                        control={<Radio />}
                                                        label="HDFC CUG"
                                                    />
                                                )}
                                            </Stack>
                                        </RadioGroup>
                                    </Stack>
                                </FormControl>
                            </CardContent>
                        )}
                    </Card>
                </Container>

                {showChequeDetails && (
                    <ChequePolicyDetails
                        setShowAlert={setShowAlert}
                        showAlert={showAlert}
                    />
                )}

                <div className="mb-4 md:mb-0">
                    {!showChequeDetails && (
                        <>
                            <Button
                                variant="contained"
                                disabled={paymentButtonDisabled}
                                onClick={handlePayment}
                                style={{
                                    'text-transform': 'capitalize',
                                    'margin-bottom': '20px'
                                }}
                            >
                                Pay: &nbsp; <span>&#8377;</span> &nbsp;{' '}
                                {paymentData['Premium'].toLocaleString('en-US')}
                            </Button>
                        </>
                    )}
                </div>
            </Stack>

            <div
                ref={divRef}
                dangerouslySetInnerHTML={{ __html: dialogData }}
            ></div>
        </>
    )
}

export default PolicyPayment
