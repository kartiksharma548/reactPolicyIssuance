import {
    Card,
    Paper,
    CardHeader,
    CardContent,
    Grid,
    Stack,
    Button,
    Badge
} from '@mui/material'
import { Container } from '@mui/system'
import { FormInputText } from '../common/FormInputs/FormInputText'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    ChequeSchemaType,
    chequeSchema
} from '../../models/schemas/chequeSchema'
import { getMasterDropdowns } from '../../services/masterService/masterService'
import { useEffect, useState } from 'react'
import { FormInputSelect } from '../common/FormInputs/FormInputSelect'
import FormInputDate from '../common/FormInputs/FormInputDate'
import { FormInputFile } from '../common/FormInputs/FormInputFile'
import dayjs from 'dayjs'
import {
    chequePayment,
    rejectApproveChq
} from '../../services/policyServices/paymentService'
import { useAppSelector } from '../../hooks/reduxHooks'
import { AuthModel } from '../../redux/features/auth/authInterface'
import { useNavigate } from 'react-router-dom'
import BackDropLoader from '../../components/common/backDropLoading'
import common from '../../utils/common'

function ChequePolicyDetails({ setShowAlert, showAlert }: any) {
    useEffect(() => {
        loadDropdowns()
    }, [])

    const [chequeState, setChequeState] = useState({
        CHEQUE_NO: '',
        CITY: 0,
        CHEQUE_DATE: dayjs(new Date()),
        BANK: 0,
        ACCOUNT_NO: '',
        CHEQUE_COPY: undefined
    })
    const paymentData = useAppSelector<any>((state: any) => state.payment)
    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )

    const [bankCities, setBankCities] = useState([])
    const [bankNames, setBankNames] = useState([])
    const [showLoading, setShowLoading] = useState(false)
    const [paymentButtonDisabled, setPaymentButtonDisabled] = useState(false)
    const {
        handleSubmit,
        control,
        setFocus,
        register,
        formState: { errors },
        setValue,

        setError,
        reset
    } = useForm<ChequeSchemaType>({
        mode: 'all',
        resolver: zodResolver(chequeSchema),
        defaultValues: {
            IsCustomerCheque: 1,
            CHEQUE_NO: '',
            CITY: 0,
            CHEQUE_DATE: dayjs(new Date()),
            BANK: 0,
            ACCOUNT_NO: '',
            CHEQUE_COPY: undefined
        }
    })

    function handleInputChange(e) {
        setChequeState({ ...chequeState, [e.target.name]: e.target.value })
    }

    function setDate(value, name) {
        setChequeState({
            ...chequeState,
            [name]: value
        })
    }

    function handlefileSelected(file: FileList) {
        if (file.length > 0)
            setChequeState({ ...chequeState, ['CHEQUE_COPY']: file[0] })
    }

    const loadDropdowns = async () => {
        let masterData = await getMasterDropdowns()

        setBankNames(masterData['Table17'])
        setBankCities(masterData['Table18'])
    }
    const onSubmitClick: SubmitHandler<ChequeSchemaType> = async (data) => {
        setShowLoading(true);
        setPaymentButtonDisabled(true) 
        let proposalPaymentObject: ProposalPaymentPolicyType = {
            ProposalID: paymentData['ProposalId'],
            ChequeDate: dayjs(chequeState.CHEQUE_DATE).format('MM/DD/YYYY'),
            BankCity: chequeState.CITY,
            Premium: paymentData['Premium'],
            DrawnOn: chequeState.BANK.toString(),
            ChequeNo: chequeState.CHEQUE_NO,
            AccountNo: chequeState.ACCOUNT_NO,
            DealerID: loginSelector.DealerId,
            UserID: loginSelector.UserId,
            PaymentModeCode: paymentData.PaymentMode,
            PaymentMode: ''
        }

        const formData = new FormData()
        formData.append('formData', JSON.stringify(proposalPaymentObject))
        formData.append('file', chequeState.CHEQUE_COPY)

        let status = await chequePayment(formData)
        setShowLoading(false)
        if (status != null) {
            if (paymentData['PaymentMode'] == 'D') {
                ApproveRejectChequeQC()
                return
            }
            setShowAlert({
                ...showAlert,
                ['open']: true,
                ['title']: 'Message',
                ['content']: status,

                dialogType: 'alert'
            })
        }
        setPaymentButtonDisabled(false)
 
    }

    const ApproveRejectChequeQC = async () => {
        let chequeObj = {
            IsApprove: 1,
            ProposalID: paymentData['ProposalId'],
            ProductID: paymentData['ProductId'],
            UserID: loginSelector.UserId,
            Remarks: '',
            HOSTIP: '',
            ICServiceEnabled: 1,
            ConsentType: paymentData['ConsentType']
        }
        // if (proposalDtls['MandateStatus'] == 1) {
        //     chequeObj.ConsentType = 2
        // } else {
        //     chequeObj.ConsentType = 1
        // }
        setShowLoading(true)
        setPaymentButtonDisabled(true)
 
        let status = await rejectApproveChq(chequeObj)
        setShowLoading(false)
        setPaymentButtonDisabled(false)
 
        if (status.status == 200) {
            if (status.data['ErrorCode'] == 1) {
                setShowAlert({
                    ...showAlert,
                    ['open']: true,
                    ['title']: 'Success',
                    ['content']: status.data['ErrorMessage'],
                    data: null,
                    dialogType: 'alert'
                })
            } else if (status.data['ErrorCode'] == -1) {
                setShowAlert({
                    ...showAlert,
                    ['open']: true,
                    ['title']: 'Success',
                    ['content']: common.isNotNullOrEmpty(
                        status.data['ErrorMessage']
                    )
                        ? status.data['ErrorMessage']
                        : 'Cheque Approved Successfully.',
                    data: null,
                    dialogType: 'alert'
                })
            }
        } else {
            setShowAlert({
                ...showAlert,
                ['open']: true,
                ['title']: 'Error',
                ['content']: 'Error In Service.',
                data: null,
                dialogType: 'alert'
            })
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmitClick)}>
            <Stack spacing={4} alignItems={'center'}>
                <Container>
                    <Card
                        sx={{
                            minWidth: '100%',
                            boxShadow: '0px 0px 0px'
                        }}
                    >
                        {
                            <Paper sx={{ backgroundColor: 'rgb(241 245 249)' }}>
                                <CardHeader title="Cheque Details" />
                            </Paper>
                        }

                        <CardContent>
                            <Grid container rowSpacing={2} spacing={6}>
                                <Grid item xs={12} md={4}>
                                    <FormInputText
                                        control={control}
                                        name="CHEQUE_NO"
                                        onChangeFn={handleInputChange}
                                        label="Cheque No"
                                        inputProps={{
                                            maxLength: 6
                                        }}
                                        className="requiredField"
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <FormInputSelect
                                        control={control}
                                        name="CITY"
                                        onChangeFn={handleInputChange}
                                        label="Branch City"
                                        LIST={bankCities}
                                        TEXT="CITY_NAME"
                                        VALUE="CITY_ID"
                                        className="requiredField"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                    className="requiredField"
                                >
                                    <FormInputDate
                                        control={control}
                                        nestedObject={''}
                                        name="CHEQUE_DATE"
                                        onChangeFn={setDate}
                                        label="Cheque Date"
                                        minDate={dayjs(new Date()).subtract(
                                            30,
                                            'day'
                                        )}
                                        maxDate={dayjs(new Date())}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <FormInputSelect
                                        control={control}
                                        name="BANK"
                                        onChangeFn={handleInputChange}
                                        label="Drawn On"
                                        LIST={bankNames}
                                        TEXT="BANK_NAME"
                                        VALUE="BANK_ID"
                                        className="requiredField"
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <FormInputText
                                        control={control}
                                        name="ACCOUNT_NO"
                                        onChangeFn={handleInputChange}
                                        label="Account No"
                                        inputProps={{
                                            maxLength: 20
                                        }}
                                        className="requiredField"
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Badge
                                        badgeContent={'Cheque Copy'}
                                        color="error"
                                    >
                                        <FormInputFile
                                            control={control}
                                            name="CHEQUE_COPY"
                                            onChangeFn={handlefileSelected}
                                            reset={reset}
                                        />
                                    </Badge>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Container>

                <Button
                    variant="contained"
                    type="submit"
                    disabled={paymentButtonDisabled}
                    style={{
                        'text-transform': 'capitalize',
                        'margin-bottom': '20px'
                    }}
                >
                    Pay: &nbsp; <span>&#8377;</span> &nbsp;{' '}
                    {paymentData['Premium'].toLocaleString('en-US')}
                </Button>
            </Stack>
        </form>
    )
}

export default ChequePolicyDetails
