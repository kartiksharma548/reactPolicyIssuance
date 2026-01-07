import { Box, Button, Container, Grid, Stack, TextField } from '@mui/material'
import QuoteListing from '../../components/quotations/viewSavedQuotes/QuoteListing'
import BasicDatePicker from '../../components/common/datepicker'
import { useRef, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { useLazyGetSavedQuotesListQuery } from '../../redux/rtkQuerySlice/quotes/quotesListEndPoint'
import { SavedQuoteList } from '../../models/types/Quotations/quoteListType'
import { AuthModel } from '../../redux/features/auth/authInterface'
import { useAppSelector } from '../../hooks/reduxHooks'
import SearchIcon from '@mui/icons-material/Search'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { useNavigate } from 'react-router-dom'
import { getSavedQuotes } from '../../services/policyServices/proposerService'
import BackDropLoader from '../../components/common/backDropLoading'
import toast, { Toaster } from 'react-hot-toast'

function QuoteSearch() {
    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )
    const [showLoading, setShowLoading] = useState(false)
    const [quotesData, setQuotesData] = useState<SavedQuoteList>()
    // const [getSavedQuotes, { data: quotesData, isSuccess }] =
    //     useLazyGetSavedQuotesListQuery()

    const [searchState, setSearchState] = useState({
        // dateFrom: dayjs(new Date()),
        // dateTo: dayjs(new Date()),
        dateFrom: dayjs(),
        dateTo: dayjs(),
        chassisNo: '',
        proposalNo: '',
        quoteNo: '',
        resetDate: false
    })

    const handleDateChange = (value: Dayjs, name: any) => {
        setSearchState({ ...searchState, [name]: value })
    }

    const getQuotesList = async () => {
        if (
            !dayjs(searchState.dateFrom).isValid() &&
            !dayjs(searchState.dateTo).isValid() &&
            searchState.chassisNo == '' &&
            searchState.proposalNo == '' &&
            searchState.quoteNo == ''
        ) {
            toast.error('Please enter at-least one field to search.')
            return
        }
        if (
            !dayjs(searchState.dateTo).isValid() &&
            !dayjs(searchState.dateFrom).isValid()
        ) {
            toast.error('Please select Quote To Date.')
            return
        }

        if (dayjs(searchState.dateTo).isBefore(searchState.dateFrom)) {
            toast.error(
                'Proposal To date cannot be less than Proposal From Date.'
            )
            return
        }
        let quoteSearch: SavedQuoteList = {
            CHASSIS_NO: searchState.chassisNo,
            PROPOSAL_NO: searchState.proposalNo,
            FromSDate: searchState.dateFrom.format('YYYY-MM-DD'),
            ToLDate: searchState.dateTo.format('YYYY-MM-DD'),
            QUOTATION_NO: searchState.quoteNo,
            DealerId: loginSelector.DealerId
        }

        let data = await getSavedQuotes(quoteSearch)
        if (data != null) {
            setQuotesData(data)
        }
    }

    let navigate = useNavigate()
    return (
        <>
            <Toaster />
            <BackDropLoader openDialog={showLoading} />
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
                        <span className="ml-2">Saved Quotes</span>
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
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <BasicDatePicker
                                defaultValue={searchState.dateFrom}
                                fullWidth
                                getDateFromPicker={handleDateChange}
                                label="Quote Created From"
                                name="dateFrom"
                                
                                InputLabelProps={{
                                                shrink: true  
                                            }}
                                
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <BasicDatePicker
                                defaultValue={searchState.dateTo}
                                fullWidth
                                getDateFromPicker={handleDateChange}
                                label="Quote Created To"
                                name="dateTo"
                               
                                InputLabelProps={{
                                                shrink: true    
                                            }}
                                
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
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
                                InputLabelProps={{
                                                shrink: true,
                                                sx: { fontSize: '1.2rem', fontWeight: 500}
                                               
                                            }}
                               
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
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
                                InputLabelProps={{
                                                shrink: true,
                                                sx: { fontSize: '1.2rem', fontWeight: 500}
                                               
                                            }}
                                
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                id="standard-basic"
                                label="Quotation Number"
                                variant="standard"
                                value={searchState.quoteNo}
                                onChange={(event: any) =>
                                    setSearchState({
                                        ...searchState,
                                        ['quoteNo']: event.target.value
                                    })
                                }
                                InputLabelProps={{
                                                shrink: true,
                                                sx: { fontSize: '1.2rem', fontWeight: 500}
                                                
                                            }}
                                
                            />
                        </Grid>
                        <Grid container>
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
                                                // dateFrom: dayjs(new Date()),
                                                // dateTo: dayjs(new Date()),
                                                dateFrom: dayjs(),
                                                dateTo: dayjs(),
                                                chassisNo: '',
                                                proposalNo: '',
                                                quoteNo: ''
                                            }
                                        }),
                                        setQuotesData(null)
                                    )}
                                >
                                    Reset
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>

                {quotesData && (
                    <QuoteListing quoteList={quotesData.QuoteList} />
                )}
            </Container>
        </>
    )
}

export default QuoteSearch
