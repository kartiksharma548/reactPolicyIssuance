import { useState } from 'react'
import { useAppSelector } from '../../hooks/reduxHooks'
import { AuthModel } from '../../redux/features/auth/authInterface'
import dayjs, { Dayjs } from 'dayjs'
import {
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Typography
} from '@mui/material'
import { Container, Box, Stack } from '@mui/system'
import KYCStatusListing from '../../components/KYC/kycStatusListing'
import BasicDatePicker from '../../components/common/datepicker'
import SearchIcon from '@mui/icons-material/Search'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import ChequeListing from './chequeListing'
import { getChequeLists } from '../../services/policyServices/paymentService'
import common from '../../utils/common'
import toast, { Toaster } from 'react-hot-toast'

function ChequeListSearch() {
    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )
    const [errorMessage, setErrorMessage] = useState('')
    const [chequeList, setChequeList] = useState<ChequeModelType[]>([])
    const [searchState, setSearchState] = useState({
        dateFrom: '',
        dateTo: '',

        chassisNo: '',
        proposalNo: '',

        status: '0'
    })

    const handleDateChange = (value: Dayjs, name: any) => {
        setSearchState({ ...searchState, [name]: value.format('YYYY-MM-DD') })
    }

    const getChequeList = async () => {
        if (
            searchState.dateFrom == '' &&
            searchState.dateTo == '' &&
            searchState.chassisNo == '' &&
            searchState.proposalNo == '' &&
            searchState.status == '-1'
        ) {
            toast.error('Please enter at-least one field to search.')
            return
        }
        if (searchState.dateFrom != '' && searchState.dateTo == '') {
            toast.error('Please select Quote To Date.')
            return
        }

        if (dayjs(searchState.dateTo).isBefore(searchState.dateFrom)) {
            toast.error(
                'Proposal To date cannot be less than Proposal From Date.'
            )
            return
        }
        let chequeListSearch: ChequeModelType = {
            ProposalNo: searchState.proposalNo,
            ChassisNo: searchState.chassisNo,
            StartDate: searchState.dateFrom,
            EndDate: searchState.dateTo,
            DealerID: loginSelector.DealerId,
            UserID: loginSelector.UserId,
            ApprovalStatus: searchState.status
        }
        let chequedata = await getChequeLists(chequeListSearch)
        if (
            common.isNotNullOrEmpty(chequedata.ChequePendingQCData) &&
            chequedata.ChequePendingQCData.length > 0
        )
            setChequeList(chequedata.ChequePendingQCData)
        else {
            setChequeList([])
            setErrorMessage('No Record Found !')
        }
    }

    return (
        <>
            <Toaster />
            <Container maxWidth="xl" sx={{ mb: 4 }}>
                <div className="box-header with-border">
                    <h1 className="box-title flex items-center my-2">
                        <svg
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
                        <span className="ml-2">
                            Cheque Pending For Approval
                        </span>
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
                    {' '}
                    <Stack alignItems={'center'}>
                        <Grid container spacing={2} alignItems={'center'}>
                            <Grid item xs={12} md={4}>
                                <BasicDatePicker
                                    defaultValue={searchState.dateFrom}
                                    fullWidth
                                    getDateFromPicker={handleDateChange}
                                    label="Proposal Submitted (From)"
                                    name="dateFrom"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <BasicDatePicker
                                    defaultValue={searchState.dateTo}
                                    fullWidth
                                    getDateFromPicker={handleDateChange}
                                    label="Proposal Submitted (To)"
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
                                    <InputLabel>Status</InputLabel>
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
                                        <MenuItem value="-1">
                                            <em>--Select--</em>
                                        </MenuItem>
                                        <MenuItem value={'0'}>
                                            {'PENDING'}
                                        </MenuItem>
                                        <MenuItem value={'1'}>
                                            {'APPROVED'}
                                        </MenuItem>
                                        <MenuItem value={'2'}>
                                            {'REJECTED'}
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
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
                                onClick={getChequeList}
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
                                            dateFrom: '',
                                            dateTo: '',
                                            chassisNo: '',
                                            proposalNo: '',
                                            status: '0'
                                        }
                                    }),
                                    setChequeList([]),
                                    setErrorMessage('')
                                )}
                            >
                                Reset
                            </Button>
                        </Stack>
                    </Stack>
                </Box>

                {chequeList != null && chequeList.length > 0 ? (
                    <ChequeListing chequeList={chequeList} />
                ) : (
                    <Typography sx={{ color: 'red', textAlign: 'center' }}>
                        {errorMessage}
                    </Typography>
                )}
            </Container>
        </>
    )
}

export default ChequeListSearch
