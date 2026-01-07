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
import { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { ProposalModel } from '../../models/types/Proposal/ProposalModel'
import CancelledProposalListing from '../../components/proposerDetails/cancelledProposalListing'
import { getCencelledProposals } from '../../services/policyServices/proposerService'
import { useAppSelector } from '../../hooks/reduxHooks'
import { AuthModel } from '../../redux/features/auth/authInterface'

function FetchCancelledProposal(){
    const loginSelector = useAppSelector<AuthModel>(
            (state: any) => state.auth.loginData
    )

    const [searchState, setSearchState] = useState({
        proposalNo: '',
        chassisNo: '',
    })
    const [ProposalCancelData, setProposalCancelData] = useState<ProposalModel[]>(null)
    
    useEffect(()=>{
        let propCancelSearch: ProposalModel = {
            DealerId: loginSelector.DealerId,
            UserId: loginSelector.UserId
        }
        getCencelledProposal(propCancelSearch)
    },[])

    const getCencelledProposal = async (propCancelSearch: ProposalModel)=> {
        let cancelledProposalData = await getCencelledProposals(propCancelSearch)
        if(cancelledProposalData != null){
            setProposalCancelData(cancelledProposalData)
        }
    }

    const getProposalList = ()=> {
        if(loginSelector != null){
            let propCancelSearch: ProposalModel = {
                DealerId: loginSelector.DealerId,
                UserId: loginSelector.UserId,
                ProposalNo: searchState.proposalNo,
                ChassisNo: searchState.chassisNo
            }
            getCencelledProposal(propCancelSearch);   
        }
    }

    return(
        <>
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
                        <span className="ml-2">Fetch Cancelled Proposals</span>
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
                                onClick={getProposalList}
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
                                            chassisNo: '',
                                            proposalNo: ''
                                        }
                                    }),
                                    setProposalCancelData(null)
                                )}
                            >
                                Reset
                            </Button>
                        </Stack>
                </Grid>
                </Box>
                {ProposalCancelData != null && (
                    <CancelledProposalListing cancelProposalList={ProposalCancelData} />
                )}
            </ Container>
        </>
    )
}

export default FetchCancelledProposal