import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { Container } from '@mui/system'
import { useEffect, useRef, useState } from 'react'
import BasicDatePicker from '../../components/common/datepicker'
import {
    getMasterDropdowns,
    getPaymentMode
} from '../../services/masterService/masterService'
import { useAppSelector } from '../../hooks/reduxHooks'
import ProposalPaymentList from '../../components/Payment/ProposalPaymentList'
import { ProposalInputModel } from '../../models/PolicyProposalMDL'
import { getDealerPaymentData } from '../../services/policyServices/paymentService'
import dayjs, { Dayjs } from 'dayjs'
import { AuthModel } from '../../redux/features/auth/authInterface'
import BackDropLoader from '../../components/common/backDropLoading'
import common from '../../utils/common'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

function ProposalPayment() {
    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )
    const ObjProposalInputModel = new ProposalInputModel()
    ObjProposalInputModel.DealerId = loginSelector.DealerId

    const [IcDropdown, setICDropdown] = useState([])

    const [errorMessage, setErrorMessage] = useState('')
    const [paymentMode, setPaymentMode] = useState<PaymentModeType[]>([])

    const [proposalPaymentList, setPaymentDataList] = useState<
        DealerPaymentMDL[]
    >([])

    const paymentModesMappingList = useRef<DealerICWisePaymentModeMDL[]>([])

    const [showLoading, setShowLoading] = useState(false)

    useEffect(() => {
        loadDropdowns()
    }, [])

    const loadDropdowns = async () => {
        let masterData = await getMasterDropdowns()
        let paymentData = await getPaymentMode({ ...ObjProposalInputModel })
        if (paymentData != null) {
            setPaymentMode(paymentData.Payment)
        }
        setICDropdown(masterData['Table5'])
    }
    const [searchState, setSearchState] = useState({
        //dateFrom: dayjs(new Date()).format('YYYY-MM-DD'),
        //dateTo: dayjs(new Date()).format('YYYY-MM-DD'),
        dateFrom: dayjs(),
        dateTo: dayjs(),
        chassisNo: '',
        proposalNo: '',

        ic: '',
        paymentMode: ''
    })

    const handleDateChange = (value: Dayjs, name: any) => {
        setSearchState({ ...searchState, [name]: value })
    }

    const getPaymentList = () => {
        let paymentSearch: DealerPaymentMDL = {
            ProposalNo: searchState.proposalNo,
            ChassisNo: searchState.chassisNo,
            StartDate: searchState.dateFrom
                ? searchState.dateFrom.format('YYYY-MM-DD')
                : '',
            EndDate: searchState.dateTo
                ? searchState.dateTo.format('YYYY-MM-DD')
                : '',
            FKDealerId: loginSelector.DealerId,
            ICProductId: searchState.ic != '' ? parseInt(searchState.ic) : 0,
            PaymentModeId: searchState.paymentMode
        }
        getSavedProposalPayment(paymentSearch)
    }

    const getSavedProposalPayment = async (paymentSearch: DealerPaymentMDL) => {
        if (
            paymentSearch.StartDate == '' &&
            paymentSearch.EndDate == '' &&
            paymentSearch.ChassisNo == '' &&
            paymentSearch.ProposalNo == '' &&
            paymentSearch.ICProductId == ''
        ) {
            toast.error('Please enter at-least one field to search.')
            return
        }
        if (paymentSearch.StartDate != '' && paymentSearch.EndDate == '') {
            toast.error('Please select Payment To Date.')
            return
        }

        if (dayjs(paymentSearch.EndDate).isBefore(paymentSearch.StartDate)) {
            toast.error(
                'Payment To date cannot be less than Payment From Date.'
            )
            return
        }
        setShowLoading(true)
        let paymentlisting = await getDealerPaymentData(paymentSearch)
        setShowLoading(false)
        if (common.isNotNullOrEmpty(paymentlisting)) {
            paymentlisting.DealerPaymentData.forEach((data) => {
                if (
                    data['ISPAYMENT_DONE'] == '0' &&
                    data['IsBulkPaymentDisable'] == 0 &&
                    data['PaymentModeId'] == 'G'
                ) {
                    data.ShowBulkCheckbox = true
                }
            })

            
           paymentlisting.DealerPaymentData.sort((a, b) => {
                // unpaid first
                const isPayA = a.ShowPayButton === true;
                const isPayB = b.ShowPayButton === true;
                if (isPayA && !isPayB) return -1;
                if (!isPayA && isPayB) return 1;

                // Cancel proposals next
                const isCancelA = a.ISPAYMENT_DONE !== 'Payment has been done' && a.Action === 0;
                const isCancelB = b.ISPAYMENT_DONE !== 'Payment has been done' && b.Action === 0;
                if (isCancelA && !isCancelB) return -1;
                if (!isCancelA && isCancelB) return 1;

                if (a.ISPAYMENT_DONE === '0' && b.ISPAYMENT_DONE !== '0') return -1;
                if (a.ISPAYMENT_DONE !== '0' && b.ISPAYMENT_DONE === '0') return 1;

                return Number(b.ProposalNo) - Number(a.ProposalNo);
            });
            paymentModesMappingList.current =
                paymentlisting.DealerICWisePaymentModeData
            setPaymentDataList(paymentlisting.DealerPaymentData)
        } else {
            setPaymentDataList([])
            setErrorMessage('No Record Found !')
        }
    }

    const onReset = () => {
        setSearchState({
            dateFrom: '',
            dateTo: '',
            chassisNo: '',
            proposalNo: '',

            ic: '',
            paymentMode: ''
        })
        setPaymentDataList([])
        setErrorMessage('')
    }

    let navigate = useNavigate()
    return (
        <>
            <Toaster />
            <BackDropLoader openDialog={showLoading} />
            <Container maxWidth={false} sx={{ mb: 4, px: 8 }} disableGutters>
                <div className="box-header with-border">
                    <h1 className="box-title flex items-center my-2">
                        <svg
                            onClick={() => navigate(-1)}
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M20 11.0005H6.82998L9.70998 8.12047C10.1 7.73047 10.1 7.10047 9.70998 6.71047C9.31998 6.32047 8.68998 6.32047 8.29998 6.71047L3.70998 11.3005C3.31998 11.6905 3.31998 12.3205 3.70998 12.7105L8.29998 17.3005C8.68998 17.6905 9.31998 17.6905 9.70998 17.3005C10.1 16.9105 10.1 16.2805 9.70998 15.8905L6.82998 13.0005H20C20.55 13.0005 21 12.5505 21 12.0005C21 11.4505 20.55 11.0005 20 11.0005Z"
                                fill="#22334F"
                            />
                        </svg>
                        <span className="ml-2">Proposal Payment</span>
                    </h1>
                </div>
                <Box
                    sx={{
                        flexGrow: '1',
                        flexDirection: 'row',
                        width: '100%',
                        padding: '1rem 0'
                    }}
                >
                    <Grid container spacing={6} alignItems={'center'}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                id="standard-basic"
                                label="Proposal Number"
                                variant="standard"
                                value={searchState.proposalNo}
                                onChange={(event: any) =>
                                    setSearchState({
                                        ...searchState,
                                        ['proposalNo']: event.target.value
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                id="standard-basic"
                                label="Chassis Number"
                                variant="standard"
                                value={searchState.chassisNo}
                                onChange={(event: any) =>
                                    setSearchState({
                                        ...searchState,
                                        ['chassisNo']: event.target.value
                                    })
                                }
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <BasicDatePicker
                                defaultValue={searchState.dateFrom}
                                fullWidth
                                getDateFromPicker={handleDateChange}
                                label="Proposal Submitted (From)"
                                name="dateFrom"
                                id="dateFrom"
                                format="DD/MM/YYYY"
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <BasicDatePicker
                                defaultValue={searchState.dateTo}
                                fullWidth
                                getDateFromPicker={handleDateChange}
                                label="Proposal Submitted (To)"
                                name="dateTo"
                                format="DD/MM/YYYY"
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Insurance Company</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={searchState.ic}
                                    onChange={(event) => {
                                        setSearchState({
                                            ...searchState,
                                            ['ic']: event.target.value
                                        })
                                    }}
                                    fullWidth
                                    label="Insurance Company"
                                    variant="standard"
                                >
                                    <MenuItem value="">
                                        <em>--Select--</em>
                                    </MenuItem>
                                    {IcDropdown.map((ic) => {
                                        return (
                                            <MenuItem value={ic['PRODUCT_ID']}>
                                                {ic['PRODUCT_NAME']}
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Payment Mode</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={searchState.paymentMode}
                                    onChange={(event) => {
                                        setSearchState({
                                            ...searchState,
                                            ['paymentMode']: event.target.value
                                        })
                                    }}
                                    fullWidth
                                    label="Status"
                                    variant="standard"
                                >
                                    <MenuItem value="">
                                        <em>--Select--</em>
                                    </MenuItem>
                                    {paymentMode.map((status) => {
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

                        <Stack
                            spacing={2}
                            direction="row"
                            className="flex mx-auto my-4"
                        >
                            <Button
                                color="primary"
                                size="medium"
                                variant="contained"
                                startIcon={<SearchIcon />}
                                onClick={getPaymentList}
                            >
                                Search
                            </Button>
                            <Button
                                color="primary"
                                size="medium"
                                variant="outlined"
                                startIcon={<RestartAltIcon />}
                                onClick={onReset}
                            >
                                Reset
                            </Button>
                        </Stack>
                    </Grid>
                </Box>
                {common.isNotNullOrEmpty(proposalPaymentList) &&
                proposalPaymentList.length > 0 ? (
                    <ProposalPaymentList
                        proposalPaymentList={proposalPaymentList}
                        getPaymentList={getPaymentList}
                        setPaymentDataList={setPaymentDataList}
                        paymentMode={paymentMode}
                        paymentModesMappingList={
                            paymentModesMappingList.current
                        }
                    />
                ) : (
                    <Typography sx={{ color: 'red', textAlign: 'center' }}>
                        {errorMessage}
                    </Typography>
                )}
            </Container>
        </>
    )
}

export default ProposalPayment
