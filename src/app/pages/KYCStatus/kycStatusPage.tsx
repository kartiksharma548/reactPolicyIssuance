import {
    Grid,
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material'
import { Container, Box, Stack } from '@mui/system'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import BasicDatePicker from '../../components/common/datepicker'
import QuoteListing from '../../components/quotations/viewSavedQuotes/QuoteListing'
import { useAppSelector } from '../../hooks/reduxHooks'
import { SavedQuoteList } from '../../models/types/Quotations/quoteListType'
import { AuthModel } from '../../redux/features/auth/authInterface'
import { useLazyGetSavedQuotesListQuery } from '../../redux/rtkQuerySlice/quotes/quotesListEndPoint'
import SearchIcon from '@mui/icons-material/Search'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { getMasterDropdowns } from '../../services/masterService/masterService'
import { getKycListing } from '../../services/KYC/kycService'
import KYCStatusListing from '../../components/KYC/kycStatusListing'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

function KYC_StatusPage() {
    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )

    const [insuranceCompaniesDropdown, setInsuranceCompaniesDropdown] =
        useState([])

    const [kycStatusData, setKycStatusData] = useState<SavedQuoteList>(null)

    const statusDropdown = useRef<any[]>([
        // {
        //     Text: 'Status',
        //     Value: 'S'
        // },
        {
            Text: 'Pending',
            Value: '2'
        },
        {
            Text: 'Approved',
            Value: '1'
        },
        {
            Text: 'Rejected',
            Value: '4'
        },
        {
            Text: 'Conditional Approval',
            Value: '3'
        }
    ])

    useEffect(() => {
        loadDropdowns()
    }, [])

    

    const loadDropdowns = async () => {
        let masterData = await getMasterDropdowns()

        setInsuranceCompaniesDropdown(masterData['Table5'])
    }

    const transTypeDropdown = useRef([
        { Text: 'Policy', Value: 'POLICY' },
        { Text: 'Endorsement', Value: 'ENDORSEMENT' }
    ])

    const [searchState, setSearchState] = useState({
        // dateFrom: dayjs(new Date()).format('YYYY-MM-DD'),
        // dateTo: dayjs(new Date()).format('YYYY-MM-DD'),
        dateFrom: '',
        dateTo: '',

        chassisNo: '',
        proposalNo: '',

        ic: '',
        status: '0',
        transType: '',
        kycReqNo: '',
        resetDate: false
    })

    const handleDateChange = (value: Dayjs, name: any) => {
        setSearchState({ ...searchState, [name]: value.format('YYYY-MM-DD') })
    }

    const getQuotesList = () => {
        if (dayjs(searchState.dateTo).isBefore(searchState.dateFrom)) {
            toast.error(
                'KYC Status To date cannot be less than KYC Status From Date.'
            )
            return
        }

        let quoteSearch: SavedQuoteList = {
            CHASSIS_NO: searchState.chassisNo,
            PROPOSAL_NO: searchState.proposalNo,
            FromSDate: searchState.dateFrom,
            ToLDate: searchState.dateTo,
            DealerId: loginSelector.DealerId,
            ProductId: searchState.ic != '' ? parseInt(searchState.ic) : 0,
            // Status: searchState.status,
            Status: searchState.status === '' || searchState.status === '0' ? undefined : searchState.status,
            Trans_TYPE: searchState.transType,
            KYC_Req_No: searchState.kycReqNo
        }

        getSavedKycListing(quoteSearch)
    }

    const getSavedKycListing = async (quoteSearch: SavedQuoteList) => {
        let kycStatuslisting = await getKycListing(quoteSearch)
        if (kycStatuslisting != null) {
            setKycStatusData(kycStatuslisting)
        }
    }
    let navigate = useNavigate()
    return (
        <>
            <Toaster />
            <Container
                maxWidth="xl"
                sx={{ mb: 4, px: 8, pt: 4 }}
                disableGutters
            >
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
                        <span className="ml-2">KYC Status</span>
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
                    <Grid container spacing={2} alignItems={'center'}>
                        <Grid item xs={12} md={4}>
                            <BasicDatePicker
                                defaultValue={searchState.dateFrom}
                                fullWidth
                                getDateFromPicker={handleDateChange}
                                label="KYC Status From"
                                name="dateFrom"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <BasicDatePicker
                                defaultValue={searchState.dateTo}
                                fullWidth
                                getDateFromPicker={handleDateChange}
                                label="KYC Status To"
                                name="dateTo"
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
                                    {insuranceCompaniesDropdown.map((ic) => {
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
                                <InputLabel shrink={false}>Status</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={searchState.status}
                                    onChange={(event) => {
                                        setSearchState({
                                            ...searchState,
                                            ['status']: event.target.value
                                        })
                                    }}
                                    fullWidth
                                    label="Status"
                                    variant="standard"
                                >
                                    <MenuItem value="">
                                        <em>--Select--</em>
                                    </MenuItem>
                                    {statusDropdown.current.map((status) => {
                                        return (
                                            <MenuItem value={status.Value}>
                                                {status.Text}
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Trans Type</InputLabel>
                                <Select
                                    labelId="trans-type-label"
                                    id="trans-type-select"
                                    value={searchState.transType}
                                    onChange={(event) => {
                                        setSearchState({
                                            ...searchState,
                                            transType: event.target.value
                                        })
                                    }}
                                    fullWidth
                                    label="Trans Type"
                                    variant="standard"
                                >
                                    <MenuItem value="">
                                        <em>--Select--</em>
                                    </MenuItem>
                                    {transTypeDropdown.current.map((type) => (
                                        <MenuItem key={type.Value} value={type.Value}>
                                            {type.Text}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                id="standard-basic"
                                label="KYC Request No."
                                variant="standard"
                                value={searchState.kycReqNo}
                                onChange={(event: any) =>
                                    setSearchState({
                                        ...searchState,
                                        ['kycReqNo']: event.target.value
                                    })
                                }
                            />
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
                                onClick={getQuotesList}
                            >
                                Search
                            </Button>
                            <Button
                                color="primary"
                                size="medium"
                                variant="outlined"
                                startIcon={<RestartAltIcon />}
                                onClick={() => (
                                    setSearchState({
                                        ...searchState,
                                        ...{
                                            // dateFrom: dayjs(new Date()).format(
                                            //     'YYYY-MM-DD'
                                            // ),
                                            // dateTo: dayjs(new Date()).format(
                                            //     'YYYY-MM-DD'
                                            // ),
                                            dateFrom: '',
                                            dateTo: '',
                                            chassisNo: '',
                                            proposalNo: '',
                                            ic: '',
                                            kycReqNo: '',
                                            transType: '',
                                            status: '0'
                                        }
                                    }),
                                    setKycStatusData(null)
                                )}
                            >
                                Reset
                            </Button>
                        </Stack>
                    </Grid>
                </Box>

                {kycStatusData != null && (
                    <KYCStatusListing
                        quoteList={kycStatusData.QuoteList}
                        refresh={getQuotesList}
                    />
                )}
            </Container>
        </>
    )
}

export default KYC_StatusPage
