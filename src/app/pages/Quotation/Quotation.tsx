import { useEffect, useReducer, useRef, useState } from 'react'
import QuoteCard from '../../components/quotations/quoteCard'
import QuoteGrid from '../../components/quotations/quoteGridView'
import Questionnaire from '../../components/MCQ/questionnaire'
import { useGetQuotesMutation } from '../../redux/rtkQuerySlice/quotes/quotesEndPoint'
import { QuoteInputRequest, PremiumInput } from '../../models/PolicyMDL'
import { useAppSelector } from '../../hooks/reduxHooks'
import { AuthModel } from '../../redux/features/auth/authInterface'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

import { useTheme } from '@mui/material/styles'
import ChoosePlan from '../../components/quotations/choosePlan'
import {
    Badge,
    Box,
    Button,
    Chip,
    Collapse,
    Divider,
    Grid,
    InputAdornment,
    List,
    ListItemButton,
    ListItemText,
    Menu,
    MenuItem,
    Modal,
    Popover,
    Stack,
    TextField,
    Tooltip,
    Typography,Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'

import { useLazyGetAddonsQuery } from '../../redux/rtkQuerySlice/addOns/addOnEndPoint'
import LinearProgress from '@mui/material/LinearProgress'
import Addons from '../../components/addOns/addOnComponent'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { AddOnMDL } from '../../models/AddonMDL'
import common from '../../utils/common'
import Container from '@mui/material/Container'
import ChangeIDV from '../../components/idv/ChangeIDV'
import VehicleInfo from '../../components/vehicleDetailsData/vehicleDetails'
import { useLazyGetProposalDetailsQuery } from '../../redux/rtkQuerySlice/details/proposalDetailsEndPoint'
import React from 'react'
import AdditionalCovers from '../../components/quotations/additionalCovers/additionalCovers'
import IDVComponent from '../../components/quotations/idvComponent'
import { IProposal } from '../../models/IProposal'
import CompareQuotes from '../../components/quotations/compareQuotes'
import toast, { ToastPosition, Toaster } from 'react-hot-toast'
import { IDiscountsAndAdditionalCoversMDL } from '../../models/Discounts'
import { AdditionalCoversType } from '../../models/types/Quotations/additionalCovers'
import CompareIcon from '@mui/icons-material/Compare'
import SortIcon from '@mui/icons-material/Sort'
import ListIcon from '@mui/icons-material/List'
import GridViewIcon from '@mui/icons-material/GridView'
import { Connector } from '../../services/SignalR'
import {
    createSearchParams,
    useNavigate,
    useSearchParams
} from 'react-router-dom'
import { blue } from '@mui/material/colors'
import ArrowForward from '@mui/icons-material/ArrowForward'
import { BasePath } from '../../constants/baseURL'
import QuoteSkeleton from '../../components/quotations/quoteSkeleton'
import SendQuotation from '../../components/quotations/sendQuotation'
import { SendCustomerConsent } from '../../models/PolicyProposalMDL'
import { QuoteLists } from '../../models/PolicyMDL'
import {
    fetchQuotations,
    getAddons
} from '../../services/policyServices/quoteService'
import BackDropLoader from '../../components/common/backDropLoading'
import SuggestedAddOns from '../../components/quotations/addOns/suggestedAddons'
import { getProposalDetails } from '../../services/policyServices/proposerService'
import { IProposalModel } from '../../models/IProposalModel'
import { checkDealerMismatch } from '../../services/common/commonService'
import { decrypt, encrypt } from '../../utils/encryption'

function Quotation() {
    const [showMore, setShowMore] = useState(false)
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
    const [stateDrawer, setStateDrawer] = React.useState(false)

    const [openCompare, setOpenCompare] = React.useState(false)
    const [sortingMenu, setSortingMenu] = useState(false)
    const [toggleQuoteGridView, setToggleQuoteGridView] = useState(true)
    const [showLoading, setShowLoading] = useState(false)
    const [showSuggestedAddons, setShowSuggestedAddons] = useState(false)
    const [openDealerDialog, setOpenDealerDialog] = useState(false)

    const [quotesData, setQuotesData] = useState<QuoteLists>()
    const [preferredQuotesData, setPreferredQuotesData] = useState<QuoteLists>()

    //End UseStates

    let navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [showAddons, setShowAddons] = useState(false)
    const [AdditionalCoverSlide, setAdditionalCOvers] = useState(false)
    let ProposalId: string = searchParams.get('ProposalId').toString() || ''
    ProposalId = decrypt(ProposalId)
    const proposalInfo = {} as IProposal
    proposalInfo.ProposalId = ProposalId
    //BEGIN API CALLS

    // const [
    //     useGetQuotes,
    //     { isLoading: isQuotesLoading, data: quotesData, isSuccess }
    // ] = useGetQuotesMutation()

    // const [
    //     getProposalData,
    //     { isSuccess: IsProposalModelSuccess, data: proposalModel }
    // ] = useLazyGetProposalDetailsQuery()

    //END API CALLS
    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )
    const isSendQuoteButtonEnable = loginSelector.IsSendQuoteEnable
    //BEGIN USE REFS

    const AddOns = useRef<any>([])
    const discounts = useRef<IDiscountsAndAdditionalCoversMDL>(
        {} as IDiscountsAndAdditionalCoversMDL
    )

    const IDV = useRef<number>(0)
    const QuoteLoopCount = useRef<number>(0)

    const policyModel = new QuoteInputRequest()
    policyModel.DealerId = loginSelector.DealerId
    policyModel.UserID = loginSelector.UserId
    policyModel.ProposalId = ProposalId

    policyModel.additionalCoversandDiscounts = discounts.current
    policyModel.ReCalculateQuote = true

    // END USE REFS

    //ADDON API CALL
    // const [getAddons, { isLoading: isAddonsLoading, data: addOnsData }] =
    //     useLazyGetAddonsQuery()

    const [addOnsData, setAddOnsData] = useState<AddOnMDL[]>([])
    const [proposalModel, setProposalModel] = useState<IProposalModel>()

    const handleCompareClickOpen = () => {
        if (state.checkedQuotations.length > 1) {
            setOpenCompare(true)
        } else {
            toast.error('Please select at-least two ICs to compare.')
        }
    }
    const checkDealerMismatchFn = async () => {
        if (ProposalId != '' && ProposalId != 0) {
            let result = await checkDealerMismatch({
                ProposalId: ProposalId,
                DealerId: loginSelector.DealerId
            })
            if (result.ErrorCode == 0) {
                alert(result.ErrorMessage)
                navigate('/logout')
            }
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        checkDealerMismatchFn()
        getProposalData()
    }, [])

    const getProposalData = async () => {
        let data = await getProposalDetails(proposalInfo)
        setProposalModel(data)
        if (data != null) {
            await checkSelectedAddons(data)
            GetQuotes(data)
        }
    }



    const checkSelectedAddons = async (data: any) => {
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
            if (data != null && data.SelectedAddon != null && data.SelectedAddon.length > 0) {
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
                    //else {
                    //     x.isChecked = false
                    // }
                })
            }
            else {
                if (data.IsFirstPageRequest == 1 ) {
                    checkingSelectedAddons.forEach((y) => {
                        if (y.AddOnType == 'RSA') {
                            y.isChecked = true;
                        }
                        if(y.AddOnType == 'BAT'){
                            y.isChecked = true;
                        }
                    })
                }
            }
            setAddOnsData(checkingSelectedAddons)
            AddOns.current = checkingSelectedAddons
        }
    }

    const getAddonsFromAPI = async () => {
        policyModel.ProposalId = ProposalId
        let addons = await getAddons(policyModel)
        return addons
    }

    const useGetQuotes = async (policyModel) => {
        let quotes = await fetchQuotations(policyModel)
        let quotesModel: QuoteLists = {
            QuoteNo: quotes.QuoteNo,
            preferredQuoteList: [],
            quoteList: [],
            quoteFailedList: []
        }
        if (
            quotes?.quoteList?.length > 0 ||
            quotes?.quoteFailedList?.length > 0
        ) {
            QuoteLoopCount.current += 1
            if (QuoteLoopCount.current == 1) {
                //setShowLoading(false)
                //await getProposalData()
                let data = await getProposalDetails(proposalInfo)
                setProposalModel(data)
            }

            quotesModel.preferredQuoteList = quotes.quoteList.filter((x) => {
                return x.IsPreferredIC == 1
            })
            quotesModel.quoteList = quotes.quoteList.filter((x) => {
                return x.IsPreferredIC == 0
            })
            quotesModel.quoteFailedList = quotes.quoteFailedList
            //setShowLoading(false)
            if(policyModel.IsOnlineQuote == 0 && QuoteLoopCount.current == 1){
                 setShowLoading(false)
            }
            if (QuoteLoopCount.current == 3) {
                //toast.error('Quotation not found')
                setShowLoading(false)
            }
        } else {
            QuoteLoopCount.current += 1
            if(policyModel.IsOnlineQuote == 0 && QuoteLoopCount.current == 1){
                 setShowLoading(false)
            }
            if (QuoteLoopCount.current == 3) {
                toast.error('Quotation not found')
                setShowLoading(false)
            }
        }
        setQuotesData(quotesModel)
    }

    const GetQuotes = (proposalData) => {
        if (
            IDV.current <= 0 &&
            proposalModel != undefined &&
            proposalModel.CoverTypeId != 2
        ) {
            toast.error('IDV/Price cannot be Zero.')
            return
        }

        if (
            loginSelector.POSP_ID > 0 &&
            IDV.current > 5000000 &&
            proposalModel.CoverTypeId != 2
        ) {
            toast.error('IDV/Price cannot be greater than 50 Lakhs.')
            return
        }

        setShowLoading(true)
        if (checkAddonValidations()) {
            QuoteLoopCount.current = 0

            setQuotesData({
                quoteFailedList: [],
                quoteList: [],
                preferredQuoteList: []
            });

            let checkedAddons = AddOns.current
                .filter((x: any) => {
                    return x['isChecked'] == true
                })
                .map((x2: any) => {
                    return x2['AddOnTypeId']
                })
                .join(',')

            let checkedAddonsWithCoverValue = AddOns.current
                .filter((x: any) => {
                    return x['isChecked'] && x['IsCoverValue']
                })
                .map((x2: any) => {
                    return x2['AddOnType'] + '|' + x2['CoverValue']
                })
                .join(',')

            policyModel.AddOns =
                checkedAddons + ':' + checkedAddonsWithCoverValue
            policyModel.additionalCoversandDiscounts = discounts.current
            policyModel.IDVDiff = IDV.current
            policyModel.IsOnlineQuote = proposalData.IsOnlineQuote
            useGetQuotes(policyModel)

            setTimeout(() => {
                policyModel.ReCalculateQuote = false
                useGetQuotes(policyModel)
            }, 7000)
            if(proposalData.IsOnlineQuote==1){
                setTimeout(() => {
                    policyModel.ReCalculateQuote = false
                    useGetQuotes(policyModel)
                }, 20000)

            }
            
            dispatch({
                type: 'setCheckedQuotationsEmpty'
            })
        } else {
            setShowLoading(false)
        }
    }

    const checkAddonValidations = () => {
        let addOnValidated = true
        let RTICoverValidation = true
        let addonName = ''
        let addonCode = ''

        if (AddOns.current.length > 0) {
            AddOns.current.forEach((element) => {
                if (
                    element.isChecked &&
                    (element.AddOnType == 'RTI' ||
                        element.AddOnType == 'EMI') &&
                    element.CoverValue == ''
                ) {
                    addOnValidated = false
                    addonName = element.AddOnName
                    addonCode = element.AddOnType
                } else if (
                    element.isChecked &&
                    element.AddOnType == 'RTI' &&
                    element.CoverValue != ''
                ) {
                    if (parseInt(element.CoverValue) < IDV.current) {
                        toast.error('RTI Cover cannot be less than IDV')
                        RTICoverValidation = false
                    }
                }
            })
        }

        if (!addOnValidated) {
            document.getElementById(addonCode + '_Value').focus()
            toast.error('Please enter ' + addonName + ' value.')
        }
        if (addOnValidated) addOnValidated = RTICoverValidation

        return addOnValidated
    }

    const setAddons = (addons: any[]) => {
        AddOns.current = [...addons]
    }

    function sortBy(): void {
        let sortByType = sortOptionByPremium == 1 ? 2 : 1
        setSortOptionByPremium(sortByType)
        if (sortByType == 1) {
            let sortedData = quotesData.quoteList?.sort(
                (a, b) => a['GROSS_PREM'] - b['GROSS_PREM']
            )

            let sortedPreferredData = quotesData.preferredQuoteList?.sort(
                (a, b) => a['GROSS_PREM'] - b['GROSS_PREM']
            )
            const quoteData: QuoteLists = {
                quoteList: sortedData,
                preferredQuoteList: sortedPreferredData,
                quoteFailedList: quotesData.quoteFailedList
            }
            setQuotesData(quoteData)
        } else if (sortByType == 2) {
            let sortedData = quotesData.quoteList?.sort(
                (a, b) => b['GROSS_PREM'] - a['GROSS_PREM']
            )

            let sortedPreferredData = quotesData.preferredQuoteList?.sort(
                (a, b) => b['GROSS_PREM'] - a['GROSS_PREM']
            )
            const quoteData: QuoteLists = {
                quoteList: sortedData,
                preferredQuoteList: sortedPreferredData,
                quoteFailedList: quotesData.quoteFailedList
            }
            setQuotesData(quoteData)
        } else if (sortByType == 3) {
        }
    }

    function compare(a, b) {
        if (a.GROSS_PREM < b.GROSS_PREM) {
            return -1
        }
        if (a.GROSS_PREM > b.GROSS_PREM) {
            return 0
        }
        return 1
    }

    function setDiscounts(discountState: AdditionalCoversType) {
        discounts.current.IsAA = discountState.AA.checked
        discounts.current.IsAntiTheft = discountState.AntiTheft.checked

        discounts.current.VoluntaryExcess = discountState.VoluntaryExcess
            .checked
            ? discountState.VoluntaryExcess.value
            : 0
        discounts.current.Electrical = discountState.Electrical.checked
            ? discountState.Electrical.value
            : 0
        discounts.current.NonElectrical = discountState.NonElectrical.checked
            ? discountState.NonElectrical.value
            : 0
        discounts.current.BiFuel = discountState.BiFuel.checked
            ? discountState.BiFuel.value
            : 0
    }

    function setIDV(IDVSelected: number) {
        IDV.current = IDVSelected
    }

    const handleToggleGridView = (toggleType: boolean) => {
        setToggleQuoteGridView(toggleType)
    }

    const [sortOptionByPremium, setSortOptionByPremium] = useState(1)

    const handleBackButton = () => {
        navigate({
            pathname: '/createPolicy/',
            search: createSearchParams({
                ProposalId: encrypt(ProposalId.toString())
            }).toString()
        })
    }

    //Send Quote Model
    const [open, setOpen] = useState(false)
    const cancelButtonRef = useRef(null)
    const openSendModal = () => {
        setOpen(true)
        dispatch({ type: 'setCompareBottom', value: false })
    }
    const [isOpen, setIsOpen] = useState(true)
    const [selectedPackage, setSelectedPackage] = useState(null)
    function toggle() {
        setIsOpen((isOpen) => !isOpen)
    }

    const openSuggestedAddonsFn = () => {
        setShowSuggestedAddons(!showSuggestedAddons)
    }

    //END Send Quote Model
    const theme = useTheme()

    return (
        <>
        {
            QuoteLoopCount.current ==0 &&  <BackDropLoader openDialog={showLoading} />
        }
           
            <Container maxWidth={false} sx={{ px: 8 }} disableGutters>
                <div className="box-header with-border">
                    <h1 className="box-title flex items-center my-2">
                        {/* <svg
                            onClick={handleBackButton}
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
                        </svg> */}
                        <span className="ml-2">Quotation</span>
                    </h1>
                </div>
                <Grid container spacing={6} className="relative">
                    <button onClick={toggle} className="ToogleInfoButton">
                        {isOpen ? (
                            <svg
                                width="24"
                                height="70"
                                viewBox="0 0 24 70"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M-1 0H11C15.4183 0 19 3.58172 19 8V62C19 66.4183 15.4183 70 11 70H-1V0Z"
                                    fill="#333399"
                                />
                                <path
                                    d="M5.11079 51.7926L5.11079 53.1222C4.8267 53.1733 4.5767 53.2685 4.36079 53.4077C4.14489 53.5469 3.96165 53.7173 3.81108 53.919C3.66051 54.1207 3.54687 54.3466 3.47017 54.5966C3.39347 54.8438 3.35511 55.1065 3.35511 55.3849C3.35511 55.8878 3.48153 56.3381 3.73437 56.7358C3.98722 57.1307 4.35795 57.4432 4.84659 57.6733C5.33523 57.9006 5.93182 58.0142 6.63636 58.0142C7.34659 58.0142 7.94602 57.9006 8.43466 57.6733C8.92329 57.4432 9.29261 57.1293 9.54261 56.7315C9.79261 56.3338 9.91761 55.8864 9.91761 55.3892C9.91761 55.1136 9.88068 54.8523 9.80682 54.6051C9.73011 54.3551 9.6179 54.1293 9.47017 53.9276C9.32244 53.7259 9.14204 53.5554 8.92898 53.4162C8.71307 53.2741 8.46591 53.1761 8.1875 53.1222L8.19176 51.7926C8.62074 51.8636 9.01562 52.0014 9.37642 52.206C9.73437 52.4077 10.044 52.6676 10.3054 52.9858C10.5639 53.3011 10.7642 53.6619 10.9062 54.0682C11.0483 54.4744 11.1193 54.9176 11.1193 55.3977C11.1193 56.1534 10.9403 56.8267 10.5824 57.4176C10.2216 58.0085 9.70597 58.4744 9.03551 58.8153C8.36506 59.1534 7.56534 59.3224 6.63636 59.3224C5.70454 59.3224 4.90483 59.152 4.23722 58.8111C3.56676 58.4702 3.05256 58.0043 2.6946 57.4134C2.33381 56.8224 2.15341 56.1506 2.15341 55.3977C2.15341 54.9347 2.22017 54.5028 2.35369 54.1023C2.48437 53.6989 2.67756 53.3366 2.93324 53.0156C3.18608 52.6946 3.49574 52.429 3.86222 52.2188C4.22585 52.0085 4.64204 51.8665 5.11079 51.7926ZM11.1321 47.5621C11.1321 48.1758 10.9915 48.7113 10.7102 49.1687C10.429 49.6261 10.0355 49.9812 9.52983 50.234C9.02415 50.4869 8.43324 50.6133 7.7571 50.6133C7.07812 50.6133 6.48437 50.4869 5.97585 50.234C5.46733 49.9812 5.07244 49.6261 4.79119 49.1687C4.50994 48.7113 4.36932 48.1758 4.36932 47.5621C4.36932 46.9485 4.50994 46.413 4.79119 45.9556C5.07244 45.4982 5.46733 45.1431 5.97585 44.8903C6.48437 44.6374 7.07812 44.511 7.7571 44.511C8.43324 44.511 9.02415 44.6374 9.52983 44.8903C10.0355 45.1431 10.429 45.4982 10.7102 45.9556C10.9915 46.413 11.1321 46.9485 11.1321 47.5621ZM10.0625 47.5579C10.0625 47.1602 9.95739 46.8306 9.74716 46.5692C9.53693 46.3079 9.2571 46.1147 8.90767 45.9897C8.55824 45.8619 8.17329 45.7979 7.75284 45.7979C7.33523 45.7979 6.9517 45.8619 6.60227 45.9897C6.25 46.1147 5.96733 46.3079 5.75426 46.5692C5.54119 46.8306 5.43466 47.1602 5.43466 47.5579C5.43466 47.9585 5.54119 48.2908 5.75426 48.555C5.96733 48.8164 6.25 49.011 6.60227 49.1388C6.9517 49.2638 7.33523 49.3263 7.75284 49.3263C8.17329 49.3263 8.55824 49.2638 8.90767 49.1388C9.2571 49.011 9.53693 48.8164 9.74716 48.555C9.95739 48.2908 10.0625 47.9585 10.0625 47.5579ZM2.27273 41.8146H11V43.0888H2.27273V41.8146ZM2.27273 38.8264H11V40.1005H2.27273L2.27273 38.8264ZM11.1449 35.2074C11.1449 35.6222 11.0682 35.9972 10.9148 36.3324C10.7585 36.6676 10.5327 36.9332 10.2372 37.1293C9.94176 37.3224 9.57954 37.419 9.15057 37.419C8.78125 37.419 8.47727 37.348 8.23864 37.206C8 37.0639 7.81108 36.8722 7.67187 36.6307C7.53267 36.3892 7.42756 36.1193 7.35653 35.821C7.28551 35.5227 7.23153 35.2188 7.1946 34.9091C7.14915 34.517 7.11222 34.1989 7.08381 33.9545C7.05256 33.7102 7.00284 33.5327 6.93466 33.4219C6.86648 33.3111 6.75568 33.2557 6.60227 33.2557H6.57244C6.20028 33.2557 5.91193 33.3608 5.70739 33.571C5.50284 33.7784 5.40057 34.0881 5.40057 34.5C5.40057 34.929 5.49574 35.267 5.68608 35.5142C5.87358 35.7585 6.08239 35.9276 6.3125 36.0213L6.03977 37.2188C5.64204 37.0767 5.32102 36.8693 5.0767 36.5966C4.82954 36.321 4.65057 36.0043 4.53977 35.6463C4.42614 35.2884 4.36932 34.9119 4.36932 34.517C4.36932 34.2557 4.40057 33.9787 4.46307 33.6861C4.52273 33.3906 4.63352 33.1151 4.79545 32.8594C4.95739 32.6009 5.18892 32.3892 5.49006 32.2244C5.78835 32.0597 6.17614 31.9773 6.65341 31.9773H11V33.2216H10.1051V33.2727C10.2699 33.3551 10.4318 33.4787 10.5909 33.6435C10.75 33.8082 10.8821 34.0199 10.9872 34.2784C11.0923 34.5369 11.1449 34.8466 11.1449 35.2074ZM10.1222 34.9304C10.1222 34.5781 10.0526 34.277 9.91335 34.027C9.77415 33.7741 9.59233 33.5824 9.3679 33.4517C9.14062 33.3182 8.89773 33.2514 8.6392 33.2514H7.79545C7.84091 33.2969 7.88352 33.3849 7.92329 33.5156C7.96023 33.6435 7.9929 33.7898 8.02131 33.9545C8.04687 34.1193 8.07102 34.2798 8.09375 34.4361C8.11364 34.5923 8.13068 34.723 8.14489 34.8281C8.17614 35.0753 8.22869 35.3011 8.30256 35.5057C8.37642 35.7074 8.48295 35.8693 8.62216 35.9915C8.75852 36.1108 8.94034 36.1705 9.16761 36.1705C9.48295 36.1705 9.72159 36.054 9.88352 35.821C10.0426 35.5881 10.1222 35.2912 10.1222 34.9304ZM13.4545 30.2802H4.45454V29.0359H5.51562V28.9293C5.37926 28.8555 5.22159 28.7489 5.04261 28.6097C4.86364 28.4705 4.70739 28.2773 4.57386 28.0302C4.4375 27.783 4.36932 27.4563 4.36932 27.0501C4.36932 26.5217 4.50284 26.0501 4.76989 25.6353C5.03693 25.2205 5.42187 24.8952 5.92472 24.6594C6.42756 24.4208 7.03267 24.3015 7.74006 24.3015C8.44744 24.3015 9.05398 24.4194 9.55966 24.6552C10.0625 24.891 10.4503 25.2148 10.723 25.6268C10.9929 26.0387 11.1278 26.5089 11.1278 27.0373C11.1278 27.435 11.0611 27.7603 10.9276 28.0131C10.794 28.2631 10.6378 28.4592 10.4588 28.6012C10.2798 28.7433 10.1207 28.8526 9.98153 28.9293V29.006H13.4545V30.2802ZM7.72727 29.0316C8.1875 29.0316 8.59091 28.9648 8.9375 28.8313C9.28409 28.6978 9.5554 28.5046 9.75142 28.2518C9.9446 27.9989 10.0412 27.6893 10.0412 27.3228C10.0412 26.9421 9.94034 26.6239 9.73864 26.3683C9.53409 26.1126 9.2571 25.9194 8.90767 25.7887C8.55824 25.6552 8.16477 25.5884 7.72727 25.5884C7.29545 25.5884 6.90767 25.6538 6.56392 25.7844C6.22017 25.9123 5.94886 26.1055 5.75 26.364C5.55114 26.6197 5.4517 26.9393 5.4517 27.3228C5.4517 27.6921 5.54687 28.0046 5.73722 28.2603C5.92756 28.5131 6.19318 28.7049 6.53409 28.8356C6.875 28.9663 7.27273 29.0316 7.72727 29.0316ZM6.05256 17.9691L6.2571 19.1239C6.10937 19.1722 5.96875 19.2489 5.83523 19.3541C5.7017 19.4563 5.59233 19.5955 5.5071 19.7717C5.42187 19.9478 5.37926 20.168 5.37926 20.4322C5.37926 20.793 5.46023 21.0941 5.62216 21.3356C5.78125 21.5771 5.98722 21.6978 6.24006 21.6978C6.45881 21.6978 6.63494 21.6168 6.76847 21.4549C6.90199 21.293 7.01136 21.0316 7.09659 20.6708L7.33523 19.631C7.47443 19.0288 7.68892 18.5799 7.97869 18.2844C8.26847 17.989 8.64489 17.8413 9.10795 17.8413C9.5 17.8413 9.84943 17.9549 10.1562 18.1822C10.4602 18.4066 10.6989 18.7205 10.8722 19.1239C11.0455 19.5245 11.1321 19.989 11.1321 20.5174C11.1321 21.2504 10.9759 21.8484 10.6634 22.3114C10.348 22.7745 9.90057 23.0586 9.32102 23.1637L9.13352 21.9322C9.45454 21.8555 9.69744 21.6978 9.86222 21.4592C10.0241 21.2205 10.1051 20.9094 10.1051 20.5259C10.1051 20.1083 10.0185 19.7745 9.84517 19.5245C9.66903 19.2745 9.45454 19.1495 9.2017 19.1495C8.99716 19.1495 8.82528 19.2262 8.68608 19.3796C8.54687 19.5302 8.44176 19.7617 8.37074 20.0742L8.12784 21.1822C7.98864 21.793 7.76704 22.2447 7.46307 22.5373C7.15909 22.8271 6.77415 22.9719 6.30824 22.9719C5.92187 22.9719 5.58381 22.864 5.29403 22.6481C5.00426 22.4322 4.77841 22.1339 4.61648 21.7532C4.4517 21.3725 4.36932 20.9364 4.36932 20.445C4.36932 19.7376 4.52273 19.1808 4.82954 18.7745C5.13352 18.3683 5.54119 18.0998 6.05256 17.9691ZM11.1321 13.6193C11.1321 14.2642 10.9943 14.8196 10.7187 15.2855C10.4403 15.7486 10.0497 16.1065 9.54687 16.3594C9.04119 16.6094 8.44886 16.7344 7.76989 16.7344C7.09943 16.7344 6.50852 16.6094 5.99716 16.3594C5.48579 16.1065 5.08665 15.7543 4.79972 15.3026C4.51278 14.848 4.36932 14.3168 4.36932 13.7088C4.36932 13.3395 4.4304 12.9815 4.55256 12.6349C4.67472 12.2884 4.86648 11.9773 5.12784 11.7017C5.3892 11.4261 5.72869 11.2088 6.14631 11.0497C6.56108 10.8906 7.06534 10.8111 7.65909 10.8111H8.11079L8.11079 16.0142H7.15625V12.0597C6.82102 12.0597 6.52415 12.1278 6.26562 12.2642C6.00426 12.4006 5.79829 12.5923 5.64773 12.8395C5.49716 13.0838 5.42187 13.3707 5.42187 13.7003C5.42187 14.0582 5.50994 14.3707 5.68608 14.6378C5.85937 14.902 6.08665 15.1065 6.3679 15.2514C6.64631 15.3935 6.94886 15.4645 7.27557 15.4645H8.02131C8.45881 15.4645 8.83097 15.3878 9.13778 15.2344C9.4446 15.0781 9.67898 14.8608 9.84091 14.5824C10 14.304 10.0795 13.9787 10.0795 13.6065C10.0795 13.3651 10.0455 13.1449 9.97727 12.946C9.90625 12.7472 9.80114 12.5753 9.66193 12.4304C9.52273 12.2855 9.35085 12.1747 9.14631 12.098L9.36364 10.892C9.71875 10.9886 10.0298 11.1619 10.2969 11.4119C10.5611 11.6591 10.767 11.9702 10.9148 12.3452C11.0597 12.7173 11.1321 13.142 11.1321 13.6193Z"
                                    fill="white"
                                />
                                <path
                                    d="M16 27C17.0506 27 18.0909 27.2069 19.0615 27.609C20.0321 28.011 20.914 28.6003 21.6569 29.3432C22.3997 30.086 22.989 30.9679 23.391 31.9386C23.7931 32.9092 24 33.9495 24 35C24 36.0506 23.7931 37.0909 23.391 38.0615C22.989 39.0321 22.3997 39.914 21.6568 40.6569C20.9139 41.3998 20.032 41.989 19.0614 42.3911C18.0908 42.7931 17.0505 43 15.9999 43L16 35V27Z"
                                    fill="#333399"
                                />
                                <path
                                    d="M20 37.5901V32.4101C20 32.0151 19.565 31.7751 19.23 31.9901L15.16 34.5801C14.85 34.7751 14.85 35.2251 15.16 35.4251L19.23 38.0101C19.565 38.2251 20 37.9851 20 37.5901Z"
                                    fill="white"
                                />
                            </svg>
                        ) : (
                            <svg
                                width="25"
                                height="71"
                                viewBox="0 0 25 71"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0 0.234375H12C16.4183 0.234375 20 3.8161 20 8.23438V62.2344C20 66.6527 16.4183 70.2344 12 70.2344H0V0.234375Z"
                                    fill="#333399"
                                />
                                <path
                                    d="M12 55.7756H3.27273L3.27273 50.304H4.40625V54.4588H7.06534V50.5895H8.1946V54.4588H10.8665V50.2528H12V55.7756ZM5.45454 47.6417L8.00284 46.1971L5.45454 44.7397V43.3462L8.72727 45.3874L12 43.3292V44.7227L9.55398 46.1971L12 47.6673V49.065L8.72727 47.0281L5.45454 49.0394L5.45454 47.6417ZM14.4545 42.038H5.45454V40.7937H6.51562V40.6871C6.37926 40.6133 6.22159 40.5067 6.04261 40.3675C5.86364 40.2283 5.70739 40.0352 5.57386 39.788C5.4375 39.5408 5.36932 39.2141 5.36932 38.8079C5.36932 38.2795 5.50284 37.8079 5.76989 37.3931C6.03693 36.9783 6.42187 36.6531 6.92472 36.4173C7.42756 36.1786 8.03267 36.0593 8.74006 36.0593C9.44744 36.0593 10.054 36.1772 10.5597 36.413C11.0625 36.6488 11.4503 36.9727 11.723 37.3846C11.9929 37.7965 12.1278 38.2667 12.1278 38.7951C12.1278 39.1928 12.0611 39.5181 11.9276 39.771C11.794 40.021 11.6378 40.217 11.4588 40.359C11.2798 40.5011 11.1207 40.6104 10.9815 40.6871L10.9815 40.7639H14.4545V42.038ZM8.72727 40.7894C9.1875 40.7894 9.59091 40.7227 9.9375 40.5891C10.2841 40.4556 10.5554 40.2624 10.7514 40.0096C10.9446 39.7567 11.0412 39.4471 11.0412 39.0806C11.0412 38.6999 10.9403 38.3817 10.7386 38.1261C10.5341 37.8704 10.2571 37.6772 9.90767 37.5465C9.55824 37.413 9.16477 37.3462 8.72727 37.3462C8.29545 37.3462 7.90767 37.4116 7.56392 37.5423C7.22017 37.6701 6.94886 37.8633 6.75 38.1218C6.55114 38.3775 6.4517 38.6971 6.4517 39.0806C6.4517 39.4499 6.54687 39.7624 6.73722 40.0181C6.92756 40.271 7.19318 40.4627 7.53409 40.5934C7.875 40.7241 8.27273 40.7894 8.72727 40.7894ZM12.1449 32.7269C12.1449 33.1417 12.0682 33.5167 11.9148 33.8519C11.7585 34.1871 11.5327 34.4528 11.2372 34.6488C10.9418 34.842 10.5795 34.9386 10.1506 34.9386C9.78125 34.9386 9.47727 34.8675 9.23864 34.7255C9 34.5835 8.81108 34.3917 8.67187 34.1502C8.53267 33.9087 8.42756 33.6389 8.35653 33.3406C8.28551 33.0423 8.23153 32.7383 8.1946 32.4286C8.14915 32.0366 8.11222 31.7184 8.08381 31.4741C8.05256 31.2298 8.00284 31.0522 7.93466 30.9414C7.86648 30.8306 7.75568 30.7752 7.60227 30.7752H7.57244C7.20028 30.7752 6.91193 30.8803 6.70739 31.0906C6.50284 31.2979 6.40057 31.6076 6.40057 32.0195C6.40057 32.4485 6.49574 32.7866 6.68608 33.0337C6.87358 33.2781 7.08239 33.4471 7.3125 33.5408L7.03977 34.7383C6.64204 34.5962 6.32102 34.3889 6.0767 34.1161C5.82954 33.8406 5.65057 33.5238 5.53977 33.1658C5.42614 32.8079 5.36932 32.4315 5.36932 32.0366C5.36932 31.7752 5.40057 31.4982 5.46307 31.2056C5.52273 30.9102 5.63352 30.6346 5.79545 30.3789C5.95739 30.1204 6.18892 29.9087 6.49006 29.744C6.78835 29.5792 7.17614 29.4968 7.65341 29.4968H12V30.7411H11.1051V30.7923C11.2699 30.8746 11.4318 30.9982 11.5909 31.163C11.75 31.3278 11.8821 31.5394 11.9872 31.7979C12.0923 32.0565 12.1449 32.3661 12.1449 32.7269ZM11.1222 32.4499C11.1222 32.0977 11.0526 31.7965 10.9134 31.5465C10.7741 31.2937 10.5923 31.1019 10.3679 30.9712C10.1406 30.8377 9.89773 30.771 9.6392 30.771H8.79545C8.84091 30.8164 8.88352 30.9045 8.92329 31.0352C8.96023 31.163 8.9929 31.3093 9.02131 31.4741C9.04687 31.6389 9.07102 31.7994 9.09375 31.9556C9.11364 32.1119 9.13068 32.2425 9.14489 32.3477C9.17614 32.5948 9.22869 32.8207 9.30256 33.0252C9.37642 33.2269 9.48295 33.3889 9.62216 33.511C9.75852 33.6303 9.94034 33.69 10.1676 33.69C10.483 33.69 10.7216 33.5735 10.8835 33.3406C11.0426 33.1076 11.1222 32.8107 11.1222 32.4499ZM8.11364 26.5256H12V27.7997H5.45454V26.5767H6.51989V26.4957C6.1733 26.3452 5.89489 26.1094 5.68466 25.7884C5.47443 25.4645 5.36932 25.0568 5.36932 24.5653C5.36932 24.1193 5.46307 23.7287 5.65057 23.3935C5.83523 23.0582 6.1108 22.7983 6.47727 22.6136C6.84375 22.429 7.29687 22.3366 7.83665 22.3366H12V23.6108H7.99006C7.51562 23.6108 7.14489 23.7344 6.87784 23.9815C6.60795 24.2287 6.47301 24.5682 6.47301 25C6.47301 25.2955 6.53693 25.5582 6.66477 25.7884C6.79261 26.0156 6.98011 26.196 7.22727 26.3295C7.47159 26.4602 7.76704 26.5256 8.11364 26.5256ZM12.1278 18.1776C12.1278 18.706 11.9929 19.1776 11.723 19.5923C11.4503 20.0043 11.0625 20.3281 10.5597 20.5639C10.054 20.7969 9.44744 20.9134 8.74006 20.9134C8.03267 20.9134 7.42756 20.7955 6.92472 20.5597C6.42187 20.321 6.03693 19.9943 5.76989 19.5795C5.50284 19.1648 5.36932 18.6946 5.36932 18.169C5.36932 17.7628 5.4375 17.4361 5.57386 17.1889C5.70739 16.9389 5.86364 16.7457 6.04261 16.6094C6.22159 16.4702 6.37926 16.3622 6.51562 16.2855V16.2088H3.27273V14.9347H12V16.179H10.9815V16.2855C11.1207 16.3622 11.2798 16.473 11.4588 16.6179C11.6378 16.7599 11.794 16.956 11.9276 17.206C12.0611 17.456 12.1278 17.7798 12.1278 18.1776ZM11.0412 17.8963C11.0412 17.5298 10.9446 17.2202 10.7514 16.9673C10.5554 16.7117 10.2841 16.5185 9.9375 16.3878C9.59091 16.2543 9.1875 16.1875 8.72727 16.1875C8.27273 16.1875 7.875 16.2528 7.53409 16.3835C7.19318 16.5142 6.92756 16.706 6.73722 16.9588C6.54687 17.2116 6.4517 17.5241 6.4517 17.8963C6.4517 18.2798 6.55114 18.5994 6.75 18.8551C6.94886 19.1108 7.22017 19.304 7.56392 19.4347C7.90767 19.5625 8.29545 19.6264 8.72727 19.6264C9.16477 19.6264 9.55824 19.5611 9.90767 19.4304C10.2571 19.2997 10.5341 19.1065 10.7386 18.8509C10.9403 18.5923 11.0412 18.2742 11.0412 17.8963Z"
                                    fill="white"
                                />
                                <path
                                    d="M17 27.2344C18.0506 27.2344 19.0909 27.4413 20.0615 27.8433C21.0321 28.2454 21.914 28.8347 22.6569 29.5775C23.3997 30.3204 23.989 31.2023 24.391 32.1729C24.7931 33.1435 25 34.1838 25 35.2344C25 36.285 24.7931 37.3253 24.391 38.2959C23.989 39.2665 23.3997 40.1484 22.6568 40.8913C21.9139 41.6341 21.032 42.2234 20.0614 42.6254C19.0908 43.0275 18.0505 43.2344 16.9999 43.2344L17 35.2344V27.2344Z"
                                    fill="#333399"
                                />
                                <path
                                    d="M17 32.6443V37.8243C17 38.2193 17.435 38.4593 17.77 38.2443L21.84 35.6543C22.15 35.4593 22.15 35.0093 21.84 34.8093L17.77 32.2243C17.435 32.0093 17 32.2493 17 32.6443Z"
                                    fill="white"
                                />
                            </svg>
                        )}
                    </button>
                    {isOpen && (
                        <Grid item xs={12} md={3}>
                            <Stack
                                spacing={2}
                                paddingLeft={{ xs: 0, sm: 0, md: 4 }}
                            >
                                {proposalModel && (
                                    <VehicleInfo
                                        proposalData={proposalModel!}
                                        quotes={
                                            quotesData?.quoteList?.length == 0
                                                ? quotesData
                                                    ?.preferredQuoteList[0]
                                                : quotesData?.quoteFailedList
                                                    ?.length > 0
                                                    ? quotesData
                                                        ?.quoteFailedList[0]
                                                    : quotesData?.quoteList[0]
                                        }
                                        failedQuote={
                                            quotesData?.quoteFailedList[0]
                                        }
                                        QuoteNo={quotesData?.QuoteNo}
                                        callFrom={'QUOTE'}
                                        callFromCustomer={false}
                                        getQuote={() => {
                                    GetQuotes(proposalModel)
                                }}
                                        setIDV={setIDV}
                                        proposalModel={proposalModel}
                                    />
                                )}
                                {proposalModel &&
                                    proposalModel.CoverTypeId != 2 && (
                                        <div className="hidden md:block">
                                            <ChangeIDV
                                                proposalData={proposalModel!}
                                                getQuote={()=>GetQuotes(proposalModel)}
                                                setIDV={setIDV}
                                            />
                                        </div>
                                    )}

                                {addOnsData != null &&
                                    addOnsData.length > 0 &&
                                    proposalModel.CoverTypeId != 2 && (
                                        <>
                                            {/* <p
                                                onClick={() => {
                                                    openSuggestedAddonsFn()
                                                }}
                                                className="mt-2 capitalize	cursor-pointer text-[#1F81B9] text-xs font-medium	"
                                            >
                                                <span className="underline">
                                                    Suggested AddOn Packages
                                                </span>
                                            </p> */}
                                            <div className="hidden md:block">
                                                <Addons
                                                    proposalModel={
                                                        proposalModel
                                                    }
                                                    props={AddOns.current}
                                                    setCheckedAddons={setAddons}
                                                    // open={showSuggestedAddons}
                                                    setOpen={
                                                        setShowSuggestedAddons
                                                    }
                                                    setSelectedPackage={
                                                        setSelectedPackage
                                                    }
                                                // ProposalId={ProposalId}
                                                // open={showSuggestedAddons}
                                                // setOpen={setShowSuggestedAddons}
                                                // addOons={AddOns.current}
                                                // setAddoons={setAddOnsData}
                                                // selectedPackage={
                                                //     selectedPackage
                                                // }
                                                // onAction ={openSuggestedAddonsFn}
                                                ></Addons>
                                            </div>
                                            <SuggestedAddOns
                                                ProposalId={ProposalId}
                                                open={showSuggestedAddons}
                                                setOpen={setShowSuggestedAddons}
                                                addOns={AddOns.current}
                                                setAddons={setAddOnsData}
                                                setAddonsRef={setAddons}
                                                proposalModel={proposalModel}
                                                selectedPackage={
                                                    selectedPackage
                                                }
                                                setSelectedPackage={
                                                    setSelectedPackage
                                                }
                                            />
                                        </>
                                    )}
                                {proposalModel && (
                                    <AdditionalCovers
                                        setDiscounts={setDiscounts}
                                        setStateDrawer={setStateDrawer}
                                        stateDrawer={stateDrawer}
                                        updateQuote={()=>{GetQuotes(proposalModel)}}
                                        proposalModel={proposalModel}
                                        showAddons={showAddons}
                                        AdditionalCoverSlide={
                                            AdditionalCoverSlide
                                        }
                                        props={addOnsData}
                                        setCheckedAddons={setAddons}
                                        // open={showSuggestedAddons}
                                        setOpen={setShowSuggestedAddons}
                                        setSelectedPackage={setSelectedPackage}
                                    />
                                )}
                            </Stack>
                        </Grid>
                    )}
                    <Grid item xs={12} md={isOpen ? 9 : 12}>
                        <Box flexGrow={1} sx={{ width: '100%' }}>
                            <Box
                                sx={{ width: '100%' }}
                                paddingLeft={{ xs: 0, sm: 0, md: 4 }}
                            >
                                <Stack
                                    direction={'row'}
                                    spacing={2}
                                    sx={{
                                        margin: '.4rem 0 .4rem',
                                        paddingTop: '10px'
                                    }}
                                    className="overflow-x-auto"
                                >
                                    <Chip
                                        className="iconChips"
                                        sx={{
                                            borderRadius: '8px',
                                            background: '#ECF0F4',
                                            display: { xs: 'none', lg: 'flex' } // Show on desktop, hide on mobile
                                        }}
                                        onClick={() =>
                                            handleToggleGridView(false)
                                        }
                                        icon={
                                            <ListIcon
                                                sx={{
                                                    marginRight: '5px!important'
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
                                                    marginRight: '5px!important'
                                                }}
                                            />
                                        }
                                    />
                                    {proposalModel &&
                                        proposalModel.CoverTypeId != 2 && (
                                            <Chip
                                                sx={{
                                                    borderRadius: '8px',
                                                    background: '#ECF0F4'
                                                }}
                                                label="Additional Covers "
                                                onClick={() => {
                                                    setStateDrawer(true)
                                                    setAdditionalCOvers(true)
                                                    setShowAddons(false)
                                                }}
                                                onDelete={() => {
                                                    setStateDrawer(true)
                                                    setAdditionalCOvers(true)
                                                    setShowAddons(false)
                                                }}
                                                deleteIcon={
                                                    <ExpandMoreIcon
                                                        sx={{
                                                            display: {
                                                                xs: 'none',
                                                                lg: 'flex'
                                                            }
                                                        }}
                                                    />
                                                }
                                            />
                                        )}

                                    <Chip
                                        sx={{
                                            borderRadius: '8px',
                                            background: '#ECF0F4'
                                        }}
                                        className="lg:!hidden"
                                        label="Addons"
                                        onClick={() => {
                                            setStateDrawer(true)
                                            setShowAddons(true)
                                            setAdditionalCOvers(false)
                                        }}
                                        onDelete={() => {
                                            setStateDrawer(true)
                                            setShowAddons(true)
                                            setAdditionalCOvers(false)
                                        }}
                                        deleteIcon={
                                            <ExpandMoreIcon
                                                sx={{
                                                    display: {
                                                        xs: 'none',
                                                        lg: 'flex'
                                                    }
                                                }}
                                            />
                                        }
                                    />
                                    {((quotesData &&
                                        quotesData.quoteList != null &&
                                        quotesData.quoteList != undefined &&
                                        quotesData.quoteList.length > 0)||(quotesData && quotesData.preferredQuoteList != null &&
                                        quotesData.preferredQuoteList != undefined && quotesData.preferredQuoteList.length > 0)) && (
                                            <>
                                                <Badge
                                                    badgeContent={
                                                        state.checkedQuotations
                                                            .length
                                                    }
                                                    color="secondary"
                                                >
                                                    <Chip
                                                        className="customChip"
                                                        sx={{
                                                            borderRadius: '8px',
                                                            background:
                                                                '#ECF0F4'
                                                        }}
                                                        label={
                                                            <div className="iconText">
                                                                Compare
                                                            </div>
                                                        }
                                                        onClick={
                                                            handleCompareClickOpen
                                                        }
                                                        icon={<CompareIcon />}
                                                    />
                                                </Badge>

                                                <ChoosePlan
                                                    setOpenPopup={
                                                        setOpenCompare
                                                    }
                                                    state={state}
                                                    dispatch={dispatch}
                                                />

                                                <Chip
                                                    className="customChip"
                                                    sx={{
                                                        borderRadius: '8px',
                                                        background: '#ECF0F4',
                                                        cursor: 'pointer'
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
                                                    icon={<SortIcon />} // Always show icon
                                                // label={theme.breakpoints.up('sm') ? "Sorting" : ""} // Show label on desktop
                                                // icon={theme.breakpoints.down('xs') ? <SortIcon /> : null} // Show icon on mobile
                                                // label="Sorting"
                                                // icon={<SortIcon />} //deleteIcon={<ExpandMoreIcon />}
                                                />
                                                
                                                {proposalModel && proposalModel.PolicyType === 'N' && (proposalModel.CoverTypeId == 5 || proposalModel.CoverTypeId == 1 )&& (
                                                    <Chip
                                                        className="customChip"
                                                        sx={{
                                                            borderRadius: '8px',
                                                            background: '#ECF0F4',
                                                            cursor: 'pointer',
                                                            // display: 'none'
                                                        }}
                                                        label={<div className="iconText">Additional Information</div>}
                                                        onClick={() => setOpenDealerDialog(true)}
                                                        icon={<AssignmentIndIcon />}
                                                    />
                                                )}

                                            </>
                                        )}
                                </Stack>

                                {openDealerDialog && <Questionnaire onClose={() => setOpenDealerDialog(false)}  ProposalId={Number(ProposalId)} updateQuote={()=>{GetQuotes(proposalModel)}}/>}


                                {QuoteLoopCount.current < 2 &&
                                    QuoteLoopCount.current != 0 && (
                                        <div style={{ paddingBottom: '8px' }}> 
                                {/* <QuoteSkeleton />
                                            <QuoteSkeleton />  */}
                                <LinearProgress color="primary" />
                                        </div>
                                    )}
                                {/* //#region Preferred */}
                                {quotesData && (
                                    <>
                                        {!toggleQuoteGridView && (
                                            <>
                                                {quotesData.preferredQuoteList?.map(
                                                    (x, index) => {
                                                        return (
                                                            <Grid
                                                                key={index}
                                                                pt={1}
                                                                container
                                                            >
                                                                <QuoteCard
                                                                    quote={x}
                                                                    dispatch={
                                                                        dispatch
                                                                    }
                                                                    proposalModel={
                                                                        proposalModel
                                                                    }
                                                                    state={
                                                                        state
                                                                    }
                                                                    ProposalId={
                                                                        ProposalId
                                                                    }
                                                                    callFromCustomer={
                                                                        false
                                                                    }
                                                                    addOns={
                                                                        AddOns.current
                                                                    }
                                                                    isPreferredQuote={
                                                                        true
                                                                    }
                                                                />
                                                            </Grid>
                                                        )
                                                    }
                                                )}
                                                {quotesData.quoteList?.map(
                                                    (x, index) => {
                                                        return (
                                                            <Grid
                                                                key={index}
                                                                pt={1}
                                                                container={
                                                                    quotesData
                                                                        .preferredQuoteList
                                                                        .length >
                                                                        0
                                                                        ? false
                                                                        : true
                                                                }
                                                            >
                                                                <QuoteCard
                                                                    quote={x}
                                                                    dispatch={
                                                                        dispatch
                                                                    }
                                                                    proposalModel={
                                                                        proposalModel
                                                                    }
                                                                    state={
                                                                        state
                                                                    }
                                                                    ProposalId={
                                                                        ProposalId
                                                                    }
                                                                    callFromCustomer={
                                                                        false
                                                                    }
                                                                    addOns={
                                                                        AddOns.current
                                                                    }
                                                                    isPreferredQuote={
                                                                        false
                                                                    }
                                                                />
                                                            </Grid>
                                                        )
                                                    }
                                                )}
                                            </>
                                        )}
                                        {toggleQuoteGridView && (
                                            <Grid container spacing={6}>
                                                {quotesData.preferredQuoteList?.map(
                                                    (x, index) => {
                                                        return (
                                                            <Grid
                                                                key={index}
                                                                pt={1}
                                                                pb={2}
                                                                item
                                                                xs={12}
                                                                md={
                                                                    isOpen
                                                                        ? 4
                                                                        : 3
                                                                }
                                                            >
                                                                <QuoteGrid
                                                                    quote={x}
                                                                    proposalModel={
                                                                        proposalModel
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
                                                                    callFromCustomer={
                                                                        false
                                                                    }
                                                                    addOns={
                                                                        AddOns.current
                                                                    }
                                                                    isPreferredQuote={
                                                                        true
                                                                    }
                                                                />
                                                            </Grid>
                                                        )
                                                    }
                                                )}
                                                {quotesData.quoteList?.map(
                                                    (x, index) => {
                                                        return (
                                                            <Grid
                                                                key={index}
                                                                pt={1}
                                                                item
                                                                xs={12}
                                                                md={
                                                                    isOpen
                                                                        ? 4
                                                                        : 3
                                                                }
                                                            >
                                                                <QuoteGrid
                                                                    quote={x}
                                                                    proposalModel={
                                                                        proposalModel
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
                                                                    callFromCustomer={
                                                                        false
                                                                    }
                                                                    addOns={
                                                                        AddOns.current
                                                                    }
                                                                    isPreferredQuote={
                                                                        false
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
                                {/* //#endregion */}
                            </Box>

                            <SendQuotation
                                props={{ ProposalId, open, setOpen }}
                            ></SendQuotation>

                            <Stack
                                direction={'row'}
                                spacing={2}
                                justifyContent={'center'}
                                pb={2}
                                mt={4}
                            >
                                <Button
                                    variant="contained"
                                    onClick={handleBackButton}
                                    sx={{ margin: '16px 0' }}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={()=>GetQuotes(proposalModel)}
                                    sx={{ margin: '16px 0' }}
                                >
                                    Get Quote
                                </Button>
                                {quotesData &&
                                    quotesData.quoteList != null &&
                                    quotesData.quoteList != undefined &&
                                    quotesData.quoteList.length > 0 &&
                                    proposalModel?.IsSendQuoteEnable == 1 ? (
                                    <Button
                                        variant="contained"
                                        onClick={openSendModal}
                                        sx={{ margin: '16px 0', ml: 2 }}
                                        endIcon={<ArrowForward />}
                                    >
                                        Send Quote To Customer
                                    </Button>
                                ) : (
                                    <></>
                                )}
                            </Stack>

                            {quotesData &&
                                quotesData.quoteFailedList.length > 0 && (
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
                                                backgroundColor: '#b4d4e5a1'
                                            }}
                                        >
                                            <Stack
                                                direction={'row'}
                                                spacing={3}
                                            >
                                                <WarningAmberIcon />
                                                <Typography
                                                    sx={{
                                                        letterSpacing: '2px'
                                                    }}
                                                >
                                                    List of Insurers who have
                                                    not provided the quotes.
                                                </Typography>
                                            </Stack>
                                        </Box>
                                        <Stack direction={'row'}>
                                            {quotesData.quoteFailedList?.map(
                                                (x, index) => {
                                                    return (
                                                        <Tooltip
                                                            title={x['Remark']}
                                                            placement="top"
                                                        >
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
                                                        </Tooltip>
                                                    )
                                                }
                                            )}
                                        </Stack>
                                    </Box>
                                )}
                        </Box>
                        <CompareQuotes
                            checkedAddons={AddOns.current}
                            setOpenPopup={setOpenCompare}
                            selectedIcs={state.checkedQuotations}
                            openPopup={openCompare}
                            callFromCustomer={false}
                            proposalData={proposalModel!}
                        ></CompareQuotes>
                    </Grid>
                </Grid>
            </Container>

            <Toaster />
        </>
    )
}
export default Quotation
