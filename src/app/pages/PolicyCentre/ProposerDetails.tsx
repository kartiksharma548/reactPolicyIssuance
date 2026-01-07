import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import {
    createSearchParams,
    useNavigate,
    useSearchParams
} from 'react-router-dom'

import { useForm, SubmitHandler, Controller } from 'react-hook-form'

import { AuthModel } from '../../redux/features/auth/authInterface'
import { useAppSelector } from '../../hooks/reduxHooks'
import {
    ProposalInputModel,
    HardcodedValue,
    PincodeModel,
    CitySearchModel
} from '../../models/PolicyProposalMDL'
import { COMMON_API_URL } from '../../constants/apiURLS'
import { HARD_CODE_VALUE } from '../../constants/hardCode'

import {
    Box,
    Container,
    FormHelperText,
    IconButton,
    Stack,
    Tooltip
} from '@mui/material'
import Button from '@mui/material/Button'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import {
    FormControl,
    InputLabel,
    MenuItem,
    Typography,
    Grid,
    TextField,
    Checkbox,
    Accordion,
    AccordionDetails,
    AccordionSummary
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import PreviewIcon from '@mui/icons-material/Preview'
import ColorToggleButton from '../../components/common/groupToggleButton'
import {
    PolicyFinancerMDL,
    PolicyProposalMDL
} from '../../models/ProposarDetails'
import BasicDatePicker from '../../components/common/datepicker'
import dayjs, { Dayjs } from 'dayjs'
import {
    getDetailsMasters,
    getPinCodeStateWise,
    getActiveCity,
    submitProposerDetails,
    getProposalInfo,
    getPreviousPolicyNcbDetails
} from '../../services/policyServices/proposerService'
import { faLessThan } from '@fortawesome/free-solid-svg-icons'
import {
    GetMisps,
    GetPGTypes,
    getActiveBanks,
    getFinanciers,
    getPaymentMode
} from '../../services/masterService/masterService'
import { prototype } from 'events'
import common from '../../utils/common'
import { FormInputText } from '../../components/common/FormInputs/FormInputText'
import {
    PolicyProposalSchemaType,
    proposerDetails
} from '../../models/schemas/proposerDetailsSchema'

import { zodResolver } from '@hookform/resolvers/zod'
import { FormInputSelect } from '../../components/common/FormInputs/FormInputSelect'
import { FormInputRadio } from '../../components/common/FormInputs/FormInputRadio'
import FormInputDate from '../../components/common/FormInputs/FormInputDate'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { FormInputNumber } from '../../components/common/FormInputs/FormInputNumber'
import ConfirmDialog from '../../components/common/confirmDialog'
import BackDropLoader from '../../components/common/backDropLoading'
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone'
import { SearchMapFinanciers } from '../../components/proposerDetails/searchMapFinanciers'
import toast, { Toaster } from 'react-hot-toast'
import { checkDealerMismatch } from '../../services/common/commonService'
import { decrypt, encrypt } from '../../utils/encryption'

function ProposerDetails() {
    dayjs.extend(customParseFormat)
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    let ProposalId: string = searchParams.get('ProposalId').toString() || ''
    ProposalId = decrypt(ProposalId)
    const [date, setDate] = React.useState<Dayjs | null>(dayjs(new Date()))

    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )
    const ObjProposalInputModel = new ProposalInputModel()

    const ObjCitySearchModel = new CitySearchModel()

    ObjProposalInputModel.DealerId = loginSelector.DealerId

    ObjProposalInputModel.POLICY_TYPE = 'N'

    const objHardcodedValue = new HardcodedValue()
    objHardcodedValue.Field_Label = 'PaymentType'

    const objCustomerDetails = new PolicyProposalMDL()

    const [customerDetails, setCustomerDetails] = useState(objCustomerDetails)
    const [disabledTMIOtherTP, setDisabledTMIOtherTP] = useState(false)
    const [showDP, setShowDP] = useState(true)
    const [EMIAddon, setEMIAddon] = useState(false)
    const [aadhaarError, setAadhaarError] = useState('')
    const [panNo, setpanNo] = useState('')

    const GetProposalInfo = async () => {
        ObjProposalInputModel.ProposalId = ProposalId
        setShowLoading(true)
        let response = await getProposalInfo(ObjProposalInputModel)
        setShowLoading(false);
        debugger;
        if (response.status == 200) {
            const ProposalData = response.data

            const maskedMobile =
                ProposalData.ProposerDetails.MOB_NO.substring(0, 1) +
                'XXXXXXX' +
                ProposalData.ProposerDetails.MOB_NO.substr(-2)
            const maskedPan = common.isNotNullOrEmpty(
                ProposalData.ProposerDetails.PAN_NO
            )
                ? 'XXX' +
                ProposalData.ProposerDetails.PAN_NO.slice(3, -3) + 'XXX'
                : ''
            setpanNo(ProposalData.ProposerDetails.PAN_NO);
            if(ProposalData?.VehicleDetails?.POLICY_TYPE === 'R' &&
                ProposalData?.VehicleDetails?.RENEWAL_TYPE === '1')
                {
                ProposalData.ProposerDetails.PAN_NO = maskedPan
            }
            if (ProposalData.ProposerDetails.IC_ID != 9)
                ProposalData.ROAD_TAX_AMT = 0
            var proposerObj = {
                PROPOSER_TYPE: ProposalData.ProposerDetails.PROPOSAL_TYPE,
                APD_BALANCE:
                    ProposalData.APDdetails.APDBALANCE > -1
                        ? ProposalData.APDdetails.APDBALANCE
                        : 0,
                GROSS_PREM: ProposalData.VehicleDetails.GROSS_PREM,
                COMPANY_NAME: ProposalData.ProposerDetails.COMPANY_NAME,
                SALUTATION: ProposalData.ProposerDetails.SALUTATION,
                COMPANY_SALUTATION:
                    ProposalData.ProposerDetails.COMPANY_SALUTATION,
                FIRST_NAME: ProposalData.ProposerDetails.FIRST_NAME,
                MIDDLE_NAME: ProposalData.ProposerDetails.MIDDLE_NAME,
                LAST_NAME: ProposalData.ProposerDetails.LAST_NAME,
                EMAIL: ProposalData.ProposerDetails.EMAIL,
                MOB_NO: ProposalData.ProposerDetails.MOB_NO,
                ALT_MOBILE_NO: ProposalData.ProposerDetails.ALT_MOBILE_NO,
                STATE_ID: ProposalData.ProposerDetails.STATE_ID,
                CITY_ID: ProposalData.ProposerDetails.CITY_ID,
                PIN: parseInt(ProposalData.ProposerDetails.PIN),
                PAN_NO: ProposalData.ProposerDetails.PAN_NO,
                EI_ACCOUNT_NO:ProposalData.ProposerDetails.EI_ACCOUNT_NO,
                DOB: dayjs(
                    common.get_CheckBlankDate(ProposalData.ProposerDetails.DOB)
                ),
                DOI: dayjs(
                    common.get_CheckBlankDate(ProposalData.ProposerDetails.DOI)
                ),
                ADDRESS1: ProposalData.ProposerDetails.ADDRESS1,
                CPA_PREV_TENURE:
                    ProposalData.VehicleDetails.CPA_PREV_TENURE > 0 ? 1 : 0,
                Is_AppointeeRequired:
                    ProposalData.VehicleDetails.CPA_PREV_TENURE == 0
                        ? 0
                        : ProposalData.Nominees.NomineeAge < 18
                            ? 1
                            : 0,
                IS_AA_MEMBERSHIP: ProposalData.DiscountDetails.IS_AA_MEMBERSHIP,
                PAYMENT_MODE: ProposalData.PaymentDetails.PAYMENT_MODE,
                TP_TENURE_AVAILABLE:
                    parseInt(ProposalData.VehicleDetails.TPPACKAGE_TENURE) > 0
                        ? '1'
                        : '0',
                AgentID: ProposalData.SolicitationDetails.AgentID
            }

            if (ProposalData.PaymentDetails.PAYMENT_MODE == 'A') {
                setShowAPDBalance(true)
            } else {
                setShowAPDBalance(false)
            }

            let aaMonth = common.isNotNullOrEmpty(
                ProposalData.DiscountDetails.AACARD_EXPIRY_DATE
            )
                ? parseInt(
                    ProposalData.DiscountDetails.AACARD_EXPIRY_DATE.split(
                        '-'
                    )[0]
                )
                : ''
            let aaYear = common.isNotNullOrEmpty(
                ProposalData.DiscountDetails.AACARD_EXPIRY_DATE
            )
                ? ProposalData.DiscountDetails.AACARD_EXPIRY_DATE.split('-')[1]
                : ''

            ProposalData.DiscountDetails.AAMonth = aaMonth
            ProposalData.DiscountDetails.AAYear = aaYear
            let AA_Object = {
                MEMBERSHIP_NO:
                    ProposalData.DiscountDetails.MEMBERSHIP_NO.toString(),
                ASSOCIATION_NAME:
                    ProposalData.DiscountDetails.ASSOCIATION_NAME.toString(),
                AAMonth: common.get_CheckEmptyString(aaMonth),
                AAYear: common.get_CheckEmptyString(aaYear)
            }

            let ncbObject = {
                PREV_IS_VISOF_POLICY:
                    ProposalData.NcbCarryFrwrdDetails.PREV_IS_VISOF_POLICY.toString(),
                PREV_VEH_POLICY_NO:
                    ProposalData.NcbCarryFrwrdDetails.PREV_VEH_POLICY_NO,
                PREV_VEH_CHASSIS_NO:
                    ProposalData.NcbCarryFrwrdDetails.PREV_VEH_CHASSIS_NO,
                PREV_VEH_ENGINE_NO:
                    ProposalData.NcbCarryFrwrdDetails.PREV_VEH_ENGINE_NO,
                PREV_VEH_MODEL:
                    ProposalData.NcbCarryFrwrdDetails.PREV_VEH_MODEL,
                PREV_VEH_VARIANT_NO:
                    ProposalData.NcbCarryFrwrdDetails.PREV_VEH_VARIANT_NO,
                PREV_VEH_MAKE: ProposalData.NcbCarryFrwrdDetails.PREV_VEH_MAKE,
                PREV_VEH_MANU_YEAR:
                    ProposalData.NcbCarryFrwrdDetails.PREV_VEH_MANU_YEAR,
                PREV_VEH_POLICYSTARTDATE: dayjs(
                    ProposalData.NcbCarryFrwrdDetails.PREV_VEH_POLICYSTARTDATE
                ),

                PREV_VEH_NCB:
                    ProposalData.NcbCarryFrwrdDetails.PREV_VEH_NCB.toString(),
                PREV_VEH_INVOICEDATE: dayjs(
                    ProposalData.NcbCarryFrwrdDetails.PREV_VEH_INVOICEDATE
                ),
                PREV_VEH_POLICYENDDATE: dayjs(
                    ProposalData.NcbCarryFrwrdDetails.PREV_VEH_POLICYENDDATE
                ),
                PREV_VEH_NCB_EFFECTIVE_DATE: dayjs(
                    ProposalData.NcbCarryFrwrdDetails
                        .PREV_VEH_NCB_EFFECTIVE_DATE
                ),

                PRODUCT_NAME: ProposalData.NcbCarryFrwrdDetails.PRODUCT_NAME,
                PREV_VEH_POLICY_NONVISOF:
                    ProposalData.NcbCarryFrwrdDetails.PREV_VEH_POLICY_NONVISOF,
                PREV_VEH_REG_NO:
                    ProposalData.NcbCarryFrwrdDetails.PREV_VEH_REG_NO,
                PREV_VEH_IC: ProposalData.NcbCarryFrwrdDetails.PREV_VEH_IC,
                PREV_VEH_ISNCBCERTIFICATE:
                    ProposalData.NcbCarryFrwrdDetails.PREV_VEH_ISNCBCERTIFICATE,
                PREV_VEH_ADDRESS:
                    ProposalData.NcbCarryFrwrdDetails.PREV_VEH_ADDRESS,
                PREV_VEH_NCB_EFFECTIVE_DATE_NONVISOF: !common.isNotNullOrEmpty(
                    ProposalData.NcbCarryFrwrdDetails
                        .PREV_VEH_NCB_EFFECTIVE_DATE_NONVISOF
                )
                    ? null
                    : dayjs(
                        ProposalData.NcbCarryFrwrdDetails
                            .PREV_VEH_NCB_EFFECTIVE_DATE_NONVISOF
                    ),

                FromandToDateCheck: false,
                FromandToDateCheckForOtherTP: false,
                MFGYearAndNCBCert: false,
                FromAndInvoiceDateCheck: false,
                MFGYearAndInvoice: false
            }

            let CPA_Object = {
                NomineeAge:
                    ProposalData.Nominees.NomineeAge == 0
                        ? ''
                        : ProposalData.Nominees.NomineeAge,
                NomineeName: ProposalData.Nominees.NomineeName,
                NomineeRelation: ProposalData.Nominees.NomineeRelation,
                NomineeGender: ProposalData.Nominees.NomineeGender,
                AppointeeAge: ProposalData.Nominees.AppointeeAge,
                AppointeeRelation: ProposalData.Nominees.AppointeeRelation,
                AppointeeGender: ProposalData.Nominees.AppointeeGender,
                AppointeeName: ProposalData.Nominees.AppointeeName
            }

            let prevTpTenure = 1
            if (
                common.isNotNullOrEmpty(
                    ProposalData.ProposerDetails.PREV_TP_POLICY_EXPIRY_DATE
                ) &&
                common.isNotNullOrEmpty(
                    ProposalData.ProposerDetails.PREV_TP_POLICY_EFFECTIVE_DATE
                )
            ) {
                prevTpTenure = dayjs(
                    ProposalData.ProposerDetails.PREV_TP_POLICY_EXPIRY_DATE
                )
                    .add(1, 'day')
                    .diff(
                        dayjs(
                            ProposalData.ProposerDetails
                                .PREV_TP_POLICY_EFFECTIVE_DATE
                        ),
                        'year'
                    )
            }

            let otherTpDetails = {
                TP_POLICY_NO: common.get_CheckEmptyString(
                    ProposalData.ProposerDetails.TP_POLICY_NO
                ),
                PREV_TP_FKISURANCE_COMP_ID:
                    ProposalData.ProposerDetails.PREV_TP_FKISURANCE_COMP_ID,
                PREV_TP_POLICY_EFFECTIVE_DATE: dayjs(
                    common.get_CheckBlankDate(
                        ProposalData.ProposerDetails
                            .PREV_TP_POLICY_EFFECTIVE_DATE
                    )
                ),
                PREV_TP_POLICY_EXPIRY_DATE: common.isNotNullOrEmpty(
                    ProposalData.ProposerDetails.PREV_TP_POLICY_EXPIRY_DATE
                )
                    ? dayjs(
                        common.get_CheckBlankDate(
                            ProposalData.ProposerDetails
                                .PREV_TP_POLICY_EXPIRY_DATE
                        )
                    )
                    : dayjs(new Date()).add(1, 'year'),

                PREV_OTHER_TP_TENURE: prevTpTenure.toString()
            }

            let finObject = {
                AGGREMENT_TYPE: ProposalData.FinancerDetails.AGGREMENT_TYPE,
                FINANCER_ID: ProposalData.FinancerDetails.FINANCER_ID,
                FINANCER_NAME: ProposalData.FinancerDetails.FINANCER_NAME,
                BRANCH_NAME: ProposalData.FinancerDetails.BRANCH_NAME,
                BRANCH_CITY: ProposalData.FinancerDetails.BRANCH_CITY,

                FIN_BRANCH_ACCOUNT_NUMBER:
                    ProposalData.FinancerDetails.FIN_BRANCH_ACCOUNT_NUMBER
            }

            if (ProposalData.DiscountDetails.IS_NCB_CARRY_FORWARD == 0) {
                ncbObject = { ...ncbObject, PREV_IS_VISOF_POLICY: '2' }
            }
            proposerObj = {
                ...proposerObj,
                ...ncbObject,
                ...CPA_Object,
                ...AA_Object,
                ...otherTpDetails,
                ...finObject
            }
            if (
                ProposalData.ProposerDetails.TP_POLICY_NO != '' &&
                ProposalData.ProposerDetails.TP_POLICY_NO != null
            ) {
                setDisabledTMIOtherTP(true)
            }

            let gender = 'M'
            if (!common.isNotNullOrEmpty(ProposalData.ProposerDetails.GENDER)) {
                if (
                    ProposalData.ProposerDetails.SALUTATION.toUpperCase() ==
                    'MS.' ||
                    ProposalData.ProposerDetails.SALUTATION.toUpperCase() ==
                    'MRS.' ||
                    ProposalData.ProposerDetails.SALUTATION.toUpperCase() ==
                    'SHRI' ||
                    ProposalData.ProposerDetails.SALUTATION.toUpperCase() ==
                    'SMT.'
                ) {
                    gender = 'F'
                }
                ProposalData.ProposerDetails.GENDER = gender
            }
            debugger;
            setCustomerDetails({ ...customerDetails, ...ProposalData })
            reset(proposerObj)
            if (
                common.get_CheckEmptyString(
                    ProposalData.FinancerDetails.AGGREMENT_TYPE
                ) != '' &&
                ProposalData.FinancerDetails.AGGREMENT_TYPE == 'Hypothecation'
            ) {
                setValue('IS_HYPOTHECATION', '1')
                setValue('IS_AGREEMENT_TYPE', '0')
            } else if (
                common.get_CheckEmptyString(
                    ProposalData.FinancerDetails.AGGREMENT_TYPE
                ) != '' &&
                ProposalData.FinancerDetails.AGGREMENT_TYPE !=
                'Hypothecation' &&
                ProposalData.FinancerDetails.AGGREMENT_TYPE != '0'
            ) {
                setValue('IS_AGREEMENT_TYPE', '1')
                setValue('IS_HYPOTHECATION', '0')
            } else {
                setValue('IS_AGREEMENT_TYPE', '0')
                setValue('IS_HYPOTHECATION', '0')
            }

            const ObjPincodeModel = new PincodeModel()
            ObjPincodeModel.StateId = ProposalData.ProposerDetails.STATE_ID
            ObjPincodeModel.DealerId = loginSelector.DealerId
            //ObjPincodeModel.CityId = ProposalData.ProposerDetails.CITY_ID

            if (loginSelector.DEALER_TYPE == 'B') {
                unregister('AgentID')

                setShowDP(false)
            }

            GetMisp()
            GetPaymentMode(ProposalData)
            GetAllActiveBank()
            getPinCodeStateWiseFN(ObjPincodeModel)
            getActiveCityFN(ObjPincodeModel)
            GetFinanciers()
            GetPGType()

            let isEMIAddon = false
            for (let i = 0; i < ProposalData.AddonDetails.length; i++) {
                if (ProposalData.AddonDetails[i].ADDON_TYPE_ID === 17) {
                    isEMIAddon = true
                    setEMIAddon(true)
                    break
                }
            }
            if (isEMIAddon) {
                setValue('ISEMIADDON', '1')
            } else {
                setValue('ISEMIADDON', '0')
            }
        }
    }

    //#region Customer Details
    const [nomineeRelationList, setNomineeRelation] = React.useState([])
    const [agreementType, setAgreementType] = React.useState([])
    const [icList, setICList] = useState([])
    const [entitledNCBList, setEntitledNCBList] = useState([])

    let genderToggleObj = [
        {
            label: 'Male',
            obj: customerDetails.ProposerDetails,
            settingState: setCustomerDetails,
            type: 'M'
        },
        {
            label: 'Female',
            obj: customerDetails.ProposerDetails,
            settingState: setCustomerDetails,
            type: 'F'
        },
        {
            label: 'TransGender',
            obj: customerDetails.ProposerDetails,
            settingState: setCustomerDetails,
            type: 'T'
        }
    ]

    let otherTPTenureToggleObj = [
        {
            label: '1 year',

            type: '1'
        },
        {
            label: '3 year',

            type: '3'
        }
    ]

    const [salutation, setSalutation] = useState([])
    const [companySalutation, setCompanySalutation] = useState([])
    const [states, setStates] = React.useState([])
    const getDetailsMastersFN = async () => {
        setShowLoading(true)
        let masterData = await getDetailsMasters(ObjProposalInputModel)
        setShowLoading(false)
        if (masterData.status === 200) {
            const finalData = masterData.data
            setAgreementType(finalData.AgreementType)
            setAssociation(finalData.Association)
            setEntitledNCBList(finalData.EntitledNCBList.EntitledNCB)
            setICList(finalData.ICs.ICs)
            setNomineeRelation(finalData.NomineeRelation)
            setSalutation(finalData.Salutation)
            // setValue('SALUTATION', 'Mr.')
            setStates(finalData.States.States)

            let companySalutationArr = []

            companySalutationArr.push({ Text: 'LESSEE', Value: 'LESSEE' })
            companySalutationArr.push({ Text: 'M/S', Value: 'M/S' })
            companySalutationArr.push({ Text: 'THE', Value: 'THE' })

            setCompanySalutation(companySalutationArr)

            GetProposalInfo()
        }
    }

    const [pincode, setPinCode] = useState([])
    const getPinCodeStateWiseFN = async (ObjPincodeModel) => {
        let pincodeData = await getPinCodeStateWise(ObjPincodeModel)
        if (pincodeData.status === 200) {
            setPinCode(pincodeData.data.Pincode)
        }
    }

    ObjCitySearchModel.StateId = 9
    ObjCitySearchModel.RegionId = 0
    ObjCitySearchModel.ZoneId = 0
    const [city, setCity] = useState([])
    const getActiveCityFN = async (ObjPincodeModel) => {

        let cityData = await getActiveCity(ObjPincodeModel)
        if (cityData.status === 200) {
            setCity(cityData.data.Cities)
        }
    }
    //#endregion

    //#region AA Membership Details
    const [associationList, setAssociation] = useState([])
    //#endregion

    //#region NCB Carry Forward Details
    let prevPolToggleObj = [
        {
            label: 'TMIBASL Policy',
            obj: customerDetails,
            settingState: setCustomerDetails,
            type: '1'
        },
        {
            label: 'Non TMIBASL Policy',
            obj: customerDetails,
            settingState: setCustomerDetails,
            type: '0'
        }
    ]

    const currentDate = new Date()
    const startingYear =
        currentDate.getFullYear() - HARD_CODE_VALUE.PolicyYearCountStart_NCB

    let YOMNCB_CF = []

    for (
        let index = currentDate.getFullYear();
        index >= startingYear;
        index--
    ) {
        let obj = {
            value: index,
            text: index
        }
        YOMNCB_CF.push(obj)
    }

    type DropDownObj = {
        text: string
        value: number
    }
    const YOM_AA = useRef<DropDownObj[]>([])

    const setAAMonthYear = () => {
        for (let index = 0; index < 12; index++) {
            let val = new Date(2000, index, 1).toLocaleString('default', {
                month: 'short'
            })
            let obj: DropDownObj = {
                value: index + 1,
                text: val
            }
            YOM_AA.current.push(obj)
        }
    }

    const [aaError, setAAError] = useState('')
    const [nMfgYear, setNMfgYear] = useState('')
    const [nInvoiceDate, setNInvoiceDate] = useState('')
    const [nPolEffDate, setNPolEffDate] = useState('')
    const [nCertificateDate, setNCertificateDate] = useState('')
    const [nPolExpDate, setNPolExpDate] = useState('')
    const [apdValidation, setApdValidation] = useState('')
    //#endregion

    //#region Financier Details (Yes/No)
    const [financiersList, setFinanciersList] = React.useState([])
    const GetFinanciers = async () => {
        ObjProposalInputModel.DealerId = loginSelector.DealerId

        let response = await getFinanciers(ObjProposalInputModel)
        setFinanciersList(response.Financier)
    }
    //#endregion

    //#region Payment Mode Details
    const [paymentMode, setPaymentMode] = React.useState('')
    const [showChequeDetails, setShowChequeDetails] = React.useState(false)
    const [showBankDetails, setShowBankDetails] = React.useState(false)
    const [showPGType, setPGType] = React.useState(false)
    const [paymentModeList, setPaymentModeList] = React.useState([])
    const [activebankList, setActiveBankList] = React.useState([])
    const [pgTypeList, setPGTypeList] = React.useState([])
    const [showAPDBalance, setShowAPDBalance] = React.useState(false)

    const handlePaymentModeChange = (event: any) => {
        const mode = event.target.value
        setPaymentMode(mode)
        if (mode === 'I') {
            setShowChequeDetails(false)
            setShowBankDetails(false)
            setPGType(false)
            setShowAPDBalance(false)
        } else if (mode === 'G') {
            setShowChequeDetails(false)
            setShowBankDetails(false)
            setPGType(false)
            setShowAPDBalance(false)
        } else if (mode === 'A') {
            setShowChequeDetails(false)
            setShowBankDetails(false)
            setPGType(false)
            setShowAPDBalance(true)
        } else {
            setShowChequeDetails(false)
            setShowBankDetails(false)
            setPGType(false)
            setShowAPDBalance(false)
        }
    }

    const GetPaymentMode = async (ProposalData) => {
        ObjProposalInputModel.DealerId = loginSelector.DealerId
        ObjProposalInputModel.ProductId = ProposalData.ProposerDetails.IC_ID
        ObjProposalInputModel.POLICY_TYPE =
            ProposalData.VehicleDetails.POLICY_TYPE
        let response = await getPaymentMode(ObjProposalInputModel)

        setPaymentModeList(response.Payment)
    }
    const GetAllActiveBank = async () => {
        let response = await getActiveBanks()

        setActiveBankList(response.Banks)
    }

    const GetPGType = async () => {
        ObjProposalInputModel.DEALER_ID = loginSelector.DealerId

        let response = await GetPGTypes(ObjProposalInputModel)

        setPGTypeList(response)
    }

    const getDate = (Data: any, Name: any, nestedObject: any) => {
        const FormattedData = dayjs(Data).format('MM/DD/YYYY')

        if (
            Name == 'PREV_VEH_POLICYENDDATE' ||
            Name == 'PREV_VEH_POLICYSTARTDATE'
        ) {
            if (
                dayjs(control._formValues.PREV_VEH_POLICYENDDATE).isBefore(
                    dayjs(control._formValues.PREV_VEH_POLICYSTARTDATE)
                ) ||
                dayjs(control._formValues.PREV_VEH_POLICYENDDATE).isSame(
                    dayjs(control._formValues.PREV_VEH_POLICYSTARTDATE)
                )
            ) {
                setValue('FromandToDateCheck', undefined)
                trigger('FromandToDateCheck')
            } else if (
                dayjs(control._formValues.PREV_VEH_POLICYSTARTDATE).isBefore(
                    dayjs(control._formValues.PREV_VEH_INVOICEDATE)
                )
            ) {
                setValue('FromAndInvoiceDateCheck', undefined)
                trigger('FromAndInvoiceDateCheck')
            } else {
                setValue('FromandToDateCheck', true)
                setValue('FromAndInvoiceDateCheck', true)
                trigger(['FromandToDateCheck', 'FromAndInvoiceDateCheck'])
            }
        } else if (
            Name == 'PREV_TP_POLICY_EXPIRY_DATE' ||
            Name == 'PREV_TP_POLICY_EFFECTIVE_DATE'
        ) {
            if (
                dayjs(control._formValues.PREV_TP_POLICY_EXPIRY_DATE).isBefore(
                    dayjs(control._formValues.PREV_TP_POLICY_EFFECTIVE_DATE)
                )
            ) {
                setValue('FromandToDateCheckForOtherTP', undefined)
            } else {
                setValue('FromandToDateCheckForOtherTP', true)
                const otherTPExpiry = dayjs(
                    control._formValues['PREV_TP_POLICY_EFFECTIVE_DATE']
                )
                    .add(
                        parseInt(control._formValues['PREV_OTHER_TP_TENURE']),
                        'year'
                    )
                    .subtract(1, 'day')

                setValue('PREV_TP_POLICY_EXPIRY_DATE', otherTPExpiry)
                setCustomerDetails({
                    ...customerDetails,
                    ['ProposerDetails']: {
                        ...customerDetails['ProposerDetails'],
                        ['PREV_TP_POLICY_EXPIRY_DATE']:
                            otherTPExpiry.format('MM/DD/YYYY')
                    }
                })

                
            }
                
            
        } else if (Name == 'PREV_VEH_NCB_EFFECTIVE_DATE_NONVISOF') {
            if (
                dayjs(
                    control._formValues['PREV_VEH_NCB_EFFECTIVE_DATE_NONVISOF']
                ).isBefore(dayjs(control._formValues['PREV_VEH_INVOICEDATE']))
            ) {
                setValue('MFGYearAndNCBCert', undefined)
                trigger('MFGYearAndNCBCert')
            } else {
                setValue('MFGYearAndNCBCert', true)
                trigger('MFGYearAndNCBCert')
            }
        } else if (Name == 'PREV_VEH_INVOICEDATE') {
            if (
                dayjs(
                    control._formValues['PREV_VEH_NCB_EFFECTIVE_DATE_NONVISOF']
                ).isBefore(control._formValues['PREV_VEH_INVOICEDATE'])
            ) {
                setValue('MFGYearAndNCBCert', undefined)
                trigger('MFGYearAndNCBCert')
            } else {
                setValue('MFGYearAndNCBCert', true)
                trigger('MFGYearAndNCBCert')
            }

            if (
                dayjs(control._formValues['PREV_VEH_INVOICEDATE']).year() <
                control._formValues['PREV_VEH_MANU_YEAR']
            ) {
                setValue('MFGYearAndInvoice', undefined)
                trigger('MFGYearAndInvoice')
            } else {
                setValue('MFGYearAndInvoice', true)
                trigger('MFGYearAndInvoice')
            }
        }

        setCustomerDetails(prev=>({
             ...prev,
            [nestedObject]: {
                ...prev[nestedObject],
                [Name]: FormattedData
            }
        })
           
        )
        //setPolicyData({ ...policyData, PolicyDetails:{...policyData.PolicyDetails,[Name]: FormattedData }});
    }
    //#endregion

    //#region Solicitation Details
    const [mispList, setMisp] = React.useState([])
    const GetMisp = async () => {
        ObjProposalInputModel.DealerId = loginSelector.DealerId

        let response = await GetMisps(ObjProposalInputModel)
        setMisp(response.PosDpList.PoSPDP)
    }
    //#endregion

    //#region Handling onChange Event
    const handleNCBCarryChange = (event: any) => {
        const { target } = event
        const { name, value } = target
        if (name === 'PREV_VEH_ISNCBCERTIFICATE') {
            setCustomerDetails({
                ...customerDetails,
                NcbCarryFrwrdDetails: {
                    ...customerDetails.NcbCarryFrwrdDetails,
                    [name]: event.target.checked
                }
            })
        } else {
            setNMfgYear('')
            setNInvoiceDate('')
            setNPolEffDate('')
            setNCertificateDate('')
            setNPolExpDate('')
            if (name == 'PREV_VEH_MANU_YEAR') {
                if (
                    dayjs(
                        control._formValues[
                        'PREV_VEH_NCB_EFFECTIVE_DATE_NONVISOF'
                        ]
                    ).year() < control._formValues['PREV_VEH_MANU_YEAR']
                ) {
                    setValue('MFGYearAndNCBCert', undefined)
                    trigger('MFGYearAndNCBCert')
                } else {
                    setValue('MFGYearAndNCBCert', true)
                    trigger('MFGYearAndNCBCert')
                }

                if (
                    dayjs(control._formValues['PREV_VEH_INVOICEDATE']).year() <
                    control._formValues['PREV_VEH_MANU_YEAR']
                ) {
                    setValue('MFGYearAndInvoice', undefined)
                    trigger('MFGYearAndInvoice')
                } else {
                    setValue('MFGYearAndInvoice', true)
                    trigger('MFGYearAndInvoice')
                }
            }
            setCustomerDetails({
                ...customerDetails,
                NcbCarryFrwrdDetails: {
                    ...customerDetails.NcbCarryFrwrdDetails,
                    [name]: value
                }
            })
        }
    }
    const handleSolicitationChange = (event: SelectChangeEvent) => {
        const { target } = event
        const { name, value } = target
        setCustomerDetails({
            ...customerDetails,
            SolicitationDetails: {
                ...customerDetails.SolicitationDetails,
                [name]: value
            }
        })
    }
    const handlePayModeChange = (event: SelectChangeEvent) => {
        const { target } = event
        const { name, value } = target

        const mode = event.target.value
        setPaymentMode(mode)
        if (mode === 'I') {
            setShowChequeDetails(false)
            setShowBankDetails(false)
            setPGType(false)
            setShowAPDBalance(false)
        } else if (mode === 'G') {
            setShowChequeDetails(false)
            setShowBankDetails(false)
            setPGType(false)
            setShowAPDBalance(false)
        } else if (mode === 'A') {
            setShowChequeDetails(false)
            setShowBankDetails(false)
            setPGType(false)
            setShowAPDBalance(true)
        } else {
            setShowChequeDetails(false)
            setShowBankDetails(false)
            setPGType(false)
            setShowAPDBalance(false)
        }

        setCustomerDetails({
            ...customerDetails,
            PaymentDetails: { ...customerDetails.PaymentDetails, [name]: value }
        })
    }

    const handleNomineeChange = (event: SelectChangeEvent) => {
        const { target } = event
        const { name, value } = target

        if (name == 'NomineeAge') {
            if (parseInt(value) < 18) setValue('Is_AppointeeRequired', 1)
            else setValue('Is_AppointeeRequired', 0)
            if (parseInt(value) > 99) {
                setValue('NomineeAge', 0)
            }
        }
        if (name == 'NomineeName') {
            if (!common.isInputText(value)) {
                let newValue = value.substring(0, value.length - 1)
                setCustomerDetails({
                    ...customerDetails,
                    Nominees: { ...customerDetails.Nominees, [name]: newValue }
                })
                setValue('NomineeName', newValue)
                return
            }
        }
        if (name == 'AppointeeAge') {
            if (parseInt(value) > 60) {
                setValue('AppointeeAge', 0)
            }
        }
        setCustomerDetails({
            ...customerDetails,
            Nominees: { ...customerDetails.Nominees, [name]: value }
        })
    }

    const genderOptions = [
        { value: 'Male', text: 'Male' },
        { value: 'Female', text: 'Female' },
        { value: 'Transgender', text: 'Transgender' }
    ];

    const handleProposalChange = (event: any) => {
        const { target } = event
        const { name, value } = target
        if (
            (!isNaN(parseInt(event.target.value.slice(-1), 10)) ||
                !common.isNotNullOrEmpty(event.target.value)) &&
            name == 'ROAD_TAX_AMT'
        ) {
            setCustomerDetails({
                ...customerDetails,

                [name]: value
            })
        }
    }

    const [showFinancierDetails, setShowFinancierDetails] =
        React.useState(false)
    const handleFinancierChange = (event: any) => {
        const { target } = event
        const { name, value } = target
        if (name == 'AGGREMENT_TYPE') {
            if (value == 'Hypothecation') {
                setValue('IS_HYPOTHECATION', '1')
                setValue('IS_AGREEMENT_TYPE', '0')
                setValue('ISEMIADDON', '0')
                //setValue('')
            } else if (value == 0) {
                if (EMIAddon) {
                    setValue('ISEMIADDON', '1')
                }
                setValue('IS_AGREEMENT_TYPE', '0')
                setValue('IS_HYPOTHECATION', '0')
                //clearErrors(['FINANCER_ID'])

                const FinancierModel: PolicyFinancerMDL = {
                    FINANCER_ID: 0,
                    FINANCER_NAME: '',
                    BRANCH_NAME: '',
                    BRANCH_CITY: '',
                    AGGREMENT_TYPE: 0,
                    FIN_BRANCH_ACCOUNT_NUMBER: ''
                }

                setCustomerDetails({
                    ...customerDetails,
                    FinancerDetails: {
                        ...customerDetails.FinancerDetails,
                        ...FinancierModel
                    }
                })

                reset({
                    ...control._formValues,
                    ...FinancierModel
                    //...{ ISEMIADDON: '1' }
                })
                trigger(['AGGREMENT_TYPE'])

                return
            } else {
                //setValue('ISEMIADDON', '0')
                setValue('IS_HYPOTHECATION', '0')
                setValue('IS_AGREEMENT_TYPE', '1')

                const FinancierModel: PolicyFinancerMDL = {
                    BRANCH_NAME: '',
                    BRANCH_CITY: '',
                    FIN_BRANCH_ACCOUNT_NUMBER: '',
                    [name]: value
                }
                setCustomerDetails({
                    ...customerDetails,
                    FinancerDetails: {
                        ...customerDetails.FinancerDetails,
                        ...FinancierModel
                    }
                })
                reset({
                    ...control._formValues,
                    ...FinancierModel,
                    ...{ ISEMIADDON: '0' }
                })
                return
            }
        }

        setCustomerDetails({
            ...customerDetails,
            FinancerDetails: {
                ...customerDetails.FinancerDetails,
                [name]: value
            }
        })
    }
    const handleAssociationChange = (event: SelectChangeEvent) => {
        const { target } = event
        const { name, value } = target
        if (name == 'AAMonth' || name == 'AAYear') {
            let aaMonth =
                name == 'AAMonth'
                    ? value
                    : customerDetails.DiscountDetails.AAMonth
            let aaYear =
                name == 'AAYear'
                    ? value
                    : customerDetails.DiscountDetails.AAYear
            const month = dayjs(
                customerDetails.VehicleDetails.POLICY_EXPIRY_DATE
            ).month()
            let year = dayjs(
                customerDetails.VehicleDetails.POLICY_EXPIRY_DATE
            ).year()
            let policyExpMonthYear = dayjs(
                customerDetails.VehicleDetails.POLICY_EXPIRY_DATE
            ).format('MMM-YYYY')
            if (parseInt(aaYear) > year) {
                setAAError('')
            } else if (parseInt(aaYear) < year) {
                setAAError(
                    'AA Membership Year/Month should be greater than ' +
                    policyExpMonthYear
                )
            } else {
                if (year == parseInt(aaYear) && parseInt(aaMonth) < month + 1) {
                    setAAError(
                        'AA Membership Year/Month should be greater than ' +
                        policyExpMonthYear
                    )
                } else if (
                    year == parseInt(aaYear) &&
                    parseInt(aaMonth) == month + 1
                ) {
                    setAAError(
                        'AA Membership Year/Month can not be same' +
                        policyExpMonthYear
                    )
                } else {
                    setAAError('')
                }
            }
        }
        setCustomerDetails({
            ...customerDetails,
            DiscountDetails: {
                ...customerDetails.DiscountDetails,
                [name]: value
            }
        })
        console.log(customerDetails.DiscountDetails)
    }

    const [customMsg, setCustomMsg] = useState({
        CKCY_NO: '',EI_ACCOUNT_NO:''
    })
    const [errorFlag, setErrorFlag] = useState({
        CKYC_NO: false,EI_ACCOUNT_NO:false
    })

    const handleCustomerChange = (event: any) => {
        debugger;
        const { target } = event
        const { name, value } = target

        if (name == 'ADDRESS1' || name == 'ADDRESS2') {
            let lastChar = value.substr(-1)
            if ([';', '&', '~'].includes(lastChar)) {
                setCustomerDetails({
                    ...customerDetails,
                    ProposerDetails: {
                        ...customerDetails.ProposerDetails,
                        [name]: value.slice(0, -1)
                    }
                })
                setValue(name, value.slice(0, -1))
                return
            }
        }
        if (name == 'SALUTATION') {
            let gender = 'M'
            if (
                value.toUpperCase() == 'MS.' ||
                value.toUpperCase() == 'MRS.' ||
                value.toUpperCase() == 'SHRI' ||
                value.toUpperCase() == 'SMT.'
            ) {
                gender = 'F'
            }
            setCustomerDetails({
                ...customerDetails,
                ProposerDetails: {
                    ...customerDetails.ProposerDetails,
                    ['GENDER']: gender,
                    [name]: value
                }
            })
            return
        }
        if (name == 'AADHAAR_NO') {
            setAadhaarError('')
            if (isNaN(parseInt(event.target.value.slice(-1), 10))) {
                if (common.isNotNullOrEmpty(event.target.value)) return
            }
        }

        setCustomerDetails({
            ...customerDetails,
            ProposerDetails: {
                ...customerDetails.ProposerDetails,
                [name]: value
            }
        })

        if (name == 'STATE_ID') {
            const ObjPincodeModel = new PincodeModel()
            ObjPincodeModel.StateId = parseInt(value)
            ObjPincodeModel.DealerId = loginSelector.DealerId
            
            getActiveCityFN(ObjPincodeModel)
            getPinCodeStateWiseFN(ObjPincodeModel)
        }
        if (name == 'CKYC_NO') {
            let istrue = common.onlyAplaNumeric(event.target.value)
            if (istrue) {
                setCustomMsg({ ...customMsg, ['CKYC_NO']: '' })
                setErrorFlag({ ...errorFlag, ['CKYC_NO']: false })
            } else {
                setCustomerDetails({
                    ...customerDetails,
                    ProposerDetails: {
                        ...customerDetails.ProposerDetails,
                        ['CKYC_NO']: ''
                    }
                })
                setCustomMsg({
                    ...customMsg,
                    ['CKYC_NO']: 'Special character not allowed'
                })
                setErrorFlag({ ...errorFlag, ['CKYC_NO']: true })
            }
        }
        if (name == 'EI_ACCOUNT_NO') {
            let istrue = common.onlyAplaNumeric(event.target.value)
            if (istrue) {
                setCustomMsg({ ...customMsg, ['EI_ACCOUNT_NO']: '' })
                setErrorFlag({ ...errorFlag, ['EI_ACCOUNT_NO']: false })
            } else {
                setCustomerDetails({
                    ...customerDetails,
                    ProposerDetails: {
                        ...customerDetails.ProposerDetails,
                        ['EI_ACCOUNT_NO']: ''
                    }
                })
                setCustomMsg({
                    ...customMsg,
                    ['EI_ACCOUNT_NO']: 'Special character not allowed'
                })
                setErrorFlag({ ...errorFlag, ['EI_ACCOUNT_NO']: true })
            }
        }

        // if (name == 'CITY_ID') {
        //     const ObjPincodeModel = new PincodeModel()
        //     ObjPincodeModel.StateId = customerDetails.ProposerDetails.STATE_ID
        //     ObjPincodeModel.CityId = customerDetails.ProposerDetails.CITY_ID

        //     getPinCodeStateWiseFN(ObjPincodeModel)
        // }
    }
    //#endregion
    let BHSeriesData = [
        {
            label: 'Yes',
            obj: customerDetails,
            settingState: setCustomerDetails,
            type: 1
        },
        {
            label: 'No',
            obj: customerDetails,
            settingState: setCustomerDetails,
            type: 3
        },
        {
            label: 'Special Reg No.',
            obj: customerDetails,
            settingState: setCustomerDetails,
            type: 2
        }
    ]

    const getToggleButtonData = (data: any, name: any) => {
        let currentObjectKey = ''
        if (name === 'IS_BH_REGIST_NO' && data != false) {
            setCustomerDetails({ ...customerDetails, [name]: data })
        } else if (name === 'GENDER' && data != false) {
            currentObjectKey = 'ProposerDetails'
            if (
                !['MRS.', 'MS.', 'SHRI', 'SMT.'].includes(
                    customerDetails.ProposerDetails.SALUTATION
                ) &&
                data == 'F'
            ) {
                return
            }
            if (
                ['MRS.', 'MS.', 'SHRI', 'SMT.'].includes(
                    customerDetails.ProposerDetails.SALUTATION
                ) &&
                data == 'M'
            ) {
                return
            }
            setCustomerDetails({
                ...customerDetails,
                [currentObjectKey]: {
                    ...customerDetails[currentObjectKey],
                    [name]: data
                }
            })
        } else if (name === 'PREV_IS_VISOF_POLICY' && data != 'false') {
            currentObjectKey = 'NcbCarryFrwrdDetails'

            setCustomerDetails({
                ...customerDetails,
                [currentObjectKey]: {
                    ...customerDetails[currentObjectKey],
                    [name]: parseInt(data)
                }
            })
        } else if (name === 'PREV_OTHER_TP_TENURE') {
            setValue(
                'PREV_TP_POLICY_EXPIRY_DATE',
                dayjs(control._formValues['PREV_TP_POLICY_EFFECTIVE_DATE'])
                    .add(parseInt(data), 'year')
                    .add(-1, 'day')
            )
            customerDetails.ProposerDetails
            setCustomerDetails({
                ...customerDetails,
                ['ProposerDetails']: {
                    ...customerDetails.ProposerDetails,
                    ['PREV_TP_POLICY_EXPIRY_DATE']: dayjs(
                        control._formValues['PREV_TP_POLICY_EFFECTIVE_DATE']
                    )
                        .add(parseInt(data), 'year').add(-1, 'day')
                        .format('MM/DD/YYYY')
                }
            })
        }
    }

    //const vehno = customerDetails.VehicleDetails.VEH_REGIST_NO.split("-");
    //const RTOupper = vehno[0].toUpperCase();
    const handleBackButton = () => {
        navigate({
            pathname: '/Quotation/',
            search: createSearchParams({
                ProposalId: encrypt(ProposalId.toString())
            }).toString()
        })
    }

    //React Hook Form Initialization

    const {
        handleSubmit,
        control,
        setFocus,
        register,
        unregister,
        formState: { errors },
        setValue,
        clearErrors,
        setError,
        reset,
        trigger
    } = useForm<PolicyProposalSchemaType>({
        mode: 'all',
        resolver: zodResolver(proposerDetails),

        // reValidateMode: 'all',
        defaultValues: {
            PIN: 0,
            PREV_OTHER_TP_TENURE: '1',
            FINANCER_ID: 0,
            IS_AGREEMENT_TYPE: '0',
            IS_HYPOTHECATION: '0',
            FIN_BRANCH_ACCOUNT_NUMBER: '',
            BRANCH_NAME: '',
            BRANCH_CITY: '',
            AgentID: 0,
            SALUTATION: '',
            STATE_ID: 0,
            CITY_ID: 0,
            PAYMENT_MODE: '',
            COMPANY_SALUTATION: '',
            AAMonth: 0,
            ASSOCIATION_NAME: '',
            PREV_VEH_IC: 0,
            AppointeeRelation: '',
            AppointeeGender: '',
            NomineeRelation: '',
            NomineeGender: '',
            FKBANK_ID: 0,
            FromandToDateCheckForOtherTP: false,
            MIDDLE_NAME: '',
            LAST_NAME: '',
            DOI: '',
            ISEMIADDON: '0',
            AGGREMENT_TYPE: '0',
            EI_ACCOUNT_NO:''
        }

        // shouldUnregister: true
    })

    const onSubmit: SubmitHandler<PolicyProposalSchemaType> = async (data) => {   
        //Checking APD Validation
        if (
            customerDetails.APDdetails.APDBALANCE <
            customerDetails.VehicleDetails.GROSS_PREM &&
            showAPDBalance
        ) {
            if (customerDetails.APDdetails.APDBALANCE == -1) {
                setApdValidation(
                    'You have not created APD account yet. Please manage APD account balance before policy payment.'
                )
                return
            } else {
                setDialog({
                    ...dialog,
                    ['open']: true,
                    ['title']: 'Error',
                    ['content']:
                        'Insufficient APD Balance. Please manage APD account balance before policy payment.',
                    data: 'PREVIEW',
                    dialogType: 'alert'
                })
            }
        }
        if (customerDetails.DiscountDetails.IS_NCB_CARRY_FORWARD == 1 && customerDetails.NcbCarryFrwrdDetails.PREV_IS_VISOF_POLICY != '1') {
            setNMfgYear('')
            setNInvoiceDate('')
            setNPolEffDate('')
            setNCertificateDate('')
            setNPolExpDate('')
            const currentYear = new Date().getFullYear()
            if (data.PREV_VEH_MANU_YEAR == currentYear) {
                setNMfgYear(
                    'Year of manufacture should be less than current year.'
                )
                return
            }
            const ncbInvoiceDate = new Date(
                dayjs(
                    common.get_CheckBlankDate(data.PREV_VEH_INVOICEDATE)
                ).format('MM/DD/YYYY')
            )
            const isInvoideDateBefore =
                ncbInvoiceDate.getFullYear() < data.PREV_VEH_MANU_YEAR
            if (isInvoideDateBefore) {
                setNInvoiceDate(
                    'Invoice Date year cannot be less than Year of Manufacture.'
                )
                return
            }
            if (
                dayjs(
                    common.get_CheckBlankDate(data.PREV_VEH_POLICYSTARTDATE)
                ).isBefore(
                    dayjs(common.get_CheckBlankDate(data.PREV_VEH_INVOICEDATE))
                )
            ) {
                setNPolEffDate(
                    'Policy Period From Date can not be less than Invoice Date.'
                )
                return
            }
            const ncbCertificateDate = new Date(
                dayjs(
                    common.get_CheckBlankDate(
                        data.PREV_VEH_NCB_EFFECTIVE_DATE_NONVISOF
                    )
                ).format('MM/DD/YYYY')
            )
            const isNcbCertficateDateBefore =
                ncbCertificateDate.getFullYear() < data.PREV_VEH_MANU_YEAR
            if (isNcbCertficateDateBefore) {
                setNCertificateDate(
                    'NCB Certificate Issue Date year cannot be less than Year of Manufacture.'
                )
                return
            }
            const ncbPolicyExpDate = dayjs(
                dayjs(
                    common.get_CheckBlankDate(data.PREV_VEH_POLICYSTARTDATE)
                ).format('MM/DD/YYYY')
            )
                .add(1, 'year')
                .subtract(1, 'day')
            if (
                dayjs(
                    common.get_CheckBlankDate(data.PREV_VEH_POLICYENDDATE)
                ).format('MM/DD/YYYY') != ncbPolicyExpDate.format('MM/DD/YYYY')
            ) {
                setNPolExpDate('Policy Period cannot be less than 1 year.')
                return
            }
            if (
                dayjs(
                    common.get_CheckBlankDate(
                        data.PREV_VEH_NCB_EFFECTIVE_DATE_NONVISOF
                    )
                ).isBefore(dayjs(), 'day') ||
                dayjs(
                    common.get_CheckBlankDate(
                        data.PREV_VEH_NCB_EFFECTIVE_DATE_NONVISOF
                    )
                ).isSame(dayjs(), 'day')
            ) {
            } else {
                setNCertificateDate(
                    'NCB Certificate Issue Date should be less than today date.'
                )
                return
            }
        }
        customerDetails.DealerDetails.DEALER_ID = loginSelector.DealerId
        customerDetails.DealerDetails.DEALER_USER_ID = loginSelector.UserId
        
        //Checking AA Month Validation
        if (customerDetails.DiscountDetails.IS_AA_MEMBERSHIP == 1) {
            const month = new Date().getMonth()
            let year = new Date().getFullYear()
            if (
                year == parseInt(customerDetails.DiscountDetails.AAYear) &&
                parseInt(customerDetails.DiscountDetails.AAMonth) < month + 1
            ) {
                setAAError('Please select Valid Month.')
                return
            } else {
                setAAError('')
            }
        }

        if (customerDetails.ProposerDetails.AADHAAR_NO !== '') {
            const isAadhaarValid = /^[0-9]{4}$/.test(
                customerDetails.ProposerDetails.AADHAAR_NO
            )
            if (isAadhaarValid) {
                setAadhaarError('')
            } else {
                setAadhaarError("Aadhaar No can't be less than 4 digit.")
                return
            }
        }

        //Parsing Dates
        customerDetails.NcbCarryFrwrdDetails.PREV_VEH_NCB_EFFECTIVE_DATE =
            dayjs(
                common.get_CheckBlankDate(
                    customerDetails.NcbCarryFrwrdDetails
                        .PREV_VEH_NCB_EFFECTIVE_DATE
                )
            ).format('MM/DD/YYYY')
        customerDetails.NcbCarryFrwrdDetails.PREV_VEH_INVOICEDATE = dayjs(
            common.get_CheckBlankDate(
                customerDetails.NcbCarryFrwrdDetails.PREV_VEH_INVOICEDATE
            )
        ).format('MM/DD/YYYY')
        customerDetails.NcbCarryFrwrdDetails.PREV_VEH_NCB_EFFECTIVE_DATE_NONVISOF =
            dayjs(
                common.get_CheckBlankDate(
                    customerDetails.NcbCarryFrwrdDetails
                        .PREV_VEH_NCB_EFFECTIVE_DATE_NONVISOF
                )
            ).format('MM/DD/YYYY')
        customerDetails.NcbCarryFrwrdDetails.PREV_VEH_POLICYSTARTDATE = dayjs(
            common.get_CheckBlankDate(
                customerDetails.NcbCarryFrwrdDetails.PREV_VEH_POLICYSTARTDATE
            )
        ).format('MM/DD/YYYY')
        customerDetails.NcbCarryFrwrdDetails.PREV_VEH_POLICYENDDATE = dayjs(
            common.get_CheckBlankDate(
                customerDetails.NcbCarryFrwrdDetails.PREV_VEH_POLICYENDDATE
            )
        ).format('MM/DD/YYYY')

        if (customerDetails.ProposerDetails.DOB == 'yyyy-MM-dd') {
            setValue('DOB', false)
            customerDetails.ProposerDetails.DOB = ''
        } else {
            customerDetails.ProposerDetails.DOB = dayjs(
                common.get_CheckBlankDate(customerDetails.ProposerDetails.DOB)
            ).format('MM/DD/YYYY')
        }
        if (customerDetails.ProposerDetails.DOI == 'yyyy-MM-dd') {
            setValue('DOI', false)
            customerDetails.ProposerDetails.DOI = ''
        } else {
            if (customerDetails.ProposerDetails.PROPOSAL_TYPE == 'C' || common.isNotNullOrEmpty(
                        customerDetails.ProposerDetails.DOI
                    ))
                customerDetails.ProposerDetails.DOI = dayjs(
                    common.get_CheckBlankDate(
                        customerDetails.ProposerDetails.DOI
                    )
                ).format('MM/DD/YYYY')
        }

        customerDetails.PaymentDetails.CHEQUE_DATE = dayjs(
            common.get_CheckBlankDate(
                customerDetails.PaymentDetails.CHEQUE_DATE
            )
        ).format('MM/DD/YYYY')

        customerDetails.ProposerDetails.PREV_TP_POLICY_EFFECTIVE_DATE = dayjs(
            common.get_CheckBlankDate(
                customerDetails.ProposerDetails.PREV_TP_POLICY_EFFECTIVE_DATE
            )
        ).format('MM/DD/YYYY')

        customerDetails.ProposerDetails.PREV_TP_POLICY_EXPIRY_DATE = dayjs(
            common.get_CheckBlankDate(
                customerDetails.ProposerDetails.PREV_TP_POLICY_EXPIRY_DATE
            )
        ).format('MM/DD/YYYY')
        //customerDetails.NcbCarryFrwrdDetails.PREV_VEH_NCB_EFFECTIVE_DATE=dayjs(customerDetails.NcbCarryFrwrdDetails.PREV_VEH_NCB_EFFECTIVE_DATE).format('MM/DD/YYYY')

        // if (
        //     customerDetails.VehicleDetails.POLICY_TYPE == 'R' &&
        //     customerDetails.VehicleDetails.TPPACKAGE_TENURE.toString() == '0'
        // ) {
        //     const isNotValidTP = dayjs(
        //         customerDetails.VehicleDetails.POLICY_EFFECTIVE_DATE
        //     ).isBefore(
        //         dayjs(
        //             customerDetails.ProposerDetails.PREV_TP_POLICY_EXPIRY_DATE
        //         )
        //     )
        //     if (!isNotValidTP) {
        //         setDialog({
        //             ...dialog,
        //             ['open']: true,
        //             ['title']: 'Error',
        //             ['content']:
        //                 'Other TP Expiry Date cannot be less than Policy Effective Date.',
        //             data: null,
        //             dialogType: 'alert'
        //         })

        //         return
        //     }
        // }
        if (
            (customerDetails.ProposerDetails.PAN_NO == '' ||
                customerDetails.ProposerDetails.PAN_NO == null) &&
            (customerDetails.ProposerDetails.CKYC_NO == '' ||
                customerDetails.ProposerDetails.CKYC_NO == null) &&
            (customerDetails.ProposerDetails.AADHAAR_NO == '' ||
                customerDetails.ProposerDetails.AADHAAR_NO == null)
        ) {
            toast.error('Please select PAN No or Addhar No or CKYC No')
            return false
        }

        if (customerDetails.ProposerDetails.PAN_NO.toLowerCase().includes("xxx")){
            customerDetails.ProposerDetails.PAN_NO = panNo;
        }

        let customerDetailsObj = { ...customerDetails }
        if (customerDetails.FinancerDetails.AGGREMENT_TYPE != 'Hypothecation') {
            let FinancierModel: PolicyFinancerMDL = {
                BRANCH_NAME: '',
                BRANCH_CITY: '',
                FIN_BRANCH_ACCOUNT_NUMBER: ''
            }
            // setCustomerDetails({
            //     ...customerDetails,
            //     FinancerDetails: {
            //         ...customerDetails.FinancerDetails,
            //         ...FinancierModel
            //     }
            // })

            customerDetailsObj = {
                ...customerDetailsObj,
                ['FinancerDetails']: {
                    ...customerDetailsObj.FinancerDetails,
                    ...FinancierModel
                }
            }
        }
        if (
            customerDetails.ProposerDetails.MOB_NO ==
            customerDetails.ProposerDetails.ALT_MOBILE_NO
        ) {
            toast.error('Alternate Mobile No cannot be same as Mobile No.')
            return
        }
        setShowLoading(true)
        let response = await submitProposerDetails(customerDetailsObj)
        setShowLoading(false)
        if (response.status === 200) {
            if (response.data.ErrorCode == 1) {
                const Proposal_ID = response.data.ProposalID
                navigate({
                    pathname: '/preview/',
                    search: createSearchParams({
                        ProposalId: encrypt(Proposal_ID)
                    }).toString()
                })
            } else {
                setDialog({
                    ...dialog,
                    ['open']: true,
                    ['title']: 'Error',
                    ['content']: response.data.ErrorMessage,
                    data: null,
                    dialogType: 'alert'
                })
            }
        }
    }

    const getNCBDetails = async () => {
        let obj = {
            PolicyNo: customerDetails.NcbCarryFrwrdDetails.PREV_VEH_POLICY_NO
        }

        let data = await getPreviousPolicyNcbDetails(obj)
        if (data != null && data.PREV_VEH_IC != 0) {
            let ncbVisofObject = {
                KEY: 'NcbCarryFrwrdDetails',
                PREV_IS_VISOF_POLICY: '1',
                PREV_IS_NONVISOF_POLICY: data.PREV_IS_NONVISOF_POLICY,
                PREV_VEH_CHASSIS_NO: data.PREV_VEH_CHASSIS_NO,
                PREV_VEH_ENGINE_NO: data.PREV_VEH_ENGINE_NO,
                PREV_VEH_MODEL: data.PREV_VEH_MODEL,
                PREV_VEH_VARIANT_NO: data.PREV_VEH_VARIANT_NO,
                PREV_VEH_MAKE: data.PREV_VEH_MAKE,
                PREV_VEH_MANU_YEAR: data.PREV_VEH_MANU_YEAR,
                PREV_VEH_INVOICEDATE: data.PREV_VEH_INVOICEDATE,
                PREV_VEH_REG_NO: data.PREV_VEH_REG_NO,
                PREV_VEH_POLICY_NO:
                    customerDetails.NcbCarryFrwrdDetails.PREV_VEH_POLICY_NO,
                PREV_VEH_POLICY_NONVISOF: data.PREV_VEH_POLICY_NONVISOF,
                PREV_VEH_NCB: data.PREV_VEH_NCB,
                PREV_VEH_IC: data.PREV_VEH_IC,
                PREV_VEH_ISNCBCERTIFICATE: data.PREV_VEH_ISNCBCERTIFICATE,
                PREV_VEH_ADDRESS: data.PREV_VEH_ADDRESS,
                PREV_VEH_POLICYSTARTDATE: data.PREV_VEH_POLICYSTARTDATE,
                PREV_VEH_POLICYENDDATE: data.PREV_VEH_POLICYENDDATE,
                PREV_VEH_NCB_EFFECTIVE_DATE: data.PREV_VEH_NCB_EFFECTIVE_DATE,
                PREV_VEH_NCB_EFFECTIVE_DATE_NONVISOF:
                    data.PREV_VEH_NCB_EFFECTIVE_DATE_NONVISOF,
                PRODUCT_NAME: data.PRODUCT_NAME
            }

            setCustomerDetails({
                ...customerDetails,
                NcbCarryFrwrdDetails: { ...ncbVisofObject }
            })

            ncbVisofObject.PREV_VEH_NCB_EFFECTIVE_DATE = dayjs(
                common.get_CheckBlankDate(
                    ncbVisofObject.PREV_VEH_NCB_EFFECTIVE_DATE
                )
            )

            ncbVisofObject.PREV_VEH_INVOICEDATE = dayjs(
                common.get_CheckBlankDate(ncbVisofObject.PREV_VEH_INVOICEDATE)
            )

            ncbVisofObject.PREV_VEH_NCB_EFFECTIVE_DATE_NONVISOF = dayjs(
                common.get_CheckBlankDate(
                    ncbVisofObject.PREV_VEH_NCB_EFFECTIVE_DATE_NONVISOF
                )
            )

            ncbVisofObject.PREV_VEH_POLICYSTARTDATE = dayjs(
                common.get_CheckBlankDate(
                    ncbVisofObject.PREV_VEH_POLICYSTARTDATE
                )
            )

            ncbVisofObject.PREV_VEH_POLICYENDDATE = dayjs(
                common.get_CheckBlankDate(ncbVisofObject.PREV_VEH_POLICYENDDATE)
            )

            reset({ ...control._formValues, ...ncbVisofObject })
        } else {
            toast.error('Policy Details Not Found!')
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
        setAAMonthYear()

        getDetailsMastersFN()
    }, [])

    useEffect(() => {
        const firstError = Object.keys(errors).reduce((field, a) => {
            return !!errors[field] ? field : a
        }, null)

        if (firstError) {
            ;(
                document.querySelector(
                    `input[name="${firstError}"]`
                ) as HTMLInputElement | null
            )?.focus()
        }
    }, [errors, setFocus])

    const onConfirmDialogClose = (action: boolean, data: any) => {
        setDialog({ ...dialog, ['open']: false })
    }
    const [dialog, setDialog] = useState({
        open: false,
        content: '',
        title: '',
        data: {},
        onClose: onConfirmDialogClose,
        dialogType: 'alert'
    })

    const [showLoading, setShowLoading] = useState(false)
    const [mapFin, setMapFin] = useState(false)

    return (
        <>
            <BackDropLoader openDialog={showLoading} />
            <ConfirmDialog {...dialog} />
            <Toaster />
            <SearchMapFinanciers
                props={{ mapFin, setMapFin, GetFinanciers, financiersList }}
            ></SearchMapFinanciers>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box>
                    <Container maxWidth={false}>
                        <div className="content-wrapper">
                            <section className="content-header">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="box box-success">
                                            <div className="box-header with-border">
                                                <h1 className="box-title flex items-center my-2">
                                                    {/* <svg
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
                                                    <span className="ml-2">
                                                        Proposal Details
                                                    </span>
                                                </h1>
                                            </div>

                                            {/* Customer Details Section */}
                                            <Accordion
                                                defaultExpanded
                                                sx={{
                                                    backgroundColor:
                                                        'transparent',
                                                    border: '0px',
                                                    boxShadow: '0px 0px 0px',
                                                    marginBottom: '5px',
                                                    '&::before': {
                                                        backgroundColor:
                                                            'transparent'
                                                    },
                                                    '&::after': {
                                                        backgroundColor:
                                                            'transparent'
                                                    }
                                                }}
                                            >
                                                <AccordionSummary
                                                    expandIcon={
                                                        <ExpandMoreIcon />
                                                    }
                                                    aria-controls="panel2-content"
                                                    className="accordianHeading"
                                                    id="panel2-header"
                                                >
                                                    <svg
                                                        width="30"
                                                        height="30"
                                                        viewBox="0 0 30 30"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <rect
                                                            width="30"
                                                            height="30"
                                                            rx="15"
                                                            fill="white"
                                                        />
                                                        <path
                                                            d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                                                            stroke="#1C274C"
                                                            strokeWidth="1.5"
                                                        />
                                                        <path
                                                            d="M16 18C16 19.1046 16 20 12 20C8 20 8 19.1046 8 18C8 16.8954 9.79086 16 12 16C14.2091 16 16 16.8954 16 18Z"
                                                            stroke="#1C274C"
                                                            strokeWidth="1.5"
                                                        />
                                                        <path
                                                            d="M25 15C25 18.7712 25 20.6569 23.8284 21.8284C22.6569 23 20.7712 23 17 23H13C9.22876 23 7.34315 23 6.17157 21.8284C5 20.6569 5 18.7712 5 15C5 11.2288 5 9.34315 6.17157 8.17157C7.34315 7 9.22876 7 13 7H17C20.7712 7 22.6569 7 23.8284 8.17157C24.298 8.64118 24.5794 9.2255 24.748 10"
                                                            stroke="#1C274C"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                        />
                                                        <path
                                                            d="M22 15H18"
                                                            stroke="#8080DA"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                        />
                                                        <path
                                                            d="M22 12H17"
                                                            stroke="#8080DA"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                        />
                                                        <path
                                                            d="M22 18H19"
                                                            stroke="#8080DA"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                        />
                                                    </svg>
                                                    <span className="AccordianItem ml-3">
                                                        Proposer Details
                                                    </span>
                                                </AccordionSummary>
                                                <AccordionDetails
                                                    sx={{ border: '0px' }}
                                                >
                                                    <Box
                                                        sx={{
                                                            flexGrow: '1',
                                                            padding: '1rem 0'
                                                        }}
                                                    >
                                                        <Grid
                                                            container
                                                            spacing={4}
                                                            pb={4}
                                                        >
                                                            {customerDetails
                                                                .ProposerDetails
                                                                .PROPOSAL_TYPE ==
                                                                'C' && (
                                                                    <>
                                                                        <Grid
                                                                            item
                                                                            xs={12}
                                                                            md={4}
                                                                        >
                                                                            <FormInputSelect
                                                                                control={
                                                                                    control
                                                                                }
                                                                                name="COMPANY_SALUTATION"
                                                                                onChangeFn={
                                                                                    handleCustomerChange
                                                                                }
                                                                                label="Company Salutation"
                                                                                LIST={
                                                                                    companySalutation
                                                                                }
                                                                                TEXT="Text"
                                                                                VALUE="Value"
                                                                            />
                                                                        </Grid>

                                                                        <Grid
                                                                            item
                                                                            xs={12}
                                                                            md={4}
                                                                        >
                                                                            <FormInputText
                                                                                control={
                                                                                    control
                                                                                }
                                                                                name="COMPANY_NAME"
                                                                                onChangeFn={
                                                                                    handleCustomerChange
                                                                                }
                                                                                label="Company Name"
                                                                            />
                                                                        </Grid>
                                                                    </>
                                                                )}
                                                        </Grid>
                                                        <Grid
                                                            container
                                                            spacing={4}
                                                        >
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={2}
                                                                className="requiredField"
                                                            >
                                                                {salutation.length >
                                                                    0 && (
                                                                        <FormInputSelect
                                                                            control={
                                                                                control
                                                                            }
                                                                            name="SALUTATION"
                                                                            onChangeFn={
                                                                                handleCustomerChange
                                                                            }
                                                                            label="Salutation"
                                                                            LIST={
                                                                                salutation
                                                                            }
                                                                            TEXT="SalutationName"
                                                                            VALUE="SalutationName"
                                                                        />
                                                                    )}
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={4}
                                                            >
                                                                <FormInputText
                                                                    control={
                                                                        control
                                                                    }
                                                                    name="FIRST_NAME"
                                                                    onChangeFn={
                                                                        handleCustomerChange
                                                                    }
                                                                    inputProps={{
                                                                        style: {
                                                                            textTransform: 'uppercase'
                                                                        },
                                                                        maxLength: 50
                                                                    }}
                                                                    autoComplete="nope"
                                                                    label="First Name"
                                                                    className="requiredField"
                                                                />
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={3}
                                                            >
                                                                <FormInputText
                                                                    control={
                                                                        control
                                                                    }
                                                                    name="MIDDLE_NAME"
                                                                    onChangeFn={
                                                                        handleCustomerChange
                                                                    }
                                                                    inputProps={{
                                                                        style: {
                                                                            textTransform: 'uppercase'
                                                                        },
                                                                        maxLength: 50
                                                                    }}
                                                                    label="Middle Name"
                                                                //className="requiredField"
                                                                />
                                                                {/* <TextField
                                                                    fullWidth
                                                                    value={
                                                                        customerDetails
                                                                            .ProposerDetails
                                                                            .MIDDLE_NAME
                                                                    }
                                                                    onChange={
                                                                        handleCustomerChange
                                                                    }
                                                                    name="MIDDLE_NAME"
                                                                    label="Middle Name"
                                                                    variant="standard"
                                                                    placeholder="Middle Name"
                                                                    InputLabelProps={{
                                                                        shrink: true
                                                                    }}
                                                                /> */}
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={3}
                                                            >
                                                                <FormInputText
                                                                    control={
                                                                        control
                                                                    }
                                                                    name="LAST_NAME"
                                                                    onChangeFn={
                                                                        handleCustomerChange
                                                                    }
                                                                    inputProps={{
                                                                        style: {
                                                                            textTransform: 'uppercase'
                                                                        },
                                                                        maxLength: 50
                                                                    }}
                                                                    label="Last Name"
                                                                //className="requiredField"
                                                                />
                                                                {/* <TextField
                                                                    fullWidth
                                                                    value={
                                                                        customerDetails
                                                                            .ProposerDetails
                                                                            .LAST_NAME
                                                                    }
                                                                    onChange={
                                                                        handleCustomerChange
                                                                    }
                                                                    name="LAST_NAME"
                                                                    label="Last Name"
                                                                    variant="standard"
                                                                    placeholder="Last Name"
                                                                    InputLabelProps={{
                                                                        shrink: true
                                                                    }}
                                                                /> */}
                                                            </Grid>

                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={12}
                                                                sx={{
                                                                    mb: 1
                                                                }}
                                                                className="requiredField"
                                                            >
                                                                <ColorToggleButton
                                                                    defaultSelected={
                                                                        customerDetails
                                                                            .ProposerDetails
                                                                            .GENDER
                                                                    }
                                                                    value={
                                                                        customerDetails
                                                                            .ProposerDetails
                                                                            .GENDER
                                                                    }
                                                                    toggleButton={
                                                                        getToggleButtonData
                                                                    }
                                                                    options={{
                                                                        ...genderToggleObj
                                                                    }}
                                                                    label="Gender"
                                                                    name="GENDER"
                                                                />
                                                            </Grid>

                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={4}
                                                                className="requiredField"
                                                            >
                                                                {control
                                                                    ._formValues[
                                                                    'PROPOSER_TYPE'
                                                                ] == 'C' && (
                                                                        <FormInputDate
                                                                            control={
                                                                                control
                                                                            }
                                                                            nestedObject={
                                                                                'ProposerDetails'
                                                                            }
                                                                            name="DOI"
                                                                            onChangeFn={
                                                                                getDate
                                                                            }
                                                                            label="Date of Incorporation"
                                                                        />
                                                                    )}{' '}
                                                                {control
                                                                    ._formValues[
                                                                    'PROPOSER_TYPE'
                                                                ] == 'I' && (
                                                                        <FormInputDate
                                                                            control={
                                                                                control
                                                                            }
                                                                            nestedObject={
                                                                                'ProposerDetails'
                                                                            }
                                                                            name="DOB"
                                                                            onChangeFn={
                                                                                getDate
                                                                            }
                                                                            label="Date of Birth"
                                                                        />
                                                                    )}
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={4}
                                                            >
                                                                <FormInputText
                                                                    control={
                                                                        control
                                                                    }
                                                                    name="EMAIL"
                                                                    disabled={
                                                                        true
                                                                    }
                                                                    onChangeFn={
                                                                        handleCustomerChange
                                                                    }
                                                                    label="Email ID"
                                                                    className="requiredField"
                                                                />
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={4}
                                                            >
                                                                <FormInputNumber
                                                                    control={
                                                                        control
                                                                    }
                                                                    disabled={
                                                                        true
                                                                    }
                                                                    name="MOB_NO"
                                                                    onChangeFn={
                                                                        handleCustomerChange
                                                                    }
                                                                    label="Mobile No."
                                                                    className="requiredField"
                                                                />
                                                            </Grid>

                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={4}
                                                            >
                                                                <FormInputNumber
                                                                    control={
                                                                        control
                                                                    }
                                                                    inputProps={{
                                                                        maxLength: 10
                                                                    }}
                                                                    name="ALT_MOBILE_NO"
                                                                    onChangeFn={
                                                                        handleCustomerChange
                                                                    }
                                                                    label="Alternate Mobile No."
                                                                />
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={4}
                                                            >
                                                                <FormInputText
                                                                    control={
                                                                        control
                                                                    }
                                                                    name="ADDRESS1"
                                                                    onChangeFn={
                                                                        handleCustomerChange
                                                                    }
                                                                    label="Address Line 1"
                                                                    className="requiredField"
                                                                    inputProps={{ maxLength: 50, minLength: 5 }}
                                                                />
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={4}
                                                            >
                                                                <TextField
                                                                    fullWidth
                                                                    value={
                                                                        customerDetails
                                                                            .ProposerDetails
                                                                            .ADDRESS2
                                                                    }
                                                                    onChange={
                                                                        handleCustomerChange
                                                                    }
                                                                    name="ADDRESS2"
                                                                    label="Address Line 2"
                                                                    variant="standard"
                                                                    placeholder="Address Line 2"
                                                                    inputProps={{ maxLength: 50 }}
                                                                    InputLabelProps={{
                                                                        shrink: true
                                                                    }}
                                                                />
                                                            </Grid>

                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={4}
                                                            >
                                                                <TextField
                                                                    fullWidth
                                                                    value={
                                                                        customerDetails
                                                                            .ProposerDetails
                                                                            .ADDRESS3
                                                                    }
                                                                    onChange={
                                                                        handleCustomerChange
                                                                    }
                                                                    name="ADDRESS3"
                                                                    label="Landmark"
                                                                    variant="standard"
                                                                    placeholder="Landmark"
                                                                    InputLabelProps={{
                                                                        shrink: true
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={4}
                                                                id="divstatevalidate"
                                                            >
                                                                {states.length >
                                                                    0 && (
                                                                        <FormInputSelect
                                                                            control={
                                                                                control
                                                                            }
                                                                            name="STATE_ID"
                                                                            onChangeFn={
                                                                                handleCustomerChange
                                                                            }
                                                                            label="State"
                                                                            LIST={
                                                                                states
                                                                            }
                                                                            TEXT="StateName"
                                                                            VALUE="StateId"
                                                                            className="requiredField"
                                                                        />
                                                                    )}
                                                            </Grid>
                                                            {city.length >
                                                                0 && (
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        md={4}
                                                                        id="divcityvalidate"
                                                                    >
                                                                        <FormInputSelect
                                                                            control={
                                                                                control
                                                                            }
                                                                            name="CITY_ID"
                                                                            onChangeFn={
                                                                                handleCustomerChange
                                                                            }
                                                                            label="City"
                                                                            LIST={
                                                                                city
                                                                            }
                                                                            TEXT="CityName"
                                                                            VALUE="CityId"
                                                                            className="requiredField"
                                                                        />
                                                                    </Grid>
                                                                )}

                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={4}
                                                                id="divPINvalidate"
                                                            >
                                                                <FormInputSelect
                                                                    control={
                                                                        control
                                                                    }
                                                                    name="PIN"
                                                                    onChangeFn={
                                                                        handleCustomerChange
                                                                    }
                                                                    label="Pincode"
                                                                    LIST={
                                                                        pincode
                                                                    }
                                                                    TEXT="PinCode"
                                                                    VALUE="PinCode"
                                                                    className="requiredField"
                                                                />
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={4}
                                                            >
                                                                <FormInputText
                                                                    control={
                                                                        control
                                                                    }
                                                                    name="PAN_NO"
                                                                    onChangeFn={
                                                                        handleCustomerChange
                                                                    }

                                                                    disabled={
                                                                        customerDetails?.VehicleDetails?.POLICY_TYPE === 'R' &&
                                                                        customerDetails?.VehicleDetails?.RENEWAL_TYPE === '1' &&
                                                                        !!customerDetails.ProposerDetails.AADHAAR_NO1
                                                                    }

                                                                    label="PAN No."
                                                                    inputProps={{
                                                                        style: {
                                                                            textTransform:
                                                                                'uppercase'
                                                                        },
                                                                        maxLength: 10
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={4}
                                                            >
                                                                <InputLabel>
                                                                    Aadhar No
                                                                </InputLabel>
                                                                <Grid
                                                                    container
                                                                    spacing={2}
                                                                >
                                                                    <Grid
                                                                        item
                                                                        xs={4}
                                                                        md={4}
                                                                    >
                                                                        <TextField
                                                                            disabled={
                                                                                true
                                                                            }
                                                                            id="AadhaarCard0"
                                                                            value={
                                                                                'xxxx'
                                                                            }
                                                                            variant="standard"
                                                                            placeholder="XXXX"
                                                                            inputProps={{
                                                                                readOnly:
                                                                                    true,
                                                                                maxLength: 4
                                                                            }}
                                                                            disabled={
                                                                                customerDetails?.VehicleDetails?.POLICY_TYPE === 'R' &&
                                                                                customerDetails?.VehicleDetails?.RENEWAL_TYPE === '1'
                                                                            }
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                        />
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={4}
                                                                        md={4}
                                                                    >
                                                                        <TextField
                                                                            id="AadhaarCard1"
                                                                            variant="standard"
                                                                            value={
                                                                                'xxxx'
                                                                            }
                                                                            placeholder="XXXX"
                                                                            inputProps={{
                                                                                maxLength: 4
                                                                            }}
                                                                            disabled={
                                                                                true
                                                                            }
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                        />
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={4}
                                                                        md={4}
                                                                    >
                                                                        <TextField
                                                                            fullWidth
                                                                            value={
                                                                                customerDetails
                                                                                    .ProposerDetails
                                                                                    .AADHAAR_NO
                                                                            }
                                                                            onChange={
                                                                                handleCustomerChange
                                                                            }
                                                                            name="AADHAAR_NO"
                                                                            variant="standard"
                                                                            placeholder="Aadhaar No."
                                                                            inputProps={{
                                                                                maxLength: 4
                                                                            }}
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            disabled={
                                                                                customerDetails?.VehicleDetails?.POLICY_TYPE === 'R' &&
                                                                                customerDetails?.VehicleDetails?.RENEWAL_TYPE === '1' &&
                                                                                !!customerDetails.ProposerDetails.AADHAAR_NO0
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                                {aadhaarError !=
                                                                    '' && (
                                                                        <FormHelperText
                                                                            sx={{
                                                                                color: 'red'
                                                                            }}
                                                                        >
                                                                            {
                                                                                aadhaarError
                                                                            }
                                                                        </FormHelperText>
                                                                    )}
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={4}
                                                            >
                                                                <TextField
                                                                    fullWidth
                                                                    value={
                                                                        customerDetails
                                                                            .ProposerDetails
                                                                            .EI_ACCOUNT_NO
                                                                    }
                                                                    onChange={
                                                                        handleCustomerChange
                                                                    }
                                                                    name="EI_ACCOUNT_NO"
                                                                    label="EI Account No"
                                                                    variant="standard"
                                                                    placeholder="Enter EI Account No"
                                                                    InputLabelProps={{
                                                                        shrink: true
                                                                    }}
                                                                    inputProps={{
                                                                        maxLength: 15
                                                                    }}
                                                                    error={
                                                                        errorFlag.EI_ACCOUNT_NO
                                                                    }
                                                                    helperText={
                                                                        customMsg.EI_ACCOUNT_NO
                                                                    }
                                                                    disabled={
                                                                        customerDetails?.VehicleDetails?.POLICY_TYPE === 'R' &&
                                                                        customerDetails?.VehicleDetails?.RENEWAL_TYPE === '1'
                                                                    }
                                                                />
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={4}
                                                            >
                                                                <TextField
                                                                    fullWidth
                                                                    value={
                                                                        customerDetails
                                                                            .ProposerDetails
                                                                            .CKYC_NO
                                                                    }
                                                                    onChange={
                                                                        handleCustomerChange
                                                                    }
                                                                    name="CKYC_NO"
                                                                    label="CKYC No."
                                                                    variant="standard"
                                                                    placeholder="Enter CKYC No."
                                                                    InputLabelProps={{
                                                                        shrink: true
                                                                    }}
                                                                    inputProps={{
                                                                        maxLength: 20
                                                                    }}
                                                                    error={
                                                                        errorFlag.CKYC_NO
                                                                    }
                                                                    helperText={
                                                                        customMsg.CKYC_NO
                                                                    }
                                                                    disabled={
                                                                        customerDetails?.VehicleDetails?.POLICY_TYPE === 'R' &&
                                                                        customerDetails?.VehicleDetails?.RENEWAL_TYPE === '1'
                                                                    }
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            md={12}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    mt: 3
                                                                }}
                                                                variant="body2"
                                                                className="red"
                                                            >
                                                                Note: Please
                                                                provide either
                                                                PAN or Aadhaar
                                                                or CKYC No. for
                                                                KYC Verification
                                                                process
                                                            </Typography>
                                                        </Grid>
                                                    </Box>
                                                </AccordionDetails>
                                            </Accordion>

                                            {/* AA Membership Section */}
                                            {customerDetails.DiscountDetails
                                                .IS_AA_MEMBERSHIP == 1 && (
                                                    <Accordion
                                                        defaultExpanded
                                                        sx={{
                                                            backgroundColor:
                                                                'transparent',
                                                            border: '0px',
                                                            boxShadow:
                                                                '0px 0px 0px',
                                                            marginBottom: '5px',
                                                            '&::before': {
                                                                backgroundColor:
                                                                    'transparent'
                                                            },
                                                            '&::after': {
                                                                backgroundColor:
                                                                    'transparent'
                                                            }
                                                        }}
                                                    >
                                                        <AccordionSummary
                                                            expandIcon={
                                                                <ExpandMoreIcon />
                                                            }
                                                            aria-controls="panel2-content"
                                                            className="accordianHeading"
                                                            id="panel2-header"
                                                        >
                                                            <svg
                                                                width="30"
                                                                height="30"
                                                                viewBox="0 0 30 30"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <rect
                                                                    width="30"
                                                                    height="30"
                                                                    rx="15"
                                                                    fill="white"
                                                                />
                                                                <path
                                                                    d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                                                                    stroke="#1C274C"
                                                                    strokeWidth="1.5"
                                                                />
                                                                <path
                                                                    d="M16 18C16 19.1046 16 20 12 20C8 20 8 19.1046 8 18C8 16.8954 9.79086 16 12 16C14.2091 16 16 16.8954 16 18Z"
                                                                    stroke="#1C274C"
                                                                    strokeWidth="1.5"
                                                                />
                                                                <path
                                                                    d="M25 15C25 18.7712 25 20.6569 23.8284 21.8284C22.6569 23 20.7712 23 17 23H13C9.22876 23 7.34315 23 6.17157 21.8284C5 20.6569 5 18.7712 5 15C5 11.2288 5 9.34315 6.17157 8.17157C7.34315 7 9.22876 7 13 7H17C20.7712 7 22.6569 7 23.8284 8.17157C24.298 8.64118 24.5794 9.2255 24.748 10"
                                                                    stroke="#1C274C"
                                                                    strokeWidth="1.5"
                                                                    strokeLinecap="round"
                                                                />
                                                                <path
                                                                    d="M22 15H18"
                                                                    stroke="#8080DA"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                />
                                                                <path
                                                                    d="M22 12H17"
                                                                    stroke="#8080DA"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                />
                                                                <path
                                                                    d="M22 18H19"
                                                                    stroke="#8080DA"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                />
                                                            </svg>
                                                            <span className="AccordianItem ml-3">
                                                                AA Membership
                                                                Details
                                                            </span>
                                                        </AccordionSummary>
                                                        <AccordionDetails
                                                            sx={{
                                                                border: '0px'
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    flexGrow: '1',
                                                                    padding:
                                                                        '1rem 0'
                                                                }}
                                                            >
                                                                <Grid
                                                                    container
                                                                    spacing={4}
                                                                >
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        md={4}
                                                                        className="requiredField"
                                                                    >
                                                                        <FormInputSelect
                                                                            control={
                                                                                control
                                                                            }
                                                                            name="ASSOCIATION_NAME"
                                                                            onChangeFn={
                                                                                handleAssociationChange
                                                                            }
                                                                            label="Association
                                                                    Name"
                                                                            LIST={
                                                                                associationList
                                                                            }
                                                                            VALUE="AssociationValue"
                                                                            TEXT="AssociationValue"
                                                                        />
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        md={4}
                                                                    >
                                                                        <FormInputText
                                                                            control={
                                                                                control
                                                                            }
                                                                            name="MEMBERSHIP_NO"
                                                                            onChangeFn={
                                                                                handleAssociationChange
                                                                            }
                                                                            label="Membership No."
                                                                            className="requiredField"
                                                                        />
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        md={2}
                                                                    >
                                                                        <>
                                                                            <FormInputSelect
                                                                                control={
                                                                                    control
                                                                                }
                                                                                name="AAMonth"
                                                                                onChangeFn={
                                                                                    handleAssociationChange
                                                                                }
                                                                                label="Validity Month"
                                                                                LIST={
                                                                                    YOM_AA.current
                                                                                }
                                                                                VALUE="value"
                                                                                TEXT="text"
                                                                                className="requiredField"
                                                                            />

                                                                            {aaError !=
                                                                                '' && (
                                                                                    <FormHelperText
                                                                                        sx={{
                                                                                            color: 'red'
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            aaError
                                                                                        }
                                                                                    </FormHelperText>
                                                                                )}
                                                                        </>
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        md={2}
                                                                    >
                                                                        <FormInputText
                                                                            control={
                                                                                control
                                                                            }
                                                                            name="AAYear"
                                                                            onChangeFn={
                                                                                handleAssociationChange
                                                                            }
                                                                            label="Year"
                                                                            className="requiredField"
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            </Box>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                )}

                                            {customerDetails.VehicleDetails.TPPACKAGE_TENURE.toString() ==
                                                '0' && (
                                                    <Accordion
                                                        defaultExpanded
                                                        sx={{
                                                            backgroundColor:
                                                                'transparent',
                                                            border: '0px',
                                                            boxShadow:
                                                                '0px 0px 0px',
                                                            marginBottom: '5px',
                                                            '&::before': {
                                                                backgroundColor:
                                                                    'transparent'
                                                            },
                                                            '&::after': {
                                                                backgroundColor:
                                                                    'transparent'
                                                            }
                                                        }}
                                                    >
                                                        <AccordionSummary
                                                            expandIcon={
                                                                <ExpandMoreIcon />
                                                            }
                                                            aria-controls="panel2-content"
                                                            className="accordianHeading"
                                                            id="panel2-header"
                                                        >
                                                            <svg
                                                                width="30"
                                                                height="30"
                                                                viewBox="0 0 30 30"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <rect
                                                                    width="30"
                                                                    height="30"
                                                                    rx="15"
                                                                    fill="white"
                                                                />
                                                                <path
                                                                    d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                                                                    stroke="#1C274C"
                                                                    strokeWidth="1.5"
                                                                />
                                                                <path
                                                                    d="M16 18C16 19.1046 16 20 12 20C8 20 8 19.1046 8 18C8 16.8954 9.79086 16 12 16C14.2091 16 16 16.8954 16 18Z"
                                                                    stroke="#1C274C"
                                                                    strokeWidth="1.5"
                                                                />
                                                                <path
                                                                    d="M25 15C25 18.7712 25 20.6569 23.8284 21.8284C22.6569 23 20.7712 23 17 23H13C9.22876 23 7.34315 23 6.17157 21.8284C5 20.6569 5 18.7712 5 15C5 11.2288 5 9.34315 6.17157 8.17157C7.34315 7 9.22876 7 13 7H17C20.7712 7 22.6569 7 23.8284 8.17157C24.298 8.64118 24.5794 9.2255 24.748 10"
                                                                    stroke="#1C274C"
                                                                    strokeWidth="1.5"
                                                                    strokeLinecap="round"
                                                                />
                                                                <path
                                                                    d="M22 15H18"
                                                                    stroke="#8080DA"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                />
                                                                <path
                                                                    d="M22 12H17"
                                                                    stroke="#8080DA"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                />
                                                                <path
                                                                    d="M22 18H19"
                                                                    stroke="#8080DA"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                />
                                                            </svg>
                                                            <span className="AccordianItem ml-3">
                                                                Other TP Details
                                                            </span>
                                                        </AccordionSummary>
                                                        <AccordionDetails
                                                            sx={{
                                                                border: '0px'
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    flexGrow: '1',
                                                                    padding:
                                                                        '1rem 0'
                                                                }}
                                                            >
                                                                <Grid
                                                                    container
                                                                    spacing={2}
                                                                    sx={{
                                                                        pt: 2
                                                                    }}
                                                                >
                                                                    <Grid
                                                                        container
                                                                        spacing={2}
                                                                        sx={{
                                                                            pt: 2
                                                                        }}
                                                                    >
                                                                        <Grid
                                                                            item
                                                                            xs={4}
                                                                            className="requiredField"
                                                                        >
                                                                            <FormInputText
                                                                                control={
                                                                                    control
                                                                                }
                                                                                name="TP_POLICY_NO"
                                                                                onChangeFn={
                                                                                    handleCustomerChange
                                                                                }
                                                                                label="Other TP Policy No."
                                                                            // disabled={
                                                                            //     disabledTMIOtherTP
                                                                            // }
                                                                            />
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            xs={4}
                                                                        >
                                                                            <FormInputSelect
                                                                                control={
                                                                                    control
                                                                                }
                                                                                name="PREV_TP_FKISURANCE_COMP_ID"
                                                                                onChangeFn={
                                                                                    handleCustomerChange
                                                                                }
                                                                                label="Other TP Insurance Company"
                                                                                LIST={
                                                                                    icList
                                                                                }
                                                                                TEXT="ICName"
                                                                                VALUE="ICId"
                                                                                // disabled={
                                                                                //     disabledTMIOtherTP
                                                                                // }
                                                                                className="requiredField"
                                                                            />
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            xs={4}
                                                                        >
                                                                            <FormInputRadio
                                                                                onChangeFn={
                                                                                    getToggleButtonData
                                                                                }
                                                                                list={
                                                                                    otherTPTenureToggleObj
                                                                                }
                                                                                label="Other TP Tenure"
                                                                                name="PREV_OTHER_TP_TENURE"
                                                                                control={
                                                                                    control
                                                                                }
                                                                                // IsDisabled={
                                                                                //     disabledTMIOtherTP
                                                                                // }
                                                                                className="requiredField"
                                                                            />
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            xs={4}
                                                                        >
                                                                            <FormInputDate
                                                                                control={
                                                                                    control
                                                                                }
                                                                                nestedObject={
                                                                                    'ProposerDetails'
                                                                                }
                                                                                name="PREV_TP_POLICY_EFFECTIVE_DATE"
                                                                                onChangeFn={
                                                                                    getDate
                                                                                }
                                                                                label="Other TP Policy Period From"
                                                                                // disabled={
                                                                                //    customerDetails?.VehicleDetails?.RENEWAL_TYPE == "1" && dayjs(control._formValues.PREV_TP_POLICY_EXPIRY_DATE).isAfter(dayjs(customerDetails.VehicleDetails.POLICY_EFFECTIVE_DATE))
                                                                                // }
                                                                                className="requiredField"
                                                                            />
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            xs={4}
                                                                            className="requiredField"
                                                                        >
                                                                            <FormInputDate
                                                                                control={
                                                                                    control
                                                                                }
                                                                                nestedObject={
                                                                                    'ProposerDetails'
                                                                                }
                                                                                name="PREV_TP_POLICY_EXPIRY_DATE"
                                                                                onChangeFn={
                                                                                    getDate
                                                                                }
                                                                                label="Other TP Policy Period To"
                                                                                disabled={true}
                                                                            />
                                                                            <Controller
                                                                                name="FromandToDateCheckForOtherTP"
                                                                                control={
                                                                                    control
                                                                                }
                                                                                render={({
                                                                                    field: {
                                                                                        onChange,
                                                                                        value,
                                                                                        ref,
                                                                                        ...field
                                                                                    },
                                                                                    fieldState:
                                                                                    {
                                                                                        error
                                                                                    }
                                                                                }) => (
                                                                                    <>
                                                                                        {error ? (
                                                                                            <FormHelperText
                                                                                                sx={{
                                                                                                    color: 'red'
                                                                                                }}
                                                                                            >
                                                                                                {
                                                                                                    error.message
                                                                                                }
                                                                                            </FormHelperText>
                                                                                        ) : (
                                                                                            <>

                                                                                            </>
                                                                                        )}
                                                                                    </>
                                                                                )}
                                                                            />
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            </Box>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                )}

                                            {/* NCB CarryForward Section */}
                                            {customerDetails.DiscountDetails
                                                .IS_NCB_CARRY_FORWARD == 1 && (
                                                    <Accordion
                                                        defaultExpanded
                                                        sx={{
                                                            backgroundColor:
                                                                'transparent',
                                                            border: '0px',
                                                            boxShadow:
                                                                '0px 0px 0px',
                                                            marginBottom: '5px',
                                                            '&::before': {
                                                                backgroundColor:
                                                                    'transparent'
                                                            },
                                                            '&::after': {
                                                                backgroundColor:
                                                                    'transparent'
                                                            }
                                                        }}
                                                    >
                                                        <AccordionSummary
                                                            expandIcon={
                                                                <ExpandMoreIcon />
                                                            }
                                                            aria-controls="panel2-content"
                                                            className="accordianHeading"
                                                            id="panel2-header"
                                                        >
                                                            <svg
                                                                width="30"
                                                                height="30"
                                                                viewBox="0 0 30 30"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <rect
                                                                    width="30"
                                                                    height="30"
                                                                    rx="15"
                                                                    fill="white"
                                                                />
                                                                <path
                                                                    d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                                                                    stroke="#1C274C"
                                                                    strokeWidth="1.5"
                                                                />
                                                                <path
                                                                    d="M16 18C16 19.1046 16 20 12 20C8 20 8 19.1046 8 18C8 16.8954 9.79086 16 12 16C14.2091 16 16 16.8954 16 18Z"
                                                                    stroke="#1C274C"
                                                                    strokeWidth="1.5"
                                                                />
                                                                <path
                                                                    d="M25 15C25 18.7712 25 20.6569 23.8284 21.8284C22.6569 23 20.7712 23 17 23H13C9.22876 23 7.34315 23 6.17157 21.8284C5 20.6569 5 18.7712 5 15C5 11.2288 5 9.34315 6.17157 8.17157C7.34315 7 9.22876 7 13 7H17C20.7712 7 22.6569 7 23.8284 8.17157C24.298 8.64118 24.5794 9.2255 24.748 10"
                                                                    stroke="#1C274C"
                                                                    strokeWidth="1.5"
                                                                    strokeLinecap="round"
                                                                />
                                                                <path
                                                                    d="M22 15H18"
                                                                    stroke="#8080DA"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                />
                                                                <path
                                                                    d="M22 12H17"
                                                                    stroke="#8080DA"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                />
                                                                <path
                                                                    d="M22 18H19"
                                                                    stroke="#8080DA"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                />
                                                            </svg>
                                                            <span className="AccordianItem ml-3">
                                                                NCB Carry Forward
                                                                Details
                                                            </span>
                                                        </AccordionSummary>
                                                        <AccordionDetails
                                                            sx={{
                                                                border: '0px'
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    flexGrow: '1',
                                                                    padding:
                                                                        '1rem 0'
                                                                }}
                                                            >
                                                                <Grid
                                                                    container
                                                                    spacing={2}
                                                                    sx={{
                                                                        pt: 2
                                                                    }}
                                                                >
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        className="requiredField"
                                                                    >
                                                                        <FormInputRadio
                                                                            onChangeFn={
                                                                                getToggleButtonData
                                                                            }
                                                                            list={
                                                                                prevPolToggleObj
                                                                            }
                                                                            label="Previous Policy Type"
                                                                            name="PREV_IS_VISOF_POLICY"
                                                                            control={
                                                                                control
                                                                            }
                                                                        />
                                                                        {/* <ColorToggleButton
                                                                        defaultSelected={
                                                                            customerDetails
                                                                                .NcbCarryFrwrdDetails
                                                                                .PREV_IS_VISOF_POLICY
                                                                        }
                                                                    /> */}
                                                                    </Grid>
                                                                </Grid>

                                                                <Grid
                                                                    container
                                                                    spacing={2}
                                                                    sx={{
                                                                        pt: 1
                                                                    }}
                                                                >
                                                                    {customerDetails
                                                                        .NcbCarryFrwrdDetails
                                                                        .PREV_IS_VISOF_POLICY ==
                                                                        '1' && (
                                                                            <>
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        4
                                                                                    }
                                                                                >
                                                                                    <FormInputText
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        name="PREV_VEH_POLICY_NO"
                                                                                        onChangeFn={
                                                                                            handleNCBCarryChange
                                                                                        }
                                                                                        label="Previous Policy No."
                                                                                        className="requiredField"
                                                                                    />
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        8
                                                                                    }
                                                                                >
                                                                                    <Button
                                                                                        variant="contained"
                                                                                        color="primary"
                                                                                        onClick={
                                                                                            getNCBDetails
                                                                                        }
                                                                                    >
                                                                                        Get
                                                                                        Details
                                                                                    </Button>
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        4
                                                                                    }
                                                                                >
                                                                                    {icList.length >
                                                                                        0 && (
                                                                                            <FormInputSelect
                                                                                                control={
                                                                                                    control
                                                                                                }
                                                                                                disabled={
                                                                                                    true
                                                                                                }
                                                                                                name="PREV_VEH_IC"
                                                                                                onChangeFn={
                                                                                                    handleNCBCarryChange
                                                                                                }
                                                                                                label="Previous Insurance Company"
                                                                                                LIST={
                                                                                                    icList
                                                                                                }
                                                                                                TEXT="ICName"
                                                                                                VALUE="ICId"
                                                                                                className="requiredField"
                                                                                            />
                                                                                        )}
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        4
                                                                                    }
                                                                                    className="requiredField"
                                                                                >
                                                                                    <FormInputDate
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        nestedObject={
                                                                                            'NcbCarryFrwrdDetails'
                                                                                        }
                                                                                        name="PREV_VEH_POLICYSTARTDATE"
                                                                                        onChangeFn={
                                                                                            getDate
                                                                                        }
                                                                                        disabled={
                                                                                            true
                                                                                        }
                                                                                        label="Policy Period From"
                                                                                    />
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        4
                                                                                    }
                                                                                    className="requiredField"
                                                                                >
                                                                                    <FormInputDate
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        name="PREV_VEH_POLICYENDDATE"
                                                                                        nestedObject={
                                                                                            'NcbCarryFrwrdDetails'
                                                                                        }
                                                                                        onChangeFn={
                                                                                            getDate
                                                                                        }
                                                                                        disabled={
                                                                                            true
                                                                                        }
                                                                                        label="Policy Period To"
                                                                                    />
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        4
                                                                                    }
                                                                                >
                                                                                    <FormInputText
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        name="PREV_VEH_NCB"
                                                                                        onChangeFn={
                                                                                            handleNCBCarryChange
                                                                                        }
                                                                                        disabled={
                                                                                            true
                                                                                        }
                                                                                        label="NCB Entitled"
                                                                                    />
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        4
                                                                                    }
                                                                                >
                                                                                    <FormInputDate
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        name="PREV_VEH_NCB_EFFECTIVE_DATE"
                                                                                        nestedObject={
                                                                                            'NcbCarryFrwrdDetails'
                                                                                        }
                                                                                        onChangeFn={
                                                                                            getDate
                                                                                        }
                                                                                        disabled={
                                                                                            false
                                                                                        }
                                                                                        label="NCB Certificate Effective Date"
                                                                                    />
                                                                                </Grid>
                                                                            </>
                                                                        )}

                                                                    {customerDetails
                                                                        .NcbCarryFrwrdDetails
                                                                        .PREV_IS_VISOF_POLICY ==
                                                                        '0' && (
                                                                            <>
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        4
                                                                                    }
                                                                                >
                                                                                    <FormInputText
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        name="PREV_VEH_MAKE"
                                                                                        onChangeFn={
                                                                                            handleNCBCarryChange
                                                                                        }
                                                                                        label="Make"
                                                                                        className="requiredField"
                                                                                    />
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        4
                                                                                    }
                                                                                >
                                                                                    <FormInputText
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        name="PREV_VEH_MODEL"
                                                                                        onChangeFn={
                                                                                            handleNCBCarryChange
                                                                                        }
                                                                                        label="Model"
                                                                                        className="requiredField"
                                                                                    />
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        4
                                                                                    }
                                                                                >
                                                                                    <FormInputText
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        name="PREV_VEH_VARIANT_NO"
                                                                                        onChangeFn={
                                                                                            handleNCBCarryChange
                                                                                        }
                                                                                        label="Variant"
                                                                                        className="requiredField"
                                                                                    />
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        4
                                                                                    }
                                                                                >
                                                                                    <FormInputSelect
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        name="PREV_VEH_MANU_YEAR"
                                                                                        onChangeFn={
                                                                                            handleNCBCarryChange
                                                                                        }
                                                                                        label="Year Of Manufacturer"
                                                                                        LIST={
                                                                                            YOMNCB_CF
                                                                                        }
                                                                                        TEXT="text"
                                                                                        VALUE="value"
                                                                                        className="requiredField"
                                                                                    />
                                                                                    {nMfgYear !=
                                                                                        '' && (
                                                                                            <FormHelperText
                                                                                                sx={{
                                                                                                    color: 'red'
                                                                                                }}
                                                                                            >
                                                                                                {
                                                                                                    nMfgYear
                                                                                                }
                                                                                            </FormHelperText>
                                                                                        )}
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        4
                                                                                    }
                                                                                >
                                                                                    <FormInputText
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        name="PREV_VEH_CHASSIS_NO"
                                                                                        onChangeFn={
                                                                                            handleNCBCarryChange
                                                                                        }
                                                                                        inputProps={{
                                                                                            style: {
                                                                                                textTransform:
                                                                                                    'uppercase'
                                                                                            },
                                                                                            maxLength: 25
                                                                                        }}
                                                                                        label="Chassis No."
                                                                                        className="requiredField"
                                                                                    />
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        4
                                                                                    }
                                                                                >
                                                                                    <FormInputText
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        name="PREV_VEH_ENGINE_NO"
                                                                                        onChangeFn={
                                                                                            handleNCBCarryChange
                                                                                        }
                                                                                        inputProps={{
                                                                                            style: {
                                                                                                textTransform:
                                                                                                    'uppercase'
                                                                                            },
                                                                                            maxLength: 25
                                                                                        }}
                                                                                        label="Engine No."
                                                                                        className="requiredField"
                                                                                    />
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        4
                                                                                    }
                                                                                >
                                                                                    <FormInputDate
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        nestedObject={
                                                                                            'NcbCarryFrwrdDetails'
                                                                                        }
                                                                                        name="PREV_VEH_INVOICEDATE"
                                                                                        onChangeFn={
                                                                                            getDate
                                                                                        }
                                                                                        label="Invoice Date"
                                                                                    />
                                                                                    <Controller
                                                                                        name="MFGYearAndInvoice"
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        render={({
                                                                                            field: {
                                                                                                onChange,
                                                                                                value,
                                                                                                ref,
                                                                                                ...field
                                                                                            },
                                                                                            fieldState:
                                                                                            {
                                                                                                error
                                                                                            }
                                                                                        }) => (
                                                                                            <>
                                                                                                {error ? (
                                                                                                    <FormHelperText
                                                                                                        sx={{
                                                                                                            color: 'red'
                                                                                                        }}
                                                                                                    >
                                                                                                        {
                                                                                                            error.message
                                                                                                        }
                                                                                                    </FormHelperText>
                                                                                                ) : (
                                                                                                    <>

                                                                                                    </>
                                                                                                )}
                                                                                            </>
                                                                                        )}
                                                                                    />
                                                                                    {nInvoiceDate !=
                                                                                        '' && (
                                                                                            <FormHelperText
                                                                                                sx={{
                                                                                                    color: 'red'
                                                                                                }}
                                                                                            >
                                                                                                {
                                                                                                    nInvoiceDate
                                                                                                }
                                                                                            </FormHelperText>
                                                                                        )}
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        4
                                                                                    }
                                                                                >
                                                                                    <FormInputText
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        name="PREV_VEH_REG_NO"
                                                                                        onChangeFn={
                                                                                            handleNCBCarryChange
                                                                                        }
                                                                                        placeholder="DL09RAA5445"
                                                                                        label="Registration No."
                                                                                        className="requiredField"
                                                                                    />
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        4
                                                                                    }
                                                                                >
                                                                                    <FormInputText
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        name="PREV_VEH_POLICY_NONVISOF"
                                                                                        onChangeFn={
                                                                                            handleNCBCarryChange
                                                                                        }
                                                                                        label="Previous Policy No."
                                                                                        className="requiredField"
                                                                                    />
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        4
                                                                                    }
                                                                                >
                                                                                    <FormInputSelect
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        name="PREV_VEH_NCB"
                                                                                        onChangeFn={
                                                                                            handleNCBCarryChange
                                                                                        }
                                                                                        label="NCB Entitled"
                                                                                        LIST={
                                                                                            entitledNCBList
                                                                                        }
                                                                                        disabled={
                                                                                            true
                                                                                        }
                                                                                        TEXT="EntitledNCBValue"
                                                                                        VALUE="EntitledNCBValue"
                                                                                    />
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        4
                                                                                    }
                                                                                    className="requiredField"
                                                                                >
                                                                                    <InputLabel htmlFor="chkncbdoc">
                                                                                        NCB
                                                                                        Document
                                                                                        Submitted
                                                                                        ?
                                                                                    </InputLabel>
                                                                                    <Controller
                                                                                        name="PREV_VEH_ISNCBCERTIFICATE"
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        render={({
                                                                                            field: {
                                                                                                onChange,
                                                                                                value,
                                                                                                ref,
                                                                                                ...field
                                                                                            },
                                                                                            fieldState:
                                                                                            {
                                                                                                error
                                                                                            }
                                                                                        }) => (
                                                                                            <>
                                                                                                <Checkbox
                                                                                                    inputProps={{
                                                                                                        'aria-label':
                                                                                                            'controlled'
                                                                                                    }}
                                                                                                    name="PREV_VEH_ISNCBCERTIFICATE"
                                                                                                    checked={
                                                                                                        value
                                                                                                    }
                                                                                                    onChange={(
                                                                                                        e
                                                                                                    ) => {
                                                                                                        onChange(
                                                                                                            e
                                                                                                                .target
                                                                                                                .checked
                                                                                                        )
                                                                                                        handleNCBCarryChange(
                                                                                                            e
                                                                                                        )
                                                                                                    }}
                                                                                                    variant="standard"
                                                                                                />
                                                                                                <label htmlFor="chkncbdoc">
                                                                                                    Yes{' '}
                                                                                                </label>
                                                                                                {error ? (
                                                                                                    <FormHelperText
                                                                                                        sx={{
                                                                                                            color: 'red'
                                                                                                        }}
                                                                                                    >
                                                                                                        {
                                                                                                            error.message
                                                                                                        }
                                                                                                    </FormHelperText>
                                                                                                ) : (
                                                                                                    <>

                                                                                                    </>
                                                                                                )}
                                                                                            </>
                                                                                        )}
                                                                                    />
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        4
                                                                                    }
                                                                                    className="requiredField"
                                                                                >
                                                                                    <FormInputDate
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        nestedObject={
                                                                                            'NcbCarryFrwrdDetails'
                                                                                        }
                                                                                        name="PREV_VEH_NCB_EFFECTIVE_DATE_NONVISOF"
                                                                                        onChangeFn={
                                                                                            getDate
                                                                                        }
                                                                                        label="NCB Certificate Effective Date"
                                                                                    />
                                                                                    {nCertificateDate !=
                                                                                        '' && (
                                                                                            <FormHelperText
                                                                                                sx={{
                                                                                                    color: 'red'
                                                                                                }}
                                                                                            >
                                                                                                {
                                                                                                    nCertificateDate
                                                                                                }
                                                                                            </FormHelperText>
                                                                                        )}
                                                                                    <Controller
                                                                                        name="MFGYearAndNCBCert"
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        render={({
                                                                                            field: {
                                                                                                onChange,
                                                                                                value,
                                                                                                ref,
                                                                                                ...field
                                                                                            },
                                                                                            fieldState:
                                                                                            {
                                                                                                error
                                                                                            }
                                                                                        }) => (
                                                                                            <>
                                                                                                {error ? (
                                                                                                    <FormHelperText
                                                                                                        sx={{
                                                                                                            color: 'red'
                                                                                                        }}
                                                                                                    >
                                                                                                        {
                                                                                                            error.message
                                                                                                        }
                                                                                                    </FormHelperText>
                                                                                                ) : (
                                                                                                    <>

                                                                                                    </>
                                                                                                )}
                                                                                            </>
                                                                                        )}
                                                                                    />
                                                                                </Grid>

                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        4
                                                                                    }
                                                                                    className="requiredField"
                                                                                >
                                                                                    <FormInputDate
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        nestedObject={
                                                                                            'NcbCarryFrwrdDetails'
                                                                                        }
                                                                                        name="PREV_VEH_POLICYSTARTDATE"
                                                                                        onChangeFn={
                                                                                            getDate
                                                                                        }
                                                                                        label="Policy Period From"
                                                                                    />
                                                                                    {nPolEffDate !=
                                                                                        '' && (
                                                                                            <FormHelperText
                                                                                                sx={{
                                                                                                    color: 'red'
                                                                                                }}
                                                                                            >
                                                                                                {
                                                                                                    nPolEffDate
                                                                                                }
                                                                                            </FormHelperText>
                                                                                        )}
                                                                                    <Controller
                                                                                        name="FromAndInvoiceDateCheck"
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        render={({
                                                                                            field: {
                                                                                                onChange,
                                                                                                value,
                                                                                                ref,
                                                                                                ...field
                                                                                            },
                                                                                            fieldState:
                                                                                            {
                                                                                                error
                                                                                            }
                                                                                        }) => (
                                                                                            <>
                                                                                                {error ? (
                                                                                                    <FormHelperText
                                                                                                        sx={{
                                                                                                            color: 'red'
                                                                                                        }}
                                                                                                    >
                                                                                                        {
                                                                                                            error.message
                                                                                                        }
                                                                                                    </FormHelperText>
                                                                                                ) : (
                                                                                                    <>

                                                                                                    </>
                                                                                                )}
                                                                                            </>
                                                                                        )}
                                                                                    />
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        4
                                                                                    }
                                                                                    className="requiredField"
                                                                                >
                                                                                    <FormInputDate
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        nestedObject={
                                                                                            'NcbCarryFrwrdDetails'
                                                                                        }
                                                                                        name="PREV_VEH_POLICYENDDATE"
                                                                                        onChangeFn={
                                                                                            getDate
                                                                                        }
                                                                                        label="Policy Period To"
                                                                                    />
                                                                                    {nPolExpDate !=
                                                                                        '' && (
                                                                                            <FormHelperText
                                                                                                sx={{
                                                                                                    color: 'red'
                                                                                                }}
                                                                                            >
                                                                                                {
                                                                                                    nPolExpDate
                                                                                                }
                                                                                            </FormHelperText>
                                                                                        )}
                                                                                    <Controller
                                                                                        name="FromandToDateCheck"
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        render={({
                                                                                            field: {
                                                                                                onChange,
                                                                                                value,
                                                                                                ref,
                                                                                                ...field
                                                                                            },
                                                                                            fieldState:
                                                                                            {
                                                                                                error
                                                                                            }
                                                                                        }) => (
                                                                                            <>
                                                                                                {error ? (
                                                                                                    <FormHelperText
                                                                                                        sx={{
                                                                                                            color: 'red'
                                                                                                        }}
                                                                                                    >
                                                                                                        {
                                                                                                            error.message
                                                                                                        }
                                                                                                    </FormHelperText>
                                                                                                ) : (
                                                                                                    <>

                                                                                                    </>
                                                                                                )}
                                                                                            </>
                                                                                        )}
                                                                                    />
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        4
                                                                                    }
                                                                                >
                                                                                    {icList.length >
                                                                                        0 && (
                                                                                            <FormInputSelect
                                                                                                control={
                                                                                                    control
                                                                                                }
                                                                                                name="PREV_VEH_IC"
                                                                                                onChangeFn={
                                                                                                    handleNCBCarryChange
                                                                                                }
                                                                                                label="Insurance
                                                                        Company"
                                                                                                LIST={
                                                                                                    icList
                                                                                                }
                                                                                                TEXT="ICName"
                                                                                                VALUE="ICId"
                                                                                                className="requiredField"
                                                                                            />
                                                                                        )}
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        4
                                                                                    }
                                                                                >
                                                                                    <FormInputText
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        name="PREV_VEH_ADDRESS"
                                                                                        onChangeFn={
                                                                                            handleNCBCarryChange
                                                                                        }
                                                                                        label="Office Address"
                                                                                        className="requiredField"
                                                                                    />
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                </Grid>
                                                            </Box>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                )}
                                            {customerDetails.ProposerDetails
                                                .IC_ID == 9 && (
                                                    <Accordion
                                                        defaultExpanded
                                                        sx={{
                                                            backgroundColor:
                                                                'transparent',
                                                            border: '0px',
                                                            boxShadow:
                                                                '0px 0px 0px',
                                                            marginBottom: '5px',
                                                            '&::before': {
                                                                backgroundColor:
                                                                    'transparent'
                                                            },
                                                            '&::after': {
                                                                backgroundColor:
                                                                    'transparent'
                                                            }
                                                        }}
                                                    >
                                                        <AccordionSummary
                                                            expandIcon={
                                                                <ExpandMoreIcon />
                                                            }
                                                            aria-controls="panel2-content"
                                                            className="accordianHeading"
                                                            id="panel2-header"
                                                        >
                                                            <svg
                                                                width="30"
                                                                height="30"
                                                                viewBox="0 0 30 30"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <rect
                                                                    width="30"
                                                                    height="30"
                                                                    rx="15"
                                                                    fill="white"
                                                                />
                                                                <path
                                                                    d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                                                                    stroke="#1C274C"
                                                                    strokeWidth="1.5"
                                                                />
                                                                <path
                                                                    d="M16 18C16 19.1046 16 20 12 20C8 20 8 19.1046 8 18C8 16.8954 9.79086 16 12 16C14.2091 16 16 16.8954 16 18Z"
                                                                    stroke="#1C274C"
                                                                    strokeWidth="1.5"
                                                                />
                                                                <path
                                                                    d="M25 15C25 18.7712 25 20.6569 23.8284 21.8284C22.6569 23 20.7712 23 17 23H13C9.22876 23 7.34315 23 6.17157 21.8284C5 20.6569 5 18.7712 5 15C5 11.2288 5 9.34315 6.17157 8.17157C7.34315 7 9.22876 7 13 7H17C20.7712 7 22.6569 7 23.8284 8.17157C24.298 8.64118 24.5794 9.2255 24.748 10"
                                                                    stroke="#1C274C"
                                                                    strokeWidth="1.5"
                                                                    strokeLinecap="round"
                                                                />
                                                                <path
                                                                    d="M22 15H18"
                                                                    stroke="#8080DA"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                />
                                                                <path
                                                                    d="M22 12H17"
                                                                    stroke="#8080DA"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                />
                                                                <path
                                                                    d="M22 18H19"
                                                                    stroke="#8080DA"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                />
                                                            </svg>
                                                            <span className="AccordianItem ml-3">
                                                                Vehicle Details
                                                            </span>
                                                        </AccordionSummary>
                                                        <AccordionDetails
                                                            sx={{
                                                                border: '0px'
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    flexGrow: '1',
                                                                    padding:
                                                                        '1rem 0'
                                                                }}
                                                            >
                                                                <Grid
                                                                    container
                                                                    spacing={2}
                                                                    sx={{
                                                                        pt: 1
                                                                    }}
                                                                >
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        md={4}
                                                                    >
                                                                        <TextField
                                                                            fullWidth
                                                                            value={
                                                                                customerDetails.ROAD_TAX_AMT
                                                                            }
                                                                            onChange={
                                                                                handleProposalChange
                                                                            }
                                                                            name="ROAD_TAX_AMT"
                                                                            label="Road Tax Amount"
                                                                            variant="standard"
                                                                            placeholder="Road Tax Amount"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            </Box>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                )}

                                            {/* CPA Section */}
                                            {customerDetails.VehicleDetails
                                                .CPA_PREV_TENURE != 0 &&
                                                customerDetails.ProposerDetails
                                                    .PROPOSAL_TYPE != 'C' && (
                                                    <Accordion
                                                        defaultExpanded
                                                        sx={{
                                                            backgroundColor:
                                                                'transparent',
                                                            border: '0px',
                                                            boxShadow:
                                                                '0px 0px 0px',
                                                            marginBottom: '5px',
                                                            '&::before': {
                                                                backgroundColor:
                                                                    'transparent'
                                                            },
                                                            '&::after': {
                                                                backgroundColor:
                                                                    'transparent'
                                                            }
                                                        }}
                                                    >
                                                        <AccordionSummary
                                                            expandIcon={
                                                                <ExpandMoreIcon />
                                                            }
                                                            aria-controls="panel2-content"
                                                            className="accordianHeading"
                                                            id="panel2-header"
                                                        >
                                                            <svg
                                                                width="30"
                                                                height="30"
                                                                viewBox="0 0 30 30"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <rect
                                                                    width="30"
                                                                    height="30"
                                                                    rx="15"
                                                                    fill="white"
                                                                />
                                                                <path
                                                                    d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                                                                    stroke="#1C274C"
                                                                    strokeWidth="1.5"
                                                                />
                                                                <path
                                                                    d="M16 18C16 19.1046 16 20 12 20C8 20 8 19.1046 8 18C8 16.8954 9.79086 16 12 16C14.2091 16 16 16.8954 16 18Z"
                                                                    stroke="#1C274C"
                                                                    strokeWidth="1.5"
                                                                />
                                                                <path
                                                                    d="M25 15C25 18.7712 25 20.6569 23.8284 21.8284C22.6569 23 20.7712 23 17 23H13C9.22876 23 7.34315 23 6.17157 21.8284C5 20.6569 5 18.7712 5 15C5 11.2288 5 9.34315 6.17157 8.17157C7.34315 7 9.22876 7 13 7H17C20.7712 7 22.6569 7 23.8284 8.17157C24.298 8.64118 24.5794 9.2255 24.748 10"
                                                                    stroke="#1C274C"
                                                                    strokeWidth="1.5"
                                                                    strokeLinecap="round"
                                                                />
                                                                <path
                                                                    d="M22 15H18"
                                                                    stroke="#8080DA"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                />
                                                                <path
                                                                    d="M22 12H17"
                                                                    stroke="#8080DA"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                />
                                                                <path
                                                                    d="M22 18H19"
                                                                    stroke="#8080DA"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                />
                                                            </svg>
                                                            <span className="AccordianItem ml-3">
                                                                Nominee Details
                                                            </span>
                                                        </AccordionSummary>
                                                        <AccordionDetails
                                                            sx={{
                                                                border: '0px'
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    flexGrow:
                                                                        '1',
                                                                    padding:
                                                                        '1rem 0'
                                                                }}
                                                            >
                                                                <Grid
                                                                    container
                                                                    spacing={2}
                                                                    sx={{
                                                                        pt: 1
                                                                    }}
                                                                >
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        md={3}
                                                                    >
                                                                        <FormInputText
                                                                            control={
                                                                                control
                                                                            }
                                                                            name="NomineeName"
                                                                            onChangeFn={
                                                                                handleNomineeChange
                                                                            }
                                                                            label="Nominee Name"
                                                                            className="requiredField"
                                                                        />
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        md={3}
                                                                    >
                                                                        <FormInputText
                                                                            control={
                                                                                control
                                                                            }
                                                                            name="NomineeAge"
                                                                            onChangeFn={
                                                                                handleNomineeChange
                                                                            }
                                                                            label="Nominee Age"
                                                                            className="requiredField"
                                                                        />
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        md={3}
                                                                    >
                                                                        <FormInputSelect
                                                                            control={
                                                                                control
                                                                            }
                                                                            name="NomineeRelation"
                                                                            onChangeFn={
                                                                                handleNomineeChange
                                                                            }
                                                                            label="Nominee
                                                                        Relation"
                                                                            LIST={
                                                                                nomineeRelationList
                                                                            }
                                                                            TEXT="RelationName"
                                                                            VALUE="RelationName"
                                                                            className="requiredField"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item xs={12} md={3}>
                                                                        <FormInputSelect
                                                                            control={control}
                                                                            name="NomineeGender"
                                                                            onChangeFn={handleNomineeChange}
                                                                            label="Nominee Gender"
                                                                            LIST={genderOptions}
                                                                            TEXT="text"
                                                                            VALUE="value"
                                                                            className="requiredField"
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            </Box>
                                                            <Box
                                                                sx={{
                                                                    flexGrow:
                                                                        '1',
                                                                    padding:
                                                                        '0.275rem 0'
                                                                }}
                                                            >
                                                                {customerDetails
                                                                    .Nominees
                                                                    .NomineeAge <
                                                                    18 &&
                                                                    customerDetails
                                                                        .Nominees
                                                                        .NomineeAge !=
                                                                    0 && (
                                                                        <>
                                                                            <Grid
                                                                                container
                                                                                spacing={
                                                                                    4
                                                                                }
                                                                                id="divAppointeeRelation"
                                                                            >
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        3
                                                                                    }
                                                                                >
                                                                                    <FormInputText
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        name="AppointeeName"
                                                                                        onChangeFn={
                                                                                            handleNomineeChange
                                                                                        }
                                                                                        label="Appointee Name"
                                                                                        className="requiredField"
                                                                                    />
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        3
                                                                                    }
                                                                                >
                                                                                    <FormInputText
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        name="AppointeeAge"
                                                                                        onChangeFn={
                                                                                            handleNomineeChange
                                                                                        }
                                                                                        label="Appointee Age"
                                                                                        className="requiredField"
                                                                                    />
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                    md={
                                                                                        3
                                                                                    }
                                                                                >
                                                                                    <FormInputSelect
                                                                                        control={
                                                                                            control
                                                                                        }
                                                                                        name="AppointeeRelation"
                                                                                        onChangeFn={
                                                                                            handleNomineeChange
                                                                                        }
                                                                                        label="Appointee
                                                                        Relation"
                                                                                        LIST={
                                                                                            nomineeRelationList
                                                                                        }
                                                                                        TEXT="RelationName"
                                                                                        VALUE="RelationName"
                                                                                        className="requiredField"
                                                                                    />
                                                                                </Grid>
                                                                                <Grid item xs={12} md={3}>
                                                                                    <FormInputSelect
                                                                                        control={control}
                                                                                        name="AppointeeGender"
                                                                                        onChangeFn={handleNomineeChange}
                                                                                        label="Appointee Gender"
                                                                                        LIST={genderOptions}
                                                                                        TEXT="text"
                                                                                        VALUE="value"
                                                                                        className="requiredField"
                                                                                    />
                                                                                </Grid>
                                                                            </Grid>
                                                                        </>
                                                                    )}
                                                            </Box>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                )}

                                            {/* Financier Details Section */}
                                            <Accordion
                                                defaultExpanded
                                                sx={{
                                                    backgroundColor:
                                                        'transparent',
                                                    border: '0px',
                                                    boxShadow: '0px 0px 0px',
                                                    marginBottom: '5px',
                                                    '&::before': {
                                                        backgroundColor:
                                                            'transparent'
                                                    },
                                                    '&::after': {
                                                        backgroundColor:
                                                            'transparent'
                                                    }
                                                }}
                                            >
                                                <AccordionSummary
                                                    expandIcon={
                                                        <ExpandMoreIcon />
                                                    }
                                                    aria-controls="panel2-content"
                                                    className="accordianHeading"
                                                    id="panel2-header"
                                                >
                                                    <svg
                                                        width="30"
                                                        height="30"
                                                        viewBox="0 0 30 30"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <rect
                                                            width="30"
                                                            height="30"
                                                            rx="15"
                                                            fill="white"
                                                        />
                                                        <path
                                                            d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                                                            stroke="#1C274C"
                                                            strokeWidth="1.5"
                                                        />
                                                        <path
                                                            d="M16 18C16 19.1046 16 20 12 20C8 20 8 19.1046 8 18C8 16.8954 9.79086 16 12 16C14.2091 16 16 16.8954 16 18Z"
                                                            stroke="#1C274C"
                                                            strokeWidth="1.5"
                                                        />
                                                        <path
                                                            d="M25 15C25 18.7712 25 20.6569 23.8284 21.8284C22.6569 23 20.7712 23 17 23H13C9.22876 23 7.34315 23 6.17157 21.8284C5 20.6569 5 18.7712 5 15C5 11.2288 5 9.34315 6.17157 8.17157C7.34315 7 9.22876 7 13 7H17C20.7712 7 22.6569 7 23.8284 8.17157C24.298 8.64118 24.5794 9.2255 24.748 10"
                                                            stroke="#1C274C"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                        />
                                                        <path
                                                            d="M22 15H18"
                                                            stroke="#8080DA"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                        />
                                                        <path
                                                            d="M22 12H17"
                                                            stroke="#8080DA"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                        />
                                                        <path
                                                            d="M22 18H19"
                                                            stroke="#8080DA"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                        />
                                                    </svg>
                                                    <span className="AccordianItem ml-3">
                                                        Financier Details
                                                        (Yes/No)
                                                    </span>
                                                </AccordionSummary>
                                                <AccordionDetails
                                                    sx={{ border: '0px' }}
                                                >
                                                    <Box
                                                        sx={{
                                                            flexGrow: '1',
                                                            padding: '1rem 0'
                                                        }}
                                                    >
                                                        <Grid
                                                            container
                                                            spacing={4}
                                                        >
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={4}
                                                            >
                                                                <FormInputSelect
                                                                    control={
                                                                        control
                                                                    }
                                                                    name="AGGREMENT_TYPE"
                                                                    onChangeFn={
                                                                        handleFinancierChange
                                                                    }
                                                                    label="Agreement Type"
                                                                    LIST={
                                                                        agreementType
                                                                    }
                                                                    TEXT="AgreementTypeValue"
                                                                    VALUE="AgreementTypeValue"
                                                                // className="requiredField"
                                                                />
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={4}
                                                            >
                                                                <FormInputSelect
                                                                    control={
                                                                        control
                                                                    }
                                                                    name="FINANCER_ID"
                                                                    onChangeFn={
                                                                        handleFinancierChange
                                                                    }
                                                                    label="Financier Name"
                                                                    LIST={
                                                                        financiersList
                                                                    }
                                                                    TEXT="FinanceName"
                                                                    VALUE="FinanceId"
                                                                // className="requiredField"
                                                                />
                                                            </Grid>
                                                            <Grid
                                                                xs={1}
                                                                md={1}
                                                                className="btn-container"
                                                            >
                                                                <Tooltip title="Search and Map Financiers">
                                                                    <IconButton
                                                                        color="secondary"
                                                                        onClick={() => {
                                                                            setMapFin(
                                                                                true
                                                                            )
                                                                        }}
                                                                    >
                                                                        <SearchTwoToneIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Grid>
                                                            {control
                                                                ._formValues[
                                                                'IS_HYPOTHECATION'
                                                            ] == '1' && (
                                                                    <>
                                                                        <Grid
                                                                            item
                                                                            xs={12}
                                                                            md={3}
                                                                        >
                                                                            <FormInputText
                                                                                control={
                                                                                    control
                                                                                }
                                                                                name="FIN_BRANCH_ACCOUNT_NUMBER"
                                                                                onChangeFn={
                                                                                    handleFinancierChange
                                                                                }
                                                                                inputProps={{
                                                                                    maxLength: 20
                                                                                }}
                                                                                label="Loan Account No."
                                                                            //className="requiredField"
                                                                            />
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            xs={12}
                                                                            md={4}
                                                                        >
                                                                            <FormInputText
                                                                                control={
                                                                                    control
                                                                                }
                                                                                name="BRANCH_NAME"
                                                                                onChangeFn={
                                                                                    handleFinancierChange
                                                                                }
                                                                                label="Branch"
                                                                                className="requiredField"
                                                                            />

                                                                            <span
                                                                                className="field-validation-valid text-danger"
                                                                                id="spnFinancerDetailsBRANCH_NAME"
                                                                            ></span>
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            xs={12}
                                                                            md={4}
                                                                        >
                                                                            <FormInputText
                                                                                control={
                                                                                    control
                                                                                }
                                                                                name="BRANCH_CITY"
                                                                                onChangeFn={
                                                                                    handleFinancierChange
                                                                                }
                                                                                label="City"
                                                                                className="requiredField"
                                                                            />

                                                                            <span
                                                                                className="field-validation-valid text-danger"
                                                                                id="spnFinancerDetailsBRANCH_CITY"
                                                                            ></span>
                                                                        </Grid>
                                                                    </>
                                                                )}
                                                        </Grid>
                                                    </Box>
                                                </AccordionDetails>
                                            </Accordion>

                                            {/* Payment Mode Sectio */}
                                            <Accordion
                                                defaultExpanded
                                                sx={{
                                                    backgroundColor:
                                                        'transparent',
                                                    border: '0px',
                                                    boxShadow: '0px 0px 0px',
                                                    marginBottom: '5px',
                                                    '&::before': {
                                                        backgroundColor:
                                                            'transparent'
                                                    },
                                                    '&::after': {
                                                        backgroundColor:
                                                            'transparent'
                                                    }
                                                }}
                                            >
                                                <AccordionSummary
                                                    expandIcon={
                                                        <ExpandMoreIcon />
                                                    }
                                                    aria-controls="panel2-content"
                                                    className="accordianHeading"
                                                    id="panel2-header"
                                                >
                                                    <svg
                                                        width="30"
                                                        height="30"
                                                        viewBox="0 0 30 30"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <rect
                                                            width="30"
                                                            height="30"
                                                            rx="15"
                                                            fill="white"
                                                        />
                                                        <path
                                                            d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                                                            stroke="#1C274C"
                                                            strokeWidth="1.5"
                                                        />
                                                        <path
                                                            d="M16 18C16 19.1046 16 20 12 20C8 20 8 19.1046 8 18C8 16.8954 9.79086 16 12 16C14.2091 16 16 16.8954 16 18Z"
                                                            stroke="#1C274C"
                                                            strokeWidth="1.5"
                                                        />
                                                        <path
                                                            d="M25 15C25 18.7712 25 20.6569 23.8284 21.8284C22.6569 23 20.7712 23 17 23H13C9.22876 23 7.34315 23 6.17157 21.8284C5 20.6569 5 18.7712 5 15C5 11.2288 5 9.34315 6.17157 8.17157C7.34315 7 9.22876 7 13 7H17C20.7712 7 22.6569 7 23.8284 8.17157C24.298 8.64118 24.5794 9.2255 24.748 10"
                                                            stroke="#1C274C"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                        />
                                                        <path
                                                            d="M22 15H18"
                                                            stroke="#8080DA"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                        />
                                                        <path
                                                            d="M22 12H17"
                                                            stroke="#8080DA"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                        />
                                                        <path
                                                            d="M22 18H19"
                                                            stroke="#8080DA"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                        />
                                                    </svg>
                                                    <span className="AccordianItem ml-3">
                                                        Payment Mode
                                                    </span>
                                                </AccordionSummary>
                                                <AccordionDetails
                                                    sx={{ border: '0px' }}
                                                >
                                                    <Box
                                                        sx={{
                                                            flexGrow: '1',
                                                            padding: '1rem 0'
                                                        }}
                                                    >
                                                        <Grid
                                                            container
                                                            spacing={4}
                                                        >
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={4}
                                                            >
                                                                {paymentModeList.length >
                                                                    0 && (
                                                                        <FormInputSelect
                                                                            control={
                                                                                control
                                                                            }
                                                                            name="PAYMENT_MODE"
                                                                            onChangeFn={
                                                                                handlePayModeChange
                                                                            }
                                                                            label="Payment
                                                                        Mode"
                                                                            LIST={
                                                                                paymentModeList
                                                                            }
                                                                            TEXT="PAYMENT_MODE"
                                                                            VALUE="PAYMENT_MODE_CODE"
                                                                            className="requiredField"
                                                                        />
                                                                    )}
                                                            </Grid>
                                                            {showAPDBalance && (
                                                                <>
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        md={4}
                                                                    >
                                                                        {/* <label>
                                                                            {customerDetails.APDdetails.APDBALANCE}
                                                                        </label> */}
                                                                        {
                                                                            <FormInputText
                                                                                control={
                                                                                    control
                                                                                }
                                                                                inputProps={{
                                                                                    readOnly:
                                                                                        true
                                                                                }}
                                                                                name="APD_BALANCE"
                                                                                label="Available APD Balance"
                                                                            />
                                                                        }

                                                                        <span
                                                                            className="field-validation-valid text-danger"
                                                                            id="spnPaymentDetailsCHEQUE_NO"
                                                                        ></span>
                                                                        {apdValidation !=
                                                                            '' && (
                                                                                <FormHelperText
                                                                                    sx={{
                                                                                        color: 'red'
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        apdValidation
                                                                                    }
                                                                                </FormHelperText>
                                                                            )}
                                                                    </Grid>
                                                                </>
                                                            )}

                                                            {/* {showChequeDetails && (
                                                                <>
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        md={4}
                                                                    >
                                                                        <FormInputText
                                                                            control={
                                                                                control
                                                                            }
                                                                            name="CHEQUE_NO"
                                                                            onChangeFn={
                                                                                handlePaymentDetailsChange
                                                                            }
                                                                            label="Cheque No."
                                                                        />

                                                                        <span
                                                                            className="field-validation-valid text-danger"
                                                                            id="spnPaymentDetailsCHEQUE_NO"
                                                                        ></span>
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        md={4}
                                                                    >
                                                                        <FormInputDate
                                                                            control={
                                                                                control
                                                                            }
                                                                            nestedObject={
                                                                                'PaymentDetails'
                                                                            }
                                                                            name="CHEQUE_DATE"
                                                                            onChangeFn={
                                                                                getDate
                                                                            }
                                                                            label="Cheque Date"
                                                                        />
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        md={4}
                                                                    >
                                                                        <FormInputText
                                                                            control={
                                                                                control
                                                                            }
                                                                            name="BANK_ACC_NO"
                                                                            onChangeFn={
                                                                                handlePaymentDetailsChange
                                                                            }
                                                                            label="Account No."
                                                                        />
                                                                    </Grid>
                                                                </>
                                                            )}
                                                            {showBankDetails && (
                                                                <>
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        md={4}
                                                                    >
                                                                        <FormInputSelect
                                                                            control={
                                                                                control
                                                                            }
                                                                            name="FKBANK_ID"
                                                                            onChangeFn={
                                                                                handlePaymentDetailsChange
                                                                            }
                                                                            label="Bank"
                                                                            LIST={
                                                                                activebankList
                                                                            }
                                                                            TEXT="BankName"
                                                                            VALUE="BankId"
                                                                        />
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        md={4}
                                                                    >
                                                                        <FormInputText
                                                                            control={
                                                                                control
                                                                            }
                                                                            name="BANK_CITY"
                                                                            onChangeFn={
                                                                                handlePaymentDetailsChange
                                                                            }
                                                                            label="City"
                                                                        />
                                                                    </Grid>
                                                                </>
                                                            )} */}
                                                            {showPGType && (
                                                                <>
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        md={4}
                                                                    >
                                                                        <FormControl
                                                                            fullWidth
                                                                        >
                                                                            <InputLabel id="ddlbank-label">
                                                                                PG
                                                                                Type
                                                                                <span className="red">
                                                                                    *
                                                                                </span>
                                                                            </InputLabel>
                                                                            <Select
                                                                                labelId="ddlbank-label"
                                                                                name="PGType"
                                                                                defaultValue=""
                                                                                value={
                                                                                    customerDetails
                                                                                        .PaymentDetails
                                                                                        .PG_Name
                                                                                }
                                                                                label="PG Type"
                                                                                variant="standard"
                                                                            >
                                                                                <MenuItem
                                                                                    value={
                                                                                        0
                                                                                    }
                                                                                >
                                                                                    <em>
                                                                                        --Select
                                                                                        PG
                                                                                        Type--
                                                                                    </em>
                                                                                </MenuItem>
                                                                                {pgTypeList.map(
                                                                                    (
                                                                                        value,
                                                                                        index
                                                                                    ) => (
                                                                                        <MenuItem
                                                                                            key={
                                                                                                index
                                                                                            }
                                                                                            value={
                                                                                                value[
                                                                                                'PG_Name'
                                                                                                ]
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                value[
                                                                                                'PG_Name'
                                                                                                ]
                                                                                            }
                                                                                        </MenuItem>
                                                                                    )
                                                                                )}
                                                                            </Select>
                                                                            <span
                                                                                className="field-validation-valid text-danger"
                                                                                id="spnPaymentDetailsFKBANK_ID"
                                                                            ></span>
                                                                        </FormControl>
                                                                    </Grid>
                                                                </>
                                                            )}
                                                        </Grid>
                                                    </Box>
                                                </AccordionDetails>
                                            </Accordion>

                                            {/* Solicitation  Details Section */}
                                            {showDP && (
                                                <Accordion
                                                    defaultExpanded
                                                    sx={{
                                                        backgroundColor:
                                                            'transparent',
                                                        border: '0px',
                                                        boxShadow:
                                                            '0px 0px 0px',
                                                        marginBottom: '5px',
                                                        '&::before': {
                                                            backgroundColor:
                                                                'transparent'
                                                        },
                                                        '&::after': {
                                                            backgroundColor:
                                                                'transparent'
                                                        }
                                                    }}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={
                                                            <ExpandMoreIcon />
                                                        }
                                                        aria-controls="panel2-content"
                                                        className="accordianHeading"
                                                        id="panel2-header"
                                                    >
                                                        <svg
                                                            width="30"
                                                            height="30"
                                                            viewBox="0 0 30 30"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <rect
                                                                width="30"
                                                                height="30"
                                                                rx="15"
                                                                fill="white"
                                                            />
                                                            <path
                                                                d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                                                                stroke="#1C274C"
                                                                strokeWidth="1.5"
                                                            />
                                                            <path
                                                                d="M16 18C16 19.1046 16 20 12 20C8 20 8 19.1046 8 18C8 16.8954 9.79086 16 12 16C14.2091 16 16 16.8954 16 18Z"
                                                                stroke="#1C274C"
                                                                strokeWidth="1.5"
                                                            />
                                                            <path
                                                                d="M25 15C25 18.7712 25 20.6569 23.8284 21.8284C22.6569 23 20.7712 23 17 23H13C9.22876 23 7.34315 23 6.17157 21.8284C5 20.6569 5 18.7712 5 15C5 11.2288 5 9.34315 6.17157 8.17157C7.34315 7 9.22876 7 13 7H17C20.7712 7 22.6569 7 23.8284 8.17157C24.298 8.64118 24.5794 9.2255 24.748 10"
                                                                stroke="#1C274C"
                                                                strokeWidth="1.5"
                                                                strokeLinecap="round"
                                                            />
                                                            <path
                                                                d="M22 15H18"
                                                                stroke="#8080DA"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                            />
                                                            <path
                                                                d="M22 12H17"
                                                                stroke="#8080DA"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                            />
                                                            <path
                                                                d="M22 18H19"
                                                                stroke="#8080DA"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                            />
                                                        </svg>
                                                        <span className="AccordianItem ml-3">
                                                            Solicitation Details
                                                        </span>
                                                    </AccordionSummary>
                                                    <AccordionDetails
                                                        sx={{ border: '0px' }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                flexGrow: '1',
                                                                padding:
                                                                    '1rem 0'
                                                            }}
                                                        >
                                                            <Grid
                                                                container
                                                                spacing={4}
                                                            >
                                                                <Grid
                                                                    item
                                                                    xs={12}
                                                                    md={4}
                                                                    className="requiredField"
                                                                >
                                                                    <FormInputSelect
                                                                        control={
                                                                            control
                                                                        }
                                                                        name="AgentID"
                                                                        onChangeFn={
                                                                            handleSolicitationChange
                                                                        }
                                                                        label={
                                                                            loginSelector.DEALER_TYPE ==
                                                                                'P'
                                                                                ? 'POSP Name'
                                                                                : 'DP/SP Name'
                                                                        }
                                                                        LIST={
                                                                            mispList
                                                                        }
                                                                        TEXT="DPName"
                                                                        VALUE="DpId"
                                                                        className="requiredField"
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </Box>
                                                    </AccordionDetails>
                                                </Accordion>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                        <div className="text-center py-3">
                            <Button
                                onClick={() => {
                                    handleBackButton()
                                }}
                                size="medium"
                                color="primary"
                                variant="contained"
                            // startIcon={<ArrowBackIosIcon />}
                            >
                                Back
                            </Button>
                            <Button
                                sx={{ ml: 2 }}
                                type="submit"
                                size="medium"
                                color="primary"
                                variant="contained"
                                endIcon={<PreviewIcon />}
                            >
                                Proposal Preview
                            </Button>
                        </div>
                    </Container>
                </Box>
            </form>
        </>
    )
}
export default ProposerDetails
