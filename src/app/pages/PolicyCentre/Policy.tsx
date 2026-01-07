import * as React from 'react'
import { useEffect, useReducer, useContext, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import CustomerDetails from './CustomerDetails'
import VehicleDetails from './VehicleDetails'
import { COMMON_API_URL } from '../../constants/apiURLS'
import axiosInstance from '../../utils/axiosInstance'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Grid from '@mui/material/Unstable_Grid2'
import ColorToggleButton from '../../components/common/groupToggleButton'

import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import BasicDatePicker from '../../components/common/datepicker'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import {
    createSearchParams,
    useNavigate,
    useSearchParams
} from 'react-router-dom'
import { update } from '../../redux/features/policy/policySlice'
import { updateProperty } from '../../redux/features/property/propertySlice'
import dayjs from 'dayjs'
import {
    getMasterData,
    getFirstPageData,
    getMakebyOemId,
    getModelbyMakeId,
    getVariantsbyModel,
    getCoverTypeOnPolicyType,
    getVISoFPrevPolicyData,
    getYOM,
    getTenureData,
    getGSTStateCode,
    getApplicableCoverTypes,
    getVehicleSubTypes,
    getVehiclebyOemId,
    checkDuplicateChassis,
    getEffectiveDate,
    validateInvoiceDateRange,
    getICsbyOEM
} from '../../services/policyServices/policyService'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    PolicyDetailsSchemaType,
    policyDetailsSchema
} from '../../models/schemas/policyDetails/policyDetailsUnions'
import { FormInputSelect } from '../../components/common/FormInputs/FormInputSelect'
import FormInputDate from '../../components/common/FormInputs/FormInputDate'
import { FormInputRadio } from '../../components/common/FormInputs/FormInputRadio'
import { FormInputText } from '../../components/common/FormInputs/FormInputText'
import common from '../../utils/common'
import SearchMapRto from '../../components/policy/SearchMapRto'
import ConfirmDialog from '../../components/common/confirmDialog'
import { HARD_CODE_VALUE } from '../../constants/hardCode'
import toast, { ToastPosition, Toaster } from 'react-hot-toast'
import { AuthModel } from '../../redux/features/auth/authInterface'
import BackDropLoader from '../../components/common/backDropLoading'
import { Redirect, useLocation } from 'react-router-dom'
import { EffectiveDateModel, TenureDetailsInputModel } from '../../models/PolicyProposalMDL'
import { claimCount } from '../../constants/hardCode'
import { checkDealerMismatch } from '../../services/common/commonService'
import { checkDupMobileEmail } from '../../services/policyServices/policyService'
import { decrypt, encrypt } from '../../utils/encryption'
import { updateEncryptedMobEmail } from '../../redux/features/encryptedMobEmail/encryptedMobEmail'

export const PolicyPageContext = React.createContext()

const someDate = new Date()
const invalidEmail =
    '~GML$,~GAMAIL$,~GMAL$,~GAAMAIL$,~GMIAL$,~GMAI$,~GIAML$,~GAMIL$,~GGMAIL$,~GMAAIL$,~GMAIIL$,~YAHO$,~YAHOOO$,~YAAHOO$,~YHOO$,~YHOOO$,~YHO$'
const defaultValue = dayjs(someDate).format('DD/MM/YYYY')

const formDataObj: any = {
    PolicyStartDate: dayjs(new Date()),
    PolicyDetails: {
        VehClass: 'P',
        PolicyType:'N',
        CoverTypeId: 0,
        RSD: defaultValue,
        ProposalType: 'I'
    },
    Renew: {
        RENEWAL_TYPE: '0',
        PREV_POLICY_ID: 0,
        PREV_POLICY_NO: '',
        PREV_CHASSIS_NO: '',
        PREV_VEH_REG1: '',
        PREV_VEH_REG2: '',
        PREV_VEH_REG3: '',
        FKISURANCE_COMP_ID: 0,
        OFFICE_ADD: '',
        INVOICE_DATE: '',
        POLICY_EFFECTIVE_DATE: '', // dayjs(new Date()),
        POLICY_EXPIRY_DATE: '', //dayjs(new Date()),
        ISTRANSFER: 'false',
        ISCLAIM_AVAILED: 'false',
        OLD_POL_NCB_PER: 0,
        OLD_POL_NCB_LEVEL: 0,
        BREAKIN_DAYS: 0,
        PREV_DEALERCODE: '',
        ISPROOF_SUBMITTED: 0,
        ISPREVPOL_COPY_SUBMT: 0,
        ISNCB_CERT_SUBMITTED: 0,
        ISCUSTOMER_UNDRTKNG_SUBMT: 0,
        IS_ADDON: 'false',
        PREV_VEHICLE_TYPE: '',
        PREV_COVERTYPE_ID: 0,
        IsHavingODPolicy: '0',
        IsHavingTPPolicy: '0',
        TP_POLICY_EXPIRY_DATE: '', //dayjs(new Date()),
        TPPOLICY_EFFECTIVE_DATE: '', //dayjs(new Date()),
        TPPOLICY_NO: '',
        TPPOLICY_INSUR_COMP_ID: 0,
        TPPOLICY_INSUR_COMP_NAME: ''
    },
    ProposerDetails: {
        SALUTATION: '0',
        FIRST_NAME: '',
        MIDDLE_NAME: '',
        LAST_NAME: '',
        COMPANY_SALUTATION: '0',
        COMPANY_NAME: '',
        EMAIL: '',
        ENCRYPTED_EMAIL: '',
        MOB_NO: '',
        ENCRYPTED_MOB_NO: '',
        ALT_MOBILE_NO: '',
        ENCRYPTED_ALT_MOBILE_NO: ''
    },
    VehicleDetails: {
        IsVehicle: '1',
        MakeId: 0,
        MakeName: '',
        ModelId: 0,
        Model: '',
        VariantId: 0,
        Variant: '',
        ChassisNo: '',
        EngineNo: '',
        FuelTypeCode: '',
        FuelType: '',
        CubicCapacity: 0,
        SeatingCapacity: 0,
        GrossVehicleWeight: 0,
        ExShowroomPrice: 0,
        DateofManufacture: 0,
        RTOId: 0,
        RTOName: '',
        InvoiceDate: dayjs(new Date()),
        IsuredStateId: 0,
        IsTestDrive: 'false',
        VehicleType: 0,
        FKVehicleType_ID: 0,
        Kilowatt: 0,
        OnRoadPrice: 0,
        IS_BH_REGIST_NO: '0',
        VEH_REGIST_NO: '',
        RTO_NAME: '',
        RegistrationNo1: '',
        RegistrationNo2: '',
        VehicleSubType: 0,
        CarrierType: 'PVT',
        MiscType: 0,
        BuiltType: 0,
        FKVehicleSubType_ID: 0,
        FKMiscType_ID: 0,
        FKBuiltType_ID: 0,
        TrailerNo: 0,
        TrailerPrice: 0,
        TrailerChassisNo: '',
        Battery_Number1: '',
        Battery_Number2: '',
        Charger_PortNumber: '',
        Quotetype: '0'
    },
    RegistrationDate: '', // dayjs(new Date()),
    IsuredStateId: 0,
    INSURED_GSTIN: '',
    IsTestDrive: 'false',
    IsVoluntaryForward: 'false',
    TP_PREV_TENURE: 0,

    Discounts: {
        IsNCBForward: 'false',
        NCBPer: 0,
        NCBLevel: '0',
        IsAntiTheft: 'false',
        IsAA: 'false',
        IsIMT23: 'false',
        VoluntaryExcess: 0,
        DiscountPer: 0,
        IsVoluntaryForward: 'false',
        IsHandicapped: 'false'
    },
    Covers: {
        ElectricalValue: 0,
        NonElectricalValue: 0,
        BiFuelValue: 0,
        GeoArea: [],
        IsCPACover: 'true',
        IsPaidDriver: 'false',
        IsUnnamedPassenger: 'false',
        CPATenure: 0,

        CoverAmount: 0,
        UnnamedPassengerCount: 0,
        OtherEmp: 0,
        LLPaidDriver: 'true',
        IMT34: 'false',
        IMT33: false,
        IsOverTurn: 'false',
        IsPACleaner: 'false',
        PACleanerCount: 0,
        IsPAConductor: 'false',
        PAConductorCount: 0,
        IsPAHelper: 'false',
        PAHelperCount: 0,
        IsLLCleaner: 'false',
        LLCleanerCount: 0,
        IsLLConductor: 'false',
        LLConductorCount: 0,
        IsLLHelper: 'false',
        LLHelperCount: 0,
        IsLLNFPP: 'false',
        LLNFPPCount: 0
    },
    ICs: [],
    GeoArea: [],
    ICList: '',
    AccessoriesValue: {
        ElectricalValue: '',
        NonElectricalValue: '',
        BiFuelValue: ''
    },
    ProposalId: 0,
    FKOEM_ID: 0,
    BHNumberSeries1: '',
    BHNumberSeries2: '',
    BHNumberSeries3: '',
    RegistrationNo1: '',
    RegistrationNo2: '',
    RegistrationNo3: '',
    SpecialRegistartionNo: '',
    LastYearAddOns: {
        ZeroDep: '0',
        ReturnToInvoice: '0',
        EngineProtect: '0'
    },
    extraFieldPropRequires: {
        IsMaskingEnabled: 0,
        IsEmailMasked: '',
        IsMobileMasked: '',
        IsAltMobMasked: ''
    },
    ClaimCount: 0,
    LastClaimDate: '',
    IsRegistrationDateOpt: 0,
    CPAReason: '',
    IsBifuel_Co_Fitted: 0
}

let IsFormValidationPassed = false
let servername = '';
function Policy() {
    const { state: newClick } = useLocation()
    const [isMapRtoOpen, setMapRto] = useState(false)
    const [VehicleCover, setVehicleCover] = useState([])
    const [VehicleRenewCover, setVehicleRenewCover] = React.useState([])
    const [ncbper, setNCBPer] = React.useState([])
    const [oem, setOem] = React.useState([])
    const [vehicleTypeList, setVehicleTypeList] = React.useState([])
    const [vehicleSubTypeList, setVehicleSubTypeList] = React.useState([])
    const [miscTypeList, setMiscTypeList] = React.useState([])
    const [builtTypeList, setBuiltTypeList] = React.useState([])
    const [make, setMake] = React.useState([])
    const [model, setModel] = React.useState([])
    const [variant, setVariant] = React.useState([])
    const [rto, setRTO] = React.useState([])
    const [states, setStates] = React.useState([])
    const [voluntryExcess, setVoluntryExcess] = React.useState([])
    const [geoarea, setGeoArea] = React.useState([])
    const [paunnamedpass, setPaUnnamedPassenger] = React.useState([])
    const [icList, setICList] = React.useState([])
    const mainICList = React.useRef([])
    const [disabled, setDisabled] = useState(true)
    const [disabledTMIInput, setTMIInput] = useState(false)
    const tmiRenewalData = React.useRef([])
    const [yom, setYOM] = React.useState([])
    const [isPIdPNoExists, setPIdPNoExists] = useState(false)
    const [disabledForVariant, setdisabledForVariant] = useState(false)
    const [insuranceCompany, setInsuranceCompany] = React.useState([])
    const [disableLLEmployee, setDisableLLEmployee] = useState(false)
    const [isSAOD, setIsSAOD] = useState(false)
    const [isSATP, setIsSATP] = useState(true)
    const [selectedOemId, setSelectedOemId] = useState(null)
    const [labelText, setLabelText] = useState("Ex-Showroom Price (STRICTLY as per Veh.)");
    //Setting Value on Page Load
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [Quotetype, setQuotetype] = useState(true);
    const { search } = useLocation()
    let ProposalId: string = searchParams.get('ProposalId') || ''
    ProposalId = decrypt(ProposalId)
    const urlQuery = new URLSearchParams(search)
    const stateParam = urlQuery.get('ProposalId')

    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )

    const encryptedMobEmail = useAppSelector<boolean>(
        (state: any) => state.encryptedMobEmail
    )

    let Input: PolicyMastersInput = {
        Id: loginSelector.DealerId,
        CoverType: 0,
        PolicyType: '',
        VehicleType: '',
        DealerId: loginSelector.DealerId,
        IsDemoVehicle: 0,
        PolicyNo: '',
        Name: '',
        Mode: '',
        Param2: 0,
        PolicyRenewType: 0,
        ProposalId: '',
        Quotetype:'0',
        FKOEM_ID:0,
        VehicleType:'PCP'
    }

    //Set The State Object
    const [lastYearAddons, setLastYearAddons] = useState(
        formDataObj.LastYearAddOns
    )
    let lastYearAddonsObj = { ...lastYearAddons }
    lastYearAddonsObj.ZeroDep = 'false'
    lastYearAddonsObj.ReturnToInvoice = 'false'
    lastYearAddonsObj.EngineProtect = 'false'

    const [policyData, setPolicyData] = React.useState(formDataObj)
    const [IsVisofSameDealer, setIsVisofSameDealer] = React.useState(true)

    const [otherData, setOtherData] = useState(
        formDataObj.extraFieldPropRequires
    )
    //#region Toggle Data
    let policyTypeToggleObj =loginSelector.DealerUserType!='P'? [
        {
            label: 'New',
            obj: policyData,
            settingState: setPolicyData,
            type: 'N',
            ObjectKey: 'PolicyDetails'
        },
        {
            label: 'Renew',
            obj: policyData,
            settingState: setPolicyData,
            type: 'R',
            ObjectKey: 'PolicyDetails'
        }
    ]:[
        
        {
            label: 'Renew',
            obj: policyData,
            settingState: setPolicyData,
            type: 'R',
            ObjectKey: 'PolicyDetails'
        }
    ]

    let carrierTypeToggleObj = [
        {
            label: 'Private',
            obj: policyData,
            settingState: setPolicyData,
            type: 'PVT',
            ObjectKey: 'VehicleDetails'
        },
        {
            label: 'Public',
            obj: policyData,
            settingState: setPolicyData,
            type: 'PUB',
            ObjectKey: 'VehicleDetails'
        }
    ]
    let vehicleTypeToggleObj = [
        {
            label: 'Private',
            obj: policyData,
            settingState: setPolicyData,
            type: 'P',
            ObjectKey: 'PolicyDetails'
        },
        {
            label: 'Commercial',
            obj: policyData,
            settingState: setPolicyData,
            type: 'C',
            ObjectKey: 'PolicyDetails'
        }
    ]
    let proposerTypeToggleObj = [
        {
            label: 'Individual',
            obj: policyData,
            settingState: setPolicyData,
            type: 'I',
            ObjectKey: 'PolicyDetails'
        },
        {
            label: 'Corporate',
            obj: policyData,
            settingState: setPolicyData,
            type: 'C',
            ObjectKey: 'PolicyDetails'
        }
    ]
    let QuoteToggleObj = [
        {
            label: 'Yes',
            obj: policyData,
            settingState: setPolicyData,
            type: '1',
            ObjectKey: 'PolicyDetails'
        },
        {
            label: 'No',
            obj: policyData,
            settingState: setPolicyData,
            type: '0',
            ObjectKey: 'PolicyDetails'
        }
    ]
    let transferCaseToggleObj = [
        {
            label: 'Yes',
            obj: policyData,
            settingState: setPolicyData,
            type: 'true',
            ObjectKey: 'Renew'
        },
        {
            label: 'No',
            obj: policyData,
            settingState: setPolicyData,
            type: 'false',
            ObjectKey: 'Renew'
        }
    ]
    let cliamAvailedToggleObj = [
        {
            label: 'Yes',
            obj: policyData,
            settingState: setPolicyData,
            type: 'true',
            ObjectKey: 'Renew'
        },
        {
            label: 'No',
            obj: policyData,
            settingState: setPolicyData,
            type: 'false',
            ObjectKey: 'Renew'
        }
    ]
    let prevPolTypeToggleObj = [
        {
            label: 'TMIBASL Policy',
            obj: policyData,
            settingState: setPolicyData,
            type: '1',
            ObjectKey: 'Renew'
        },
        {
            label: 'Non TMIBASL Policy',
            obj: policyData,
            settingState: setPolicyData,
            type: '3',
            ObjectKey: 'Renew'
        },
        {
            label: 'No Previous Policy',
            obj: policyData,
            settingState: setPolicyData,
            type: '2',
            ObjectKey: 'Renew'
        }
    ]
    let activeODPolicyObj = [
        {
            label: 'Yes',
            obj: policyData,
            settingState: setPolicyData,
            type: '1',
            ObjectKey: 'Renew'
        },
        {
            label: 'No',
            obj: policyData,
            settingState: setPolicyData,
            type: '0',
            ObjectKey: 'Renew'
        }
    ]
    let activeTPPolicy = [
        {
            label: 'Yes',
            obj: policyData,
            settingState: setPolicyData,
            type: '1',
            ObjectKey: 'Renew'
        },
        {
            label: 'No',
            obj: policyData,
            settingState: setPolicyData,
            type: '0',
            ObjectKey: 'Renew'
        }
    ]
    let cliamAvailedYear = [
        {
            label: 'First Year',
            obj: policyData,
            settingState: setPolicyData,
            type: '1',
            ObjectKey: 'Renew'
        },
        {
            label: 'First Year',
            obj: policyData,
            settingState: setPolicyData,
            type: '0',
            ObjectKey: 'Renew'
        },
        {
            label: 'First Year',
            obj: policyData,
            settingState: setPolicyData,
            type: '2',
            ObjectKey: 'Renew'
        }
    ]
    let listRenewVehicleCover = [
        { CoverTypeId: 1, CoverType: '1 OD + 1 TP' },
        { CoverTypeId: 6, CoverType: '1 OD + 0 TP' },
        { CoverTypeId: 2, CoverType: '0 OD + 1 TP' }
    ]
    let noPrevPolicy = [
        { CoverTypeId: 1, CoverType: '1 OD + 1 TP' },
        { CoverTypeId: 2, CoverType: '0 OD + 1 TP' }
        // { CoverTypeId: 6, CoverType: '1 OD + 0 TP' }
    ]
    //#endregion

    const [cpaval, setval] = React.useState(0)
    const [vehicleData, setVehicleData] = React.useState(
        formDataObj.VehicleDetails
    )

    const [biFuelAgreement, setBiFuelAgreement] = useState(false)

    let vehicleDataObj = { ...vehicleData }
    vehicleDataObj.IsVehicle = '1'
    vehicleDataObj.MakeId = 0
    vehicleDataObj.MakeName = ''
    vehicleDataObj.ModelId = 0
    vehicleDataObj.Model = ''
    vehicleDataObj.VariantId = 0
    vehicleDataObj.Variant = ''
    vehicleDataObj.ChassisNo = ''
    vehicleDataObj.EngineNo = ''
    vehicleDataObj.FuelTypeCode = ''
    vehicleDataObj.FuelType = ''
    vehicleDataObj.CubicCapacity = 0
    vehicleDataObj.SeatingCapacity = 0
    vehicleDataObj.GrossVehicleWeight = 0
    vehicleDataObj.ExShowroomPrice = 0
    vehicleDataObj.DateofManufacture = 0
    vehicleDataObj.RTOId = 0
    vehicleDataObj.RTOName = ''
        ; (vehicleDataObj.InvoiceDate = ''), //dayjs(new Date())
            (vehicleDataObj.RegistrationDate = ''), //dayjs(new Date())
            (vehicleDataObj.IsuredStateId = 0)
    vehicleDataObj.IsTestDrive = 'false'
    vehicleDataObj.VehicleType = ''
    vehicleDataObj.Kilowatt = 0
    vehicleDataObj.OnRoadPrice = 0
    vehicleDataObj.IS_BH_REGIST_NO = '0'
    vehicleDataObj.VEH_REGIST_NO = ''
    vehicleDataObj.RTO_NAME = ''
    vehicleDataObj.RegistrationNo1 = ''
    vehicleDataObj.RegistrationNo2 = ''

    const [customerDetails, setCustomerDetails] = React.useState(
        formDataObj.ProposerDetails
    )
    let customerDetailsObj = {}
    customerDetailsObj.SALUTATION = '0'
    customerDetailsObj.FIRST_NAME = ''
    customerDetailsObj.MIDDLE_NAME = ''
    customerDetailsObj.LAST_NAME = ''
    customerDetailsObj.COMPANY_SALUTATION = '0'
    customerDetailsObj.COMPANY_NAME = ''
    customerDetailsObj.EMAIL = ''
    customerDetailsObj.MOB_NO = ''
    customerDetailsObj.ALT_MOBILE_NO = ''

    const [additionalDiscounts, setAdditionalDiscounts] = React.useState(
        formDataObj.Discounts
    )


    const [icData, setICOnEdit] = React.useState([])
    const [optionalDetails, setOptionalDetails] = React.useState(
        formDataObj.Covers
    )
    const [futureDate, setPolicyFutureDate] = useState(
        // dayjs(new Date()).add(2, 'months')
        dayjs(new Date()).add(1, 'months')
    )

    const validEmailandMobile = useState(false)

    const resetMaxMinDates = () => {
        setMaxRegistration('')
        setMinRegistration('')
        setMinInvoice('')
        setMaxInvoice(dayjs(new Date()))
    }

    const getToggleButtonData = async (data: any, name: any) => {
        let currentObjectKey = ''
        if (name === 'PolicyType' && data == 'R' && data != false) {
            currentObjectKey = 'PolicyDetails'
            setPolicyData({
                ...policyData,
                [currentObjectKey]: {
                    ...policyData[currentObjectKey],
                    [name]: data
                },

                Renew: { ...policyData.Renew, ['RENEWAL_TYPE']: '1' },
                ['IS_BH_REGIST_NO']: '3'
            })
            if (name === 'PolicyType' && data != false) {
                let obj = {
                    name: name,
                    data: data
                }
                dispatch(updateProperty(obj))
            }

            setVehicleCover(listRenewVehicleCover)
            setValue('RENEWAL_TYPE', '1')
            setValue('IS_BH_REGIST_NO', '3')
            setTMIInput(true)
            setDisabled(true)
            reset({ ...control._formValues, ...formDataObj.LastYearAddons })
            getYOMFN(new Date().getFullYear().toString(), 'R')
            setValue('SAOD_POLICY', '0')
            let onchangeCoverObj = {
                PolicyType:
                    policyData.Renew.RENEWAL_TYPE == '2' || data == 'N'
                        ? 'N'
                        : 'R',
                VehicleType: policyData.PolicyDetails.VehClass,
                RenewalType: policyData.Renew.RENEWAL_TYPE
            }

            await getCoversTypebyIdforRenewFN(onchangeCoverObj)
        } else if (name === 'PolicyType' && data == 'N' && data != false) {
            getYOMFN(new Date().getFullYear().toString(), 'N')
            currentObjectKey = 'PolicyDetails'
            setPolicyData({
                ...policyData,
                [currentObjectKey]: {
                    ...policyData[currentObjectKey],
                    [name]: data
                },
                Renew: { ...policyData.Renew, ['RENEWAL_TYPE']: 0 },
                ['IS_BH_REGIST_NO']: '0'
            })
            if (name === 'PolicyType') {
                let obj = {
                    name: name,
                    data: data
                }
                dispatch(updateProperty(obj))
            }
            let onchangeCoverObj = {
                PolicyType:
                    policyData.Renew.RENEWAL_TYPE == '2' || data == 'N'
                        ? 'N'
                        : 'R',
                VehicleType: policyData.PolicyDetails.VehClass,
                RenewalType: policyData.Renew.RENEWAL_TYPE
            }
            // setValue('RENEWAL_TYPE', '0')
            // setValue('SAOD_POLICY', '0')
            vehicleDataObj.InvoiceDate = dayjs(new Date())
            await getCoversTypebyIdforRenewFN(onchangeCoverObj)
            reset({ ...control._formValues, ...customerDetailsObj })
            setCustomerDetails({ ...customerDetails, ...customerDetailsObj })
            reset({ ...control._formValues, ...vehicleDataObj })
            setVehicleData({ ...vehicleData, ...vehicleDataObj })
            reset({ ...control._formValues, ...formDataObj.Renew })
            setTMIInput(false)
            resetMaxMinDates()
            setMinRegistration(dayjs(new Date()))
            setMaxRegistration(dayjs(new Date()))
            dispatch(updateEncryptedMobEmail(false))
        } else if (name === 'PolicyType' && data != false) {
            currentObjectKey = 'PolicyDetails'
            setPolicyData({
                ...policyData,
                [currentObjectKey]: {
                    ...policyData[currentObjectKey],
                    [name]: data
                }
            })
            if (name === 'PolicyType') {
                let obj = {
                    name: name,
                    data: data
                }
                dispatch(updateProperty(obj))
            }
        } else if (name === 'RENEWAL_TYPE' && data == '1' && data != false) {
            setVehicleCover(null)
            currentObjectKey = 'Renew'
            setVehicleCover(listRenewVehicleCover)
            setDisabled(true)
            setTMIInput(true)
            setPolicyData({
                ...policyData,
                [currentObjectKey]: {
                    ...policyData[currentObjectKey],
                    [name]: data
                }
            })
            let obj = {
                name: 'RENEWAL_TYPE',
                data: '1'
            }
            setValue('RegistrationDate', '')
            setValue('InvoiceDate', '')

            resetMaxMinDates()

            dispatch(updateProperty(obj))
        }
        else if (name === 'Quotetype') {

            setValue('Quotetype', data);
            policyData.Quotetype = data;


        }
        else if (name === 'RENEWAL_TYPE' && data == '3' && data != false) {
            setVehicleCover(null)
            setVehicleCover(listRenewVehicleCover)
            currentObjectKey = 'Renew'
            setDisabled(false)
            setTMIInput(false)
            //setMake(null)
            // setModel(null)
            // setVariant(null)
            setPolicyData({
                ...policyData,
                [currentObjectKey]: {
                    ...policyData[currentObjectKey],
                    [name]: data
                },
                ['IsVoluntaryForward']: 'false'
            })
            let obj = {
                name: 'RENEWAL_TYPE',
                data: '3'
            }
            dispatch(updateProperty(obj))
            reset({ ...control._formValues, ...formDataObj.Renew })

            reset({ ...control._formValues, ...customerDetailsObj })
            setCustomerDetails({ ...customerDetails, ...customerDetailsObj })

            reset({ ...control._formValues, ...vehicleData })
            //setVehicleData({ ...vehicleData, ...vehicleData })

            reset({ ...control._formValues, ...formDataObj.Discounts })
            setAdditionalDiscounts({
                ...additionalDiscounts,
                ...formDataObj.Discounts
            })

            reset({ ...control._formValues, ...lastYearAddonsObj })
            setLastYearAddons({ ...lastYearAddons, ...lastYearAddonsObj })

            reset({
                ...control._formValues,
                ['INSURED_GSTIN']: '',
               // ['FKOEM_ID']: 0,
                ['CPATenure']: 0,
                ['IS_BH_REGIST_NO']: '3'
            })
            setValue('RENEWAL_TYPE', '3')
            dispatch(updateEncryptedMobEmail(false))
        } else if (name === 'RENEWAL_TYPE' && data == '2' && data != false) {
            currentObjectKey = 'Renew'
            setVehicleCover(null)
            setVehicleCover(noPrevPolicy)
            // let onchangeCoverObj = {
            //     PolicyType: policyData.PolicyDetails.PolicyType,
            //     VehicleType: policyData.PolicyDetails.VehClass
            // }
            // getCoversTypebyIdforRenewFN(onchangeCoverObj)
            setMaxInvoice(dayjs(new Date()))
            setDisabled(true)
            setPolicyData({
                ...policyData,
                [currentObjectKey]: {
                    ...policyData[currentObjectKey],
                    [name]: data
                },
                ['VoluntaryExcess']: 0,
                ['IsVoluntaryForward']: 'false',
                AccessoriesValue: {
                    ...policyData.AccessoriesValue,
                    ['ElectricalValue']: '',
                    ['NonElectricalValue']: '',
                    ['BiFuelValue']: ''
                }
            })
            setTMIInput(false)
            let obj = {
                name: 'RENEWAL_TYPE',
                data: '2'
            }
            dispatch(updateProperty(obj))

            resetMaxMinDates()
            reset({ ...control._formValues, ...customerDetailsObj })
            setCustomerDetails({
                ...customerDetails,
                ...formDataObj.ProposerDetails
            })

            reset({ ...control._formValues, ...vehicleData })
            //setVehicleData({ ...vehicleData, ...vehicleDataObj })

            reset({ ...control._formValues, ...formDataObj.Discounts })
            setAdditionalDiscounts({
                ...additionalDiscounts,
                ...formDataObj.Discounts
            })

            reset({ ...control._formValues, ...lastYearAddonsObj })
            setLastYearAddons({ ...lastYearAddons, ...lastYearAddonsObj })

            setOptionalDetails({
                ...optionalDetails,
                ['IsUnnamedPassenger']: 'false',
                ['CoverAmount']: 0,
                ['CPATenure']: 0
            })

            reset({
                ...control._formValues,
                ['INSURED_GSTIN']: '',
                //['FKOEM_ID']: 0,
                ['CPATenure']: 0,
                ['IS_BH_REGIST_NO']: '3',
                ['IsUnnamedPassenger']: 'false',
                ['SATP_POLICY']: '2'
            })
            dispatch(updateEncryptedMobEmail(false))
            //getFirstPageDataFN();
        } else if (name === 'ISTRANSFER' && data != false) {
            currentObjectKey = 'Renew'
            if (data == 'true') {
                setPolicyData({
                    ...policyData,
                    [currentObjectKey]: {
                        ...policyData[currentObjectKey],
                        [name]: data,
                        ['OLD_POL_NCB_LEVEL']: 0,
                        ['ISCLAIM_AVAILED']: 'false'
                    }
                })
                reset({
                    ...control._formValues,
                    ['ISCLAIM_AVAILED']: 'false',
                    ['OLD_POL_NCB_LEVEL']: 0
                })
                return
            }

            setPolicyData({
                ...policyData,
                [currentObjectKey]: {
                    ...policyData[currentObjectKey],
                    [name]: data
                }
            })
        } else if (
            name === 'ISCLAIM_AVAILED' &&
            common.isNotNullOrEmpty(data)
        ) {
            currentObjectKey = 'Renew'

            setDialog({
                ...dialog,
                ['open']: true,
                ['title']: 'NCB Selection',
                ['content']:
                    data == 'true'
                        ? HARD_CODE_VALUE.claimTaken
                        : HARD_CODE_VALUE.claimNotTaken,
                data: true,
                dialogType: 'confirm'
            })
        } else if (name === 'ProposalType' && data != false) {
            currentObjectKey = 'PolicyDetails'
            if (data === 'C') {
                setValue('IsCPACover', 'false')
                setValue('CPATenure', '0')
                reset({ ...control._formValues, ...customerDetailsObj })

                setCustomerDetails({
                    ...customerDetails,
                    ...customerDetailsObj
                })
                let EmpCount: number = 0
                setPolicyData({
                    ...policyData,
                    [currentObjectKey]: {
                        ...policyData[currentObjectKey],
                        [name]: data
                    }
                })
                if (data == 'C' && policyData.PolicyDetails.VehClass == 'P') {
                    setDisableLLEmployee(true)
                    EmpCount = vehicleData.SeatingCapacity
                }
                setOptionalDetails({
                    ...optionalDetails,
                    ['IsCPACover']: 'false',
                    ['OtherEmp']: EmpCount
                })
                setValue('OtherEmp', EmpCount)
            } else if (data === 'I') {
                console.log('IsCPACover' + data)
                setValue('IsCPACover', 'true')
                setValue('CPATenure', '0')
                reset({ ...control._formValues, ...customerDetailsObj })

                setCustomerDetails({
                    ...customerDetails,
                    ...customerDetailsObj
                })
                setPolicyData({
                    ...policyData,
                    [currentObjectKey]: {
                        ...policyData[currentObjectKey],
                        [name]: data
                    }
                })
                if (data == 'I' && policyData.PolicyDetails.VehClass == 'P') {
                    setDisableLLEmployee(false)
                }
                setOptionalDetails({
                    ...optionalDetails,
                    ['IsCPACover']: 'true',
                    ['OtherEmp']: 0
                })
            }
        } else if (name === 'VehClass' && data != false) {
            currentObjectKey = 'PolicyDetails'
            setValue('CoverTypeId', '0')
            setValue('PREV_COVERTYPE_ID', '0')
            setValue('CPATenure', '0')
            setVehicleData({
                ...vehicleData,
                ['FKVehicleType_ID']: data == 'C' ? 3 : 1
            })
            //setValue('IsIMT23', 'true')
            if (data == 'C') {
                setPolicyData({
                    ...policyData,

                    [currentObjectKey]: {
                        ...policyData[currentObjectKey],
                        [name]: data
                    }
                })

                await handleCommercialChanges()
                let onchangeCoverObj = {
                    PolicyType:
                        policyData.Renew.RENEWAL_TYPE == '2' ||
                            policyData.PolicyDetails.PolicyType == 'N'
                            ? 'N'
                            : 'R',
                    VehicleType: data,
                    Id: policyData.FKOEM_ID,
                    RenewalType: policyData.Renew.RENEWAL_TYPE
                }
                await getCoversTypebyIdforRenewFN(onchangeCoverObj)
            } else {
                handlePrivateChanges()

                let onchangeCoverObj = {
                    PolicyType:
                        policyData.Renew.RENEWAL_TYPE == '2' ||
                            policyData.PolicyDetails.PolicyType == 'N'
                            ? 'N'
                            : 'R',
                    VehicleType: data,
                    Id: policyData.FKOEM_ID,
                    RenewalType: policyData.Renew.RENEWAL_TYPE
                }

                //setValue('RENEWAL_TYPE', '0')
                await getCoversTypebyIdforRenewFN(onchangeCoverObj)
                //setVehicleCover(noPrevPolicy)
            }
        } else if (name === 'IsHavingTPPolicy' && !isNaN(parseInt(data))) {
            setPolicyData((prevData) => ({
                ...prevData,
                ['Renew']: {
                    ...prevData['Renew'],
                    ['IsHavingTPPolicy']: data
                }
            }))
            let obj = {
                POLICY_EXPIRY_DATE:
                    policyData.Renew.POLICY_EXPIRY_DATE != ''
                        ? dayjs(policyData.Renew.POLICY_EXPIRY_DATE).format(
                            'MM/DD/YYYY'
                        )
                        : '',
                TP_POLICY_EXPIRY_DATE:
                    policyData.Renew.TP_POLICY_EXPIRY_DATE != ''
                        ? dayjs(policyData.Renew.TP_POLICY_EXPIRY_DATE).format(
                            'MM/DD/YYYY'
                        )
                        : '',
                PREV_COVERTYPE_ID: policyData.Renew.PREV_COVERTYPE_ID,
                IsHavingODPolicy: policyData.Renew.IsHavingODPolicy,
                IsHavingTPPolicy: data,
                RENEWAL_TYPE: policyData.Renew.RENEWAL_TYPE
            }
            getApplicable_RenewCoverTypes(obj)
        } else if (name === 'IsHavingODPolicy' && !isNaN(parseInt(data))) {
            setPolicyData((prevData) => ({
                ...prevData,
                ['Renew']: {
                    ...prevData['Renew'],
                    ['IsHavingODPolicy']: data
                }
            }))
            let obj = {
                POLICY_EXPIRY_DATE:
                    policyData.Renew.POLICY_EXPIRY_DATE != ''
                        ? dayjs(policyData.Renew.POLICY_EXPIRY_DATE).format(
                            'MM/DD/YYYY'
                        )
                        : '',
                TP_POLICY_EXPIRY_DATE:
                    policyData.Renew.TP_POLICY_EXPIRY_DATE != ''
                        ? dayjs(policyData.Renew.TP_POLICY_EXPIRY_DATE).format(
                            'MM/DD/YYYY'
                        )
                        : '',
                PREV_COVERTYPE_ID: policyData.Renew.PREV_COVERTYPE_ID,
                IsHavingODPolicy: data,
                IsHavingTPPolicy: policyData.Renew.IsHavingTPPolicy,
                RENEWAL_TYPE: policyData.Renew.RENEWAL_TYPE
            }
            getApplicable_RenewCoverTypes(obj)
        } else if (name === 'CarrierType') {
            setVehicleData((prevData) => ({
                ...prevData,
                ['CarrierType']: data
            }))
        }
        if(name=="RENEWAL_TYPE"){
            if(oem.length==1){
                let onchangeCoverObj = {
                    PolicyType:
                       data == '2' ||
                        policyData.PolicyDetails.PolicyType == 'N'
                            ? 'N'
                            : 'R',
                   
                    Id: policyData.FKOEM_ID,
                    RenewalType: data
                }

                //setValue('RENEWAL_TYPE', '0')
               await getCoversTypebyIdforRenewFN(onchangeCoverObj)
            }
        }
    }

    const renewDefaultCoverTypes = React.useRef([])

    const [cpaWaiverReasonList, setCpaWaiverReasonList] = useState([])

    const getMasterDataFn = async () => {
        let masterData = await getMasterData(Input)
        if (masterData.status === 200) {
            const finalresponse = masterData.data;
            servername = finalresponse.EnvValue;
            if (ProposalId == 0 || ProposalId == '' || ProposalId == null) {
                setVehicleCover(finalresponse.VehicleCoverList.VehicleCover)
            } else {
                setVehicleCover(finalresponse.VehicleCoverList.VehicleCover)
            }
            renewDefaultCoverTypes.current =
                finalresponse.VehicleRenewCoverList.VehicleCover
            setVehicleRenewCover(
                finalresponse.VehicleRenewCoverList.VehicleCover
            )
            setNCBPer(finalresponse.EntitledNCBList.EntitledNCB)
            setCpaWaiverReasonList(finalresponse.CPA)
            setOem(finalresponse.OEMList.Oems)
            let oems = finalresponse.OEMList.Oems??[]
            if(oems.length==1){
                    let oemObject = oems[0];
                    setValue("FKOEM_ID",oemObject.OemId)
                    setPolicyData({ ...policyData, "FKOEM_ID":oemObject.OemId })
                    const mockEvent = {
                        target: {
                        value: oemObject.OemId,
                        name:"FKOEM_ID"
                        },
                    };
                    handleOemChange(mockEvent)

            }
            setRTO(finalresponse.RTOList.RTOsList)
            setStates(finalresponse.States.States)
            setVoluntryExcess(finalresponse.VoluntryExcessList.VoluntryExcess)
            setNCBPer(finalresponse.EntitledNCBList.EntitledNCB)
            setGeoArea(finalresponse.GeographicalAreaList.GeographicalAreas)
            setPaUnnamedPassenger(finalresponse.PaUnnamedList.PaUnnamed)

            setMiscTypeList(finalresponse.vehicleTypeMiscList.VehicleMiscTypes)
            if (finalresponse.ICList.ICs.length > 0) {
                finalresponse.ICList.ICs.forEach((ic) => {
                    ic.checked = false
                })
            }
            mainICList.current = finalresponse.ICList.ICs
            setICList(finalresponse.ICList.ICs)

            setInsuranceCompany(finalresponse.InsuranceCompanies.ICs)

            getYOMFN(new Date().getFullYear().toString(), 'N')
            if (ProposalId != 0 && ProposalId != '') {
                getFirstPageDataFN()
            }
        }
    }
    const getFirstPageDataFN = async () => {
        policyData.ProposalId = ProposalId
        setShowLoading(true)
        let data = await getFirstPageData(policyData)
        setShowLoading(false)
        if (data.status === 200) {
            setValue('Quotetype', data.data.Quotetype);

            setIsOldVehicle(data.data.VehicleAge === true);
            setLabelText(data.data.VehicleAge === true ? "Insured Declared Value (IDV)"
                : "Ex-Showroom Price (STRICTLY as per Veh.)")
            let onchangeCoverObj = {
                PolicyType:
                    data.data.Renew.RENEWAL_TYPE == '2' ||
                        data.data.PolicyDetails.PolicyType == 'N'
                        ? 'N'
                        : 'R',
                VehicleType: data.data.PolicyDetails.VehClass,
                // data.data.FKOEM_ID == 2
                //     ? 'C'
                //     : data.data.FKOEM_ID == 4
                //       ? 'T'
                //       : 'P',
                Id: data.data.FKOEM_ID,
                RenewalType: data.data.Renew.RENEWAL_TYPE
            }
            await getCoversTypebyIdforRenewFN(onchangeCoverObj)
            if (data.data.VehicleDetails.FKVehicleType_ID != 1) {
                await getVehicleSubTypesFn({
                    VehicleType: data.data.VehicleDetails.FKVehicleType_ID
                })
            }

            if (data.data.Renew.RENEWAL_TYPE == '2') {
                getYOMFN(new Date().getFullYear().toString(), 'R')
            } else if (
                data.data.Renew.RENEWAL_TYPE == '1' ||
                data.data.Renew.RENEWAL_TYPE == '3'
            ) {
                let obj = {
                    name: 'PolicyType',
                    data: 'R'
                }
                dispatch(updateProperty(obj))

                getYOMFN(new Date().getFullYear().toString(), 'R')
            }

            setCustomerDetails(data.data.ProposerDetails)

            const params = {
                DealerId: loginSelector.DealerId,
                OemId: data.data.FKOEM_ID,
                PolicyType: data.data.PolicyDetails.PolicyType
            }

            const result = await getICsbyOEM(params);
            setICList(result.ICList.ICs);

            data.data.VehicleDetails.FKOEM_ID = data.data.FKOEM_ID

            await getMakebyOemIdFN(
                data.data.VehicleDetails,
                loginSelector.DealerId
            )
            
            data.data.RegistrationDate = common.isNotNullOrEmpty(
                data.data.RegistrationDate
            )
                ? dayjs(common.get_CheckBlankDate(data.data.RegistrationDate))
                : ''
            data.data.BiFuelKit.KitInvoice = dayjs(
                common.get_CheckBlankDate(data.data.BiFuelKit.KitInvoice)
            )
            if (data.data.PolicyDetails.PolicyType == 'N')
                data.data.VehicleDetails.InvoiceDate = dayjs(new Date())
            else
                data.data.VehicleDetails.InvoiceDate = dayjs(
                    common.get_CheckBlankDate(
                        data.data.VehicleDetails.InvoiceDate
                    )
                )

            data.data.PolicyStartDate = dayjs(
                common.get_CheckBlankDate(data.data.PolicyStartDate)
            )
            data.data.Renew.POLICY_EXPIRY_DATE = dayjs(
                common.get_CheckBlankDate(data.data.Renew.POLICY_EXPIRY_DATE)
            )
            data.data.Renew.TP_POLICY_EXPIRY_DATE = dayjs(
                common.get_CheckBlankDate(data.data.Renew.TP_POLICY_EXPIRY_DATE)
            )
            data.data.Renew.POLICY_EFFECTIVE_DATE = dayjs(
                common.get_CheckBlankDate(data.data.Renew.POLICY_EFFECTIVE_DATE)
            )
            data.data.Renew.TPPOLICY_EFFECTIVE_DATE = dayjs(
                common.get_CheckBlankDate(
                    data.data.Renew.TPPOLICY_EFFECTIVE_DATE
                )
            )
            data.data.Renew.IsHavingTPPolicy =
                data.data.Renew.IsHavingTPPolicy.toString()
            data.data.Renew.IsHavingODPolicy =
                data.data.Renew.IsHavingODPolicy.toString()

            data.data.Renew.ISCLAIM_AVAILED =
                data.data.Renew.ISCLAIM_AVAILED.toString()
            data.data.Renew.ISTRANSFER = data.data.Renew.ISTRANSFER.toString()
            data.data.IsTestDrive = data.data.IsTestDrive.toString()

            data.data.Covers.IsPAConductor =
                data.data.Covers.IsPAConductor.toString()
            data.data.Covers.IsLLConductor =
                data.data.Covers.IsLLConductor.toString()
            data.data.Covers.IsPACleaner =
                data.data.Covers.IsPACleaner.toString()
            data.data.Covers.IsLLCleaner =
                data.data.Covers.IsLLCleaner.toString()
            data.data.Covers.IsPAHelper = data.data.Covers.IsPAHelper.toString()
            data.data.Covers.IsLLHelper = data.data.Covers.IsLLHelper.toString()
            data.data.Covers.IsLLNFPP = data.data.Covers.IsLLNFPP.toString()
            data.data.Covers.IMT34 = data.data.Covers.IMT34.toString()
            data.data.Covers.IsOverTurn = data.data.Covers.IsOverTurn.toString()
            let dataObject = {
                CoverTypeId: parseInt(data.data.PolicyDetails.CoverTypeId),
                INSURED_GSTIN: data.data.INSURED_GSTIN,
                FKOEM_ID: data.data.FKOEM_ID,
                IsuredStateId: data.data.IsuredStateId,
                IS_BH_REGIST_NO: data.data.IS_BH_REGIST_NO.toString(),
                BHNumberSeries1: data.data.BHNumberSeries1,
                BHNumberSeries2: data.data.BHNumberSeries2,
                BHNumberSeries3: data.data.BHNumberSeries3,
                IsNCBForward: data.data.Discounts.IsNCBForward.toString(),
                IsVoluntaryForward: data.data.IsVoluntaryForward.toString(),
                IsAA: data.data.Discounts.IsAA.toString(),
                IsAntiTheft: data.data.Discounts.IsAntiTheft.toString(),
                IsIMT23: data.data.Discounts.IsIMT23.toString(),
                VoluntaryExcess: data.data.Discounts.VoluntaryExcess.toString(),
                NCBLevel: data.data.Discounts.NCBLevel.toString(),
                IsTestDrive: data.data.IsTestDrive.toString(),
                DateofManufacture: parseInt(
                    data.data.VehicleDetails.DateofManufacture
                ),
                SpecialRegistartionNo: data.data.SpecialRegistartionNo,
                RegistrationDate: data.data.RegistrationDate,
                TP_PREV_TENURE: data.data.TP_PREV_TENURE,
                VehClass: data.data.PolicyDetails.VehClass,
                ExShowroomPrice: data.data.VehilceIDV,
                PolicyStartDate: data.data.PolicyStartDate,
                MaxExShowroom: data.data.MaxExShowroom,
                MinExShowroom: data.data.MinExShowroom,
                CPAReason: data.data.CPAReason
            }
            let [OdTenure, TpTenure] = getOD_TPTenures(dataObject.CoverTypeId)

            setval(TpTenure)
            //setValue('CPATenure', TpTenure.toString())
            let optionalObject = {
                IsUnnamedPassenger:
                    data.data.Covers.IsUnnamedPassenger.toString(),
                IsCPACover: data.data.Covers.IsCPACover.toString(),
                CPATenure: data.data.Covers.CPATenure,
                IsPaidDriver: data.data.Covers.IsPaidDriver.toString(),
                CoverAmount: data.data.Covers.CoverAmount.toString(),
                LLPaidDriver:"true"
            }
            let renewalObject = {
                PREV_POLICY_NO: data.data.Renew.PREV_POLICY_NO,
                FKISURANCE_COMP_ID: data.data.Renew.FKISURANCE_COMP_ID,
                ISCLAIM_AVAILED: data.data.Renew.ISCLAIM_AVAILED.toString()
            }
            let prevPolAddon = {
                EngineProtect:
                    data.data.LastYearAddOns.EngineProtect.toString(),
                ReturnToInvoice:
                    data.data.LastYearAddOns.ReturnToInvoice.toString(),
                ZeroDep: data.data.LastYearAddOns.ZeroDep.toString()
            }

            let obj = {
                ...data.data.PolicyDetails,
                ...data.data.ProposerDetails,
                ...data.data.VehicleDetails,
                ...data.data.Discounts,
                ...data.data.Covers,
                ...data.data.Renew,
                ...prevPolAddon,
                ...dataObject,
                ...optionalObject,
                ...renewalObject
            }
            setPolicyData({ ...policyData, ...data.data })
            setAdditionalDiscounts({ ...data.data.Discounts, ...dataObject })
            setPolicyData({
                ...data.data,
                ['IsVoluntaryForward']: dataObject.IsVoluntaryForward.toString()
            })
            setVehicleData({ ...data.data.VehicleDetails, ...dataObject })
            setOptionalDetails({ ...data.data.Covers, ...optionalObject })

            setdisabledForVariant(true)
            reset({ ...control._formValues, ...obj })

            if (
                data.data.Renew.RENEWAL_TYPE == '2' ||
                data.data.PolicyDetails.PolicyType == 'N'
            ) {
                setValue('SATP_POLICY', '2')
            } else {
                setValue('SATP_POLICY', '0')
            }
            setValue('SAOD_POLICY', '0')
            // if (data.data.Renew.PREV_COVERTYPE_ID == 6) {
            //     setValue('SAOD_POLICY', '1')
            // } else {
            //     setValue('SAOD_POLICY', '0')
            // }

            if (
                common
                    .get_CheckEmptyString(
                        data.data.VehicleDetails.VehicleSubType
                    )
                    .toUpperCase() == 'TRAILER'
            )
                setValue('IsTrailer', '1')
            else setValue('IsTrailer', '0')

            if (data.data.PolicyDetails.ProposalType == 'C') {
                setValue('IsCPACover', 'false')
                unregister('CPAReason')
            }

            if (data.data.Renew.RENEWAL_TYPE == '1' && ProposalId != 0) {
                setTMIInput(true)
                setPIdPNoExists(true)
                setdisabledForVariant(true)

                let SearchPrevPolData = {
                    PolicyNo: data.data.Renew.PREV_POLICY_NO,
                    DealerId: loginSelector.DealerId,
                    UserID: loginSelector.UserId,
                    PolicyRenewType: '1',
                    PolicyType: 'R'
                }

                let prevPolData =
                    await getVISoFPrevPolicyData(SearchPrevPolData)
                if (prevPolData.status === 200) {

                    if(prevPolData.data.Renew.PREV_POLICY_NO=="NOT FOUND"){
                        toast.error("Policy not found against this Policy No.")
                        return
                    }
                    if (
                        prevPolData.data.Renew.PREV_POLICY_NO != '' &&
                        prevPolData.data.Renew.PREV_POLICY_NO != null
                    ) {
                        if (
                            prevPolData.data.DealerId != loginSelector.DealerId
                        ) {
                            maskMobEmail(prevPolData.data)
                            dispatch(updateEncryptedMobEmail(true))
                        } else {
                            dispatch(updateEncryptedMobEmail(false))
                        }
                    }
                }
            }

            if (
                data.data.VehicleDetails.InvoiceDate != '' &&
                data.data.VehicleDetails.InvoiceDate != null &&
                data.data.PolicyDetails.PolicyType == 'R'
            ) {
                setRegistrationInvoiceOnRenew(data.data)
            }
            objTenureInputModel.DealerId = loginSelector.DealerId
            objTenureInputModel.CoverType = parseInt(
                data.data.PolicyDetails.CoverTypeId
            )
            objTenureInputModel.PolicyType = data.data.PolicyDetails.PolicyType
            await getTenureFN(objTenureInputModel)

            const response = await getVehiclebyOemId({
                Id: data.data.FKOEM_ID
            })
            if (response != null && response.data != null) {
                setVehicleTypeList(response.data)
            }
            if (
                data.data.Renew.RENEWAL_TYPE == '1' ||
                data.data.Renew.RENEWAL_TYPE == '3'
            ) {
                let coverTypeObject = {
                    POLICY_EXPIRY_DATE: dayjs(
                        data.data.Renew.POLICY_EXPIRY_DATE
                    ).format('MM/DD/YYYY'),
                    TP_POLICY_EXPIRY_DATE:
                        data.data.Renew.TP_POLICY_EXPIRY_DATE != ''
                            ? dayjs(
                                data.data.Renew.TP_POLICY_EXPIRY_DATE
                            ).format('MM/DD/YYYY')
                            : '',
                    PREV_COVERTYPE_ID: data.data.Renew.PREV_COVERTYPE_ID,
                    IsHavingODPolicy: data.data.Renew.IsHavingODPolicy.toString(),
                    IsHavingTPPolicy: data.data.Renew.IsHavingTPPolicy.toString(),
                    RENEWAL_TYPE: data.data.Renew.RENEWAL_TYPE
                }
                getApplicable_RenewCoverTypes(coverTypeObject)
            }

            if (
                data.data.Renew.RENEWAL_TYPE == '1' ||
                data.data.Renew.RENEWAL_TYPE == '3'
            ) {
                reset({ ...control._formValues, ...prevPolAddon })
                setLastYearAddons({ ...lastYearAddons, ...prevPolAddon })

                if (
                    
                    (data.data.GeoArea.length > 0 ||
                        data.data.AccessoriesValue.BiFuelValue > 0)
                ) {
                    setBiFuelAgreement(true)
                }
            }
        }
    }
    const getMakebyOemIdFN = async (vehDetails: any, DealerId) => {
        Input.Id = vehDetails.FKOEM_ID
        Input.DealerId = DealerId
        let response = await getMakebyOemId(Input)
        let makesArr = response.data.Makes ?? []
        
        if(makesArr.length==1){
            let makesObject = makesArr[0];
            setValue("MakeId",makesObject.MakeId)    
  
            setVehicleData({...vehicleData,"MakeId":makesObject.MakeId,"FKVehicleType_ID":vehDetails.FKVehicleType_ID,"VehicleType":Input.VehicleType })
            vehDetails.MakeId = makesObject.MakeId
        }

        setMake(makesArr)
        if(vehDetails.MakeId!=0)
            await getModelbyMakeIdFN(vehDetails)
    }
    const getModelbyMakeIdFN = async (vehDetails: any) => {
        Input.Id = vehDetails.MakeId
        Input.Param2 = vehDetails.FKOEM_ID
        Input.VehicleType = vehDetails.FKVehicleType_ID
        let response = await getModelbyMakeId(Input)
        setModel(response.data.Models)
        if(vehDetails.ModelId!=undefined &&vehDetails.ModelId != 0)
            await getVariantsbyModelFN(vehDetails)
    }
    const getVariantsbyModelFN = async (vehDetails: any) => {
        Input.Id = vehDetails.ModelId
        Input.Param2 = vehDetails.FKOEM_ID
        let response = await getVariantsbyModel(Input)
        setVariant(response.data.Variants)
    }
    let DroppDownObject = {
        oem: oem,
        rto: rto,
        states: states,
        ncbper: ncbper,
        voluntryExcess: voluntryExcess,
        geoarea: geoarea,
        paunnamedpass: paunnamedpass
    }
    const handleClickShowRTOMapping = () => {
        setMapRto(true)
    }
    let objTenureInputModel = new TenureDetailsInputModel()
    const handleInputChange = (event: any) => {
        const { target } = event
        const { name, value } = target
        if (name === 'CoverTypeId') {

            if(getOD_TPTenures(event.target.value)[1] >=1){
                setValue('LLPaidDriver', 'true')
            }
            if (
                event.target.value == 5 ||
                event.target.value == 4 ||
                event.target.value == 7
            ) {
                setOptionalDetails({
                    ...optionalDetails,
                    ['IsCPACover']: 'true',
                    ['CPATenure']: 3
                })
                setValue('IsCPACover', 'true')
            } else if (event.target.value == 6) {
                setOptionalDetails({
                    ...optionalDetails,
                    ['IsCPACover']: 'false',
                    ['CPATenure']: 0
                })

                reset({
                    ...control._formValues,
                    ['IsCPACover']: 'false',
                    ['CPATenure']: 0,
                    ['SATP_POLICY']: '0'
                })
            } else {
                setOptionalDetails({
                    ...optionalDetails,
                    ['IsCPACover']: 'true',
                    ['CPATenure']: 1
                })

                reset({
                    ...control._formValues,
                    ['IsCPACover']: 'true',
                    ['CPATenure']: 1,
                    ['CoverTypeId']: value
                })
            }

            objTenureInputModel.DealerId = loginSelector.DealerId
            objTenureInputModel.CoverType = value
            objTenureInputModel.PolicyType = policyData.PolicyDetails.PolicyType
            getTenureFN(objTenureInputModel)

            let [OdTenure, TpTenure] = getOD_TPTenures(event.target.value)
            setval(TpTenure)
            setValue('CPATenure', TpTenure)
            reset({
                ...control._formValues
                //['CPATenure']: TpTenure
            })
            let CPAReason = policyData.CPAReason
            if (TpTenure != 0) {
                CPAReason = ''

                unregister('CPAReason')
                //setValue('CPAReason', '')
            } else {
                register('CPAReason', { required: true })
                setValue('CPAReason', '')
            }
            if (OdTenure == 0) {
                setPolicyData({
                    ...policyData,
                    ['CPAReason']: CPAReason,
                    PolicyDetails: {
                        ...policyData.PolicyDetails,
                        [name]: value
                    },
                    ['VoluntaryExcess']: 0,
                    ['IsVoluntaryForward']: 'false',
                    AccessoriesValue: {
                        ...policyData.AccessoriesValue,
                        ['ElectricalValue']: '',
                        ['NonElectricalValue']: ''
                    }
                })
            } else
                setPolicyData({
                    ...policyData,
                    ['CPAReason']: CPAReason,
                    PolicyDetails: {
                        ...policyData.PolicyDetails,
                        [name]: value
                    }
                })
            return
            //checkDuplicacyOnChassisFN()
            //GetProductbyCoverPolicyTypeFN(value)
        } else if (name === 'ProposalType') {
            if (event.target.value === 'I') {
                setProposerType((policyData.PolicyDetails.ProposalType = 'I'))
            } else if (event.target.value === 'C') {
                setProposerType((policyData.PolicyDetails.ProposalType = 'C'))
            }
        } else if (name === 'ChassisNo') {
            setVehicleData({ ...vehicleData, [name]: value })
        } else if (name === 'EngineNo') {
            setVehicleData({ ...vehicleData, [name]: value })
        } else if (name === 'ClaimCount') {
            setPolicyData({ ...policyData, [name]: value })
        }
        setPolicyData({
            ...policyData,
            PolicyDetails: { ...policyData.PolicyDetails, [name]: value }
        })
    }
    const handleRenewChange = (event: any) => {
        const { target } = event
        const { name, value } = target

        if (name == 'PREV_COVERTYPE_ID') {
            // let onchangeCoverObj = {
            //     PolicyType: policyData.Renew.RENEWAL_TYPE == '3' ? 'R' : 'N',
            //     VehicleType: policyData.PolicyDetails.VehClass,
            //     Id: policyData.VehicleDetails.FKOEM_ID
            // }

            // //trigger('POLICY_EXPIRY_DATE')

            // //unregister(['POLICY_EXPIRY_DATE'])

            // getCoversTypebyIdforRenewFN(onchangeCoverObj)

            setValue('OLD_POL_NCB_LEVEL', '0')

            checkRegistrationInvoice(value, name)

            if (value == 6) {
                // reset({
                //     ...control._formValues,
                //     ['SATP_POLICY']: '0',
                //     ['SAOD_POLICY']: '1'
                // })
                setPolicyData((prevData) => ({
                    ...prevData,
                    ['RegistrationDate']: '',
                    ['VehicleDetails']: {
                        ...prevData['VehicleDetails'],
                        ['InvoiceDate']: ''
                    },
                    ['Renew']: {
                        ...prevData['Renew'],
                        ['IsHavingTPPolicy']: '0',
                        ['OLD_POL_NCB_LEVEL']: 0,
                        [name]: value
                    }
                }))
            } else if (value == 2 || value == 4) {
                // reset({
                //     ...control._formValues,
                //     ['SATP_POLICY']: '1',
                //     ['SAOD_POLICY']: '0'
                // })
                setPolicyData({
                    ...policyData,
                    ['RegistrationDate']: '',
                    ['VehicleDetails']: {
                        ...policyData['VehicleDetails'],
                        ['InvoiceDate']: ''
                    },
                    ['Renew']: {
                        ...policyData['Renew'],
                        ['IsHavingTPPolicy']: '0',
                        ['OLD_POL_NCB_LEVEL']: 0,
                        ['ISCLAIM_AVAILED']: 'false',
                        ['POLICY_EXPIRY_DATE']: dayjs(new Date()).format(
                            'MM/DD/YYYY'
                        ),
                        [name]: value
                    }
                })

                setValue('POLICY_EXPIRY_DATE', dayjs(new Date()))
                //unregister('POLICY_EXPIRY_DATE')
            } else {
                // reset({
                //     ...control._formValues,
                //     ['SATP_POLICY']: '0',
                //     ['SAOD_POLICY']: '0'
                // })
                setPolicyData({
                    ...policyData,
                    ['RegistrationDate']: '',
                    ['VehicleDetails']: {
                        ...policyData['VehicleDetails'],
                        ['InvoiceDate']: ''
                    },
                    ['Renew']: {
                        ...policyData['Renew'],
                        ['IsHavingTPPolicy']: '0',
                        ['OLD_POL_NCB_LEVEL']: 0,
                        [name]: value
                    }
                })
            }
            let obj = {
                POLICY_EXPIRY_DATE:
                    policyData.Renew.POLICY_EXPIRY_DATE != ''
                        ? dayjs(policyData.Renew.POLICY_EXPIRY_DATE).format(
                            'MM/DD/YYYY'
                        )
                        : '',
                TP_POLICY_EXPIRY_DATE:
                    policyData.Renew.TP_POLICY_EXPIRY_DATE != ''
                        ? dayjs(policyData.Renew.TP_POLICY_EXPIRY_DATE).format(
                            'MM/DD/YYYY'
                        )
                        : '',
                PREV_COVERTYPE_ID: value,
                IsHavingODPolicy: policyData.Renew.IsHavingODPolicy.toString(),
                IsHavingTPPolicy: policyData.Renew.IsHavingTPPolicy.toString(),
                RENEWAL_TYPE: policyData.Renew.RENEWAL_TYPE
            }
            getApplicable_RenewCoverTypes(obj)
        } else {
            let NCBPER: number = 0
            NCBPER = policyData.Renew.OLD_POL_NCB_PER
            if (name == 'OLD_POL_NCB_LEVEL') {
                NCBPER = ncbper.filter((x) => x.EntitledNCBValue == value)[0][
                    'EntitledNCBLabel'
                ]
            }
            setPolicyData({
                ...policyData,

                ['Renew']: {
                    ...policyData['Renew'],
                    [name]: value,
                    ['OLD_POL_NCB_PER']: NCBPER
                }
            })
        }
    }
    const getDate = (Data: any, Name: any) => {
        const FormattedData = dayjs(Data)
        if (Name == 'PolicyStartDate') {
            setPolicyData({ ...policyData, [Name]: FormattedData })
        } else {
            setPolicyData({
                ...policyData,
                PolicyDetails: {
                    ...policyData.PolicyDetails,
                    [Name]: FormattedData
                }
            })
        }
    }
    const getDate1 = (Data: any, Name: any, nestedObject: any) => {
        const FormattedData = dayjs(Data)
        if (Name === 'POLICY_EXPIRY_DATE') {
            setPolicyData({
                ...policyData,

                [nestedObject]: {
                    ...policyData[nestedObject],
                    [Name]: FormattedData
                },

                ['RegistrationDate']: '',
                ['VehicleDetails']: {
                    ...policyData['VehicleDetails'],
                    ['InvoiceDate']: ''
                }
            })

            //setValue('RegistrationDate', '')
            //setValue('InvoiceDate', '')

            if (Name === 'POLICY_EXPIRY_DATE' && Data != '') {
                checkRegistrationInvoice(Data, Name)
            }
            let obj = {
                POLICY_EXPIRY_DATE: dayjs(FormattedData).format('MM/DD/YYYY'),
                TP_POLICY_EXPIRY_DATE:
                    policyData.Renew.TP_POLICY_EXPIRY_DATE != ''
                        ? dayjs(policyData.Renew.TP_POLICY_EXPIRY_DATE).format(
                            'MM/DD/YYYY'
                        )
                        : '',
                PREV_COVERTYPE_ID: policyData.Renew.PREV_COVERTYPE_ID,
                IsHavingODPolicy: policyData.Renew.IsHavingODPolicy.toString(),
                IsHavingTPPolicy: policyData.Renew.IsHavingTPPolicy.toString(),
                RENEWAL_TYPE: policyData.Renew.RENEWAL_TYPE
            }
            getApplicable_RenewCoverTypes(obj)
        } else if (Name === 'LastClaimDate') {
        } else if (Name == 'TP_POLICY_EXPIRY_DATE' && Data != '') {
            setPolicyData({
                ...policyData,
                [nestedObject]: {
                    ...policyData[nestedObject],
                    [Name]: FormattedData
                },

                //['RegistrationDate']: '',
                ['VehicleDetails']: {
                    ...policyData['VehicleDetails'],
                    ['InvoiceDate']: ''
                }
            })
            //setValue('RegistrationDate', '')
            //setValue('InvoiceDate', '')
            checkRegistrationInvoice(Data, Name)
            let obj = {
                POLICY_EXPIRY_DATE:
                    policyData.Renew.POLICY_EXPIRY_DATE != ''
                        ? dayjs(policyData.Renew.POLICY_EXPIRY_DATE).format(
                            'MM/DD/YYYY'
                        )
                        : '',
                TP_POLICY_EXPIRY_DATE:
                    dayjs(FormattedData).format('MM/DD/YYYY'),
                PREV_COVERTYPE_ID: policyData.Renew.PREV_COVERTYPE_ID,
                IsHavingODPolicy: policyData.Renew.IsHavingODPolicy.toString(),
                IsHavingTPPolicy: policyData.Renew.IsHavingTPPolicy.toString(),
                RENEWAL_TYPE: policyData.Renew.RENEWAL_TYPE
            }
            getApplicable_RenewCoverTypes(obj)
        } else {
            setPolicyData({
                ...policyData,
                [nestedObject]: {
                    ...policyData[nestedObject],
                    [Name]: FormattedData
                }
            })
        }
    }
    const calculateTP_OD_Diff = (CoverType) => {
        const checkDays = dayjs(policyData.Renew.TP_POLICY_EXPIRY_DATE).diff(
            policyData.Renew.POLICY_EXPIRY_DATE,
            'day'
        )
        if (CoverType == 'OD') return checkDays >= 0
        else if (CoverType == 'TP') return checkDays <= 0
    }
    //#region Validation Section Start
    const {
        handleSubmit,
        control,
        setFocus,
        register,
        formState: { errors },
        setValue,
        trigger,
        setError,
        unregister,
        clearErrors,
        reset
    } = useForm<PolicyDetailsSchemaType>({
        mode: 'all',
        reValidateMode: 'all',
        resolver: zodResolver(policyDetailsSchema),
        // shouldUnregister: true,
        defaultValues: {
            PolicyType: loginSelector.DealerUserType!='P'?'N':'R',
            RENEWAL_TYPE: '0',
            ISTRANSFER: 'false',
            ISCLAIM_AVAILED: 'false',
            VehClass: 'P',
            ProposalType: 'I',
            IS_BH_REGIST_NO: '0',
            IsVehicle: '1',
            IsNCBForward: 'false',
            IsAntiTheft: 'false',
            IsAA: 'false',
            IsHandicapped: 'false',
            IsVoluntaryForward: 'false',
            IsIMT23: 'false',
            IsCPACover: 'true',
            IsUnnamedPassenger: 'false',
            IsPaidDriver: 'false',
            LLPaidDriver: 'true',
            CoverTypeId: 0,
            FKOEM_ID: '0',
            MakeId: '0',
            ModelId: '0',
            VariantId: '0',
            IsuredStateId: '0',
            RTOId: '0',
            DateofManufacture: 0,
            CPATenure: 0,
            VoluntaryExcess: 0,
            NCBLevel: 0,
            ZeroDep: 'false',
            ReturnToInvoice: 'false',
            EngineProtect: 'false',
            PREV_COVERTYPE_ID: '0',
            SAOD_POLICY: '0',
            EngineStatus: '0',
            ChassisStatus: '0',
            COMPANY_NAME: '',
            CoverAmount: 0,
            FKISURANCE_COMP_ID: 0,
            OLD_POL_NCB_LEVEL: 0,
            InvoiceDate: dayjs(new Date()),
            SATP_POLICY: '2',
            CPAReason: '',
            SALUTATION: '',
            COMPANY_SALUTATION: '',
            VehicleSubType: '',
            MiscType: '',
            BuiltType: '',
            FKVehicleType_ID: 2,
            FKVehicleSubType_ID: 0,
            FKMiscType_ID: 0,
            FKBuiltType_ID: 0,
            IsTrailer: '0',
            TrailerNo: 0,
            IsTrailerNo: '0',
            Kilowatt: 0,
            Quotetype: '0'
        }
    })

    const checkDuplicacyOnEmailMobile = async () => {
        let objData = {
            ProposerDetails: {},
            VehicleDetails: {}
        }
        objData.ProposerDetails.PROPOSAL_TYPE =
            policyData.PolicyDetails.ProposalType;
        objData.ProposerDetails.MOB_NO = customerDetails.MOB_NO;
        objData.ProposerDetails.ALT_MOBILE_NO = customerDetails.ALT_MOBILE_NO;
        objData.ProposerDetails.EMAIL = customerDetails.EMAIL;
        objData.VehicleDetails.CHASSIS_NO = vehicleData.ChassisNo;
        objData.ProposerDetails.INSURD_NAME =
            customerDetails.FIRST_NAME +
            customerDetails.MIDDLE_NAME +
            customerDetails.LAST_NAME
        const isDuplicacyFound = await checkDupMobileEmail(objData)
        if (isDuplicacyFound.status == 200) {
            const result = isDuplicacyFound.data
            if (
                result.ErrorCode === 0 &&
                result.Param1 === '0' &&
                result.Param2 === 0
            ) {
                return true
            } else if (result.ErrorCode == 1 && result.Param2 == 1) {
                return false
            } else if (result.Param1 == '1' && result.Param2 == 1) {
                return false
            } else if (result.ErrorCode == 1 && result.Param2 == 0) {
                return false
            } else if (
                result.ErrorCode == 0 &&
                result.Param1 == '1' &&
                result.Param2 == 0
            ) {
                return false
            } else if (
                result.ErrorCode == 0 &&
                result.Param1 == '0' &&
                result.Param2 == 1
            ) {
                return false
            }
        }
    }

    const onSubmit: SubmitHandler<PolicyDetailsSchemaType> = async (data) => {
        if (policyData.Renew.RENEWAL_TYPE != '1') {
            const isValid = await checkDuplicacyOnEmailMobile()

            if (!isValid) {
                toast.error(
                    'Email or Mobile No. already exists for another Policy.'
                )
                return
            }
        }
        if (control._formValues.ChassisStatus == '1') {
            IsFormValidationPassed = true
        } else if (
            vehicleData.ChassisNo.length < 16 &&
            control._formValues.ChassisStatus == '0'
        ) {
            toast.error('Chassis no. should be of a minimum of 16 digits.')
            IsFormValidationPassed = false
            return false
        }
        if (control._formValues.EngineStatus == '1') {
            IsFormValidationPassed = true
        } else if (
            (vehicleData.EngineNo.length < 4 || vehicleData.EngineNo.length > 25)
            &&
            control._formValues.EngineStatus == '0'
        ) {
            toast.error('Engine no should be between 4 to 25 digit')
            IsFormValidationPassed = false
            return false
        }
        let IsChassisPassed = isAlphaNumeric(vehicleData.ChassisNo)
        let IsEnginePassed = isAlphaNumeric(vehicleData.EngineNo)
        policyData.PolicyDetails.CoverTypeId = control._formValues.CoverTypeId
        policyData.UserID = loginSelector.UserId
        policyData.DealerId = loginSelector.DealerId
        policyData.ProposalId = ProposalId
        policyData.ICs = icList.map((e) => e.ICId)

        if (
            policyData.PolicyDetails.PolicyType == 'R' &&
            (policyData.Renew.RENEWAL_TYPE == '3' ||
                policyData.Renew.RENEWAL_TYPE == '1')
        ) {
            if (
                policyData.Renew.PREV_COVERTYPE_ID == 1 ||
                policyData.Renew.PREV_COVERTYPE_ID == 3
            ) {
                if (
                    !(
                        dayjs(policyData.Renew.POLICY_EXPIRY_DATE).format(
                            'DD/MM/YYYY'
                        ) ==
                        dayjs(policyData.Renew.TP_POLICY_EXPIRY_DATE).format(
                            'DD/MM/YYYY'
                        )
                    )
                ) {
                    setDialog({
                        ...dialog,
                        ['open']: true,
                        ['title']: 'Invalid Dates',
                        ['content']:
                            'Previous Policy OD and TP Expiry should be same.',
                        data: false,
                        dialogType: 'alert'
                    })

                    return
                }
            }
            if (
                (dayjs(new Date()).add(60, 'day') <
                    dayjs(policyData.Renew.POLICY_EXPIRY_DATE) ||
                    dayjs(new Date()).add(60, 'day') <
                    dayjs(policyData.Renew.TP_POLICY_EXPIRY_DATE)) &&
                policyData.PolicyDetails.CoverTypeId == 1
            ) {
                setDialog({
                    ...dialog,
                    ['open']: true,
                    ['title']: 'Invalid Dates',
                    ['content']:
                        'Expiry Dates should not be greater than 60 days to continue the renewal.',
                    data: false,
                    dialogType: 'alert'
                })
                return
            } else if (
                policyData.PolicyDetails.CoverTypeId == 6 &&
                dayjs(new Date()).add(60, 'day') <
                dayjs(policyData.Renew.POLICY_EXPIRY_DATE)
            ) {
                setDialog({
                    ...dialog,
                    ['open']: true,
                    ['title']: 'Invalid Dates',
                    ['content']:
                        'OD Expiry Date should not be greater than 60 days to continue the renewal.',
                    data: false,
                    dialogType: 'alert'
                })
                return
            } else if (
                policyData.PolicyDetails.CoverTypeId == 2 &&
                dayjs(new Date()).add(60, 'day') <
                dayjs(policyData.Renew.TP_POLICY_EXPIRY_DATE)
            ) {
                setDialog({
                    ...dialog,
                    ['open']: true,
                    ['title']: 'Invalid Dates',
                    ['content']:
                        'TP Expiry Date should not be greater than 60 days to continue the renewal.',
                    data: false,
                    dialogType: 'alert'
                })
                return
            }
            policyData.Renew.POLICY_EFFECTIVE_DATE = dayjs(
                policyData.Renew.POLICY_EFFECTIVE_DATE
            ).format('MM/DD/YYYY')
            policyData.Renew.POLICY_EXPIRY_DATE = dayjs(
                policyData.Renew.POLICY_EXPIRY_DATE
            ).format('MM/DD/YYYY')
            policyData.Renew.TP_POLICY_EXPIRY_DATE = dayjs(
                policyData.Renew.TP_POLICY_EXPIRY_DATE
            ).format('MM/DD/YYYY')
            policyData.Renew.TPPOLICY_EFFECTIVE_DATE = dayjs(
                policyData.Renew.TPPOLICY_EFFECTIVE_DATE
            ).format('MM/DD/YYYY')
        }

        policyData.PolicyStartDate = dayjs(policyData.PolicyStartDate).isValid()
            ? dayjs(policyData.PolicyStartDate).format('MM/DD/YYYY')
            : ''
        if (policyData.Renew.RENEWAL_TYPE == '2')
            policyData.PolicyStartDate = dayjs(new Date()).format('MM/DD/YYYY')

        vehicleData.InvoiceDate = dayjs(vehicleData.InvoiceDate).isValid()
            ? dayjs(vehicleData.InvoiceDate).format('MM/DD/YYYY')
            : ''
        policyData.RegistrationDate = dayjs(
            policyData.RegistrationDate
        ).isValid()
            ? dayjs(policyData.RegistrationDate).format('MM/DD/YYYY')
            : ''
        if (policyData.INSURED_GSTIN?.length >= 2) {
            const obj = {}
            obj.StateId = policyData.IsuredStateId
            let response = await getGSTStateCode(obj)
            if (response.status == 200 && response != null) {
                const gstincode = response.data.GstStateCode
                if (policyData.INSURED_GSTIN?.length >= 2) {
                    const statecode = policyData.INSURED_GSTIN.trim().substring(
                        0,
                        2
                    )
                    if (gstincode == statecode) {
                    } else {
                        toast.error('Invalid GSTIN')
                        return false
                    }
                }
            }
        }
        //Ex-Showroom Validation Between Minimum and Maximum
        // if (vehicleData.ExShowroomPrice > 0) {
        //     let isExshowroomPricePassed = checkExshowroomPrice(
        //         vehicleData.ExShowroomPrice,
        //         vehicleData.MinExShowroom,
        //         vehicleData.MaxExShowroom
        //     )
        //     if (isExshowroomPricePassed == false) {
        //         return false
        //     }
        // } else {
        //     toast.error('Ex-Showroom price can not be 0')
        //     return false
        // }
        //Email Extension Validation
        // if (vehicleData.ExShowroomPrice <= 0) {
        //     toast.error('Ex-Showroom price can not be 0')
        //     return false
        // }

        const rawExShowroom =
            vehicleData?.ExShowroomPrice ??
            policyData?.VehicleDetails?.ExShowroomPrice ??
            0
        const exShowroomNumber = Number(String(rawExShowroom).replace(/[, ]+/g, '')) || 0

        if (exShowroomNumber <= 0 && policyData?.PolicyDetails?.CoverTypeId != 2) {
            toast.error('Ex-Showroom price can not be 0')
            return false
        }

        const MIN_EX = 50000
        const MAX_EX = 10000000
        if ((exShowroomNumber < MIN_EX || exShowroomNumber > MAX_EX) && policyData?.PolicyDetails?.CoverTypeId != 2) {
            toast.error(`Ex-Showroom Price(Rs.) must be in Range ${MIN_EX.toLocaleString()} - ${MAX_EX.toLocaleString()}`)
            return false
        }

        policyData.VehicleDetails = {
            ...policyData.VehicleDetails,
            ExShowroomPrice: exShowroomNumber
        }

        let isEmailExtensionPassed = checkEmailSpecialValidation(
            customerDetails.EMAIL
        )
        if (isEmailExtensionPassed == false) {
            toast.error('Please correct email id extension')
            return false
        }

        if (policyData.ICs.length === 0) {
            toast.error('No IC is mapped to this Dealer')
            return false
        }
        let vehicleDetails = {
            MiscType: '',
            BuiltType: '',
            VehicleType: '',
            VehicleSubType: ''
        }

        let coverDetails = {
            IMT33: false
        }
        //Registration No. Validation//
        if (policyData.RegistrationDate != "") {


            let effectiveDate = dayjs().format('MM/DD/YYYY');
            if (policyData.PolicyDetails.PolicyType == 'R') {
                const policyExpiryDateValue = policyData.Renew.POLICY_EXPIRY_DATE
                const tpPolicyExpiryDateValue = policyData.Renew.TP_POLICY_EXPIRY_DATE
                const effectiveDateModelObj = new EffectiveDateModel()
                effectiveDateModelObj.CoverTypeId = policyData.PolicyDetails.CoverTypeId
                effectiveDateModelObj.PolicyType = 'R'

                effectiveDateModelObj.ODExpiryDate = policyExpiryDateValue
                effectiveDateModelObj.TPExpiryDate = tpPolicyExpiryDateValue
                const effectiveResult = await getEffectiveDate(effectiveDateModelObj)
                effectiveDate = effectiveResult.data
            }
            let regType = vehicleData.IS_BH_REGIST_NO;
            let regNo = "";
            if (regType == '1') {
                regNo = policyData.BHNumberSeries1.replace('-', '') + policyData.BHNumberSeries3 + policyData.BHNumberSeries2
            }
            else if (regType == '2') {
                regNo = policyData.SpecialRegistartionNo;
            }
            else {
                regNo = vehicleData.RTO_NAME.replace('-', '') + vehicleData.RegistrationNo1 + vehicleData.RegistrationNo2;
            }

            let regObj = {
                VehicleDetails: {
                    Count: 0,
                    VEH_REGIST_NO: regNo,
                    POLICY_EFFECTIVE_DATE: effectiveDate,
                    COVER_TYPE_ID: policyData.PolicyDetails.CoverTypeId,
                    POLICY_TYPE: policyData.PolicyDetails.PolicyType,
                    POLICY_EXPIRY_DATE:''

                }
            }
            if (policyData.PolicyDetails.PolicyType == 'R') {
                regObj.VehicleDetails.POLICY_EXPIRY_DATE = policyData.Renew.POLICY_EXPIRY_DATE
                
            }
            const IsDuplicatReg = await checkDuplicateChassis(regObj)
            if (IsDuplicatReg.status == 200 && IsDuplicatReg.data.ErrorCode != 0) {
                toast.error('Policy found against this Registraion No.')
                return;
            }
        }

        if (policyData.PolicyDetails.VehClass == 'C') {
            let vehicleTypeName = vehicleTypeList.find(
                (x) => x['VEHICLETYPE_ID'] == vehicleData.FKVehicleType_ID
            )['VEHICLETYPE_VALUE']
            vehicleDetails.VehicleType = vehicleTypeName
            if (
                vehicleData.VehicleType == 'MISC-D' ||
                vehicleData.VehicleType == 'GCV'
            ) {
                let subTypeName = vehicleSubTypeList.find(
                    (x) =>
                        x['VEHICLESUBTYPE_ID'] ==
                        vehicleData.FKVehicleSubType_ID
                )['SUBTYPE_VALUE']
                vehicleDetails.VehicleSubType = subTypeName
            }

            if (vehicleData.VehicleType == 'MISC-D') {
                let miscTypeName = miscTypeList.find(
                    (x) => x['MISVEHICLETYPEID'] == vehicleData.FKMiscType_ID
                )['MISVEHICLENAME']
                vehicleDetails.MiscType = miscTypeName
            }
            if (policyData.FKOEM_ID != 3 && policyData.FKOEM_ID != 1) {
                let builtTypeName = builtTypeList.find(
                    (x) => x['BUILTTYPE_ID'] == vehicleData.FKBuiltType_ID
                )['BUILTTYPE_NAME']
                vehicleDetails.BuiltType = builtTypeName
            }
        } else {
            if (vehicleData.VehicleType == '') {
                if (vehicleData.FKVehicleType_ID == 1) {
                    vehicleDetails.VehicleType = 'PCP'
                } else if (vehicleData.FKVehicleType_ID == 5) {
                    vehicleDetails.VehicleType = 'TWP'
                }
            } else {
                vehicleDetails.VehicleType = vehicleData.VehicleType
            }
        }
        if (vehicleData.VehicleType == 'TWP') {
            coverDetails.IMT33 = true
        }

        if (optionalDetails.IsUnnamedPassenger === 'true')
            optionalDetails.UnnamedPassengerCount = vehicleData.SeatingCapacity
        else optionalDetails.UnnamedPassengerCount = 0

        if (
            
            isSAOD &&
            (policyData.GeoArea.length > 0 ||
                policyData.AccessoriesValue.BiFuelValue > 0) &&
            !biFuelAgreement
        ) {
            setDialog({
                ...dialog,
                ['open']: true,
                ['title']: 'Message',
                ['content']:
                    'Please check "BiFuel/Geographical Area taken in Previous TP Policy" checkbox.',
                data: false,
                dialogType: 'alert'
            })
            return
        }

        if (
           
            isSAOD &&
            (policyData.GeoArea.length > 0 ||
                policyData.AccessoriesValue.BiFuelValue > 0) &&
            !biFuelAgreement
        ) {
            setDialog({
                ...dialog,
                ['open']: true,
                ['title']: 'Message',
                ['content']:
                    'Please check "BiFuel/Geographical Area taken in Previous TP Policy" checkbox.',
                data: false,
                dialogType: 'alert'
            })
            return
        }

        const chassisNO = vehicleData.ChassisNo
        const engineNo = vehicleData.EngineNo

        if (chassisNO === engineNo) {
            toast.error('Chassis number and Engine number cannot be the same.')
            reset({
                ...control._formValues,
                ['EngineNo']: '',
                ['ChassisNo']: ''
            })
            return
        }
        const fkVehicleTypeId = Number(vehicleData.FKVehicleType_ID);
        console.log('FKVehicleType_ID:', fkVehicleTypeId);
        if (!fkVehicleTypeId || fkVehicleTypeId === 0) {
            toast.error('Vehicle Type Cannot be null.');
            return;
        }





        if (customerDetails.MOB_NO == customerDetails.ALT_MOBILE_NO) {
            toast.error('Alternate Mobile No cannot be same as Mobile No.')
            return
        }
        // policyData.Quotetype=1;
        setShowLoading(true)
        axiosInstance
            .post(COMMON_API_URL.policyIssuance, {
                ...policyData,
                PolicyDetails: {
                    ...policyData.PolicyDetails,
                    ...policyData.PolicyDetails
                },
                ProposerDetails: {
                    ...policyData.ProposerDetails,
                    ...customerDetails
                },
                VehicleDetails: {
                    ...{
                        ...policyData.VehicleDetails,
                        ...vehicleData
                    },
                    ...vehicleDetails
                },
                Discounts: { ...policyData.Discounts, ...additionalDiscounts },
                Covers: {
                    ...{ ...policyData.Covers, ...optionalDetails },
                    ...coverDetails
                },
                LastYearAddOns: {
                    ...policyData.LastYearAddOns,
                    ...lastYearAddons
                }
            })
            .then((response) => {
                setShowLoading(false)
                if (response.status === 200) {
                    if (
                        response.data.ErrorCode == 1 &&
                        response.data.ProposalID != 0
                    ) {
                        const Proposal_ID = response.data.ProposalID
                        let obj = {
                            ProposalId: Proposal_ID
                        }
                        dispatch(update(obj))
                        navigate({
                            pathname: '/Quotation',
                            search: createSearchParams({
                                ProposalId: encrypt(Proposal_ID)
                            }).toString()
                        })
                    } else {
                        console.log(response.data)
                        toast.error(response.data.ErrorMessage)
                    }
                }
            })
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
        checkDealerMismatchFn()

        getMasterDataFn()
        let obj = {
            name: 'PolicyType',
            data: loginSelector.DealerUserType!='P'?'N':'R'
        }
        formDataObj.PolicyDetails.PolicyType = loginSelector.DealerUserType!='P'?'N':'R'
        formDataObj.Renew.RENEWAL_TYPE = loginSelector.DealerUserType!='P'?'0':'1'
        dispatch(updateProperty(obj))
        if (ProposalId == 0 || stateParam == null) {

            if(loginSelector.DealerUserType=='P'){
                
                    setPolicyData({
                    ...policyData,
                    ['PolicyDetails']: {
                        ...policyData['PolicyDetails'],
                        ['PolicyType']: 'R'
                    },

                    Renew: { ...policyData.Renew, ['RENEWAL_TYPE']: '1' },
                    ['IS_BH_REGIST_NO']: '3'
                })
                

                
                setValue('RENEWAL_TYPE', '1')
                setValue('IS_BH_REGIST_NO', '3')
                setTMIInput(true)
                setDisabled(true)
                reset({ ...control._formValues, ...formDataObj.LastYearAddons })
                getYOMFN(new Date().getFullYear().toString(), 'R')
                setValue('SAOD_POLICY', '0')
                let onchangeCoverObj = {
                    PolicyType:
                        'R',
                    VehicleType: policyData.PolicyDetails.VehClass,
                    RenewalType: '1'
                }
                 setVehicleCover(null)
               
                setVehicleCover(listRenewVehicleCover)
               
                setPolicyData({
                    ...policyData,
                    ['Renew']: {
                        ...policyData['Renew'],
                        ['RENEWAL_TYPE']: '1'
                    }
                })
                let obj = {
                    name: 'RENEWAL_TYPE',
                    data: '1'
                }
                setValue('RegistrationDate', '')
                setValue('InvoiceDate', '')

                resetMaxMinDates()

                dispatch(updateProperty(obj))
                 getCoversTypebyIdforRenewFN(onchangeCoverObj)
                
            }
            setValue('CPATenure', 0)
            reset({
                ...control._formValues,
                ['IsNCBForward']: 'false',
                ['NCBLevel']: 0,
                ['IsAntiTheft']: 'false',
                ['IsAA']: 'false',
                ['IsHandicapped']: 'false',
                ['IsVoluntaryForward']: 'false',
                ['VoluntaryExcess']: 0,
                ['IsIMT23']: 'true',
                ['CPATenure']: 0
            })
            reset({
                ...control._formValues,
                ...formDataObj,
                ...formDataObj.ProposerDetails,
                ...formDataObj.VehicleDetails,
                ...formDataObj.Discounts,
                ...formDataObj.Covers,
                ...formDataObj.LastYearAddons,
                ...formDataObj.Renew,
                ...formDataObj.PolicyDetails,
                ...formDataObj.Discounts
            })
            setPolicyData(formDataObj)
            setVehicleData(formDataObj.VehicleDetails)
            setCustomerDetails(formDataObj.ProposerDetails)
            setOptionalDetails(formDataObj.Covers)
            setAdditionalDiscounts(formDataObj.Discounts)
            
            setMake(null)
            setModel(null)
            setVariant(null)
            setval(0)
            setPIdPNoExists(false)
            setIsSATP(true)
        }
    }, [stateParam, newClick])

    useEffect(() => {
        const firstError = Object.keys(errors).reduce((field, a) => {
            return !!errors[field] ? field : a
        }, null)
        console.log(control._fields[firstError])
        if (firstError) {
            ; (
                document.querySelector(
                    `input[name="${firstError}"]`
                ) as HTMLInputElement | null
            )?.focus()
        }
    }, [errors, setFocus])
    //#endregion

    //#region Dependent Function
    async function getCoversTypebyIdforRenewFN(onchangeCoverObj: any) {
        Input = { ...onchangeCoverObj }
        // Input.PolicyType = onchangeCoverObj.PolicyType
        // Input.VehicleType = onchangeCoverObj.VehicleType
        let result = await getCoverTypeOnPolicyType(Input)
        if (result.status == 200) {
            if (onchangeCoverObj.VehicleType == "C" && (onchangeCoverObj.RenewalType == '2') && (onchangeCoverObj.Id == 1 || onchangeCoverObj.Id == 3)) {
                let coversWithNoSATP = noPrevPolicy.filter(x => x.CoverTypeId != 2)
                setVehicleCover(coversWithNoSATP)
            }
            else if (onchangeCoverObj.RenewalType == '2') {
                setVehicleCover(noPrevPolicy)
            } else if (onchangeCoverObj.PolicyType == 'N') {
                setVehicleCover(result.data.VehicleCover)
            }

            setVehicleRenewCover(result.data.VehicleCover)
        }
    }

    const [isOldVehicle, setIsOldVehicle] = useState(false);
    const getEffectiveDateFn = async (effectiveDateModelObj1: any) => {

        var result = await validateInvoiceDateRange(effectiveDateModelObj1);
        if (result == "False") {

            setLabelText("Ex-Showroom Price (STRICTLY as per Veh.)");
        }
        else {

            setLabelText("Insured Declared Value (IDV)");
        }
    }
    const getVISoFPrevPolicyDataFN = async () => {

        if (policyData.Renew.RENEWAL_TYPE == '1') {
            if (policyData.Renew.PREV_POLICY_NO.length > 5) {
                let SearchPrevPolData = {}
                SearchPrevPolData.PolicyNo = policyData.Renew.PREV_POLICY_NO
                SearchPrevPolData.DealerId = loginSelector.DealerId
                SearchPrevPolData.UserID = loginSelector.UserId
                SearchPrevPolData.PolicyRenewType =
                    policyData.Renew.RENEWAL_TYPE
                SearchPrevPolData.PolicyType =
                    policyData.PolicyDetails.PolicyType
                let data = await getVISoFPrevPolicyData(SearchPrevPolData)

                if (data.status === 200) {
                    if(data.data.Renew.PREV_POLICY_NO=="NOT FOUND"){
                        toast.error("Policy not found against this Policy No.")
                        return
                    }
                    const effectiveDateModelObj1 = new EffectiveDateModel();
                    effectiveDateModelObj1.ODExpiryDate = data.data.VehicleDetails.InvoiceDate;
                    effectiveDateModelObj1.TPExpiryDate = policyData.PolicyStartDate.format('DD/MM/YYYY');


                    // let obj = {
                    //         VehicleDetails:{
                    //             Count:1,
                    //             POLICY_EXPIRY_DATE:data.data.Renew.POLICY_EXPIRY_DATE,
                    //             POLICY_EFFECTIVE_DATE : data.data.Renew.POLICY_EFFECTIVE_DATE,
                    //             COVER_TYPE_ID : data.data.Renew.PREV_COVERTYPE_ID,
                    //             POLICY_TYPE : data.data.PolicyDetails.PolicyType,
                    //             CHASSIS_NO : data.data.VehicleDetails.ChassisNo
                    //         }
                    // };
                    // const {data:responseData } = await checkDuplicateChassis(obj);

                    // if(responseData.ErrorCode==1){
                    //     toast.error("Policy already exists with this Policy No.");
                    //     return;
                    // }
                    getEffectiveDateFn(effectiveDateModelObj1);
                    setIsOldVehicle(data.data.VehicleAge === true);
                    setLabelText(data.data.VehicleAge === true ? "Insured Declared Value (IDV)" : "Ex-Showroom Price (STRICTLY as per Veh.)")


                    const params = {
                        DealerId: loginSelector.DealerId,
                        OemId: data.data.FKOEM_ID,
                        PolicyType: 'R'
                    }

                    const result = await getICsbyOEM(params);
                    setICList(result.ICList.ICs);




                    if (
                        data.data.Renew.PREV_POLICY_NO != '' &&
                        data.data.Renew.PREV_POLICY_NO != null
                    ) {
                        const visofPolResponse = data.data
                        setOtherData(visofPolResponse.extraFieldPropRequires)
                        if (data.data.Renew.RENEWAL_TYPE == '2') {
                            setVehicleCover(noPrevPolicy)
                        } else if (
                            data.data.Renew.RENEWAL_TYPE == '1' ||
                            data.data.Renew.RENEWAL_TYPE == '3'
                        ) {
                            setVehicleCover(listRenewVehicleCover)
                        }
                        setCustomerDetails(data.data.ProposerDetails)

                        // let icsDataArr = []
                        // if (
                        //     data.data.ICList != '' &&
                        //     data.data.ICList != null
                        // ) {
                        //     icsDataArr = data.data.ICList.split(',')
                        // }
                        // let tempArr = [...mainICList.current]
                        // if (tempArr.length > 0 && icsDataArr.length > 0) {
                        //     icsDataArr.forEach((element2) => {
                        //         tempArr.forEach((element) => {
                        //             if (element.ICId.toString() == element2) {
                        //                 element.checked = true
                        //             }
                        //         })
                        //     })
                        // }
                        // setICList(tempArr)
                        await getMakebyOemIdFN(
                            data.data.VehicleDetails,
                            loginSelector.DealerId
                        )


                        data.data.RegistrationDate = data.data.RegistrationDate != null ? dayjs(
                            common.get_CheckBlankDate(
                                data.data.RegistrationDate
                            )
                        ) : null
                        data.data.BiFuelKit.KitInvoice = dayjs(
                            common.get_CheckBlankDate(
                                data.data.BiFuelKit.KitInvoice
                            )
                        )
                        data.data.VehicleDetails.InvoiceDate = dayjs(
                            common.get_CheckBlankDate(
                                data.data.VehicleDetails.InvoiceDate
                            )
                        )
                        data.data.PolicyStartDate = dayjs(
                            common.get_CheckBlankDate(data.data.PolicyStartDate)
                        )
                        data.data.Renew.POLICY_EXPIRY_DATE = dayjs(
                            common.get_CheckBlankDate(
                                data.data.Renew.POLICY_EXPIRY_DATE
                            )
                        )
                        data.data.Renew.TP_POLICY_EXPIRY_DATE = dayjs(
                            common.get_CheckBlankDate(
                                data.data.Renew.TP_POLICY_EXPIRY_DATE
                            )
                        )
                        data.data.Renew.POLICY_EFFECTIVE_DATE = dayjs(
                            common.get_CheckBlankDate(
                                data.data.Renew.POLICY_EFFECTIVE_DATE
                            )
                        )
                        data.data.Renew.TPPOLICY_EFFECTIVE_DATE = dayjs(
                            common.get_CheckBlankDate(
                                data.data.Renew.TPPOLICY_EFFECTIVE_DATE
                            )
                        )

                        data.data.Covers.IsPAConductor =
                            data.data.Covers.IsPAConductor.toString()
                        data.data.Covers.IsLLConductor =
                            data.data.Covers.IsLLConductor.toString()
                        data.data.Covers.IsPACleaner =
                            data.data.Covers.IsPACleaner.toString()
                        data.data.Covers.IsLLCleaner =
                            data.data.Covers.IsLLCleaner.toString()
                        data.data.Covers.IsPAHelper =
                            data.data.Covers.IsPAHelper.toString()
                        data.data.Covers.IsLLHelper =
                            data.data.Covers.IsLLHelper.toString()
                        data.data.Covers.IsLLNFPP =
                            data.data.Covers.IsLLNFPP.toString()
                        data.data.Covers.IMT34 =
                            data.data.Covers.IMT34.toString()
                        data.data.Covers.IsOverTurn =
                            data.data.Covers.IsOverTurn.toString()

                        setVehicleData(data.data.VehicleDetails)
                        if (
                            data.data.IS_BH_REGIST_NO == '' ||
                            data.data.IS_BH_REGIST_NO == '0'
                        )
                            data.data.IS_BH_REGIST_NO = '3'
                        let dataObject = {
                            CoverTypeId: parseInt(
                                data.data.PolicyDetails.CoverTypeId
                            ),
                            INSURED_GSTIN: data.data.INSURED_GSTIN,
                            FKOEM_ID: data.data.FKOEM_ID,
                            IsuredStateId: data.data.IsuredStateId,
                            IS_BH_REGIST_NO:
                                data.data.IS_BH_REGIST_NO.toString(),
                            BHNumberSeries1: data.data.BHNumberSeries1,
                            BHNumberSeries2: data.data.BHNumberSeries2,
                            BHNumberSeries3: data.data.BHNumberSeries3,
                            IsNCBForward:
                                data.data.Discounts.IsNCBForward.toString(),
                            IsVoluntaryForward:
                                data.data.IsVoluntaryForward.toString(),
                            VoluntaryExcess:
                                data.data.Discounts.VoluntaryExcess.toString(),
                            NCBLevel: data.data.Discounts.NCBLevel.toString(),
                            IsTestDrive: data.data.IsTestDrive.toString(),
                            DateofManufacture: parseInt(
                                data.data.VehicleDetails.DateofManufacture
                            ),
                            SpecialRegistartionNo:
                                data.data.SpecialRegistartionNo,
                            RegistrationDate: data.data.RegistrationDate,
                            InvoiceDate: data.data.VehicleDetails.InvoiceDate,
                            CPAReason: data.data.CPAReason
                        }

                        let [OdTenure, TpTenure] = getOD_TPTenures(
                            dataObject.CoverTypeId
                        )
                        setval(TpTenure)
                        //if(data.data.VehicleDetails.VEH_REGIST_NO)
                        let RenewalObject = {
                            ISCLAIM_AVAILED:
                                data.data.Renew.ISCLAIM_AVAILED.toString(),
                            ISTRANSFER: data.data.Renew.ISTRANSFER.toString(),
                            OLD_POL_NCB_LEVEL:
                                data.data.Renew.OLD_POL_NCB_LEVEL,
                            FKISURANCE_COMP_ID:
                                data.data.Renew.FKISURANCE_COMP_ID
                        }
                        let additionalDiscountObj = {
                            DiscountPer: visofPolResponse.Discounts.DiscountPer,
                            IsAA: visofPolResponse.Discounts.IsAA.toString(),
                            IsAntiTheft:
                                visofPolResponse.Discounts.IsAntiTheft.toString(),
                            IsHandicapped:
                                visofPolResponse.Discounts.IsHandicapped.toString(),
                            IsIMT23:
                                visofPolResponse.Discounts.IsIMT23.toString(),
                            IsNCBForward:
                                visofPolResponse.Discounts.IsNCBForward.toString(),
                            NCBLevel: visofPolResponse.Discounts.NCBLevel,
                            NCBPer: visofPolResponse.Discounts.NCBPer,
                            VoluntaryExcess:
                                visofPolResponse.Discounts.VoluntaryExcess.toString()
                        }
                            let optionalObject = {
                            IsUnnamedPassenger:
                                data.data.Covers.IsUnnamedPassenger.toString(),
                            IsCPACover: data.data.Covers.IsCPACover.toString(),
                            CPATenure: data.data.Covers.CPATenure,

                                IsPaidDriver:
                                    data.data.Covers.IsPaidDriver.toString(),
                                CoverAmount: data.data.Covers.CoverAmount,
                                OtherEmp:0
                            }
                            let EmpCount= 0;
                            if (data.data.PolicyDetails.ProposalType == 'C' && policyData.PolicyDetails.VehClass == 'P') {
                               
                                EmpCount = data.data.VehicleDetails.SeatingCapacity
                            }
                            optionalObject.OtherEmp = EmpCount;
               
                            let lastYearAddonsObj = {
                                ZeroDep:
                                    visofPolResponse.LastYearAddOns.ZeroDep.toString(),
                                ReturnToInvoice:
                                    visofPolResponse.LastYearAddOns.ReturnToInvoice.toString(),
                                EngineProtect:
                                    visofPolResponse.LastYearAddOns.EngineProtect.toString()
                            }

                            data.data.Renew.IsHavingODPolicy =  data.data.Renew.IsHavingODPolicy.toString();
                            data.data.Renew.IsHavingTPPolicy = data.data.Renew.IsHavingTPPolicy.toString();

                        let obj = {
                            ...data.data.PolicyDetails,
                            ...data.data.ProposerDetails,
                            ...data.data.VehicleDetails,
                            ...data.data.Discounts,
                            ...data.data.Covers,
                            ...data.data.Renew,
                            ...lastYearAddonsObj,
                            ...dataObject,
                            ...optionalObject,
                            ...RenewalObject,
                            ...additionalDiscountObj
                        }
                        setAdditionalDiscounts({
                            ...data.data.Discounts,
                            ...additionalDiscountObj
                        })
                        setPolicyData({
                            ...data.data,
                            ['IsVoluntaryForward']:
                                dataObject.IsVoluntaryForward
                        })
                        setVehicleData({
                            ...data.data.VehicleDetails,
                            ...dataObject
                        })
                        setOptionalDetails({
                            ...data.data.Covers,
                            ...optionalObject
                        })

                            reset({ ...control._formValues, ...obj })
                            if (data.data.DealerId != loginSelector.DealerId) {
                                maskMobEmail(data.data)
                                dispatch(updateEncryptedMobEmail(true))
                            } else {
                                dispatch(updateEncryptedMobEmail(false))
                            }
                            if (optionalObject.CPATenure > 0) {
                                unregister('CPAReason')
                            }
                            if (data.data.VehicleDetails.FKVehicleType_ID != 1) {
                                await getVehicleSubTypesFn({
                                    VehicleType:
                                        data.data.VehicleDetails.FKVehicleType_ID
                                })
                            }
                            tmiRenewalData.current = data.data
                            setTMIInput(true)
                            await getYOMFN(new Date().getFullYear().toString(), 'R')
                            setdisabledForVariant(true)
                            let coverTypeObj = {
                                POLICY_EXPIRY_DATE:
                                    data.data.Renew.POLICY_EXPIRY_DATE != ''
                                        ? dayjs(
                                            data.data.Renew.POLICY_EXPIRY_DATE
                                        ).format('MM/DD/YYYY')
                                        : '',
                                TP_POLICY_EXPIRY_DATE: dayjs(
                                    data.data.Renew.TP_POLICY_EXPIRY_DATE
                                ).format('MM/DD/YYYY'),
                                PREV_COVERTYPE_ID:
                                    data.data.Renew.PREV_COVERTYPE_ID,
                                IsHavingODPolicy: data.data.Renew.IsHavingODPolicy.toString(),
                                IsHavingTPPolicy: data.data.Renew.IsHavingTPPolicy.toString(),
                                RENEWAL_TYPE: data.data.Renew.RENEWAL_TYPE
                            }
                            let onchangeCoverObj = {
                                PolicyType:
                                    policyData.Renew.RENEWAL_TYPE == '2' ||
                                    policyData.PolicyDetails.PolicyType == 'N'
                                    ? 'N'
                                    : 'R',
                            VehicleType:
                                data.data.FKOEM_ID == 2
                                    ? 'C'
                                    : data.data.FKOEM_ID == 4
                                        ? 'T'
                                        : 'P',
                            Id: data.data.FKOEM_ID,
                            RenewalType: policyData.Renew.RENEWAL_TYPE
                        }
                        await getCoversTypebyIdforRenewFN(onchangeCoverObj)
                        await getApplicable_RenewCoverTypes(coverTypeObj)
                        const response = await getVehiclebyOemId({
                            Id: data.data.FKOEM_ID
                        })
                        if (response != null && response.data != null) {
                            setVehicleTypeList(response.data)
                        }

                        setRegistrationInvoiceOnRenew(data.data)
                    } else {
                        //toast.error('No Data Found against this policy no')

                        toast.error('Policy has already been renewed');
                        reset({ ...control._formValues, ...customerDetailsObj })
                        setCustomerDetails({
                            ...customerDetails,
                            ...customerDetailsObj
                        })
                        reset({ ...control._formValues, ...vehicleDataObj })
                        setVehicleData({ ...vehicleData, ...vehicleDataObj })
                    }
                }
            }
        }
    }


    function maskMobEmail(policyObj: any) {
        const maskedMobile =
            policyObj.ProposerDetails.MOB_NO.substring(0, 1) +
            'XXXXXXX' +
            policyObj.ProposerDetails.MOB_NO.substr(-2)

        const maskedEmail =
            policyObj.ProposerDetails.EMAIL.substring(0, 1) +
            'XXXXXXX' +
            policyObj.ProposerDetails.EMAIL.substr(-5)

        setCustomerDetails({
            ...policyObj.ProposerDetails,
            ['ENCRYPTED_MOB_NO']: maskedMobile,
            ['ENCRYPTED_EMAIL']: maskedEmail
        })

        setIsVisofSameDealer(false)
    }

    function onConfirmDialogClose(action: boolean, data: any) {
        if (action === false) {
            let claimAvailed: string = 'false'
            if (control._formValues['ISCLAIM_AVAILED'] == 'false')
                claimAvailed = 'true'

            setPolicyData((prevData) => {
                return {
                    ...prevData,
                    Renew: {
                        ...prevData.Renew,
                        ['ISCLAIM_AVAILED']: claimAvailed,
                        ['OLD_POL_NCB_LEVEL']:
                            claimAvailed == 'true'
                                ? 0
                                : prevData.Renew.OLD_POL_NCB_LEVEL
                    }
                }
            })

            reset({
                ...control._formValues,
                ['ISCLAIM_AVAILED']: claimAvailed,
                ['OLD_POL_NCB_LEVEL']:
                    claimAvailed == 'true'
                        ? 0
                        : policyData.Renew.OLD_POL_NCB_LEVEL
            })
        } else {
            let claimAvailed = 'false'
            if (control._formValues['ISCLAIM_AVAILED'] == 'true')
                claimAvailed = 'true'

            setPolicyData((prevData) => {
                return {
                    ...prevData,
                    Renew: {
                        ...prevData.Renew,
                        ['ISCLAIM_AVAILED']: claimAvailed,
                        ['OLD_POL_NCB_LEVEL']:
                            claimAvailed == 'true'
                                ? 0
                                : prevData.Renew.OLD_POL_NCB_LEVEL
                    }
                }
            })
            reset({
                ...control._formValues,
                ['ISCLAIM_AVAILED']: claimAvailed,
                ['OLD_POL_NCB_LEVEL']:
                    claimAvailed == 'true'
                        ? 0
                        : policyData.Renew.OLD_POL_NCB_LEVEL
            })
        }
        setDialog({
            ...dialog,
            ['open']: false
        })
    }
    const [dialog, setDialog] = useState({
        open: false,
        content: '',
        title: '',
        data: {},
        onClose: onConfirmDialogClose,
        dialogType: 'alert'
    })
    //#endregion

    const otherTPTenureDropDown = [
        {
            TEXT: '1 year',

            VALUE: '1'
        },
        {
            TEXT: '3 year',

            VALUE: '3'
        }
    ]

    const otherCVTPTenureDropDown = [
        {
            TEXT: '1 year',

            VALUE: '1'
        }
    ]

    const handleTPPrevTenureYear = (e: any) => {
        setPolicyData({ ...policyData, ['TP_PREV_TENURE']: e.target.value })
    }

    //#region Duplicate Chassis number validation
    const isAlphaNumeric = (str: string) => {
        let regex = new RegExp(/^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$/)
        if (str == null) {
            return 'false'
        }
        if (regex.test(str) == true) {
            return 'true'
        } else {
            return 'false'
        }
    }
    const getYOMFN = async (year: string, policyType: string) => {
        const yomResult = await getYOM(year, policyType)
        if (yomResult.status == 200) {
            setYOM(yomResult.data.YearofManufacture)
        }
    }
    const [showLoading, setShowLoading] = useState(false)
    //#endregion

    //#region To check the difference between policy expiry date
    const checkPolicyExpiryDate = (expiryDate) => {
        //setPolicyExpiryDate(expiryDate);

        if (expiryDate.trim() === '') {
            alert('Please Select Policy Expiry Date.')
        } else {
            //setSpnPolicyExpdate('');

            const today = new Date()
            const [day, month, year] = expiryDate.split('/')
            const polexpdate = new Date(`${month}/${day}/${year}`)
            //const differenceInTime = Math.round(today.getTime() - polexpdate.getTime());
            const differenceInTime = Math.round(
                polexpdate.getTime() - today.getTime()
            )
            const val = differenceInTime / (1000 * 3600 * 24)
            const differenceInDays = Math.ceil(val)
            const checkdays =
                val.toString().indexOf('.') > -1
                    ? differenceInDays - 1
                    : differenceInDays

            if (checkdays > 90) {
                //alert(checkdays)
                //setDivtransferVisible(false);
                //setDivclaimVisible(false);
                //setDivoldncbVisible(false);
            } else if (checkdays < 60) {
                toast.error(
                    'OD Policy expiry date should be greater than 60 days from today'
                )
            } else {
                //alert(checkdays)
                //setDivtransferVisible(true);
                // if ((ddlRenewCoverType !== '2' && ddlRenewCoverType !== '4') && hdnisTransfer !== 'False') {
                //     //setDivclaimVisible(true);
                //     //setDivoldncbVisible(true);
                // }
            }

            // if (checkdays >= 0 && (ddlRenewCoverType === 6 || ddlRenewCoverType === 5)) {
            //     //setDivActiveODVisible(true);
            // } else {
            //     //setDivActiveODVisible(false);
            // }
        }
    }
    const checkTPPolicyExpiryDate = (tpExpiryDate) => {
        //const tpexpiryDate = event.target.value;
        //setTpPolicyExpiryDate(expiryDate);

        if (expiryDate.trim() === '') {
            //alert('Please Select TP Policy Expiry Date.');
        } else {
            //alert('');

            const today = new Date()
            const [day, month, year] = tpExpiryDate.split('/')
            const polexpdate = new Date(`${month}/${day}/${year}`)
            const differenceInTime = Math.round(
                today.getTime() - polexpdate.getTime()
            )
            const val = differenceInTime / (1000 * 3600 * 24)
            const differenceInDays = Math.ceil(val)
            const checkdays =
                val.toString().indexOf('.') > -1
                    ? differenceInDays - 1
                    : differenceInDays

            // if (checkdays >= 0 && (ddlRenewCoverType === 6 || ddlRenewCoverType === 5)) {
            //     setDivActiveTPVisible(true);
            // } else {
            //     setDivActiveTPVisible(false);
            // }
        }
    }
    //#endregion

    const getApplicable_RenewCoverTypes = async (data: any) => {
        if (
            control._formValues.PolicyType == 'R' &&
            data.RENEWAL_TYPE.toString() != '2' &&
            (common.isNotNullOrEmpty(data.POLICY_EXPIRY_DATE) ||
                (common.isNotNullOrEmpty(data.TP_POLICY_EXPIRY_DATE) &&
                    data.PREV_COVERTYPE_ID.toString() != '0'))
        ) {
            const coverTypeObj: any = {
                PolicyDetails: {
                    PolicyType: 'R'
                },
                Renew: {
                    RENEWAL_TYPE: data.RENEWAL_TYPE,
                    PREV_POLICY_ID: 0,
                    PREV_POLICY_NO: '',
                    PREV_CHASSIS_NO: '',
                    PREV_VEH_REG1: '',
                    PREV_VEH_REG2: '',
                    PREV_VEH_REG3: '',
                    FKISURANCE_COMP_ID: 0,
                    OFFICE_ADD: '',
                    INVOICE_DATE: '',
                    POLICY_EFFECTIVE_DATE: '', // dayjs(new Date()),
                    POLICY_EXPIRY_DATE: data.POLICY_EXPIRY_DATE, //dayjs(new Date()),
                    ISTRANSFER: 'false',
                    ISCLAIM_AVAILED: 'false',
                    OLD_POL_NCB_PER: 0,
                    OLD_POL_NCB_LEVEL: 0,
                    BREAKIN_DAYS: 0,
                    PREV_DEALERCODE: '',
                    ISPROOF_SUBMITTED: 0,
                    ISPREVPOL_COPY_SUBMT: 0,
                    ISNCB_CERT_SUBMITTED: 0,
                    ISCUSTOMER_UNDRTKNG_SUBMT: 0,
                    IS_ADDON: 'false',
                    PREV_VEHICLE_TYPE: '',
                    PREV_COVERTYPE_ID: data.PREV_COVERTYPE_ID,
                    IsHavingODPolicy: data.IsHavingODPolicy.toString(),
                    IsHavingTPPolicy: data.IsHavingTPPolicy.toString(),
                    TP_POLICY_EXPIRY_DATE: data.TP_POLICY_EXPIRY_DATE, //dayjs(new Date()),
                    TPPOLICY_EFFECTIVE_DATE: '', //dayjs(new Date()),
                    TPPOLICY_NO: '',
                    TPPOLICY_INSUR_COMP_ID: 0,
                    TPPOLICY_INSUR_COMP_NAME: ''
                }
            }
            const result = await getApplicableCoverTypes(coverTypeObj)
            if (
                result != null &&
                common.isNotNullOrEmpty(result) &&
                result.length > 0
            ) {
                let coverTypes = []
                result.forEach((element) => {
                    let newPlan: string = ''
                    if (element == '1,1') newPlan = '1 OD + 1 TP'
                    else if (element == '0,1') newPlan = '0 OD + 1 TP'
                    else if (element == '1,0') newPlan = '1 OD + 0 TP'
                    let coverType = listRenewVehicleCover.filter((x) => {
                        return x.CoverType == newPlan
                    })
                    coverTypes.push({
                        CoverTypeId: coverType[0].CoverTypeId,
                        CoverType: coverType[0].CoverType
                    })
                })

                if (policyData.PolicyDetails.VehClass == "C" && coverTypeObj.Renew.RENEWAL_TYPE == '3' && (policyData.FKOEM_ID == 1 || policyData.FKOEM_ID == 3)) {
                    coverTypes = coverTypes.filter(x => x.CoverTypeId != 2);
                }
                setVehicleCover(coverTypes)
            }
        }
    }

    const getTenureFN = async (data) => {
        let tenureResponse = await getTenureData(data)
        if (tenureResponse.status == 200) {
            if (tenureResponse.data != null) {
                setIsSAOD(tenureResponse.data.TPTenure == 0)
                setIsSATP(tenureResponse.data.ODTenure == 0)
                if (tenureResponse.data.ODTenure == 0) {
                    reset({ ...control._formValues, ...formDataObj.Discounts })
                    setAdditionalDiscounts({
                        ...additionalDiscounts,
                        ...formDataObj.Discounts
                    })
                }
                if (tenureResponse.data.TPTenure == 0) {
                    reset({ ...control._formValues, ...formDataObj.Covers })
                    setOptionalDetails({
                        ...optionalDetails,
                        ['IsPaidDriver']: 'false',
                        ['IsUnnamedPassenger']: 'false',
                        ['LLPaidDriver']: 'true',
                        ['CoverAmount']: 0,
                        ['IsCPACover']: 'false',

                        ['CPATenure']: 0
                    })
                    reset({
                        ...control._formValues,
                        ['IsCPACover']: 'false',
                        ['CoverAmount']: 0,
                        ['CPATenure']: 0,
                        ['IsCPACover']: 'false'
                    })
                }
            }

            return tenureResponse.data.ODTenure
        }
    }
    const [minInvoice, setMinInvoice] = useState('')
    const [maxInvoice, setMaxInvoice] = useState(dayjs(new Date()))

    const [minRegistration, setMinRegistration] = useState(dayjs(new Date()))
    const [maxRegistration, setMaxRegistration] = useState(dayjs(new Date()))

    const checkRegistrationInvoice = (data: any, name: any) => {
        const today = dayjs(new Date()).format('DD/MM/YYYY')
        const [day, month, year] = today?.split('/')
        if (control._formValues.PolicyType == 'N') {
            if (name === 'InvoiceDate') {
                const selectedInvoiceData = data?.format('DD/MM/YYYY')
                const [dayID, monthID, yearID] = selectedInvoiceData?.split('/')
                if (day <= dayID) {
                    const newinv = vehicleData.InvoiceDate
                    const futureDateForRegistration = newinv
                    setMinInvoice(newinv)
                    setMinRegistration(newinv)

                    setMaxRegistration(newinv.add(3, 'months'))
                } else {
                    toast.error('Please select correct registration date')
                }
            } else if (name === 'RegistrationDate') {
                const selectedRegistrationDate = data?.format('DD/MM/YYYY')
                const [dayRD, monthRD, yearRD] =
                    selectedRegistrationDate?.split('/')
            }
        } else if (
            control._formValues.PolicyType == 'R' &&
            policyData.Renew.RENEWAL_TYPE != 1 &&
            policyData.Renew.RENEWAL_TYPE != 2
        ) {
            let [ODTenure, TPTenure] =
                name == 'PREV_COVERTYPE_ID'
                    ? getOD_TPTenures(data)
                    : getOD_TPTenures(policyData.Renew.PREV_COVERTYPE_ID)

            let maxInvoiceDate = dayjs(new Date())

            if (name == 'POLICY_EXPIRY_DATE') {
                let policyExpiryDate = dayjs(data)
                    .subtract(ODTenure, 'years')
                    .add(1, 'days')
                let policyTpExpiryDate = dayjs(new Date())

                if (
                    common.isNotNullOrEmpty(
                        policyData.Renew.TP_POLICY_EXPIRY_DATE
                    ) &&
                    dayjs(policyData.Renew.TP_POLICY_EXPIRY_DATE).isValid()
                ) {
                    policyTpExpiryDate = dayjs(
                        policyData.Renew.TP_POLICY_EXPIRY_DATE
                    )
                        .subtract(TPTenure, 'years')
                        .add(1, 'days')
                }

                let EXPIRY_DATE = policyExpiryDate.isBefore(policyTpExpiryDate)
                    ? policyExpiryDate
                    : policyTpExpiryDate


                getYOMFN(EXPIRY_DATE.year().toString(), 'R')
                maxInvoiceDate = EXPIRY_DATE.subtract(1, 'day');

            } else if (name == 'TP_POLICY_EXPIRY_DATE') {
                let policyTpExpiryDate = dayjs(data)
                    .subtract(TPTenure, 'years')
                    .add(1, 'days')
                let policyExpiryDate = dayjs(new Date())

                if (
                    common.isNotNullOrEmpty(
                        policyData.Renew.POLICY_EXPIRY_DATE
                    ) &&
                    dayjs(policyData.Renew.POLICY_EXPIRY_DATE).isValid()
                ) {
                    policyExpiryDate = dayjs(
                        policyData.Renew.POLICY_EXPIRY_DATE
                    )
                        .subtract(ODTenure, 'years')
                        .add(1, 'days')
                }

                let EXPIRY_DATE = policyExpiryDate.isBefore(policyTpExpiryDate)
                    ? policyExpiryDate
                    : policyTpExpiryDate

                getYOMFN(EXPIRY_DATE.year().toString(), 'R')

                maxInvoiceDate = EXPIRY_DATE.subtract(1, 'day');

            } else if (name == 'PREV_COVERTYPE_ID') {
                let policyTpExpiryDate = dayjs(new Date())
                let policyExpiryDate = dayjs(new Date())

                if (
                    common.isNotNullOrEmpty(
                        policyData.Renew.POLICY_EXPIRY_DATE
                    ) &&
                    dayjs(policyData.Renew.POLICY_EXPIRY_DATE).isValid()
                ) {
                    policyExpiryDate = dayjs(
                        policyData.Renew.POLICY_EXPIRY_DATE
                    )
                        .subtract(ODTenure, 'years')
                        .add(1, 'days')
                }
                if (
                    common.isNotNullOrEmpty(
                        policyData.Renew.TP_POLICY_EXPIRY_DATE
                    ) &&
                    dayjs(policyData.Renew.TP_POLICY_EXPIRY_DATE).isValid()
                ) {
                    policyTpExpiryDate = dayjs(
                        policyData.Renew.TP_POLICY_EXPIRY_DATE
                    )
                        .subtract(TPTenure, 'years')
                        .add(1, 'days')
                }

                maxInvoiceDate = policyExpiryDate.isBefore(policyTpExpiryDate)
                    ? policyExpiryDate
                    : policyTpExpiryDate


            }

            let minInvoiceDate = maxInvoiceDate
                .subtract(11, 'years')
                .add(1, 'days')

            if (common.isNotNullOrEmpty(vehicleData.DateofManufacture))
                minInvoiceDate = dayjs(maxInvoiceDate)
                    .year(vehicleData.DateofManufacture)
                    .month(0)

            setMinInvoice(minInvoiceDate)
            setMaxInvoice(maxInvoiceDate)
            setMinRegistration(maxInvoiceDate)
            setMaxRegistration(maxInvoiceDate.add(3, 'months'))
        }
    }

    /////Setting Min and Max Invoice Dates
    const setRegistrationInvoiceOnRenew = (policyRenewData) => {
        let maxInvoiceDate = dayjs(new Date())
        let policyTpExpiryDate = dayjs(new Date())
        let policyExpiryDate = dayjs(new Date())

        let [ODTenure, TPTenure] = getOD_TPTenures(
            policyRenewData.Renew.PREV_COVERTYPE_ID
        )

        if (
            common.isNotNullOrEmpty(policyRenewData.Renew.POLICY_EXPIRY_DATE) &&
            dayjs(policyRenewData.Renew.POLICY_EXPIRY_DATE).isValid()
        ) {
            policyExpiryDate = dayjs(policyRenewData.Renew.POLICY_EXPIRY_DATE)
                .subtract(ODTenure, 'years')
                .add(1, 'days')
        }
        if (
            common.isNotNullOrEmpty(
                policyRenewData.Renew.TP_POLICY_EXPIRY_DATE
            ) &&
            dayjs(policyRenewData.Renew.TP_POLICY_EXPIRY_DATE).isValid()
        ) {
            policyTpExpiryDate = dayjs(
                policyRenewData.Renew.TP_POLICY_EXPIRY_DATE
            )
                .subtract(TPTenure, 'years')
                .add(1, 'days')
        }

        maxInvoiceDate = policyExpiryDate.isBefore(policyTpExpiryDate)
            ? policyExpiryDate
            : policyTpExpiryDate

        let minInvoiceDate = maxInvoiceDate.subtract(11, 'years').add(1, 'days')


        if (
            common.isNotNullOrEmpty(
                policyRenewData.VehicleDetails.DateofManufacture
            )
        )
            minInvoiceDate = dayjs(maxInvoiceDate)
                .year(policyRenewData.VehicleDetails.DateofManufacture)
                .month(0)

        setMinInvoice(minInvoiceDate)
        if (policyRenewData.Renew.RENEWAL_TYPE != '2')
            setMaxInvoice(maxInvoiceDate)
        else
            setMaxInvoice(dayjs())
        setMinRegistration(maxInvoiceDate)
        setMaxRegistration(maxInvoiceDate.add(3, 'months'))
    }

    const getOD_TPTenures = (coverTypeId) => {
        if (coverTypeId == 1) return [1, 1]
        else if (coverTypeId == 2) return [0, 1]
        else if (coverTypeId == 3) return [3, 3]
        else if (coverTypeId == 4) return [0, 3]
        else if (coverTypeId == 5) return [1, 3]
        else if (coverTypeId == 6) return [1, 0]
        else if (coverTypeId == 7) return [1, 5]
        else if (coverTypeId == 8) return [0, 5]
        else return [0, 0]
    }

    const checkExshowroomPrice = (
        exshowroom: number,
        minexshoroom: number,
        maxexshowroom: number
    ) => {
        if (
            parseInt(exshowroom) < minexshoroom ||
            parseInt(minexshoroom) > maxexshowroom
        ) {
            toast.error(
                'Please enter value between ' +
                minexshoroom +
                ' and ' +
                maxexshowroom
            )
            return false
        } else {
            return true
        }
    }
    const checkEmailSpecialValidation = (email: string) => {
        let extension = ''
        if (email != '' && email != null && email != undefined) {
            const splitedEMAIL = email?.split('@')
            const get_Extension =
                splitedEMAIL[splitedEMAIL.length - 1].split('.')[0]
            extension = '~' + get_Extension + '$'
            let status = invalidEmail.includes(extension.toUpperCase())
            if (status == true) {
                return false
            } else {
                return true
            }
        }
    }

    //#region Changes For Commercial

    const [selectedMakeId, setSelectedMakeId] = useState(null)
    const [selectedModelId, setSelectedModelId] = useState(null)
    const [selectedVariantId, setSelectedVariantId] = useState(null)


  

    const handleOemChange = async (e) => {
        setSelectedMakeId(null)
        setMake([])
        setModel([])
        setVariant([])

        setSelectedModelId(null)
        setSelectedVariantId(null)

        setSelectedOemId(e.target.value)

        await changeOemFn(e.target.value)
        
         let vehicleDet = { ...vehicleData }
        if (e.target.value == 2) {
            let currentObjectKey = 'PolicyDetails'
            vehicleDet.VehicleType = 'PCV'
            let PolicyDet = { ...policyData.PolicyDetails }

            PolicyDet.VehClass = 'C'
            setPolicyData({
                ...policyData,
                [e.target.name]: e.target.value,
                PolicyDetails: {
                    ...PolicyDet
                }
            });

            handleCommercialChanges()
            setVehicleCover(noPrevPolicy)

        } else {
            let PolicyDet = { ...policyData.PolicyDetails }
           

            if (e.target.value == 4) {
                vehicleDet.VehicleType = 'TWP'
                vehicleDet.FKVehicleType_ID = 5
                setValue('FKVehicleType_ID', 5)
            } else if (e.target.value == 1 || e.target.value == 3) {
                vehicleDet.VehicleType = 'PCP'
                vehicleDet.FKVehicleType_ID = 1
                setValue('FKVehicleType_ID', 1)
            }

            PolicyDet.VehClass = 'P'
            vehicleDet.FKMiscType_ID = 0
            vehicleDet.FKVehicleSubType_ID = 0
            vehicleDet.FKBuiltType_ID = 0
            vehicleDet.MiscType = ''
            vehicleDet.VehicleSubType = ''
            vehicleDet.BuiltType = ''
            setPolicyData({
                ...policyData,
                [e.target.name]: e.target.value,
                ['Discounts']: {
                    ...policyData['Discounts'],
                    ['IsIMT23']: 'false'
                },
                PolicyDetails: {
                    ...PolicyDet
                },
                VehicleDetails: {
                    ...vehicleDet
                }
            })
            setVehicleData({ ...vehicleData, ...vehicleDet })

            setValue('IsIMT23', 'false')
            setValue('VehClass', 'P')
        }
        let onchangeCoverObj = {
            PolicyType:
                policyData.Renew.RENEWAL_TYPE == '2' ||
                    policyData.PolicyDetails.PolicyType == 'N'
                    ? 'N'
                    : 'R',
            Id: e.target.value,
            VehicleType:
                e.target.value == 2 ? 'C' : e.target.value == 4 ? 'T' : 'P',
            RenewalType: policyData.Renew.RENEWAL_TYPE
        }
        await getCoversTypebyIdforRenewFN(onchangeCoverObj)
        
        Input.FKOEM_ID = e.target.value
        Input.DealerId = loginSelector.DealerId
        Input.FKVehicleType_ID = vehicleDet.FKVehicleType_ID
        Input.VehicleType = vehicleDet.VehicleType

        await getMakebyOemIdFN(
                Input,
                loginSelector.DealerId
                
        )
        
    
        const params = { 
            DealerId: loginSelector.DealerId, 
            OemId: e.target.value ,
            PolicyType:policyData.PolicyDetails.PolicyType
        };

        const result = await getICsbyOEM(params);
        setICList(result.ICList.ICs);

    }

    const handleCommercialChanges = async () => {
        setValue('CoverTypeId', '0')
        setValue('PREV_COVERTYPE_ID', '0')
        setValue('CPATenure', '0')
        setValue('FKVehicleType_ID', 3)
        

        await getVehicleSubTypesFn({ VehicleType: 3 })

        //setValue('IsIMT23', 'true')
        setValue('IsUnnamedPassenger', 'false')
        setValue('OtherEmp', '0')
        setVehicleData({
            ...vehicleData,
            ['VehicleType']: 'PCV',
            ['FKVehicleType_ID']: 3
        })
        //setValue('VehClass', e.target.value == 2 ? 'C' : 'P')
        //setOptionalDetails({...optionalDetails,})
    }

    const handlePrivateChanges = () => {
        let PolicyDet = { ...policyData.PolicyDetails }
        let vehicleDet = { ...vehicleData }
        PolicyDet.VehClass = 'P'
        vehicleDet.FKMiscType_ID = 0
        vehicleDet.FKVehicleSubType_ID = 0
        vehicleDet.FKBuiltType_ID = 0
        vehicleDet.MiscType = ''
        vehicleDet.VehicleSubType = ''
        vehicleDet.BuiltType = ''
        vehicleDet.VehicleType = 'PCP'
        vehicleDet.FKVehicleType_ID = 1
        setPolicyData({
            ...policyData,

            ['Discounts']: {
                ...policyData['Discounts'],
                ['IsIMT23']: 'false'
            },
            PolicyDetails: {
                ...PolicyDet
            },
            VehicleDetails: {
                ...vehicleDet
            }
        })
        setVehicleData({ ...vehicleData, ...vehicleDet })

        setValue('IsIMT23', 'false')
        setValue('VehClass', 'P')
    }

    const changeOemFn = async (value) => {
        const response = await getVehiclebyOemId({ Id: value })
        if (response != null && response.data != null) {
            setVehicleTypeList(response.data)
        }
    }

    const handleVehicleTypeChange = async (e) => {
        let { value, name } = e.target

        setModel([])
        setVariant([])
        reset({
            ...control._formValues,
            ['MakeId']: 0,
            ['ModelId']: 0,
            ['VariantId']: 0
        })
        await fillVehicleNames(name, value)
    }

    const fillVehicleNames = async (name, value) => {
        if (name == 'FKVehicleType_ID') {
            let vehicleTypeName = vehicleTypeList.find(
                (x) => x['VEHICLETYPE_ID'] == value
            )['VEHICLETYPE_VALUE']

            let miscType = {
                ['MiscType']: vehicleData.MiscType,
                ['FKMiscType_ID']: vehicleData.FKMiscType_ID,
                ['IMT34']: vehicleData.IMT34
            }

            if (value != 1) {
                await getVehicleSubTypesFn({ VehicleType: value })
                let carrierType = vehicleData.CarrierType
                if (value == 4) {
                    carrierType = 'PVT'
                    reset({
                        ...control._formValues,

                        ['CarrierType']: 'PVT'
                    })
                } else {
                    miscType.MiscType = ''
                    miscType.FKMiscType_ID = 0
                    miscType.IMT34 = 0
                }
                setVehicleData({
                    ...vehicleData,
                    ['VehicleType']: vehicleTypeName,
                    ['FKVehicleType_ID']: value,
                    ['CarrierType']: carrierType,

                    ...miscType
                })

            } else {
                setVehicleData({
                    ...vehicleData,
                    ['VehicleType']: vehicleTypeName,
                    ['FKVehicleType_ID']: value,
                    ['VehicleSubType']: '',
                    ['FKVehicleSubType_ID']: 0,
                    ['MiscType']: '',
                    ['FKMiscType_ID']: 0,
                    ['CarrierType']: 'PVT'
                })
                reset({
                    ...control._formValues,
                    ['FKVehicleSubType_ID']: 0,
                    ['FKMiscType_ID']: 0,
                    ['CarrierType']: 'PVT'
                })
            }
        } else if (name == 'FKVehicleSubType_ID') {
            let subTypeName = vehicleSubTypeList.find(
                (x) => x['VEHICLESUBTYPE_ID'] == value
            )['SUBTYPE_VALUE']
            setVehicleData({
                ...vehicleData,
                ['VehicleSubType']: subTypeName,
                ['FKVehicleSubType_ID']: value
            })
            if (
                common.get_CheckEmptyString(subTypeName).toUpperCase() ==
                'TRAILER' &&
                vehicleData.VehicleType == 'GCV'
            )
                setValue('IsTrailer', '1')
            else setValue('IsTrailer', '0')
        } else if (name == 'FKMiscType_ID') {
            let miscTypeName = miscTypeList.find(
                (x) => x['MISVEHICLETYPEID'] == value
            )['MISVEHICLENAME']
            setVehicleData({
                ...vehicleData,
                ['MiscType']: miscTypeName,
                ['FKMiscType_ID']: value
            })
        } else if (name == 'FKBuiltType_ID') {
            let builtTypeName = builtTypeList.find(
                (x) => x['BUILTTYPE_ID'] == value
            )['BUILTTYPE_NAME']
            setVehicleData({
                ...vehicleData,
                ['BuiltType']: builtTypeName,
                ['FKBuiltType_ID']: value
            })
        }
    }
    const getVehicleSubTypesFn = async (data: any) => {
        let result = await getVehicleSubTypes(data)
        if (result != null) {
            setVehicleSubTypeList(result.subTypeList)
            setBuiltTypeList(result.builtTypeList)
        }
    }


    // #endRegion
    return (
        <>
            <ConfirmDialog {...dialog} />
            <BackDropLoader openDialog={showLoading} />
            <SearchMapRto
                props={{ isMapRtoOpen, setMapRto, rto, setRTO }}
            ></SearchMapRto>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* <form> */}
                <Box>
                    <Container
                        maxWidth={false}
                        sx={{ px: 8, pt: 4 }}
                        disableGutters
                    >
                        <div className="content-wrapper">
                            <section className="content-header">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="box box-success">
                                            <div className="box-header with-border">
                                                <h1 className="box-title flex items-center my-2">
                                                    <svg
                                                        onClick={() =>
                                                            navigate(-1)
                                                        }
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
                                                        Policy Issuance
                                                    </span>
                                                </h1>
                                            </div>

                                            <Accordion
                                                defaultExpanded
                                                sx={{
                                                    backgroundColor:
                                                        'transparent',
                                                    border: '0px',
                                                    boxShadow: '0px 0px 0px',
                                                    '&:before': {
                                                        display: 'none'
                                                    }
                                                }}
                                            >
                                                <AccordionSummary
                                                    expandIcon={
                                                        <ExpandMoreIcon />
                                                    }
                                                    aria-controls="panel6-content"
                                                    className="accordianHeading"
                                                    id="panel6-header"
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
                                                        <g clipPath="url(#clip0_1516_22030)">
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M23.4091 13.166V8.25766C23.4091 7.49228 23.1201 6.75862 22.6052 6.21728C22.0912 5.67689 21.3933 5.37305 20.6652 5.37305C17.4979 5.37305 11.0277 5.37305 7.86036 5.37305C7.13322 5.37305 6.43444 5.67689 5.92042 6.21728C5.40548 6.75862 5.11646 7.49228 5.11646 8.25766V21.7307C5.11646 22.4961 5.40548 23.2298 5.92042 23.7702C6.43444 24.3115 7.13322 24.6154 7.86036 24.6154C11.0277 24.6154 17.4979 24.6154 20.6652 24.6154C21.1701 24.6154 21.5799 24.1846 21.5799 23.6538C21.5799 23.123 21.1701 22.6923 20.6652 22.6923C17.4979 22.6923 11.0277 22.6923 7.86036 22.6923C7.61798 22.6923 7.38566 22.5913 7.21371 22.4105C7.04267 22.2307 6.94572 21.9855 6.94572 21.7307V8.25766C6.94572 8.00189 7.04267 7.75766 7.21371 7.57785C7.38566 7.39709 7.61798 7.29612 7.86036 7.29612H20.6652C20.9076 7.29612 21.1408 7.39709 21.3119 7.57785C21.4838 7.75766 21.5799 8.00189 21.5799 8.25766V13.166C21.5799 13.6968 21.9896 14.1275 22.4945 14.1275C22.9994 14.1275 23.4091 13.6968 23.4091 13.166Z"
                                                                fill="black"
                                                            />
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M9.68874 16.2063L15.79 16.2092C16.2948 16.2101 16.7046 15.7794 16.7055 15.2486C16.7055 14.7178 16.2967 14.2871 15.7918 14.2861L9.69057 14.2832C9.18569 14.2822 8.77594 14.713 8.77502 15.2438C8.77502 15.7746 9.18387 16.2053 9.68874 16.2063Z"
                                                                fill="#8080DA"
                                                            />
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M9.68874 12.1037L18.229 12.1066C18.7339 12.1076 19.1436 11.6768 19.1445 11.1461C19.1445 10.6153 18.7357 10.1845 18.2308 10.1836L9.69057 10.1807C9.18569 10.1797 8.77594 10.6105 8.77502 11.1412C8.77502 11.672 9.18387 12.1028 9.68874 12.1037Z"
                                                                fill="#8080DA"
                                                            />
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M9.69692 20.053L14.3347 20.0558C14.8396 20.0568 15.2494 19.626 15.2503 19.0953C15.2503 18.5645 14.8405 18.1337 14.3356 18.1328L9.69875 18.1299C9.19387 18.1289 8.7832 18.5597 8.7832 19.0905C8.78229 19.6212 9.19205 20.052 9.69692 20.053Z"
                                                                fill="#8080DA"
                                                            />
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M22.4512 15.2568L25.2683 15.9305V18.902C25.2683 20.069 24.5328 21.4272 22.5491 22.2178L22.4512 22.2568L22.3534 22.2178C20.3696 21.4272 19.6342 20.069 19.6342 18.902V15.9305L22.4512 15.2568ZM20.6312 16.8835V18.902C20.6312 19.7406 20.7106 20.4152 22.4512 21.1427C24.1918 20.4152 24.2712 19.7406 24.2712 18.902V16.8835L22.4512 16.3446L20.6312 16.8835Z"
                                                                fill="#8080DA"
                                                            />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_1516_22030">
                                                                <rect
                                                                    width="20"
                                                                    height="20"
                                                                    fill="white"
                                                                    transform="translate(5 5)"
                                                                />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                    <span className="AccordianItem ml-3">
                                                        Policy Details
                                                    </span>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Box
                                                        sx={{
                                                            flexGrow: '1'
                                                        }}
                                                    >
                                                        <Grid
                                                            container
                                                            sx={{ mt: 2 }}
                                                            rowSpacing={6}
                                                            columnSpacing={8}
                                                        >
                                                            <Grid
                                                                xs={12}
                                                                md={4}
                                                                className="requiredField"
                                                            >
                                                                <FormInputRadio
                                                                    onChangeFn={
                                                                        getToggleButtonData
                                                                    }
                                                                    list={
                                                                        policyTypeToggleObj
                                                                    }
                                                                    label="Policy Type"
                                                                    name="PolicyType"
                                                                    control={
                                                                        control
                                                                    }
                                                                    IsDisabled={
                                                                        isPIdPNoExists
                                                                    }
                                                                />
                                                            </Grid>
                                                            {policyData
                                                                .PolicyDetails
                                                                .PolicyType ==
                                                                'R' ? (
                                                                <Grid
                                                                    xs={12}
                                                                    md={8}
                                                                    id="divRenew"
                                                                >
                                                                    <Grid
                                                                        xs={12}
                                                                        className="requiredField"
                                                                    >
                                                                        <FormInputRadio
                                                                            onChangeFn={
                                                                                getToggleButtonData
                                                                            }
                                                                            list={
                                                                                prevPolTypeToggleObj
                                                                            }
                                                                            label="Previous Policy Type"
                                                                            name="RENEWAL_TYPE"
                                                                            control={
                                                                                control
                                                                            }
                                                                            IsDisabled={
                                                                                isPIdPNoExists
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </Grid>
                                                        <Grid
                                                            container
                                                            sx={{ mt: 2 }}
                                                            rowSpacing={6}
                                                            columnSpacing={8}
                                                        >
                                                            <Grid
                                                                xs={12}
                                                                md={4}
                                                                item
                                                            >
                                                                <FormControl
                                                                    fullWidth
                                                                >
                                                                    <FormInputSelect
                                                                        control={
                                                                            control
                                                                        }
                                                                        name="FKOEM_ID"
                                                                        onChangeFn={
                                                                            handleOemChange
                                                                        }
                                                                        label="OEM"
                                                                        LIST={
                                                                            oem
                                                                        }
                                                                        TEXT="OemCode"
                                                                        VALUE="OemId"
                                                                        defaultValue={
                                                                            selectedOemId
                                                                                ? selectedOemId
                                                                                : ''
                                                                        }
                                                                        inputProps={{
                                                                            readOnly:
                                                                                disabledTMIInput
                                                                        }}
                                                                        disabled={
                                                                            disabledTMIInput
                                                                        }
                                                                        className="requiredField"
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                            {policyData.FKOEM_ID ==
                                                                2 && (
                                                                    <Grid
                                                                        xs={12}
                                                                        md={4}
                                                                        item
                                                                    >
                                                                        <FormControl
                                                                            fullWidth
                                                                        >
                                                                            <FormInputSelect
                                                                                control={
                                                                                    control
                                                                                }
                                                                                name="FKVehicleType_ID"
                                                                                onChangeFn={
                                                                                    handleVehicleTypeChange
                                                                                }
                                                                                label="Vehicle Type"
                                                                                LIST={
                                                                                    vehicleTypeList
                                                                                }
                                                                                TEXT="VEHICLETYPE_VALUE"
                                                                                VALUE="VEHICLETYPE_ID"
                                                                                // defaultValue={
                                                                                //     selectedOemId ? selectedOemId : ''
                                                                                // }
                                                                                inputProps={{
                                                                                    readOnly:
                                                                                        disabledTMIInput
                                                                                }}
                                                                                disabled={
                                                                                    disabledTMIInput
                                                                                }
                                                                                className="requiredField"
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                )}

                                                            {vehicleData.VehicleType ==
                                                                'GCV' && (
                                                                    <Grid
                                                                        xs={12}
                                                                        md={4}
                                                                        item
                                                                        className="requiredField"
                                                                    >
                                                                        <FormInputRadio
                                                                            onChangeFn={
                                                                                getToggleButtonData
                                                                            }
                                                                            list={
                                                                                carrierTypeToggleObj
                                                                            }
                                                                            label="Carrier Type"
                                                                            name="CarrierType"
                                                                            control={
                                                                                control
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                )}
                                                        </Grid>

                                                        {policyData
                                                            .PolicyDetails
                                                            .PolicyType ==
                                                            'R' &&
                                                            policyData.Renew
                                                                .RENEWAL_TYPE !=
                                                            2 ? (
                                                            <Grid
                                                                id="divRenew1"
                                                                container
                                                                rowSpacing={6}
                                                                columnSpacing={
                                                                    8
                                                                }
                                                                sx={{ mt: 2 }}
                                                            >
                                                                <Grid
                                                                    xs={12}
                                                                    md={4}
                                                                    className="policyNo"
                                                                >
                                                                    <FormInputText
                                                                        control={
                                                                            control
                                                                        }
                                                                        onBlur={
                                                                            getVISoFPrevPolicyDataFN
                                                                        }
                                                                        name="PREV_POLICY_NO"
                                                                        onChangeFn={
                                                                            handleRenewChange
                                                                        }
                                                                        inputProps={{
                                                                            style: {
                                                                                textTransform:
                                                                                    'uppercase'
                                                                            },
                                                                            maxLength: 30
                                                                        }}
                                                                        label="Previous Policy No"
                                                                        className="requiredField"
                                                                    />
                                                                </Grid>
                                                                <Grid
                                                                    xs={12}
                                                                    md={4}
                                                                    className="policyNo"
                                                                >
                                                                    <FormControl
                                                                        fullWidth
                                                                    >
                                                                        <FormInputSelect
                                                                            control={
                                                                                control
                                                                            }
                                                                            name="PREV_COVERTYPE_ID"
                                                                            onChangeFn={
                                                                                handleRenewChange
                                                                            }
                                                                            label="Previous Vehicle Cover"
                                                                            LIST={
                                                                                VehicleRenewCover
                                                                            }
                                                                            TEXT="CoverType"
                                                                            VALUE="CoverTypeId"
                                                                            disabled={
                                                                                disabledTMIInput
                                                                            }
                                                                            className="requiredField"
                                                                        />
                                                                    </FormControl>
                                                                </Grid>
                                                                <Grid
                                                                    xs={12}
                                                                    md={4}
                                                                    className="policyNo"
                                                                    style={{
                                                                        display:
                                                                            'none'
                                                                    }}
                                                                >
                                                                    <FormControl
                                                                        fullWidth
                                                                    >
                                                                        <InputLabel id="ddlODTenure_label">
                                                                            OD
                                                                            Tenure{' '}
                                                                            <span className="red">
                                                                                *
                                                                            </span>
                                                                        </InputLabel>
                                                                        <Select
                                                                            value={
                                                                                policyData
                                                                                    .Renew
                                                                                    .PREV_POLICY_NO
                                                                            }
                                                                            variant="standard"
                                                                            labelId="ddlODTenure_label"
                                                                            name="PREV_COVERTYPE_ID"
                                                                            id="ddlRenewODTenure"
                                                                            label="OD Tenure"
                                                                        >
                                                                            <MenuItem
                                                                                value={
                                                                                    0
                                                                                }
                                                                            >
                                                                                <em>
                                                                                    -select-
                                                                                </em>
                                                                            </MenuItem>
                                                                            <MenuItem
                                                                                value={
                                                                                    1
                                                                                }
                                                                            >
                                                                                1+0
                                                                            </MenuItem>
                                                                        </Select>
                                                                    </FormControl>
                                                                </Grid>
                                                                <Grid
                                                                    xs={12}
                                                                    md={4}
                                                                    className="policyNo"
                                                                    style={{
                                                                        display:
                                                                            'none'
                                                                    }}
                                                                >
                                                                    <FormControl
                                                                        fullWidth
                                                                    >
                                                                        <InputLabel id="ddlODTenure_label">
                                                                            TP
                                                                            Tenure{' '}
                                                                            <span className="red">
                                                                                *
                                                                            </span>
                                                                        </InputLabel>
                                                                        <Select
                                                                            variant="standard"
                                                                            labelId="ddlODTenure_label"
                                                                            name="PREV_COVERTYPE_ID"
                                                                            id="ddlRenewTPTenure"
                                                                            label="TP Tenure"
                                                                        >
                                                                            <MenuItem>
                                                                                <em></em>
                                                                            </MenuItem>
                                                                        </Select>
                                                                    </FormControl>
                                                                </Grid>
                                                                {policyData
                                                                    .Renew
                                                                    .PREV_COVERTYPE_ID !=
                                                                    2 &&
                                                                    policyData
                                                                        .Renew
                                                                        .PREV_COVERTYPE_ID !=
                                                                    4 && (
                                                                        <Grid
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
                                                                                    'Renew'
                                                                                }
                                                                                name="POLICY_EXPIRY_DATE"
                                                                                onChangeFn={
                                                                                    getDate1
                                                                                }
                                                                                label="OD Policy Expiry Date"
                                                                                maxDate={
                                                                                    policyData
                                                                                        .PolicyDetails
                                                                                        .PolicyType ==
                                                                                        'R'
                                                                                        ? dayjs(
                                                                                            new Date()
                                                                                        ).add(
                                                                                            3,
                                                                                            'year'
                                                                                        )
                                                                                        : dayjs(
                                                                                            new Date()
                                                                                        ).add(
                                                                                            60,
                                                                                            'days'
                                                                                        )
                                                                                }
                                                                                disabled={
                                                                                    disabledTMIInput
                                                                                }
                                                                            />
                                                                        </Grid>
                                                                    )}
                                                                <Grid
                                                                    xs={12}
                                                                    md={4}
                                                                    className="requiredField"
                                                                >
                                                                    <FormInputDate
                                                                        control={
                                                                            control
                                                                        }
                                                                        nestedObject={
                                                                            'Renew'
                                                                        }
                                                                        name="TP_POLICY_EXPIRY_DATE"
                                                                        onChangeFn={
                                                                            getDate1
                                                                        }
                                                                        label="TP Policy Expiry Date"
                                                                        disabled={
                                                                            disabledTMIInput
                                                                        }
                                                                    />
                                                                </Grid>
                                                                {policyData
                                                                    .Renew
                                                                    .PREV_COVERTYPE_ID ==
                                                                    6 &&
                                                                    calculateTP_OD_Diff(
                                                                        'TP'
                                                                    ) && (
                                                                        <Grid
                                                                            xs={
                                                                                12
                                                                            }
                                                                            md={
                                                                                4
                                                                            }
                                                                            id="divActiveTP"
                                                                        >
                                                                            <ColorToggleButton
                                                                                value={
                                                                                    policyData
                                                                                        .Renew
                                                                                        .IsHavingTPPolicy
                                                                                }
                                                                                defaultSelected={
                                                                                    policyData
                                                                                        .Renew
                                                                                        .IsHavingTPPolicy
                                                                                }
                                                                                toggleButton={
                                                                                    getToggleButtonData
                                                                                }
                                                                                options={{
                                                                                    ...activeTPPolicy
                                                                                }}
                                                                                label="Does the customer have active TP Policy?"
                                                                                name="IsHavingTPPolicy"
                                                                            />
                                                                        </Grid>
                                                                    )}
                                                                {policyData
                                                                    .Renew
                                                                    .PREV_COVERTYPE_ID ==
                                                                    6 &&
                                                                    calculateTP_OD_Diff(
                                                                        'OD'
                                                                    ) && (
                                                                        <Grid
                                                                            xs={
                                                                                12
                                                                            }
                                                                            md={
                                                                                4
                                                                            }
                                                                            id="divActiveOD"
                                                                        >
                                                                            <ColorToggleButton
                                                                                value={
                                                                                    policyData
                                                                                        .Renew
                                                                                        .IsHavingODPolicy
                                                                                }
                                                                                defaultSelected={
                                                                                    policyData
                                                                                        .Renew
                                                                                        .IsHavingODPolicy
                                                                                }
                                                                                toggleButton={
                                                                                    getToggleButtonData
                                                                                }
                                                                                options={{
                                                                                    ...activeODPolicyObj
                                                                                }}
                                                                                label="Does the customer have active OD Policy?"
                                                                                name="IsHavingODPolicy"
                                                                            />
                                                                        </Grid>
                                                                    )}
                                                                <Grid
                                                                    xs={12}
                                                                    md={4}
                                                                    className="requiredField"
                                                                >
                                                                    <FormInputRadio
                                                                        onChangeFn={
                                                                            getToggleButtonData
                                                                        }
                                                                        list={
                                                                            transferCaseToggleObj
                                                                        }
                                                                        label="Transfer Case"
                                                                        name="ISTRANSFER"
                                                                        control={
                                                                            control
                                                                        }
                                                                        IsDisabled={
                                                                            disabledTMIInput
                                                                        }
                                                                    />
                                                                </Grid>
                                                                {policyData
                                                                    .Renew
                                                                    .ISTRANSFER !=
                                                                    'true' &&
                                                                    policyData
                                                                        .Renew
                                                                        .PREV_COVERTYPE_ID !=
                                                                    2 && (
                                                                        <Grid
                                                                            xs={
                                                                                12
                                                                            }
                                                                            md={
                                                                                4
                                                                            }
                                                                            className="requiredField"
                                                                        >
                                                                            <FormInputRadio
                                                                                onChangeFn={
                                                                                    getToggleButtonData
                                                                                }
                                                                                list={
                                                                                    cliamAvailedToggleObj
                                                                                }
                                                                                label="Claim made on existing policy?"
                                                                                name="ISCLAIM_AVAILED"
                                                                                control={
                                                                                    control
                                                                                }
                                                                            />
                                                                        </Grid>
                                                                    )}

                                                                <Grid
                                                                    xs={12}
                                                                    md={4}
                                                                    className="policyNo"
                                                                    id="divclaimtenure"
                                                                    style={{
                                                                        display:
                                                                            'none'
                                                                    }}
                                                                >
                                                                    <FormControl
                                                                        fullWidth
                                                                    >
                                                                        <InputLabel id="ddlNoOfClaims">
                                                                            No.
                                                                            of
                                                                            claims
                                                                            in
                                                                            the
                                                                            previous
                                                                            policy{' '}
                                                                            <span className="red">
                                                                                *
                                                                            </span>
                                                                        </InputLabel>
                                                                        <Select
                                                                            variant="standard"
                                                                            labelId="ddlNoOfClaims"
                                                                            name="NoOfClaimsID"
                                                                            label="No. of claims in the previous policy"
                                                                        >
                                                                            <MenuItem value="0">
                                                                                <em>
                                                                                    -Select
                                                                                    No.
                                                                                    of
                                                                                    Claims-
                                                                                </em>
                                                                            </MenuItem>
                                                                            <MenuItem value="1">
                                                                                1
                                                                            </MenuItem>
                                                                            <MenuItem value="6">
                                                                                2
                                                                            </MenuItem>
                                                                            <MenuItem value="2">
                                                                                3
                                                                            </MenuItem>
                                                                        </Select>
                                                                    </FormControl>
                                                                </Grid>
                                                                <Grid
                                                                    xs={12}
                                                                    md={4}
                                                                    style={{
                                                                        display:
                                                                            'none'
                                                                    }}
                                                                >
                                                                    <ColorToggleButton
                                                                        defaultSelected={
                                                                            1
                                                                        }
                                                                        toggleButton={
                                                                            getToggleButtonData
                                                                        }
                                                                        options={{
                                                                            ...cliamAvailedYear
                                                                        }}
                                                                        label="Claim availed in which year "
                                                                        name="RENEWAL_TYPE1"
                                                                    />
                                                                </Grid>
                                                                {policyData
                                                                    .Renew
                                                                    .PREV_COVERTYPE_ID !=
                                                                    2 &&
                                                                    policyData
                                                                        .Renew
                                                                        .PREV_COVERTYPE_ID !=
                                                                    4 &&
                                                                    policyData
                                                                        .Renew
                                                                        .ISTRANSFER !=
                                                                    'true' &&
                                                                    policyData
                                                                        .Renew
                                                                        .ISCLAIM_AVAILED !=
                                                                    'true' && (
                                                                        <Grid
                                                                            xs={
                                                                                12
                                                                            }
                                                                            md={
                                                                                4
                                                                            }
                                                                            id="divoldncb"
                                                                        >
                                                                            <FormControl
                                                                                fullWidth
                                                                            >
                                                                                <FormInputSelect
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    name="OLD_POL_NCB_LEVEL"
                                                                                    onChangeFn={
                                                                                        handleRenewChange
                                                                                    }
                                                                                    label="Previous NCB %"
                                                                                    LIST={
                                                                                        ncbper
                                                                                    }
                                                                                    TEXT="EntitledNCBLabel"
                                                                                    VALUE="EntitledNCBValue"
                                                                                    className="requiredField"
                                                                                    disabled={
                                                                                        disabledTMIInput
                                                                                    }
                                                                                />
                                                                            </FormControl>
                                                                        </Grid>
                                                                    )}
                                                                {/* {policyData
                                                                    .PolicyDetails
                                                                    .CoverTypeId !=
                                                                    2 &&
                                                                    policyData
                                                                        .PolicyDetails
                                                                        .CoverTypeId !=
                                                                        4 && (
                                                                        
                                                                    )} */}
                                                                <Grid
                                                                    xs={12}
                                                                    md={4}
                                                                    id="divoldncb"
                                                                >
                                                                    <FormControl
                                                                        fullWidth
                                                                    >
                                                                        <FormInputSelect
                                                                            control={
                                                                                control
                                                                            }
                                                                            name="FKISURANCE_COMP_ID"
                                                                            onChangeFn={
                                                                                handleRenewChange
                                                                            }
                                                                            label="Previous OD Policy IC"
                                                                            LIST={
                                                                                insuranceCompany
                                                                            }
                                                                            TEXT="ICName"
                                                                            VALUE="ICId"
                                                                            className="requiredField"
                                                                            disabled={
                                                                                disabledTMIInput
                                                                            }
                                                                        />
                                                                    </FormControl>
                                                                </Grid>
                                                                {policyData
                                                                    .Renew
                                                                    .PREV_COVERTYPE_ID ==
                                                                    6 && (
                                                                        // calculateTP_OD_Diff() &&
                                                                        <Grid
                                                                            xs={12}
                                                                            md={4}
                                                                            id="divPrevTPTenure"
                                                                            className="requiredField"
                                                                        >
                                                                            <FormControl
                                                                                fullWidth
                                                                            >
                                                                                <FormInputSelect
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    name="TP_PREV_TENURE"
                                                                                    onChangeFn={
                                                                                        handleTPPrevTenureYear
                                                                                    }
                                                                                    label="Previous TP Tenure (Year)"
                                                                                    LIST={
                                                                                        policyData
                                                                                            .PolicyDetails
                                                                                            .VehClass ==
                                                                                            'C'
                                                                                            ? otherCVTPTenureDropDown
                                                                                            : otherTPTenureDropDown
                                                                                    }
                                                                                    TEXT="TEXT"
                                                                                    VALUE="VALUE"
                                                                                />
                                                                            </FormControl>
                                                                        </Grid>
                                                                    )}

                                                                {policyData
                                                                    .Renew
                                                                    .PREV_COVERTYPE_ID ==
                                                                    3 &&
                                                                    policyData.Renew
                                                                        .RENEWAL_TYPE ==
                                                                    3 &&
                                                                    policyData.Renew
                                                                        .ISCLAIM_AVAILED ==
                                                                    'true' &&
                                                                    policyData.Renew
                                                                        .ISTRANSFER ==
                                                                    'false' ? (
                                                                    <>
                                                                        <Grid
                                                                            xs={
                                                                                12
                                                                            }
                                                                            md={
                                                                                4
                                                                            }
                                                                        >
                                                                            <FormControl
                                                                                fullWidth
                                                                            >
                                                                                <FormInputSelect
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    name="ClaimCount"
                                                                                    onChangeFn={
                                                                                        handleInputChange
                                                                                    }
                                                                                    label="Claim Count"
                                                                                    LIST={
                                                                                        claimCount
                                                                                    }
                                                                                    TEXT="claimId"
                                                                                    VALUE="claimValue"
                                                                                />
                                                                            </FormControl>
                                                                        </Grid>
                                                                        <Grid
                                                                            xs={
                                                                                12
                                                                            }
                                                                            md={
                                                                                4
                                                                            }
                                                                        >
                                                                            <FormInputDate
                                                                                minDate={policyData.Renew.POLICY_EXPIRY_DATE?.subtract(
                                                                                    3,
                                                                                    'years'
                                                                                )}
                                                                                maxDate={
                                                                                    policyData
                                                                                        .Renew
                                                                                        .POLICY_EXPIRY_DATE
                                                                                }
                                                                                control={
                                                                                    control
                                                                                }
                                                                                name="LastClaimDate"
                                                                                onChangeFn={
                                                                                    getDate1
                                                                                }
                                                                                label="Last Claim Date"
                                                                            />
                                                                        </Grid>
                                                                    </>
                                                                ) : (
                                                                    <></>
                                                                )}
                                                            </Grid>
                                                        ) : (
                                                            <></>
                                                        )}

                                                        <Grid
                                                            container
                                                            rowSpacing={6}
                                                            columnSpacing={8}
                                                            sx={{ mt: 2 }}
                                                        >
                                                            {(policyData.FKOEM_ID ==
                                                                1 ||
                                                                policyData.FKOEM_ID ==
                                                                3) && (
                                                                    <Grid
                                                                        xs={12}
                                                                        md={4}
                                                                        className="requiredField"
                                                                    >
                                                                        <FormInputRadio
                                                                            onChangeFn={
                                                                                getToggleButtonData
                                                                            }
                                                                            list={
                                                                                vehicleTypeToggleObj
                                                                            }
                                                                            label="Vehicle Class"
                                                                            name="VehClass"
                                                                            control={
                                                                                control
                                                                            }
                                                                            IsDisabled={
                                                                                disabledTMIInput
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                )}
                                                            {(servername == 'UAT') && (
                                                                <Grid xs={12} md={3}>
                                                                    <FormInputRadio
                                                                        onChangeFn={getToggleButtonData}
                                                                        list={QuoteToggleObj}
                                                                        label="Offline Quote"
                                                                        name="Quotetype"
                                                                        control={control}

                                                                    />
                                                                </Grid>
                                                            )}
                                                            <Grid
                                                                xs={12}
                                                                md={4}
                                                                className="requiredField"
                                                            >
                                                                <FormInputRadio
                                                                    onChangeFn={
                                                                        getToggleButtonData
                                                                    }
                                                                    list={
                                                                        proposerTypeToggleObj
                                                                    }
                                                                    label="Proposer Type"
                                                                    name="ProposalType"
                                                                    control={
                                                                        control
                                                                    }
                                                                    IsDisabled={
                                                                        disabledTMIInput
                                                                    }
                                                                />
                                                            </Grid>
                                                            <Grid
                                                                xs={12}
                                                                md={4}
                                                            >
                                                                <FormControl
                                                                    fullWidth
                                                                >
                                                                    <FormInputSelect
                                                                        control={
                                                                            control
                                                                        }
                                                                        name="CoverTypeId"
                                                                        onChangeFn={
                                                                            handleInputChange
                                                                        }
                                                                        label="Vehicle Cover"
                                                                        LIST={
                                                                            VehicleCover
                                                                        }
                                                                        TEXT="CoverType"
                                                                        VALUE="CoverTypeId"
                                                                        className="requiredField"
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                            {policyData
                                                                .PolicyDetails
                                                                .PolicyType ==
                                                                'N' && (
                                                                    <Grid
                                                                        xs={12}
                                                                        md={4}
                                                                        className="requiredField"
                                                                    >
                                                                        <FormInputDate
                                                                            control={
                                                                                control
                                                                            }
                                                                            nestedObject={
                                                                                'VehicleDetails'
                                                                            }
                                                                            name="PolicyStartDate"
                                                                            onChangeFn={
                                                                                getDate
                                                                            }
                                                                            label="Policy Start Date"
                                                                            //disabled={disabledTMIInput}
                                                                            //onBlur={checkRegistrationInvoice}
                                                                            //minDate={sendPolicyData.minInvoice}
                                                                            //maxDate={sendPolicyData.maxInvoice}
                                                                            defaultValue={dayjs(
                                                                                new Date()
                                                                            )}
                                                                            minDate={dayjs(
                                                                                new Date()
                                                                            )}
                                                                            maxDate={
                                                                                futureDate
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                )}

                                                        </Grid>
                                                    </Box>
                                                </AccordionDetails>
                                            </Accordion>

                                            <PolicyPageContext.Provider
                                                value={{
                                                    cpa: [cpaval, setval],
                                                    cpaWaiverReasonList:
                                                        cpaWaiverReasonList,
                                                    unregister: unregister,
                                                    register: register,
                                                    proposer: [
                                                        policyData,
                                                        setPolicyData
                                                    ]
                                                }}
                                            >
                                                <CustomerDetails
                                                    sendDataToParent={{
                                                        customerDetails,
                                                        setCustomerDetails,
                                                        policyData,
                                                        setPolicyData,
                                                        disabledTMIInput,
                                                        IsVisofSameDealer
                                                    }}
                                                    controls={{ control }}
                                                    resets={{ reset }}
                                                ></CustomerDetails>
                                                <VehicleDetails
                                                    sendPolicyData={{
                                                        icData,
                                                        setICOnEdit,
                                                        policyData,
                                                        setPolicyData,
                                                        optionalDetails,
                                                        setOptionalDetails,
                                                        vehicleData,
                                                        setVehicleData,
                                                        additionalDiscounts,
                                                        setAdditionalDiscounts,
                                                        icList,
                                                        setICList,
                                                        DroppDownObject,
                                                        make,
                                                        setMake,
                                                        model,
                                                        setModel,
                                                        variant,
                                                        setVariant,
                                                        vehicleSubTypeList,
                                                        miscTypeList,
                                                        builtTypeList,
                                                        lastYearAddons,
                                                        setLastYearAddons,
                                                        handleClickShowRTOMapping,
                                                        disabledTMIInput,
                                                        setTMIInput,
                                                        yom,
                                                        setYOM,
                                                        disabledForVariant,
                                                        setdisabledForVariant,
                                                        isSAOD,
                                                        isSATP,
                                                        minInvoice,
                                                        setMinInvoice,
                                                        maxInvoice,
                                                        setMaxInvoice,
                                                        minRegistration,
                                                        setMinRegistration,
                                                        maxRegistration,
                                                        setMaxRegistration,
                                                        setValue,
                                                        disableLLEmployee,
                                                        setDisableLLEmployee,
                                                        handleVehicleTypeChange,
                                                        biFuelAgreement,
                                                        setBiFuelAgreement,
                                                        isOldVehicle,
                                                        labelText,
                                                        setLabelText
                                                    }}
                                                    controls={{ control }}
                                                    resets={{ reset }}
                                                ></VehicleDetails>
                                            </PolicyPageContext.Provider>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                        <div className="text-center py-3">
                            <Button
                                color="primary"
                                size="medium"
                                variant="contained"
                                type="submit"
                            //disabled={validEmailandMobile}
                            >
                                Get Quotes
                            </Button>
                        </div>
                    </Container>
                </Box>
            </form>
            <Toaster />
        </>
    )
}
export default Policy
