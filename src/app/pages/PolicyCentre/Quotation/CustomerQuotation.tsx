import { useEffect, useReducer, useRef, useState } from 'react'
import QuoteCard from '../../../components/quotations/quoteCard'
import QuoteGrid from '../../../components/quotations/quoteGridView'
import { QuoteInputRequest } from '../../../models/PolicyMDL'
import { useAppDispatch } from '../../../hooks/reduxHooks'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import ChoosePlan from '../../../components/quotations/choosePlan'
import QuoteSelectReason from '../../../components/quotations/quoteSelectReason'
import {
    Badge,
    Box,
    Button,
    Chip,
    Grid,
    Stack,
    Typography
} from '@mui/material'
import { AddOnMDL } from '../../../models/AddonMDL'
import Container from '@mui/material/Container'
import VehicleInfo from '../../../components/vehicleDetailsData/vehicleDetails'
import React from 'react'
import { IProposal } from '../../../models/IProposal'
import CompareQuotes from '../../../components/quotations/compareQuotes'
import toast, { ToastPosition, Toaster } from 'react-hot-toast'
import CompareIcon from '@mui/icons-material/Compare'
import SortIcon from '@mui/icons-material/Sort'
import ListIcon from '@mui/icons-material/List'
import GridViewIcon from '@mui/icons-material/GridView'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { blue } from '@mui/material/colors'
import ArrowForward from '@mui/icons-material/ArrowForward'
import { SendCustomerConsent } from '../../../models/PolicyProposalMDL'
import {
    sendQuotesVerificationOTP,
    getCustomerDealerDetails,
    IsQuoteLinkExpired
} from '../../../services/quoteService'
import QuoteOTPVerification from '../../../components/quotations/quoteOTPVerification'
import { BasePath } from '../../../constants/baseURL'
import { CustomerQuotationNavBar } from '../../../components/sideBarContent/topBar'
import Footer from '../../../components/sideBarContent/footer'
import { getProposalDetails } from '../../../services/policyServices/proposerService'
import { IProposalModel } from '../../../models/IProposalModel'
import {
    fetchQuotations,
    getAddons
} from '../../../services/policyServices/quoteService'
import { QuoteLists } from '../../../models/PolicyMDL'
import BackDropLoader from '../../../components/common/backDropLoading'
import { decrypt } from '../../../utils/encryption'

function CustomerQuotation(props) {
    const [state, dispatch] = useReducer(reducer, {
        checkedQuotations: [],
        openCompareBottom: false
    })

    function reducer(state: any, action: any) {
        switch (action.type) {
            case 'setCheckedQuotations':
                let tempState: any = {}
                if (action.value['check']) {
                    if (state.checkedQuotations.length == 5) {
                        toast.error("Maximum 5 IC's can be compared.")
                        return state
                    }
                    tempState = {
                        ...state,
                        checkedQuotations: [
                            ...state.checkedQuotations,
                            action.value['quote']
                        ]
                    }
                } else {
                    tempState = {
                        ...state,
                        checkedQuotations: state.checkedQuotations.filter(
                            (x: any) =>
                                x['PRODUCTID'] !=
                                action.value['quote']['PRODUCTID']
                        )
                    }
                }
                if (tempState.checkedQuotations.length == 0)
                    return { ...tempState, openCompareBottom: false }
                else if (tempState.checkedQuotations.length > 1)
                    return { ...tempState, openCompareBottom: true }
                else return tempState

            case 'setCheckedQuotationsEmpty':
                return {
                    ...state,
                    checkedQuotations: [],
                    openCompareBottom: false
                }

            case 'setCompareBottom':
                return { ...state, openCompareBottom: action.value }
        }
    }

    //Begin UseStates
    const [openCompare, setOpenCompare] = React.useState(false)
    const [toggleQuoteGridView, setToggleQuoteGridView] = useState(false)
    const [showLoading, setShowLoading] = useState(false)
    //End UseStates
    let navigate = useNavigate()

    const [searchParams] = useSearchParams()
    let ProposalId: string = searchParams.get('ProposalId') || ''
    ProposalId = decrypt(ProposalId)
    const IsExpired: number = parseInt(searchParams.get('IsExpired')) || 0
    const [customerDetails, setCustomerDetails] = useState({})
    const [quotesData, setQuotesData] = useState<QuoteLists>()

    const proposalInfo = {} as IProposal
    proposalInfo.ProposalId = ProposalId

    //BEGIN API CALLS
    const getCustomerDealerDetailsFN = async () => {
        let data = await getCustomerDealerDetails(proposalInfo)
        if (data.status === 200) {
            console.log(data)
            let custData = {
                ...data.data
            }
            setCustomerDetails(custData)
            IsQuoteLinkExpiredFN(custData)
        }
    }

    const getAddonsFromAPI = async (policyModel) => {
        let addons = await getAddons(policyModel)
        return addons
    }

    const [addOnsData, setAddOnsData] = useState<AddOnMDL[]>([])
    const [proposalModel, setProposalModel] = useState<IProposalModel>()

    const getProposalData = async () => {
        let data = await getProposalDetails(proposalInfo)
        setProposalModel(data)
        if (data != null) {
            let addons = await getAddonsFromAPI()
            if (data.FuelType != 'ELECTRIC') {
                addons = addons.filter(function (item) {
                    return (
                        item['AddOnTypeId'] !== 18 && item['AddOnTypeId'] !== 19
                    )
                })
            }
            let checkingSelectedAddons = [...addons]
            if (data != null && data.SelectedAddon.length > 0) {
                checkingSelectedAddons.forEach((x) => {
                    if (
                        data.SelectedAddon.split(',').indexOf(
                            x.AddOnTypeId.toString()
                        ) > -1
                    ) {
                        if (x.AddOnType == 'RTI') {
                            x.IsCoverValue = true

                            x.CoverValue = data.RTI_Amount.toString()
                        }
                        if (x.AddOnType == 'EMI') {
                            x.IsCoverValue = true
                            x.CoverValue = data.EMI_Amount.toString()
                        }
                        x.isChecked = true
                    }
                })
            }
            setAddOnsData(checkingSelectedAddons)
            AddOns.current = checkingSelectedAddons
        }
    }
    //END API CALLS

    //BEGIN USE REFS
    const AddOns = useRef<any>([])
    const QuoteLoopCount = useRef<number>(0)
    // END USE REFS

    //ADDON API CALL
    const handleCompareClickOpen = () => {
        if (state.checkedQuotations.length > 1) {
            setOpenCompare(true)
        } else {
            toast.error('Please select at-least two ICs to compare.')
        }
    }
    useEffect(() => {
        getCustomerDealerDetailsFN()
        getProposalData(proposalInfo)
    }, [])

    const useGetQuotes = async (policyModel) => {
        let quotes = await fetchQuotations(policyModel)
        if (
            quotes?.quoteList?.length > 0 ||
            quotes?.quoteFailedList?.length > 0
        ) {
            QuoteLoopCount.current += 1
            if (QuoteLoopCount.current == 1) {
                setShowLoading(false)
                let data = await getProposalDetails(proposalInfo)
                setProposalModel(data)
            }

            let quotesModel: QuoteLists = {
                preferredQuoteList: [],
                quoteList: quotes.quoteList,
                quoteFailedList: quotes.quoteFailedList
            }
            setShowLoading(false)
            setQuotesData(quotesModel)
        } else {
            QuoteLoopCount.current += 1

            if (QuoteLoopCount.current == 3) {
                toast.error('Quotation not found')
                setShowLoading(false)
            }
        }
    }
    const GetQuotes = (customerDealerDetails) => {
        setShowLoading(true)
        const policyModel = new QuoteInputRequest()
        policyModel.DealerId = customerDealerDetails.FKDEALER_ID
        policyModel.UserID = customerDealerDetails.FKUSER_ID
        policyModel.ProposalId = customerDealerDetails.ProposalId

        policyModel.AddOns = AddOns.current
            .filter((x: any) => {
                return x['isChecked'] == true
            })
            .map((x2: any) => {
                return x2['AddOnTypeId']
            })
            .join(',')

        policyModel.ReCalculateQuote = false
        useGetQuotes(policyModel)
        getAddonsFromAPI(policyModel)
        dispatch({
            type: 'setCheckedQuotationsEmpty'
        })
    }
    const [sortOptionByPremium, setSortOptionByPremium] = useState(1)
    function sortBy(): void {
        let sortByType = sortOptionByPremium == 1 ? 2 : 1
        setSortOptionByPremium(sortByType)
        if (sortByType == 1) {
            let sortedData = quotesData.quoteList?.sort(
                (a, b) => a['GROSS_PREM'] - b['GROSS_PREM']
            )
            const quoteData: QuoteLists = {
                quoteList: sortedData,
                quoteFailedList: quotesData.quoteFailedList
            }
            setQuotesData(quoteData)
        } else if (sortByType == 2) {
            let sortedData = quotesData.quoteList?.sort(
                (a, b) => b['GROSS_PREM'] - a['GROSS_PREM']
            )
            const quoteData: QuoteLists = {
                quoteList: sortedData,
                quoteFailedList: quotesData.quoteFailedList
            }
            setQuotesData(quoteData)
        } else if (sortByType == 3) {
        }
    }
    const handleToggleGridView = (toggleType: boolean) => {
        setToggleQuoteGridView(toggleType)
    }

    //#region Send Quote Model
    const [open, setOpen] = useState(false)
    const [timerComplete, setTimerComplete] = useState(false)
    const objConsentData = new SendCustomerConsent()
    const [sendQuoteConsentOTP, setSendQuoteConsentOTP] =
        useState(objConsentData)

    async function confirmQuotes() {
        setTimerComplete(false)
        dispatch({ type: 'setCompareBottom', value: false })
        let validationStatus = true
        objConsentData.ProposalId = proposalInfo.ProposalId
        objConsentData.ProductId = sendQuoteConsentOTP.ProductId
        objConsentData.Reason = sendQuoteConsentOTP.Reason
        objConsentData.Remarks = sendQuoteConsentOTP.Remarks
        if (proposalInfo.ProposalId != 0) {
            if (objConsentData.ProductId == 0) {
                setSendQuoteConsentOTP(objConsentData)
                toast.error(
                    'Please select quotation or any reason for consent !'
                )
                validationStatus = false
            } else if (objConsentData.ProductId == 1000) {
                if (
                    objConsentData.Remarks == '' ||
                    objConsentData.Reason == ''
                ) {
                    toast.error("Reason & remarks can't be blank")
                    validationStatus = false
                }
            }
            if (validationStatus === true) {
                setShowLoading(true)
                let status = await sendQuotesVerificationOTP(objConsentData)
                setShowLoading(false)
                if (status.Flag == 1) {
                    toast.success(status.Message)

                    setOpen(true)
                } else if (status.Flag == 0) {
                    toast.error(status.Message)
                    setSendQuoteConsentOTP({
                        ...sendQuoteConsentOTP,
                        ...{ Remarks: '', Reason: '', ProductId: 0 }
                    })
                    setOpen(false)
                }
            }
        } else {
            toast.error('Please contact to your MISP/Dealer !')
        }
    }

    const IsQuoteLinkExpiredFN = async (customerDealerDetails) => {
        objConsentData.ProposalId = proposalInfo.ProposalId
        objConsentData.Param1 = IsExpired
        objConsentData.DealerId = customerDealerDetails.FKDEALER_ID
        objConsentData.UserID = customerDealerDetails.FKUSER_ID
        let response = await IsQuoteLinkExpired(objConsentData)
        if (response.status == 200) {
            if (response.data.Flag == 1 && response.data.Param1 == 1) {
                GetQuotes(customerDealerDetails)
            } else {
                toast.error(response.data.Message)
            }
        }
    }
    //#endregion

    return (
        <>
            <BackDropLoader openDialog={showLoading} />
            <div className="h-full">
                <CustomerQuotationNavBar />
                <div className="CustomerQuotationSection">
                    <Container maxWidth={false}>
                        <div className="box-header with-border">
                            <h1 className="box-title flex items-center my-2">
                                <span>Quotation</span>
                            </h1>
                        </div>
                        <Grid container spacing={6}>
                            <Grid item xs={3}>
                                <Stack spacing={2}>
                                    {proposalModel && (
                                        <VehicleInfo
                                            proposalData={proposalModel!}
                                            quotes={quotesData?.quoteList[0]}
                                            QuoteNo={customerDetails?.QuoteNo}
                                            callFrom={'QUOTE'}
                                            callFromCustomer={true}
                                        />
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={9}>
                                <Box flexGrow={1} sx={{ width: '100%' }}>
                                    <Box sx={{ width: '100%' }}>
                                        <Stack
                                            direction={'row'}
                                            spacing={2}
                                            sx={{ margin: '.4rem 0 .2rem' }}
                                        >
                                            <Chip
                                                className="iconChips"
                                                sx={{
                                                    borderRadius: '8px',
                                                    background: '#ECF0F4'
                                                }}
                                                onClick={() =>
                                                    handleToggleGridView(false)
                                                }
                                                icon={
                                                    <ListIcon
                                                        sx={{
                                                            marginRight:
                                                                '5px!important'
                                                        }}
                                                    />
                                                }
                                            />
                                            <Chip
                                                className="iconChips"
                                                sx={{
                                                    borderRadius: '8px',
                                                    background: '#ECF0F4'
                                                }}
                                                onClick={() =>
                                                    handleToggleGridView(true)
                                                }
                                                icon={
                                                    <GridViewIcon
                                                        sx={{
                                                            marginRight:
                                                                '5px!important'
                                                        }}
                                                    />
                                                }
                                            />
                                            <Badge
                                                badgeContent={
                                                    state.checkedQuotations
                                                        .length
                                                }
                                                color="secondary"
                                            >
                                                <Chip
                                                    sx={{
                                                        borderRadius: '8px',
                                                        background: '#ECF0F4'
                                                    }}
                                                    label="Compare"
                                                    onClick={
                                                        handleCompareClickOpen
                                                    }
                                                    icon={<CompareIcon />}
                                                />
                                            </Badge>

                                            <ChoosePlan
                                                setOpenPopup={setOpenCompare}
                                                state={state}
                                                dispatch={dispatch}
                                            />

                                            <Chip
                                                sx={{
                                                    borderRadius: '8px',
                                                    background: '#ECF0F4'
                                                }}
                                                label={
                                                    <div className="iconText">
                                                        {sortOptionByPremium ==
                                                            1
                                                            ? 'Sort By Highest Premium'
                                                            : 'Sort By Lowest Premium'}
                                                    </div>
                                                }
                                                onClick={() => sortBy()}
                                                icon={<SortIcon />}
                                            />
                                        </Stack>
                                        {quotesData && (
                                            <>
                                                {!toggleQuoteGridView &&
                                                    quotesData.quoteList?.map(
                                                        (x, index) => {
                                                            return (
                                                                <Grid
                                                                    key={index}
                                                                    pt={1}
                                                                    container
                                                                >
                                                                    <QuoteCard
                                                                        quote={
                                                                            x
                                                                        }
                                                                        dispatch={
                                                                            dispatch
                                                                        }
                                                                        state={
                                                                            state
                                                                        }
                                                                        ProposalId={
                                                                            ProposalId
                                                                        }
                                                                        set={
                                                                            sendQuoteConsentOTP
                                                                        }
                                                                        set1={
                                                                            setSendQuoteConsentOTP
                                                                        }
                                                                        callFromCustomer={
                                                                            true
                                                                        }
                                                                        addOns={
                                                                            AddOns.current
                                                                        }
                                                                    />
                                                                </Grid>
                                                            )
                                                        }
                                                    )}
                                                {toggleQuoteGridView && (
                                                    <Grid container spacing={6}>
                                                        {quotesData.quoteList?.map(
                                                            (x, index) => {
                                                                return (
                                                                    <Grid
                                                                        key={
                                                                            index
                                                                        }
                                                                        pt={1}
                                                                        item
                                                                        xs={4}
                                                                    >
                                                                        <QuoteGrid
                                                                            quote={
                                                                                x
                                                                            }
                                                                            dispatch={
                                                                                dispatch
                                                                            }
                                                                            state={
                                                                                state
                                                                            }
                                                                            ProposalId={
                                                                                ProposalId
                                                                            }
                                                                            set={
                                                                                sendQuoteConsentOTP
                                                                            }
                                                                            set1={
                                                                                setSendQuoteConsentOTP
                                                                            }
                                                                            callFromCustomer={
                                                                                true
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                )
                                                            }
                                                        )}
                                                    </Grid>
                                                )}
                                            </>
                                        )}
                                    </Box>
                                    <QuoteSelectReason
                                        sendQuoteSelect={{
                                            sendQuoteConsentOTP,
                                            setSendQuoteConsentOTP
                                        }}
                                    ></QuoteSelectReason>
                                    {quotesData &&
                                        quotesData.quoteFailedList.length >
                                        0 && (
                                            <Box
                                                sx={{
                                                    borderRadius: 1,
                                                    borderStyle: 'dashed',
                                                    width: '100%',
                                                    borderWidth: '2px'
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        backgroundColor:
                                                            '#b4d4e5a1'
                                                    }}
                                                >
                                                    <Stack
                                                        direction={'row'}
                                                        spacing={3}
                                                    >
                                                        <WarningAmberIcon />
                                                        <Typography
                                                            sx={{
                                                                letterSpacing:
                                                                    '2px'
                                                            }}
                                                        >
                                                            List of Insurers who
                                                            have not provided
                                                            the quotes.
                                                        </Typography>
                                                    </Stack>
                                                </Box>
                                                <Stack direction={'row'}>
                                                    {quotesData.quoteFailedList?.map(
                                                        (x, index) => {
                                                            return (
                                                                <div className="icItem">
                                                                    <Box
                                                                        component="img"
                                                                        p={2}
                                                                        borderColor={
                                                                            blue
                                                                        }
                                                                        src={
                                                                            BasePath +
                                                                            '/Images/Product/' +
                                                                            x[
                                                                            'PROD_LOGO_PATH'
                                                                            ]
                                                                        }
                                                                    />
                                                                </div>
                                                            )
                                                        }
                                                    )}
                                                </Stack>
                                            </Box>
                                        )}
                                    <div className="text-center">
                                        {/* <Button
                                            variant="contained"
                                            onClick={() => {
                                                IsQuoteLinkExpiredFN(
                                                    customerDetails
                                                )
                                            }}
                                            sx={{ margin: '16px 0' }}
                                        >
                                            Get Quote
                                        </Button> */}
                                        <QuoteOTPVerification
                                            params={{
                                                open,
                                                setOpen,
                                                ProposalId,
                                                timerComplete,
                                                setTimerComplete,
                                                confirmQuotes
                                            }}
                                        ></QuoteOTPVerification>
                                        <Button
                                            variant="contained"
                                            onClick={confirmQuotes}
                                            sx={{ margin: '16px 0', ml: 2 }}
                                            endIcon={<ArrowForward />}
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                </Box>
                                <CompareQuotes
                                    checkedAddons={AddOns.current}
                                    setOpenPopup={setOpenCompare}
                                    selectedIcs={state.checkedQuotations}
                                    openPopup={openCompare}
                                    callFromCustomer={true}
                                    proposalData={proposalModel!}
                                ></CompareQuotes>
                            </Grid>
                        </Grid>
                    </Container>
                </div>
                <Toaster position="top-center" />
                <div className="footer-customer-quotation">
                    <Footer />
                </div>
            </div>
        </>
    )
}
export default CustomerQuotation
