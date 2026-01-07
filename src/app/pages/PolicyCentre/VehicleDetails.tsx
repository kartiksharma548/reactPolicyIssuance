import { useContext, useEffect, useRef, useState } from 'react'
import { COMMON_API_URL } from '../../constants/apiURLS'
import { PolicyMastersInput } from '../../redux/features/interfaces/loginInputModel'
import {
    FormControl,
    MenuItem,
    Select,
    Stack,
    Chip,
    TextField
} from '@mui/material'
import { AuthModel } from '../../redux/features/auth/authInterface'
import { useAppSelector } from '../../hooks/reduxHooks'
import { PropertyModel } from '../../redux/features/property/propertyInterface'
import { BasePath } from '../../constants/baseURL'
import { PolicyPageContext } from './Policy'

import axiosInstance from '../../utils/axiosInstance'
import InputLabel from '@mui/material/InputLabel'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'
import FormControlLabel from '@mui/material/FormControlLabel'
import ColorToggleButton from '../../components/common/groupToggleButton'
import Button from '@mui/material/Button'
import FormGroup from '@mui/material/FormGroup'
import Checkbox from '@mui/material/Checkbox'
import dayjs from 'dayjs'
import CancelIcon from '@mui/icons-material/Cancel'
import IconButton from '@mui/material/IconButton'
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone'

import Tooltip from '@mui/material/Tooltip'

//Zod validation schema
import { FormInputSelect } from '../../components/common/FormInputs/FormInputSelect'
import FormInputDate from '../../components/common/FormInputs/FormInputDate'
import { FormInputRadio } from '../../components/common/FormInputs/FormInputRadio'
import { FormInputText } from '../../components/common/FormInputs/FormInputText'
import {
    getEffectiveDate,
    checkDuplicateChassis,
    checkChassisPayment,
    validateEngineChassisNo,
    validateSpclRegistrationNo,
    getStateCode,
    checkRtoCodeEnabled,
    validateInvoiceDateRange
} from '../../services/policyServices/policyService'

import toast from 'react-hot-toast'
import { FormInputNumber } from '../../components/common/FormInputs/FormInputNumber'
import {
    EffectiveDateModel,
    ValidateProposalModel
} from '../../models/PolicyProposalMDL'
import common from '../../utils/common'
import CVAdditionalCovers from '../../components/policy/cvAdditionalCovers'


function VehicleDetails({ sendPolicyData, controls, resets }) {
    let policyData = sendPolicyData.policyData
    let setPolicyData = sendPolicyData.setPolicyData
    let optionalDetails = sendPolicyData.optionalDetails
    let setOptionalDetails = sendPolicyData.setOptionalDetails
    let vehicleData = sendPolicyData.vehicleData
    let setVehicleData = sendPolicyData.setVehicleData
    let additionalDiscounts = sendPolicyData.additionalDiscounts
    let setAdditionalDiscounts = sendPolicyData.setAdditionalDiscounts
    let setter = sendPolicyData.DroppDownObject
    let make = sendPolicyData.make
    let setMake = sendPolicyData.setMake
    let model = sendPolicyData.model
    let setModel = sendPolicyData.setModel
    let variant = sendPolicyData.variant
    let setVariant = sendPolicyData.setVariant
    let lastYearAddons = sendPolicyData.lastYearAddons
    let setLastYearAddons = sendPolicyData.setLastYearAddons
    let disabledTMIInput = sendPolicyData.disabledTMIInput
    let disabledForVariant = sendPolicyData.disabledForVariant
    let setdisabledForVariant = sendPolicyData.setdisabledForVariant
    let isOldVehicle = sendPolicyData.isOldVehicle
    let labelText = sendPolicyData.labelText
    let setLabelText = sendPolicyData.setLabelText



    const isAntiTheftCoFitted = useRef(null)
    //Additional Discounts
    let additionalDiscountsObj = { ...additionalDiscounts }
    additionalDiscountsObj.IsAntiTheft = 'false'

    interface ToggleRadioType {
        label: string
        obj: any
        settingState: any
        type: any
    }
    const encryptedMobEmail = useAppSelector<boolean>(
        (state: any) => state.auth.encryptedMobEmail
    )

    const BHSeriesData: ToggleRadioType[] = [
        {
            label: 'Yes',
            obj: policyData,
            settingState: setPolicyData,
            type: '1'
        },
        {
            label: 'No',
            obj: policyData,
            settingState: setPolicyData,
            type: '3'
        },
        {
            label: 'Special Reg No.',
            obj: policyData,
            settingState: setPolicyData,
            type: '2'
        }
    ]
    const TestData: ToggleRadioType[] = [
        {
            label: 'Yes',
            obj: vehicleData,
            settingState: setVehicleData,
            type: 'true'
        },
        {
            label: 'No',
            obj: vehicleData,
            settingState: setVehicleData,
            type: 'false'
        }
    ]

    const someDate = new Date()
    const numberOfDaysToAdd = 0
    const date = someDate.setDate(someDate.getDate() + numberOfDaysToAdd)
    const defaultValue = dayjs(someDate).format('DD/MM/YYYY')

    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )
    const propertySelect = useAppSelector<PropertyModel>(
        (state: any) => state.updateProperty
    )
    const Input: PolicyMastersInput = {
        Id: loginSelector.DealerId,
        CoverType: 0,
        PolicyType: '',
        VehicleType: '',
        DealerId: loginSelector.DealerId,
        IsDemoVehicle: 0,
        PolicyNo: '',
        Name: '',
        Mode: '',
        Param2: 0
    }

    //#region Vehicle Object
    const handleInputChange = (event: any) => {
        let val = false
        const { target } = event
        const { name, value } = target

        if (name === 'RTOId') {

            setVehicleData({
                ...vehicleData,
                RTOId: value,
                RTO_NAME: '',
                RegistrationNo1: '',
                RegistrationNo2: ''
            })

            resets.reset({
                ...controls.control._formValues,
                ['RTO_NAME']: '',
                ['RegistrationNo1']: '',
                ['RegistrationNo2']: ''
            })
            return
        }

        if (name === 'INSURED_GSTIN' || name === 'IsuredStateId') {
            setPolicyData({ ...policyData, [name]: value })
        } else if (
            name === 'RTO_NAME' ||
            name === 'RegistrationNo1' ||
            name === 'RegistrationNo2'
        ) {
            setVehicleData({ ...vehicleData, [name]: value })
        }
        else if (name === 'SpecialRegistartionNo') {
            setPolicyData({ ...policyData, [name]: value })
        }
        else if (
            name === 'BHNumberSeries1' ||
            name === 'BHNumberSeries2' ||
            name === 'BHNumberSeries3'
        ) {
            if (
                name === 'BHNumberSeries2' &&
                (value.substr(-1).toUpperCase() == 'I' ||
                    value.substr(-1).toUpperCase() == 'O')
            ) {
                sendPolicyData.setValue(
                    'BHNumberSeries2',
                    value.substring(0, value.length - 1)
                )
                return
            }

            setPolicyData({ ...policyData, [name]: value })
        }
        else if (name == 'DateofManufacture') {
            if (policyData.PolicyDetails.PolicyType == 'R') {
                let minInvoiceDate;
                const invoiceYear = Number(value);
                if (!isNaN(invoiceYear) && invoiceYear > 1900 && invoiceYear < 2100) {
                    minInvoiceDate = dayjs(`${invoiceYear}-01-01`);
                } else {
                    minInvoiceDate = dayjs(); // fallback to today
                }
                // console.log(sendPolicyData.minInvoiceDate)
                sendPolicyData.setMinInvoice(minInvoiceDate);

                if (policyData.Renew.RENEWAL_TYPE == '3') {
                    let EXPIRY_DATE =
                        policyData.Renew.POLICY_EXPIRY_DATE.isBefore(
                            policyData.Renew.TP_POLICY_EXPIRY_DATE
                        )
                            ? policyData.Renew.POLICY_EXPIRY_DATE
                            : policyData.Renew.TP_POLICY_EXPIRY_DATE

                    let tenure = policyData.Renew.POLICY_EXPIRY_DATE.isBefore(
                        policyData.Renew.TP_POLICY_EXPIRY_DATE
                    )
                        ? getOD_TPTenures(policyData.Renew.PREV_COVERTYPE_ID)[0]
                        : getOD_TPTenures(policyData.Renew.PREV_COVERTYPE_ID)[1]

                    let polStartDate = dayjs(EXPIRY_DATE).subtract(tenure, 'year');
                    sendPolicyData.setMaxInvoice(dayjs(polStartDate));
                }
                else
                    sendPolicyData.setMaxInvoice(dayjs());

                sendPolicyData.setValue('InvoiceDate', '')

            }

            setVehicleData({ ...vehicleData, [name]: value })
            
        }


        // else if (name == 'DateofManufacture') {
        //     if (policyData.PolicyDetails.PolicyType == 'R') {
        //         const invoiceYear = Number(value);
        //         let minInvoiceDate = dayjs(`${invoiceYear}-01-01`);
        //         let maxInvoiceDate;

        //         const expiryDate = policyData.PolicyDetails.ExpiryDate
        //             ? dayjs(policyData.PolicyDetails.ExpiryDate)
        //             : dayjs();

        //         // Max Invoice Date should not exceed expiry date or Dec 31 of manufacture year
        //         const endOfManufactureYear = dayjs(`${invoiceYear}-12-31`);
        //         maxInvoiceDate = expiryDate.isBefore(endOfManufactureYear)
        //             ? expiryDate
        //             : endOfManufactureYear;

        //         sendPolicyData.setMinInvoice(minInvoiceDate);
        //         sendPolicyData.setMaxInvoice(maxInvoiceDate);
        //     }

        //     setVehicleData({ ...vehicleData, [name]: value });
        // }

        else if (value === 'true') {
            val = true
            setVehicleData({ ...vehicleData, [name]: val })
        }
        else if (value === 'false') {

            val = false
            setVehicleData({ ...vehicleData, [name]: val })
        }
        else if (name === 'TrailerNo') {
            let trailerInfo = {
                TrailerChassisNo: vehicleData.TrailerChassisNo,
                TrailerPrice: vehicleData.TrailerPrice
            }

            sendPolicyData.setValue('IsTrailerNo', value.toString())

            if (value == 0) {
                trailerInfo.TrailerChassisNo = ''
                trailerInfo.TrailerPrice = 0
            }
            setVehicleData({ ...vehicleData, [name]: value, ...trailerInfo })
            resets.reset({ ...controls.control._formValues, ...trailerInfo })
        }
        else {
            setVehicleData({ ...vehicleData, [name]: value })
        }

    }
    //#endregion

    //#region Additional Discounts
    const handleAdditionalChange = (event: any) => {
        let val = false
        if (event.target.value === 'true') {
            val = true
            setAdditionalDiscounts({
                ...additionalDiscounts,
                [event.target.name]: val
            })
        } else if (event.target.value === 'false') {
            val = false
            setAdditionalDiscounts({
                ...additionalDiscounts,
                [event.target.name]: val
            })
        } else {
            setAdditionalDiscounts({
                ...additionalDiscounts,
                [event.target.name]: event.target.value
            })
        }
    }
    let AddDiscounts: ToggleRadioType = [
        {
            label: 'Yes',
            obj: additionalDiscounts,
            settingState: setAdditionalDiscounts,
            type: 'true'
        },
        {
            label: 'No',
            obj: additionalDiscounts,
            settingState: setAdditionalDiscounts,
            type: 'false'
        }
    ]
    let AddDiscountsVoluntry: ToggleRadioType = [
        {
            label: 'Yes',
            obj: policyData,
            settingState: setPolicyData,
            type: true
        },
        {
            label: 'No',
            obj: policyData,
            settingState: setPolicyData,
            type: false
        }
    ]
    //#endregion

    //#region Optional Details Change
    const handleOptionalChange = (event: any) => {
        const { target } = event
        const { name, value } = target
        let val = false
        if (
            name === 'ElectricalValue' ||
            name === 'NonElectricalValue' ||
            name === 'BiFuelValue'
        ) {            
            const raw = (value ?? '').toString()
            const digits = raw.replace(/\D/g, '')
            const numeric = digits === '' ? '' : parseInt(digits, 10)

            if (numeric !== '' && numeric > 500000) {
                toast.error('Maximum allowed value is 500000')
                
                setPolicyData({
                    ...policyData,
                    AccessoriesValue: {
                        ...policyData.AccessoriesValue,
                        // [name]: '500000'
                    }
                })
            } else {
                setPolicyData({
                    ...policyData,
                    AccessoriesValue: {
                        ...policyData.AccessoriesValue,
                        [name]: digits === '' ? '' : numeric.toString()
                    }
                })
            }
        } else if (name === 'GeoArea') {
            let geoval = typeof value === 'string' ? value.split(',') : value
            setPolicyData({ ...policyData, [name]: geoval })
        } else if (value === 'true') {
            val = true
            setOptionalDetails({ ...optionalDetails, [name]: val })
        } else if (value === 'false') {
            val = false
            setOptionalDetails({ ...optionalDetails, [name]: val })
        } else if (name == 'CPATenure') {
            if (value != 0) {
                setPolicyData({
                    ...policyData,
                    ['CPAReason']: ''
                })

                unregister('CPAReason')
                //sendPolicyData.setValue('CPAReason', '')
            } else {
                register('CPAReason', { required: true })
                sendPolicyData.setValue('CPAReason', '')
            }
            //setval(value)
            setOptionalDetails({ ...optionalDetails, [name]: value })
            sendPolicyData.setValue('CPATenure', value)
        } else {
            setOptionalDetails({ ...optionalDetails, [name]: value })
        }
    }
    let coverToggleObj: ToggleRadioType = [
        {
            label: 'Yes',
            obj: optionalDetails,
            settingState: setOptionalDetails,
            type: 'true'
        },
        {
            label: 'No',
            obj: optionalDetails,
            settingState: setOptionalDetails,
            type: 'false'
        }
    ]
    //#endregion

    //#region IC Selection
    const handleICSelection = (event: any) => {
        let tempIc = [...sendPolicyData.icList]
        tempIc.forEach((element) => {
            if (element.ICId == event.target.value) {
                element.checked = !element.checked
            }
        })
        sendPolicyData.setICList(tempIc)
    }
    const selectAllIC = (event: any) => {
        let tempIc = [...sendPolicyData.icList]
        tempIc.forEach((element) => {
            if (event.target.checked == true) {
                element.checked = true
            } else if (event.target.checked == false) {
                element.checked = false
            }
        })
        sendPolicyData.setICList(tempIc)
    }
    //#endregion

    //#region On Load Control Binding
    useEffect(() => { }, [])

    //#endregion

    //#region Dependent DropDown
    const [selectedOemId, setSelectedOemId] = useState(null)
    const [selectedMakeId, setSelectedMakeId] = useState(null)
    const [selectedModelId, setSelectedModelId] = useState(null)
    const [selectedVariantId, setSelectedVariantId] = useState(null)

  
    const handleMakeChange = (e: any) => {
        setSelectedModelId(null)
        setSelectedVariantId(null)
        setSelectedMakeId(e.target.value)
        setVehicleData({ ...vehicleData, [e.target.name]: e.target.value })
        Input.Id = e.target.value
        Input.VehicleType = vehicleData.FKVehicleType_ID
        Input.Param2 = policyData.FKOEM_ID
        axiosInstance
            .post(COMMON_API_URL.getModelbyMakeId, { ...Input })
            .then((response) => {
                if (response.status === 200) {
                    setModel(response.data.Models)
                }
            })
    }
    const handleModelChange = (e) => {
        setSelectedVariantId(null)
        setSelectedModelId(e.target.value)
        setVehicleData({ ...vehicleData, [e.target.name]: e.target.value })
        Input.Id = e.target.value
        //Input.Param2 = policyData.FKOEM_ID

        axiosInstance
            .post(COMMON_API_URL.getVariantsbyModel, { ...Input })
            .then((response) => {
                if (response.status === 200) {
                    setVariant(response.data.Variants)

                    //code aaded by nishant
                    // if (response.data.Variants[0]['CHASSISNO']) {
                    if (vehicleData.ChassisNo == '') {
                        const chassisNo = response.data.Variants[0]['CHASSISNO']

                        if (chassisNo !== null && chassisNo !== '') {
                            setVehicleData({
                                ...vehicleData,
                                ['ChassisNo']: chassisNo
                            })
                            resets.reset({
                                ...controls.control._formValues,
                                ['ChassisNo']: chassisNo
                            })
                        } else {
                            setVehicleData({
                                ...vehicleData,
                                ['ChassisNo']: ''
                            })
                            resets.reset({
                                ...controls.control._formValues,
                                ['ChassisNo']: ''
                            })
                        }
                    }

                    // code ended here
                }
            })
    }
    //const [disablePrice,setdisablePrice]= useState(true)

    const handleVaraintChange = (e) => {
        setSelectedVariantId(null)
        setSelectedVariantId(e.target.value)
        Input.Id = e.target.value
        Input.DealerId = loginSelector.DealerId
        Input.PolicyType = policyData.PolicyDetails.PolicyType
        axiosInstance
            .post(COMMON_API_URL.getVariantDetailsbyId, { ...Input })
            .then((response) => {
                if (response.status === 200) {
                    let variantDetails = response.data
                    let objVariantDetails = {
                        SeatingCapacity: variantDetails.SeatingCapacity,
                        GrossVehicleWeight: variantDetails.GrossVehicleWeight,
                        FuelType: variantDetails.FuelType,
                        CubicCapacity: variantDetails.CubicCapacity,
                        ExShowroomPrice: variantDetails.EXshowRoomPrice,
                        Kilowatt: variantDetails.Kilowatt,
                        MaxExShowroom: variantDetails.MaxExShowroom,
                        MinExShowroom: variantDetails.MinExShowroom,

                        OnRoadPrice: variantDetails.OnRoadPrice,
                        IsBifuel_Co_Fitted: variantDetails.IsBifuel_Co_Fitted,
                        VariantId: e.target.value,
                        IsAntiTheft:
                            variantDetails.ISANTITHEFT_CO_FITTED.toString(),
                        IsIMT23:
                            variantDetails.SeatingCapacity > 7 &&
                                controls.control._formValues['VehClass'] == 'C'
                                ? 'true'
                                : 'false'
                    }
                    setdisabledForVariant(true)
                    setVehicleData({ ...vehicleData, ...objVariantDetails })
                    setPolicyData({
                        ...policyData,
                        ['IsBifuel_Co_Fitted']:
                            objVariantDetails.IsBifuel_Co_Fitted
                    })
                    setAdditionalDiscounts({
                        ...additionalDiscounts,
                        ['IsIMT23']: objVariantDetails.IsIMT23
                    })
                    setAdditionalDiscounts({
                        ...additionalDiscounts,
                        ['IsAntiTheft']:
                            objVariantDetails.IsAntiTheft.toString()
                    })
                    isAntiTheftCoFitted.current =
                        objVariantDetails.IsAntiTheft.toString()
                    resets.reset({
                        ...controls.control._formValues,
                        ...objVariantDetails
                    })
                    if (
                        policyData.PolicyDetails.ProposalType == 'C' &&
                        policyData.PolicyDetails.VehClass == 'P'
                    ) {
                        setOptionalDetails({
                            ...optionalDetails,
                            ['OtherEmp']: objVariantDetails.SeatingCapacity
                        })
                        sendPolicyData.setDisableLLEmployee(true)
                    } else {
                        setDisableLLEmployee(false)
                        setOptionalDetails({
                            ...optionalDetails,
                            ['OtherEmp']: 0
                        })
                    }
                }
            })
    }
    //#endregion

    //#region Year of Manufacture Logic
    // const currentDate = new Date()
    // const startingYear =
    //     currentDate.getFullYear() - HARD_CODE_VALUE.MinPolicyYearCountNew
    let YOM = sendPolicyData.yom //[]
    // for (
    //     let index = currentDate.getFullYear();
    //     index >= startingYear;
    //     index--
    // ) {
    //     YOM.push({ year: index })
    // }
    //#endregion

    //#region Legal Liability - Employees other than paid driver

    const Seating_Capacity = vehicleData.SeatingCapacity
    let LLOT_PaidDriver = []
    if (Seating_Capacity > 0) {
        LLOT_PaidDriver.push(0)
        for (let LLCount = 1; LLCount <= Seating_Capacity; LLCount++) {
            LLOT_PaidDriver.push(LLCount)
        }
    } else {
        LLOT_PaidDriver = [0]
    }
    //#endregion

    //#region CPA Values / Corporate-Individual Change /
    const { cpa, proposer, cpaWaiverReasonList, unregister, register } =
        useContext(PolicyPageContext)
    const [cpaval, setval] = cpa

    let CPATenureList = [{ cpavalues: 0 }]

    //working for 1, 3

    if (CPATenureList.findIndex((x) => x.cpavalues == 1) < 0) {
        CPATenureList.push({ cpavalues: 1 })
    }
    if (CPATenureList.findIndex((x) => x.cpavalues == cpaval) < 0) {
        CPATenureList.push({ cpavalues: parseInt(cpaval) })
    }

    // for (let cpaData = 1; cpaData <= cpaval; cpaData++) {
    //     if (cpaData != 2) CPATenureList.push({ cpavalues: cpaData })
    // }
    // if (CPATenureList.length > 0)
    //     CPATenureList.splice(0, 0, { cpavalues: 0 })

    //#endregion


    const getSelectedDate = (Data: any, Name: any, nestedObject: any) => {
        const FormattedData = dayjs(Data)
        if (Name == 'InvoiceDate') {
            setVehicleData({ ...vehicleData, [Name]: FormattedData })
            sendPolicyData.setValue('RegistrationDate', '')
            setPolicyData({ ...policyData, ['RegistrationDate']: '' })
            //setPolicyData({ ...policyData, ['RegistrationDate']: '' })
            //sendPolicyData.setValue('RegistrationDate', '')
            sendPolicyData.setMinRegistration(FormattedData)
            sendPolicyData.setMaxRegistration(
                dayjs(FormattedData).add(3, 'months')
            )

            getEffectiveDateFn(FormattedData);

        } else if (Name == 'RegistrationDate') {
            setPolicyData({ ...policyData, [Name]: FormattedData })
            sendPolicyData.setValue(
                'IS_BH_REGIST_NO',
                dayjs(FormattedData).isValid() ? '3' : '0'
            )
            setVehicleData({
                ...vehicleData,
                IS_BH_REGIST_NO: dayjs(FormattedData).isValid() ? '3' : '0'
            })
            // setPolicyData({
            //     ...policyData,
            //     ['VehicleDetails']: {
            //         ...policyData.VehicleDetails,
            //         ['IS_BH_REGIST_NO']: dayjs(FormattedData).isValid()
            //             ? '3'
            //             : '0'
            //     }
            // })
        }
    }

    const getEffectiveDateFn = async (data: any) => {

        const effectiveDateModelObj1 = new EffectiveDateModel();
        effectiveDateModelObj1.ODExpiryDate = data.format('DD/MM/YYYY');
        effectiveDateModelObj1.TPExpiryDate = sendPolicyData.policyData.PolicyStartDate.format('DD/MM/YYYY');
        var result = await validateInvoiceDateRange(effectiveDateModelObj1);
        if (result == "False") {
            isOldVehicle = false;
            setLabelText("Ex-Showroom Price (STRICTLY as per Veh.)");
        }
        else {
            isOldVehicle = true;
            setLabelText("Insured Declared Value (IDV)");
        }
    }


    const getToggleButtonData = (data: any, name: any) => {
        if (name === 'IS_BH_REGIST_NO' && data != false) {
            if (vehicleData.InvoiceDate == '' && data == '1') {
                toast.error('Please select Invoice Date First.')
                sendPolicyData.setValue('IS_BH_REGIST_NO', 3)
                return
            } else if (data == '1') {
                
                    const invoiceYear = dayjs(vehicleData.InvoiceDate)
                        .year()
                        .toString()
                        .substr(-2)
                    setPolicyData({
                        ...policyData,
                        ['BHNumberSeries1']: invoiceYear + '-BH',
                        [name]: data
                    })
                    setVehicleData({
                        ...vehicleData,
                        ['BHNumberSeries1']: invoiceYear + '-BH',
                        [name]: data
                    })
                    sendPolicyData.setValue('BHNumberSeries1', invoiceYear + '-BH')
                    return
                
                
            } else {
                setPolicyData({
                    ...policyData,

                    [name]: data
                })
                setVehicleData({
                    ...vehicleData,

                    [name]: data
                })
            }
        } else if (name === 'IsTestDrive' && data != false) {
            setVehicleData({ ...vehicleData, [name]: data })
            if (data == 'false') {
                resets.reset({
                    ...controls.control._formValues,
                    ['IsNCBForward']: 'false',
                    ['NCBLevel']: 0,
                    ['IsAntiTheft']: 'false',
                    ['IsAA']: 'false',
                    ['IsHandicapped']: 'false',
                    ['IsVoluntaryForward']: 'false',
                    ['VoluntaryExcess']: 0,
                    ['IsIMT23']: 'true'
                })
                setAdditionalDiscounts({
                    ...additionalDiscounts,
                    [name]: data,
                    ['NCBLevel']: 0
                })
            } else {
                resets.reset({
                    ...controls.control._formValues,
                    ['IsNCBForward']: 'false',
                    ['NCBLevel']: 0
                })
                setAdditionalDiscounts({
                    ...additionalDiscounts,
                    ['IsNCBForward']: 'false',
                    ['NCBLevel']: 0
                })
            }
            setPolicyData({
                ...policyData,
                [name]: data,
                ['VoluntaryExcess']: 0,
                ['IsVoluntaryForward']: 'false'
            })
        } else if (name === 'IsNCBForward' && data != false) {
            if (data === 'false') {
                resets.reset({
                    ...controls.control._formValues,
                    ['NCBLevel']: 0
                })
                setAdditionalDiscounts({
                    ...additionalDiscounts,
                    [name]: data,
                    ['NCBLevel']: 0
                })
            } else {
                setAdditionalDiscounts({
                    ...additionalDiscounts,
                    ['IsNCBForward']: data
                })
            }
        } else if (
            (name === 'IsAntiTheft' ||
                name === 'IsAA' ||
                name === 'IsHandicapped' ||
                name === 'IsIMT23') &&
            data != false
        ) {
            setAdditionalDiscounts({ ...additionalDiscounts, [name]: data })
        } else if (name === 'IsVoluntaryForward' && data != false) {
            if (data == 'false') {
                resets.reset({
                    ...controls.control._formValues,
                    ['VoluntaryExcess']: 0
                })
                setAdditionalDiscounts({
                    ...additionalDiscounts,

                    ['VoluntaryExcess']: 0
                })
                setPolicyData({
                    ...policyData,
                    [name]: data
                })
            } else {
                setPolicyData({
                    ...policyData,
                    [name]: data
                })
            }
            // } else if (name == 'IsUnnamedPassenger' && data != false) {
            //     if (data === 'false') {
            //         resets.reset({
            //             ...controls.control._formValues,
            //             ['CoverAmount']: 0
            //         })
            //         setOptionalDetails({
            //             ...optionalDetails,
            //             [name]: data,
            //             ['CoverAmount']: 0
            //         })
            //     } else {
            //         setOptionalDetails({ ...optionalDetails, [name]: data })
            //     }
        } else if (name == 'IsUnnamedPassenger' && data != false) {
            if (data === 'false') {
                const otherOptionsStillSelected =
                    optionalDetails.IsPaidDriver === 'true' ||
                    optionalDetails.IsPACleaner === 'true' ||
                    optionalDetails.IsPAConductor === 'true' ||
                    optionalDetails.IsPAHelper === 'true';

                if (!otherOptionsStillSelected) {
                    resets.reset({
                        ...controls.control._formValues,
                        ['CoverAmount']: 0
                    });

                    setOptionalDetails({
                        ...optionalDetails,
                        [name]: data,
                        ['CoverAmount']: 0
                    });
                } else {
                    setOptionalDetails({
                        ...optionalDetails,
                        [name]: data
                    });
                }
            } else {
                setOptionalDetails({ ...optionalDetails, [name]: data });
            }

            // } else if (
            //     (name == 'IsPaidDriver' || name == 'LLPaidDriver') &&
            //     data != false
            // ) {
            //     setOptionalDetails({ ...optionalDetails, [name]: data })
            // } 

        } else if ((name == 'IsPaidDriver' || name == 'LLPaidDriver') && data != false) {
            if (data === 'false') {
                const otherOptionsStillSelected =
                    optionalDetails.IsUnnamedPassenger === 'true' ||
                    optionalDetails.IsPACleaner === 'true' ||
                    optionalDetails.IsPAConductor === 'true' ||
                    optionalDetails.IsPAHelper === 'true';

                if (!otherOptionsStillSelected) {
                    resets.reset({
                        ...controls.control._formValues,
                        ['CoverAmount']: 0
                    });

                    setOptionalDetails({
                        ...optionalDetails,
                        [name]: data,
                        ['CoverAmount']: 0
                    });
                } else {
                    setOptionalDetails({
                        ...optionalDetails,
                        [name]: data
                    });
                }
            } else {
                setOptionalDetails({ ...optionalDetails, [name]: data });
            }
        }

        else if (
            (name == 'ZeroDep' ||
                name == 'ReturnToInvoice' ||
                name == 'EngineProtect') &&
            data != false
        ) {
            setLastYearAddons({ ...lastYearAddons, [name]: data })
        } else if (name === 'IsCPACover' && data != false) {
            if (data === 'false') {
                resets.reset({
                    ...controls.control._formValues,
                    ['CPATenure']: 0
                })
                setOptionalDetails({
                    ...optionalDetails,
                    [name]: data,
                    ['CPATenure']: 0
                })
            } else {
                setOptionalDetails({ ...optionalDetails, [name]: data })
            }
        } else {
            setOptionalDetails({
                ...optionalDetails,
                [name]: data
            })
        }
    }

    const [expanded, setExpanded] = useState(true)
    const toggleAccordion = () => {
        setExpanded(!expanded)
    }
    const OpenRTOMap = () => {
        sendPolicyData.handleClickShowRTOMapping()
    }

    //#region Validate Registration Number
    const validateSpclRegistrationNoFN = async () => {
        let objData = { SpecialRegistartionNo: '', UserId: 0 }
        objData.SpecialRegistartionNo = policyData.SpecialRegistartionNo
        objData.UserId = loginSelector.UserId
        const result = await validateSpclRegistrationNo(objData)
        if (result.status == 200) {
            if (result.data.Count == 0) {
                resets.reset({
                    ...controls.control._formValues,
                    ['SpecialRegistartionNo']: ''
                })
                toast.error('This registration number is not allowed')
            }
        }
    }
    const [stateCode, setStateCode] = useState([null])

    const checkRTOFN = async () => {
        const selectedOption = policyData.IS_BH_REGIST_NO
        if (selectedOption !== '1') {
            let stateCodeResp = await getStateCode(vehicleData.RTOId)
            if (stateCodeResp.status == 200) {
                if (stateCodeResp.data != '' && stateCodeResp.data != null) {
                    setStateCode([stateCodeResp.data])
                    const rtoName = vehicleData.RTO_NAME
                    if (rtoName !== '') {
                        if (rtoName?.includes('-')) {
                            const rtoSData = rtoName.split('-')
                            if (rtoSData.length > 2) {
                                toast.error('Please Enter Correct RTO Code.')
                                resets.reset({
                                    ...controls.control._formValues,
                                    ['RTO_NAME']: ''
                                })
                                setVehicleData({
                                    ...vehicleData,
                                    ['RTO_NAME']: ''
                                })
                                return false
                            } else {
                                if (
                                    rtoSData[0].length != 2 ||
                                    isAlphaOrParen(rtoSData[0]) != true ||
                                    rtoSData[1].length > 2 ||
                                    isAlphaOrParen(isNumeric[1]) != true
                                ) {
                                    toast.error(
                                        'Please Enter Correct RTO Code.'
                                    )
                                    resets.reset({
                                        ...controls.control._formValues,
                                        ['RTO_NAME']: ''
                                    })
                                    setVehicleData({
                                        ...vehicleData,
                                        ['RTO_NAME']: ''
                                    })
                                    return false
                                } else {
                                    if (
                                        !stateCodeResp.data.includes(
                                            rtoSData[0].toUpperCase()
                                        )
                                    ) {
                                        toast.error(
                                            'Please Enter Correct RTO Code.'
                                        )
                                        resets.reset({
                                            ...controls.control._formValues,
                                            ['RTO_NAME']: ''
                                        })
                                        setVehicleData({
                                            ...vehicleData,
                                            ['RTO_NAME']: ''
                                        })
                                        return false
                                    } else {
                                        let stateCodeResp =
                                            await checkRtoCodeEnabled(
                                                vehicleData.RTO_NAME
                                            )
                                        if (stateCodeResp == '0') {
                                            toast.error(
                                                'Please Enter Correct RTO Code.'
                                            )
                                            resets.reset({
                                                ...controls.control._formValues,
                                                ['RTO_NAME']: ''
                                            })
                                            setVehicleData({
                                                ...vehicleData,
                                                ['RTO_NAME']: ''
                                            })
                                            return false
                                        }
                                    }
                                }
                                if (rtoSData[1].length === 1) {
                                    document.querySelector(
                                        '#ddlregistration'
                                    ).value = rtoSData[0] + '-0' + rtoSData[1]
                                }
                            }
                        } else {
                            toast.error('Please Enter Correct RTO Code.')
                            resets.reset({
                                ...controls.control._formValues,
                                ['RTO_NAME']: ''
                            })
                            setVehicleData({ ...vehicleData, ['RTO_NAME']: '' })
                            return false
                        }
                    }
                } else {
                    toast.error('Please Select Registration City First')
                    resets.reset({
                        ...controls.control._formValues,
                        ['RTO_NAME']: ''
                    })
                    setVehicleData({ ...vehicleData, ['RTO_NAME']: '' })
                    return false
                }
            }
        } else {
            if (
                vehicleData.InvoiceDate != '' ||
                vehicleData.InvoiceDate != null
            ) {
                let YY = vehicleData.InvoiceDate.format('DD/MM/YYYY').substr(-2)
                const rtoName = policyData.BHNumberSeries1
                if (rtoName !== '') {
                    if (rtoName.includes('-')) {
                        const rtoSData = rtoName.split('-')
                        if (rtoSData.length > 2) {
                            toast.error('Please Enter Correct RTO Code.')
                            resets.reset({
                                ...controls.control._formValues,
                                ['BHNumberSeries1']: ''
                            })
                            setPolicyData({
                                ...policyData,
                                ['BHNumberSeries1']: ''
                            })
                            return false
                        } else {
                            if (
                                rtoSData[0].length !== 2 ||
                                isNumeric(rtoSData[0]) != true ||
                                rtoSData[1].length !== 2 ||
                                isAlphaOrParen(isNumeric[1]) != true ||
                                rtoSData[1].toUpperCase() !== 'BH' ||
                                YY !== rtoSData[0]
                            ) {
                                toast.error(
                                    'Please Enter Last 2 Digit of Invoice Year and BH(Format: YY-BH).'
                                )
                                resets.reset({
                                    ...controls.control._formValues,
                                    ['BHNumberSeries1']: ''
                                })
                                setPolicyData({
                                    ...policyData,
                                    ['BHNumberSeries1']: ''
                                })
                                return false
                            }
                        }
                    } else {
                        toast.error('Please Enter Correct RTO Code.')
                        resets.reset({
                            ...controls.control._formValues,
                            ['BHNumberSeries1']: ''
                        })
                        setPolicyData({
                            ...policyData,
                            ['BHNumberSeries1']: ''
                        })
                        return false
                    }
                }
            }
        }
    }
    const isAlphaOrParen = (param: any) => {
        return /^[a-zA-Z]+$/.test(param)
    }
    const isNumeric = (param: any) => {
        return /^[0-9]+$/.test(param)
    }
    //#endregion

    //#region Duplicate Chassis number validation
    const checkDuplicacyOnChassisFN = async (event: any) => {
        debugger
        const { name } = event.target

        const ddlCoverTypeValue = policyData.PolicyDetails.CoverTypeId
        const policyTypeValue = policyData.PolicyDetails.PolicyType
        const previousPolicyTypeValue = policyData.Renew.RENEWAL_TYPE
        const ddlCoverTypeRenewValue = policyData.Renew.PREV_COVERTYPE_ID
        const policyExpiryDateValue = policyData.Renew.POLICY_EXPIRY_DATE
        const tpPolicyExpiryDateValue = policyData.Renew.TP_POLICY_EXPIRY_DATE

        let objData = {
            VehicleDetails: {},
            ProposerDetails: {}
        }
        if (
            policyData.PolicyDetails.CoverTypeId != '' &&
            policyData.PolicyDetails.CoverTypeId != null &&
            policyData.PolicyDetails.CoverTypeId != undefined
        ) {
            if (name === 'ChassisNo') {
                isVerify_ChassisNo({ ChassisNo: vehicleData.ChassisNo });
            } else if (name === 'EngineNo') {
                isVerify_ChassisNo({ EngineNo: vehicleData.EngineNo });
            }
        } else {
            setVehicleData({ ...setVehicleData, ['ChassisNo']: '' })
            resets.reset({ ...controls.control._formValues, ['ChassisNo']: '' })
            resets.reset({
                ...controls.control._formValues,
                ['ChassisStatus']: '0'
            })
            toast.error('Please select cover type first')
        }

        // if (
        //     name == 'ChassisNo' &&
        //     (vehicleData.ChassisNo == null || vehicleData.ChassisNo == '')
        // )
        //     return false
        // else if (
        //     name == 'EngineNo' &&
        //     (vehicleData.EngineNo == null || vehicleData.EngineNo == '')
        // )
        //     return false


        if (
            ddlCoverTypeValue === '' && policyTypeValue === 'N'
        ) {
            return false
        }
        objData.ProposerDetails.MOB_NO = ''
        if (name == 'ChassisNo')
            objData.VehicleDetails.CHASSIS_NO = vehicleData.ChassisNo
        else if (name == 'EngineNo')
            objData.VehicleDetails.ENGINE_NO = vehicleData.EngineNo

        objData.VehicleDetails.POLICY_TYPE = policyTypeValue
        objData.VehicleDetails.COVER_TYPE_ID = ddlCoverTypeValue
        objData.VehicleDetails.VEH_REGIST_NO = ''
        objData.VehicleDetails.Count =
            name == 'ChassisNo' ? 1 : name == 'EngineNo' ? 2 : 3

        const effectiveDateModelObj = new EffectiveDateModel()
        effectiveDateModelObj.CoverTypeId = policyData.PolicyDetails.CoverTypeId

        if (policyTypeValue == 'R') {
            
            objData.VehicleDetails.COVER_TYPE_ID = policyData.PolicyDetails.CoverTypeId
            effectiveDateModelObj.RenewalType = ''
            if(policyData.Renew.RENEWAL_TYPE == '2'){
              
                effectiveDateModelObj.ODExpiryDate = dayjs().format('MM/DD/YYYY')
                effectiveDateModelObj.TPExpiryDate = dayjs().format('MM/DD/YYYY')
            }
            else{
                
                effectiveDateModelObj.ODExpiryDate = policyExpiryDateValue.format('MM/DD/YYYY')
                effectiveDateModelObj.TPExpiryDate = tpPolicyExpiryDateValue.format('MM/DD/YYYY')
            }

        }
        effectiveDateModelObj.PolicyType = policyTypeValue
        const effectiveResult = await getEffectiveDate(effectiveDateModelObj)
        if (effectiveResult.status == 200) {
            objData.VehicleDetails.POLICY_EFFECTIVE_DATE = effectiveResult.data
            if(policyData.Renew.RENEWAL_TYPE == '2')
                objData.VehicleDetails.POLICY_EFFECTIVE_DATE = dayjs().format('MM/DD/YYYY')

            //objData.VehicleDetails.POLICY_EXPIRY_DATE = effectiveResult.data
            checkDuplicateChassisFN(objData)
        }
    }
    const checkDuplicateChassisFN = async (data: any) => {
        const IsDuplicatChassis = await checkDuplicateChassis(data)
        if (IsDuplicatChassis.status == 200) {
            if (IsDuplicatChassis.data.ErrorCode == 0) {
                const validateProposalModelOobj = new ValidateProposalModel()
                //validateProposalModelOobj.POLICY_EFFECTIVE_DATE = data.VehicleDetails.POLICY_EFFECTIVE_DATE
                validateProposalModelOobj.ChassisNo = vehicleData.ChassisNo
                validateProposalModelOobj.UserId = loginSelector.UserId
                checkChassisPaymentFN(validateProposalModelOobj)
            } else {
                if (data.VehicleDetails.Count == 1) {
                    setVehicleData({ ...vehicleData, ['ChassisNo']: '' })
                    resets.reset({
                        ...controls.control._formValues,
                        ['ChassisNo']: ''
                    })
                } else if (data.VehicleDetails.Count == 2) {
                    setVehicleData({ ...vehicleData, ['EngineNo']: '' })
                    resets.reset({
                        ...controls.control._formValues,
                        ['EngineNo']: ''
                    })
                }

                let type =
                    data.VehicleDetails.Count == 1
                        ? 'Chassis No.'
                        : data.VehicleDetails.Count == 2
                            ? 'Engine No.'
                            : ''
                toast.error(`Policy found against this ${type}`)
            }
        }
    }

    const checkChassisPaymentFN = async (paymentData: any) => {
        const IsPaymentPending = await checkChassisPayment(paymentData)
        if (IsPaymentPending.status == 200) {
            if (IsPaymentPending.data.ErrorCode == 1) {
                return true
            } else {
                toast.error(IsPaymentPending.data.ErrorMessage)
            }
        }
    }
    
    const isPrintable = (value: string) =>
       typeof value === 'string' && /^[\x20-\x7E]+$/.test(value)
 
   
    const isValidAlphanumeric = (value: string) => isPrintable(value)
    const isValidEngineNo = (value: string) => isPrintable(value)

    // const isValidAlphanumeric = (value: string) =>
    //     /^[a-zA-Z0-9]+$/.test(value) && /[a-zA-Z]/.test(value) && /[0-9]/.test(value);


    // const isValidEngineNo = (value: string) =>
    //  /^[A-Za-z0-9.-]+$/.test(value) && /[A-Za-z]/.test(value) && /[0-9]/.test(value);

    // const isValidEngineNo = (value: string) =>
    //     /^[A-Za-z0-9-]+$/.test(value);

    const isVerify_ChassisNo = async (data: any) => {
        const IsSpecialCH = await validateEngineChassisNo(data);

        // Chassis No. validation
        if (data.ChassisNo !== undefined) {
            if (IsSpecialCH.status == 200) {
                if (IsSpecialCH.data.ChassisStatus == 1) {
                    resets.reset({
                        ...controls.control._formValues,
                        ['ChassisStatus']: '1'
                    });
                } else if (IsSpecialCH.data.ChassisStatus == 0) {
                    const chassisNo = data.ChassisNo || '';
                    if (chassisNo !== '') {
                        if (chassisNo.length < 16) {
                            toast.error('Chassis No. can not be less than 16 digits');
                            setVehicleData({ ...vehicleData, ['ChassisNo']: '' });
                            resets.reset({
                                ...controls.control._formValues,
                                ['ChassisNo']: ''
                            });
                            resets.reset({
                                ...controls.control._formValues,
                                ['ChassisStatus']: '0'
                            });
                            return;
                        }

                        if (!isValidAlphanumeric(chassisNo)) {
                            toast.error('VIN (Chassis No) should be alphabet and numeric characters.');
                            setVehicleData({ ...vehicleData, ['ChassisNo']: '' });
                            resets.reset({
                                ...controls.control._formValues,
                                ['ChassisNo']: ''
                            });
                            resets.reset({
                                ...controls.control._formValues,
                                ['ChassisStatus']: '0'
                            });
                            return;
                        }


                        resets.reset({
                            ...controls.control._formValues,
                            ['ChassisStatus']: '0'
                        });
                    }

                }
            }
        }

        // Engine No. validation
        if (data.EngineNo !== undefined) {
            if (IsSpecialCH.status == 200) {
                if (IsSpecialCH.data.EngineStatus == 1) {
                    resets.reset({
                        ...controls.control._formValues,
                        ['EngineStatus']: '1'
                    });
                } else if (IsSpecialCH.data.EngineStatus == 0) {
                    const EngineNo = data.EngineNo || '';

                    if (EngineNo !== '') {
                        if (EngineNo.length < 7) {
                            toast.error('Engine No. can not be less than 7 digits');
                            setVehicleData({ ...vehicleData, ['EngineNo']: '' });
                            resets.reset({
                                ...controls.control._formValues,
                                ['EngineNo']: ''
                            });
                            return;
                        }

                        if (!isValidEngineNo(EngineNo)) {
                            toast.error('Engine No. should be alphabet and numeric characters.');
                            setVehicleData({ ...vehicleData, ['EngineNo']: '' });
                            resets.reset({
                                ...controls.control._formValues,
                                ['EngineNo']: ''
                            });
                            return;
                        }


                        resets.reset({
                            ...controls.control._formValues,
                            ['EngineStatus']: '0'
                        });
                    }

                }
            }
        }
    }

    // const isVerify_EngineNo = async () => {
    //     const engineNo = vehicleData.EngineNo || '';
    //     if (engineNo && engineNo.trim() !== '') {
    //         let objData: any = {};
    //         objData.EngineNo = engineNo;
    //         objData.UserId = loginSelector.UserId;
    //         const IsSpecialEN = await validateEngineChassisNo(objData);
    //         if (IsSpecialEN.status == 200) {
    //             if (IsSpecialEN.data.EngineStatus == 1) {

    //                 resets.reset({
    //                     ...controls.control._formValues,
    //                     ['EngineStatus']: '1'
    //                 });
    //             } else if (IsSpecialEN.data.EngineStatus == 0) {

    //                 if (engineNo.length < 12) {
    //                     toast.error('Engine No. can not be less than 12 digits');
    //                 } else if (/[^a-zA-Z0-9]/.test(engineNo)) {
    //                     toast.error('Engine No. should be alphabet and numeric characters.');
    //                 }
    //                 setVehicleData({ ...vehicleData, ['EngineNo']: '' });
    //                 resets.reset({
    //                     ...controls.control._formValues,
    //                     ['EngineNo']: ''
    //                 });
    //                 resets.reset({
    //                     ...controls.control._formValues,
    //                     ['EngineStatus']: '0'
    //                 });
    //             }
    //         }
    //     }
    // }








    //#endregion

    //#region DMS API Call Method
    const objConfigValues: FetchCustomerConfigValues = {
        ChassisNumber: 'QWERTYUIOPAS12345',
        DealerCode: loginSelector.DealerId
    }
    // const FatchDMSCustomerDetials = () => {
    //     axiosInstance
    //         .post(COMMON_API_URL.getDMSCustomerDetials, { ...objConfigValues })
    //         .then((response) => {
    //             if (response.status == 200) {
    //                 console.log(response.data)
    //             }
    //         })
    // }
    const FatchDMSCustomerDetials = () => {
        const chassisNO = controls.control._formValues['ChassisNo']
        const engineNo = controls.control._formValues['EngineNo']

        if (chassisNO === engineNo) {
            toast.error('Chassis number and Engine number cannot be the same.')
            resets.reset({
                ...controls.control._formValues,
                ['EngineNo']: '',
                ['ChassisNo']: ''
            })
            return
        } else {
            axiosInstance
                .post(COMMON_API_URL.getDMSCustomerDetials, {
                    ...objConfigValues
                })
                .then((response) => {
                    if (response.status == 200) {
                        console.log(response.data)
                    }
                })
        }
    }

    //#endregion
    const checkExshowroomPrice = () => {
        if (
            parseInt(vehicleData.ExShowroomPrice) < vehicleData.MinExShowroom ||
            parseInt(vehicleData.ExShowroomPrice) > vehicleData.MaxExShowroom
        ) {
            toast.error(
                'Please enter value between ' +
                vehicleData.MinExShowroom +
                ' and ' +
                vehicleData.MaxExShowroom
            )
            return false
        }
    }
// ...existing code...
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
    return (
        <>
            {/* Vehicle Details Working Section */}
            <Accordion
                defaultExpanded
                sx={{
                    backgroundColor: 'transparent',
                    border: '0px',
                    boxShadow: '0px 0px 0px'
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
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
                        <rect width="30" height="30" rx="15" fill="white" />
                        <path
                            d="M8.6999 17.3998H11.0999C11.5499 17.3998 11.9624 17.0248 11.9624 16.5373C11.9624 16.0498 11.5874 15.6748 11.0999 15.6748H8.6999C8.2499 15.6748 7.8374 16.0498 7.8374 16.5373C7.8374 17.0248 8.2124 17.3998 8.6999 17.3998Z"
                            fill="#8080DA"
                        />
                        <path
                            d="M18.5999 17.3998H20.9999C21.4499 17.3998 21.8624 17.0248 21.8624 16.5373C21.8624 16.0498 21.4874 15.6748 20.9999 15.6748H18.5999C18.1499 15.6748 17.7374 16.0498 17.7374 16.5373C17.7374 17.0248 18.1124 17.3998 18.5999 17.3998Z"
                            fill="#8080DA"
                        />
                        <path
                            d="M25.4999 11.0248H24.4124L22.65 6.5248C22.3874 5.8498 21.7125 5.3623 20.9625 5.3623H8.88745C8.13745 5.3623 7.49995 5.8123 7.19995 6.4873L5.43745 10.9873H4.49995C4.04995 10.9873 3.63745 11.3623 3.63745 11.8498C3.63745 12.3373 4.01245 12.7123 4.49995 12.7123H4.79995V12.7498C4.79995 12.7873 4.79995 12.7873 4.79995 12.8248V18.9373C4.79995 19.9123 5.54995 20.7373 6.48745 20.8873V22.3498C6.48745 23.6248 7.53745 24.7123 8.84995 24.7123H9.59995C10.875 24.7123 11.9625 23.6623 11.9625 22.3498V20.9248H17.775V22.3498C17.775 23.6248 18.8249 24.7123 20.1374 24.7123H20.8874C22.1624 24.7123 23.2499 23.6623 23.2499 22.3498V20.9248C24.2999 20.8873 25.1249 20.0248 25.1249 18.9748V12.7873C25.1249 12.7498 25.1249 12.7123 25.1249 12.6748H25.4999C25.9499 12.6748 26.3624 12.2998 26.3624 11.8123C26.3624 11.3248 25.9499 11.0248 25.4999 11.0248ZM8.77495 7.1248C8.77495 7.0873 8.81245 7.0498 8.88745 7.0498H20.9625C21 7.0498 21.0374 7.0873 21.0749 7.0873V7.1248L22.9874 11.9248H6.86245L8.77495 7.1248ZM10.2375 22.2748C10.2375 22.6498 9.93745 22.9498 9.56245 22.9498H8.81245C8.43745 22.9498 8.13745 22.6498 8.13745 22.2748V20.8498H10.2V22.2748H10.2375ZM21.525 22.2748C21.525 22.6498 21.2249 22.9498 20.8499 22.9498H20.0999C19.7249 22.9498 19.4249 22.6498 19.4249 22.2748V20.8498H21.4874V22.2748H21.525ZM23.4 18.8998C23.4 19.0498 23.2874 19.1998 23.0999 19.1998H6.74995C6.59995 19.1998 6.44995 19.0873 6.44995 18.8998V13.6498H23.3624V18.8998H23.4Z"
                            fill="black"
                        />
                        <path d="M8.5 11L10 8H20L21 11H8.5Z" fill="#8080DA" />
                    </svg>
                    <span className="AccordianItem ml-3 text-lg">
                        Vehicle Details
                    </span>
                </AccordionSummary>

                <AccordionDetails>
                    <Box sx={{ flexGrow: '1' }}>
                        <Grid
                            container
                            rowSpacing={6}
                            columnSpacing={8}
                            sx={{ mt: 2 }}
                        >
                            <Grid xs={12} md={4}>
                                <FormInputText
                                    control={controls.control}
                                    name="ChassisNo"
                                    onBlur={checkDuplicacyOnChassisFN}
                                    onChangeFn={handleInputChange}
                                    label="VIN (Chassis No)"
                                    placeholder="Chassis No."
                                    inputProps={{
                                        style: { textTransform: 'uppercase' },
                                        maxLength: 25
                                    }}
                                    autoComplete="nope"
                                    disabled={disabledTMIInput}
                                    className="requiredField"
                                />
                            </Grid>
                            <Grid xs={12} md={4}>
                                <FormInputText
                                    control={controls.control}
                                    name="EngineNo"
                                    onBlur={checkDuplicacyOnChassisFN}
                                    onChangeFn={handleInputChange}
                                    label="Engine No"
                                    placeholder="Enter Engine No."
                                    inputProps={{
                                        style: { textTransform: 'uppercase' },
                                        maxLength: 25
                                    }}
                                    autoComplete="nope"
                                    disabled={disabledTMIInput}
                                    className="requiredField"
                                />
                            </Grid>
                            <Grid xs={12} md={4}>
                                {policyData.Renew.RENEWAL_TYPE == '1' ? (
                                    <></>
                                ) : (
                                    <Button
                                        variant="contained"
                                        onClick={FatchDMSCustomerDetials}
                                    >
                                        Fetch
                                    </Button>
                                )}
                            </Grid>
                            {policyData.FKOEM_ID == 2 &&
                                vehicleData.VehicleType != 'PCV' && (
                                    <>
                                        <Grid xs={12} md={4}>
                                            <FormControl fullWidth>
                                                <FormInputSelect
                                                    control={controls.control}
                                                    name="FKVehicleSubType_ID"
                                                    onChangeFn={
                                                        sendPolicyData.handleVehicleTypeChange
                                                    }
                                                    label="Vehicle Sub Type"
                                                    LIST={
                                                        sendPolicyData.vehicleSubTypeList
                                                    }
                                                    TEXT="SUBTYPE_VALUE"
                                                    VALUE="VEHICLESUBTYPE_ID"
                                                    inputProps={{
                                                        readOnly:
                                                            sendPolicyData.disabledTMIInput
                                                    }}
                                                    disabled={disabledTMIInput}
                                                    className="requiredField"
                                                />
                                            </FormControl>
                                        </Grid>
                                        {policyData.FKOEM_ID == 2 &&
                                            vehicleData.VehicleType ==
                                            'MISC-D' && (
                                                <Grid xs={12} md={4}>
                                                    <FormControl fullWidth>
                                                        <FormInputSelect
                                                            control={
                                                                controls.control
                                                            }
                                                            name="FKMiscType_ID"
                                                            onChangeFn={
                                                                sendPolicyData.handleVehicleTypeChange
                                                            }
                                                            label="Misc Type"
                                                            LIST={
                                                                sendPolicyData.miscTypeList
                                                            }
                                                            TEXT="MISVEHICLENAME"
                                                            VALUE="MISVEHICLETYPEID"
                                                            inputProps={{
                                                                readOnly:
                                                                    sendPolicyData.disabledTMIInput
                                                            }}
                                                            disabled={
                                                                disabledTMIInput
                                                            }
                                                            className="requiredField"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            )}
                                    </>
                                )}
                            {policyData.FKOEM_ID == 2 && (
                                <Grid xs={12} md={4}>
                                    <FormControl fullWidth>
                                        <FormInputSelect
                                            control={controls.control}
                                            name="FKBuiltType_ID"
                                            onChangeFn={
                                                sendPolicyData.handleVehicleTypeChange
                                            }
                                            label="Built Type"
                                            LIST={sendPolicyData.builtTypeList}
                                            TEXT="BUILTTYPE_NAME"
                                            VALUE="BUILTTYPE_ID"
                                            inputProps={{
                                                readOnly:
                                                    sendPolicyData.disabledTMIInput
                                            }}
                                            disabled={disabledTMIInput}
                                            className="requiredField"
                                        />
                                    </FormControl>
                                </Grid>
                            )}
                            {policyData.FKOEM_ID == 4 && (
                                <>
                                    <Grid xs={12} md={4}>
                                        <FormInputText
                                            control={controls.control}
                                            name="Battery_Number1"
                                            // onBlur={checkDuplicacyOnChassisFN}
                                            onChangeFn={handleInputChange}
                                            label="Battery Identification Number 1"
                                            placeholder=""
                                            inputProps={{
                                                style: {
                                                    textTransform: 'uppercase'
                                                },
                                                maxLength: 17
                                            }}
                                            autoComplete="nope"
                                            disabled={disabledTMIInput}
                                            className="requiredField"
                                        />
                                    </Grid>
                                    <Grid xs={12} md={4}>
                                        <FormInputText
                                            control={controls.control}
                                            name="Battery_Number2"
                                            // onBlur={checkDuplicacyOnChassisFN}
                                            onChangeFn={handleInputChange}
                                            label="Battery Identification Number 2"
                                            placeholder=""
                                            inputProps={{
                                                style: {
                                                    textTransform: 'uppercase'
                                                },
                                                maxLength: 17
                                            }}
                                            autoComplete="nope"
                                            disabled={disabledTMIInput}
                                            className="requiredField"
                                        />
                                    </Grid>
                                    <Grid xs={12} md={4}>
                                        <FormInputText
                                            control={controls.control}
                                            name="Charger_PortNumber"
                                            // onBlur={checkDuplicacyOnChassisFN}
                                            onChangeFn={handleInputChange}
                                            label="Charger & Port Identification Number"
                                            placeholder=""
                                            inputProps={{
                                                style: {
                                                    textTransform: 'uppercase'
                                                },
                                                maxLength: 17
                                            }}
                                            autoComplete="nope"
                                            disabled={disabledTMIInput}
                                            className="requiredField"
                                        />
                                    </Grid>
                                </>
                            )}
                            {policyData.FKOEM_ID == 2 &&
                                vehicleData.VehicleType != 'PCV' &&
                                common
                                    .get_CheckEmptyString(
                                        vehicleData.VehicleSubType
                                    )
                                    .toUpperCase() == 'TRAILER' && (
                                    <>
                                        <Grid
                                            xs={12}
                                            md={4}
                                            className="requiredField"
                                        >
                                            <FormInputSelect
                                                control={controls.control}
                                                name="TrailerNo"
                                                onChangeFn={handleInputChange}
                                                label="Trailer No"
                                                LIST={[0, 1]}
                                                TEXT=""
                                                VALUE=""
                                                inputProps={{
                                                    readOnly:
                                                        sendPolicyData.disabledTMIInput
                                                }}
                                                disabled={disabledTMIInput}
                                                className="requiredField"
                                            />
                                        </Grid>
                                        {vehicleData.TrailerNo > 0 && (
                                            <>
                                                <Grid
                                                    xs={12}
                                                    md={4}
                                                    className="requiredField"
                                                >
                                                    <FormInputNumber
                                                        control={
                                                            controls.control
                                                        }
                                                        name="TrailerPrice"
                                                        onChangeFn={
                                                            handleInputChange
                                                        }
                                                        label="Trailer Price"
                                                        placeholder="100000"
                                                        // onBlur={
                                                        //     checkExshowroomPrice
                                                        // }
                                                        inputProps={{
                                                            style: {
                                                                textTransform:
                                                                    'uppercase'
                                                            },
                                                            maxLength: 7
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid xs={12} md={4}>
                                                    <FormInputText
                                                        control={
                                                            controls.control
                                                        }
                                                        name="TrailerChassisNo"
                                                        // onBlur={checkDuplicacyOnChassisFN}
                                                        onChangeFn={
                                                            handleInputChange
                                                        }
                                                        label="Trailer (Chassis No)"
                                                        placeholder="Trailer Chassis No."
                                                        inputProps={{
                                                            style: {
                                                                textTransform:
                                                                    'uppercase'
                                                            },
                                                            maxLength: 25
                                                        }}
                                                        autoComplete="nope"
                                                        disabled={
                                                            disabledTMIInput
                                                        }
                                                        className="requiredField"
                                                    />
                                                </Grid>
                                            </>
                                        )}
                                    </>
                                )}
                            <Grid xs={12} md={4}>
                                <FormControl fullWidth>
                                    <FormInputSelect
                                        control={controls.control}
                                        name="MakeId"
                                        onChangeFn={handleMakeChange}
                                        label="Make"
                                        LIST={make}
                                        TEXT="MakeName"
                                        VALUE="MakeId"
                                        defaultValue={
                                            selectedMakeId ? selectedMakeId : ''
                                        }
                                        inputProps={{
                                            readOnly:
                                                sendPolicyData.disabledTMIInput
                                        }}
                                        disabled={disabledTMIInput}
                                        className="requiredField"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={4}>
                                <FormControl fullWidth>
                                    <FormInputSelect
                                        control={controls.control}
                                        name="ModelId"
                                        onChangeFn={handleModelChange}
                                        label="Model"
                                        LIST={model}
                                        TEXT="ModelCode"
                                        VALUE="ModelId"
                                        defaultValue={
                                            selectedModelId
                                                ? selectedModelId
                                                : ''
                                        }
                                        inputProps={{
                                            readOnly:
                                                sendPolicyData.disabledTMIInput
                                        }}
                                        disabled={disabledTMIInput}
                                        className="requiredField"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={4}>
                                <FormControl fullWidth>
                                    <FormInputSelect
                                        control={controls.control}
                                        name="VariantId"
                                        onChangeFn={handleVaraintChange}
                                        label="Variant"
                                        LIST={variant}
                                        TEXT="VariantName"
                                        VALUE="VariantId"
                                        defaultValue={
                                            selectedVariantId
                                                ? selectedVariantId
                                                : ''
                                        }
                                        disabled={disabledTMIInput}
                                        className="requiredField"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={4}>
                                <FormInputText
                                    control={controls.control}
                                    name="FuelType"
                                    onChangeFn={handleInputChange}
                                    label="Fuel Type"
                                    placeholder="Enter Fuel Type."
                                    inputProps={{
                                        style: { textTransform: 'uppercase' }
                                    }}
                                    disabled={disabledForVariant}
                                />
                            </Grid>
                            <Grid xs={12} md={4}>
                                <FormInputText
                                    control={controls.control}
                                    name="SeatingCapacity"
                                    onChangeFn={handleInputChange}
                                    label="Seating Capacity"
                                    placeholder="Enter Seating Capacity."
                                    inputProps={{
                                        style: { textTransform: 'uppercase' }
                                    }}
                                    disabled={disabledForVariant}
                                />
                            </Grid>
                            {policyData.PolicyDetails.VehClass == 'C' && vehicleData.VehicleType == 'GCV' && (
                                <Grid xs={12} md={4}>
                                    <FormInputNumber
                                        control={controls.control}
                                        name="GrossVehicleWeight"
                                        //onChangeFn={handleInputChange}
                                        label="Gross Vehicle Weight"
                                        placeholder="10000"
                                        disabled={disabledForVariant}
                                    //onBlur={checkExshowroomPrice}
                                    />
                                </Grid>
                            )}
                            {vehicleData.FuelType == 'ELECTRIC' && (
                                <Grid xs={12} md={4}>
                                    <FormInputText
                                        control={controls.control}
                                        name="Kilowatt"
                                        onChangeFn={handleInputChange}
                                        label="Kilo Watt"
                                        placeholder="1100"
                                        disabled={disabledForVariant}
                                    />
                                </Grid>
                            )}{' '}
                            {vehicleData.FuelType != 'ELECTRIC' && (
                                <Grid xs={12} md={4}>
                                    <FormInputText
                                        control={controls.control}
                                        name="CubicCapacity"
                                        onChangeFn={handleInputChange}
                                        label="Cubic Capacity"
                                        placeholder="1100"
                                        disabled={disabledForVariant}
                                    />
                                </Grid>
                            )}
                            <Grid xs={12} md={4} className="requiredField">
                                <FormInputNumber
                                    control={controls.control}
                                    name="ExShowroomPrice"
                                    onChangeFn={handleInputChange}
                                    // label="Ex-Showroom Price (STRICTLY as per Veh.)"
                                    label={labelText}
                                    placeholder="1400000"
                                // onBlur={checkExshowroomPrice}
                                />
                            </Grid>
                            <Grid xs={12} md={4}>
                                <FormControl fullWidth>
                                    <FormInputSelect
                                        control={controls.control}
                                        name="DateofManufacture"
                                        onChangeFn={handleInputChange}
                                        label="Year of Manufacture"
                                        LIST={YOM}
                                        TEXT="Text"
                                        VALUE="Value"
                                        disabled={disabledTMIInput}
                                        className="requiredField"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid xs={10} md={3}>
                                <FormControl fullWidth>
                                    <FormInputSelect
                                        control={controls.control}
                                        name="RTOId"
                                        onChangeFn={handleInputChange}
                                        label="Registration City"
                                        LIST={setter.rto}
                                        TEXT="RTOName"
                                        VALUE="RTOId"
                                       // disabled={disabledTMIInput}
                                        className="requiredField"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid
                                xs={1}
                                md={1}
                                className="btn-container ml-auto mr-4 md:mr-0 md:ml-0"
                            >
                                <Tooltip title="Search and Map RTO">
                                    <IconButton
                                        color="secondary"
                                        onClick={OpenRTOMap}
                                    >
                                        <SearchTwoToneIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid xs={12} md={4}>
                                <FormControl fullWidth>
                                    <FormInputSelect
                                        control={controls.control}
                                        name="IsuredStateId"
                                        onChangeFn={handleInputChange}
                                        label="Customer Residence State"
                                        LIST={setter.states}
                                        TEXT="StateName"
                                        VALUE="StateId"
                                        disabled={disabledTMIInput}
                                        className="requiredField"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={4} className="requiredField">
                                <FormInputDate
                                    control={controls.control}
                                    nestedObject={'VehicleDetails'}
                                    name="InvoiceDate"
                                    onChangeFn={getSelectedDate}
                                    label="Invoice Date"
                                    disabled={
                                        disabledTMIInput ||
                                        policyData.PolicyDetails.PolicyType ==
                                        'N'
                                    }
                                    //onBlur={checkRegistrationInvoice}
                                    minDate={sendPolicyData.minInvoice}
                                    maxDate={sendPolicyData.maxInvoice}
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                md={4}
                                className={
                                    policyData.PolicyDetails.PolicyType == 'R'
                                        ? 'requiredField'
                                        : ''
                                }
                            >
                                <FormInputDate
                                    control={controls.control}
                                    nestedObject={'PolicyData'}
                                    name="RegistrationDate"
                                    onChangeFn={getSelectedDate}
                                    label="Registration Date"
                                    // disabled={disabledTMIInput && policyData.RegistrationDate!=null}
                                    disabled={
                                        policyData.PolicyDetails.PolicyType === 'R' && sendPolicyData.isPIdPNoExists
                                    }
                                    //onBlur={checkRegistrationInvoice}
                                    minDate={dayjs(
                                        sendPolicyData.minRegistration
                                    )}
                                    maxDate={dayjs(
                                        sendPolicyData.maxRegistration
                                    )}
                                />
                            </Grid>
                            <Grid xs={12} md={4}>
                                <FormInputText
                                    control={controls.control}
                                    name="INSURED_GSTIN"
                                    onChangeFn={handleInputChange}
                                    label="GSTIN"
                                    placeholder="Enter GST Number"
                                    inputProps={{
                                        style: { textTransform: 'uppercase' },
                                        maxLength: 15
                                    }}
                                    autoComplete="nope"
                                // disabled={disabledTMIInput}
                                />
                            </Grid>
                            {/* {policyData.PolicyDetails.PolicyType == 'N' && (
                                <Grid xs={12} md={4}>
                                    <ColorToggleButton
                                        value={policyData.IsTestDrive}
                                        // defaultSelected={policyData.IsTestDrive}
                                        toggleButton={getToggleButtonData}
                                        options={{ ...TestData }}
                                        label="Test Vehicle"
                                        name="IsTestDrive"
                                        disabled={disabledTMIInput}
                                    />
                                </Grid>
                            )} */}
                            {(policyData.RegistrationDate != '' &&
                                dayjs(policyData.RegistrationDate).isValid() &&
                                policyData.PolicyDetails.PolicyType == 'N') ||
                                policyData.PolicyDetails.PolicyType == 'R' ? (
                                <Grid xs={12} md={4}>
                                    <FormInputRadio
                                        onChangeFn={getToggleButtonData}
                                        list={BHSeriesData}
                                        label="BH Registration"
                                        name="IS_BH_REGIST_NO"
                                        control={controls.control}
                                    />
                                </Grid>
                            ) : (
                                <></>
                            )}
                            {((policyData.RegistrationDate != '' &&
                                dayjs(policyData.RegistrationDate).isValid() &&
                                policyData.PolicyDetails.PolicyType == 'N') ||
                                policyData.PolicyDetails.PolicyType == 'R') && (
                                    <>
                                        {vehicleData.IS_BH_REGIST_NO == '1' && (
                                            <Grid
                                                xs={12}
                                                md={4}
                                                id="IdBhRegistration"
                                                className={
                                                    policyData.PolicyDetails
                                                        .PolicyType == 'R'
                                                        ? 'requiredField mb-1'
                                                        : 'mb-1'
                                                }
                                            >
                                                <label htmlFor="ddlregistration">
                                                    BH Registration No.
                                                </label>
                                                <div className="flex">
                                                    <FormInputText
                                                        control={controls.control}
                                                        name="BHNumberSeries1"
                                                        onChangeFn={
                                                            handleInputChange
                                                        }
                                                        placeholder="01-BH"
                                                        //onBlur={checkRTOFN}
                                                        autoComplete="nope"
                                                        inputProps={{
                                                            maxLength: 5
                                                        }}
                                                        //disabled={controls.control._formValues['BHNumberSeries1']!=""}
                                                    />
                                                    <FormInputNumber
                                                        control={controls.control}
                                                        name="BHNumberSeries3"
                                                        onChangeFn={
                                                            handleInputChange
                                                        }
                                                        placeholder="3532"
                                                        autoComplete="nope"
                                                        sx={{
                                                            margin: '0 .5rem'
                                                        }}
                                                        inputProps={{
                                                            maxLength: 4
                                                        }}
                                                    />
                                                    <FormInputText
                                                        control={controls.control}
                                                        name="BHNumberSeries2"
                                                        onChangeFn={
                                                            handleInputChange
                                                        }
                                                        placeholder="RAA"
                                                        autoComplete="nope"
                                                        sx={{
                                                            margin: '0 .5rem'
                                                        }}
                                                        inputProps={{
                                                            maxLength: 3,
                                                            style: {
                                                                textTransform:
                                                                    'uppercase'
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </Grid>
                                        )}
                                        {vehicleData.IS_BH_REGIST_NO == '3' && (
                                            <Grid
                                                xs={12}
                                                md={4}
                                                id="IdRegistrationNo"
                                                className={
                                                    policyData.PolicyDetails
                                                        .PolicyType == 'R'
                                                        ? 'requiredField mb-1'
                                                        : 'mb-1'
                                                }
                                            >
                                                <label htmlFor="ddlregistration">
                                                    Registration No.
                                                </label>
                                                <div className="flex">
                                                    <FormInputText
                                                        control={controls.control}
                                                        name="RTO_NAME"
                                                        onChangeFn={
                                                            handleInputChange
                                                        }
                                                        placeholder="DL-09"
                                                        onBlur={checkRTOFN}
                                                        autoComplete="nope"
                                                        inputProps={{
                                                            maxLength: 5,
                                                            style: {
                                                                textTransform:
                                                                    'uppercase'
                                                            }
                                                        }}
                                                    />
                                                    <FormInputText
                                                        control={controls.control}
                                                        name="RegistrationNo1"
                                                        onChangeFn={
                                                            handleInputChange
                                                        }
                                                        placeholder="RAA"
                                                        sx={{
                                                            margin: '0 .5rem'
                                                        }}
                                                        autoComplete="nope"
                                                        inputProps={{
                                                            maxLength: 3,
                                                            style: {
                                                                textTransform:
                                                                    'uppercase'
                                                            }
                                                        }}
                                                    />
                                                    <FormInputNumber
                                                        control={controls.control}
                                                        name="RegistrationNo2"
                                                        onChangeFn={
                                                            handleInputChange
                                                        }
                                                        placeholder="5445"
                                                        autoComplete="nope"
                                                        inputProps={{
                                                            maxLength: 4
                                                        }}
                                                        sx={{
                                                            paddingLeft: '20px'
                                                        }}
                                                    />
                                                </div>
                                            </Grid>
                                        )}
                                        {vehicleData.IS_BH_REGIST_NO == '2' && (
                                            <Grid xs={12} md={4} spacing={2}>
                                                <label
                                                    htmlFor="ddlregistration"
                                                    className="mb-1"
                                                >
                                                    Special No.
                                                </label>
                                                <div className="flex">
                                                    <FormInputText
                                                        control={controls.control}
                                                        onBlur={
                                                            validateSpclRegistrationNoFN
                                                        }
                                                        name="SpecialRegistartionNo"
                                                        onChangeFn={
                                                            handleInputChange
                                                        }
                                                        placeholder="INDL09STF"
                                                        autoComplete="nope"
                                                        inputProps={{
                                                            style: {
                                                                textTransform:
                                                                    'uppercase'
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </Grid>
                                        )}
                                    </>
                                )}
                        </Grid>
                    </Box>
                </AccordionDetails>
            </Accordion>

            {/* Additional Discounts Working Section OK TO K*/}
            {(!sendPolicyData.isSATP ||
                (getOD_TPTenures(policyData.Renew.PREV_COVERTYPE_ID)[0] > 0 &&
                    policyData.Renew.RENEWAL_TYPE == '1' &&
                    policyData.PolicyDetails.CoverTypeId == 0)) &&
                vehicleData.IsTestDrive != 'true' && (
                    <Accordion
                        defaultExpanded
                        sx={{
                            backgroundColor: 'transparent',
                            border: '0px',
                            boxShadow: '0px 0px 0px'
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3-content"
                            className="accordianHeading"
                            id="panel3-header"
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
                                    d="M20.76 6.7627H9.24002C7.11925 6.7627 5.40002 8.48192 5.40002 10.6027V20.2027C5.40002 22.3235 7.11925 24.0427 9.24002 24.0427H20.76C22.8808 24.0427 24.6 22.3235 24.6 20.2027V10.6027C24.6 8.48192 22.8808 6.7627 20.76 6.7627Z"
                                    stroke="black"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M10.2 20.2035L19.8 10.6035"
                                    stroke="#8080DA"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M11.16 14.4435C12.2204 14.4435 13.08 13.5839 13.08 12.5235C13.08 11.4631 12.2204 10.6035 11.16 10.6035C10.0996 10.6035 9.23999 11.4631 9.23999 12.5235C9.23999 13.5839 10.0996 14.4435 11.16 14.4435Z"
                                    stroke="#8080DA"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M18.84 20.2033C19.9005 20.2033 20.76 19.3437 20.76 18.2833C20.76 17.223 19.9005 16.3633 18.84 16.3633C17.7796 16.3633 16.92 17.223 16.92 18.2833C16.92 19.3437 17.7796 20.2033 18.84 20.2033Z"
                                    stroke="#8080DA"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span className="AccordianItem ml-3 text-lg">
                                Additional Discounts
                            </span>
                        </AccordionSummary>

                        <AccordionDetails>
                            <Box sx={{ flexGrow: '1' }}>
                                <Grid container spacing={4} sx={{ mt: 2 }}>
                                    <>
                                        <Grid xs={6} md={3}>
                                            <FormInputRadio
                                                onChangeFn={getToggleButtonData}
                                                list={AddDiscounts}
                                                label="NCB Carry Forward"
                                                name="IsNCBForward"
                                                control={controls.control}
                                            />
                                        </Grid>
                                        {additionalDiscounts.IsNCBForward ==
                                            'true' ? (
                                            <Grid
                                                xs={12}
                                                md={3}
                                                id="divNCBValue"
                                            >
                                                <FormControl fullWidth>
                                                    <FormInputSelect
                                                        control={
                                                            controls.control
                                                        }
                                                        name="NCBLevel"
                                                        onChangeFn={
                                                            handleAdditionalChange
                                                        }
                                                        label="Entitled NCB %"
                                                        LIST={setter.ncbper.filter(
                                                            (item) =>
                                                                item.EntitledNCBLabel !==
                                                                '0'
                                                        )}
                                                        TEXT="EntitledNCBLabel"
                                                        VALUE="EntitledNCBValue"
                                                        className="requiredField"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        ) : (
                                            <></>
                                        )}

                                        {policyData.PolicyDetails.VehClass !=
                                            'C' && (
                                                <>
                                                    <Grid xs={6} md={3}>
                                                        <FormInputRadio
                                                            onChangeFn={
                                                                getToggleButtonData
                                                            }
                                                            list={AddDiscounts}
                                                            label="Voluntary Excess"
                                                            name="IsVoluntaryForward"
                                                            control={
                                                                controls.control
                                                            }
                                                        />
                                                    </Grid>
                                                    {policyData.IsVoluntaryForward ==
                                                        'true' &&
                                                        vehicleData.IsTestDrive !=
                                                        'true' ? (
                                                        <Grid
                                                            xs={12}
                                                            md={3}
                                                            id="divVoluntaryExcess"
                                                        >
                                                            <FormControl fullWidth>
                                                                <FormInputSelect
                                                                    control={
                                                                        controls.control
                                                                    }
                                                                    name="VoluntaryExcess"
                                                                    onChangeFn={
                                                                        handleAdditionalChange
                                                                    }
                                                                    label="Voluntary Excess (₹)"
                                                                    LIST={
                                                                        setter.voluntryExcess
                                                                    }
                                                                    TEXT="VoluntryExcessValue"
                                                                    VALUE="VoluntryExcessCode"
                                                                    className="requiredField"
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                    ) : (
                                                        <></>
                                                    )}
                                                    <Grid xs={6} md={3}>
                                                        <FormInputRadio
                                                            onChangeFn={
                                                                getToggleButtonData
                                                            }
                                                            list={AddDiscounts}
                                                            label="AAI Membership"
                                                            name="IsAA"
                                                            control={
                                                                controls.control
                                                            }
                                                        />
                                                    </Grid>
                                                    {policyData.PolicyDetails
                                                        .PolicyType != 'N' && (
                                                            <Grid xs={6} md={3}>
                                                                <FormInputRadio
                                                                    onChangeFn={
                                                                        getToggleButtonData
                                                                    }
                                                                    list={AddDiscounts}
                                                                    label="Handicapped"
                                                                    name="IsHandicapped"
                                                                    control={
                                                                        controls.control
                                                                    }
                                                                />
                                                            </Grid>
                                                        )}
                                                </>
                                            )}
                                        <Grid xs={6} md={3}>
                                            <FormInputRadio
                                                onChangeFn={getToggleButtonData}
                                                list={AddDiscounts}
                                                label="Anti Theft"
                                                name="IsAntiTheft"
                                                control={controls.control}
                                                IsDisabled={
                                                    isAntiTheftCoFitted.current ==
                                                        'true'
                                                        ? disabledForVariant
                                                        : false
                                                }
                                            />
                                        </Grid>
                                        {((policyData.PolicyDetails.VehClass ==
                                            'C' &&
                                            vehicleData.VehicleType == 'PCV' &&
                                            vehicleData.SeatingCapacity > 7) ||
                                            (policyData.PolicyDetails
                                                .VehClass == 'C' &&
                                                vehicleData.VehicleType !=
                                                'PCV')) && (
                                                <Grid xs={6} md={3}>
                                                    <FormInputRadio
                                                        onChangeFn={
                                                            getToggleButtonData
                                                        }
                                                        list={AddDiscounts}
                                                        label="IMT23"
                                                        name="IsIMT23"
                                                        control={controls.control}
                                                    // IsDisabled={
                                                    //     policyData.PolicyDetails
                                                    //         .VehClass == 'C'
                                                    // }
                                                    />
                                                </Grid>
                                            )}
                                    </>
                                </Grid>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                )}

            {/* Optional Details Working Section*/}
            <Accordion
                defaultExpanded
                sx={{
                    backgroundColor: 'transparent',
                    border: '0px',
                    boxShadow: '0px 0px 0px'
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel4-content"
                    className="accordianHeading"
                    id="panel4-header"
                >
                    <svg
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect width="30" height="30" rx="15" fill="white" />
                        <path
                            d="M15 10.9424C15.8025 10.9424 16.587 11.1804 17.2544 11.6262C17.9217 12.0721 18.4418 12.7059 18.7489 13.4473C19.056 14.1888 19.1364 15.0047 18.9798 15.7918C18.8232 16.579 18.4368 17.302 17.8693 17.8695C17.3018 18.437 16.5787 18.8235 15.7916 18.98C15.0045 19.1366 14.1886 19.0562 13.4471 18.7491C12.7056 18.442 12.0719 17.9219 11.626 17.2546C11.1801 16.5873 10.9421 15.8028 10.9421 15.0002C10.9433 13.9244 11.3712 12.8929 12.1319 12.1322C12.8927 11.3714 13.9241 10.9435 15 10.9424ZM15 8.75488C13.7647 8.75488 12.5573 9.12116 11.5302 9.80741C10.5032 10.4937 9.70273 11.469 9.23004 12.6102C8.75734 13.7514 8.63367 15.0071 8.87464 16.2186C9.11562 17.4301 9.71043 18.5429 10.5839 19.4163C11.4573 20.2897 12.5701 20.8845 13.7816 21.1255C14.993 21.3665 16.2488 21.2428 17.3899 20.7701C18.5311 20.2974 19.5065 19.4969 20.1927 18.4699C20.879 17.4429 21.2453 16.2354 21.2453 15.0002C21.2453 13.3438 20.5873 11.7553 19.4161 10.5841C18.2448 9.41287 16.6563 8.75488 15 8.75488Z"
                            fill="#8080DA"
                        />
                        <path
                            d="M16.4175 6.6875V7.72656L17.7693 8.28656C18.3592 8.53226 18.9139 8.85518 19.4187 9.24688L20.5803 10.1416L21.4837 9.61875L22.9012 12.0753L22 12.5938L22.1903 14.0419C22.2777 14.6762 22.2777 15.3195 22.1903 15.9538L22 17.4062L22.9012 17.9269L21.4837 20.3812L20.5803 19.8584L19.4187 20.7531C18.9135 21.1425 18.3589 21.4632 17.7693 21.7069L16.4175 22.2669V23.3125H13.5737V22.2669L12.2218 21.7069C11.6354 21.4625 11.0837 21.1419 10.5812 20.7531L9.41966 19.8584L8.51622 20.3812L7.09872 17.9247L7.99997 17.4062L7.80966 15.9581C7.72222 15.3238 7.72222 14.6805 7.80966 14.0462L7.99997 12.5938L7.09872 12.0731L8.51622 9.61875L9.41966 10.1416L10.5812 9.24688C11.0865 8.85748 11.6411 8.53677 12.2306 8.29313L13.5825 7.73313V6.6875H16.4262M17.52 4.5H12.4887L11.395 5.59375V6.27188C10.6269 6.58882 9.90454 7.00666 9.24685 7.51438L8.65622 7.1775L7.16872 7.57781L4.65747 11.9375C4.81278 12.5216 4.90028 12.8475 5.05778 13.4316L5.63966 13.7684C5.52882 14.5916 5.52882 15.4259 5.63966 16.2491L5.05778 16.5859C4.90028 17.17 4.81278 17.4959 4.65747 18.08L7.16872 22.4222L8.65622 22.8225L9.24028 22.4856C9.89798 22.9933 10.6204 23.4112 11.3884 23.7281V24.4062L12.4822 25.5H17.5134L18.6072 24.4062V23.7281C19.3752 23.4112 20.0976 22.9933 20.7553 22.4856L21.3437 22.8225L22.8378 22.4222L25.3425 18.0625C25.1872 17.4784 25.0997 17.1525 24.9422 16.5684L24.3603 16.2316C24.4711 15.4084 24.4711 14.5741 24.3603 13.7509L24.9422 13.4141C25.0997 12.83 25.1872 12.5041 25.3425 11.92L22.8312 7.57781L21.3437 7.1775L20.7531 7.51438C20.0954 7.00666 19.373 6.58882 18.605 6.27188V5.59375L17.5112 4.5H17.52Z"
                            fill="#231F20"
                        />
                    </svg>
                    <span className="AccordianItem ml-3 text-lg">
                        Optional Details
                    </span>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ flexGrow: '1' }}>
                        <Grid
                            container
                            rowSpacing={6}
                            columnSpacing={8}
                            sx={{ mt: 2 }}
                        >
                            {(!sendPolicyData.isSATP ||
                                (getOD_TPTenures(
                                    policyData.Renew.PREV_COVERTYPE_ID
                                )[0] > 0 &&
                                    policyData.Renew.RENEWAL_TYPE == '1' &&
                                    policyData.PolicyDetails.CoverTypeId ==
                                    0)) && (
                                    <>
                                        <Grid xs={12} md={3} id="divElectricalAcc">
                                            <TextField
                                                value={
                                                    policyData.AccessoriesValue
                                                        .ElectricalValue
                                                }
                                                onChange={handleOptionalChange}
                                                fullWidth
                                                variant="standard"
                                                inputProps={{ maxLength: 6 }}
                                                autoComplete="nope"
                                                label="Electrical Accessories Price"
                                                pattern="[0-9]"
                                                name="ElectricalValue"
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                            />
                                        </Grid>
                                        <Grid
                                            xs={12}
                                            md={3}
                                            id="divNonElectricalAcc"
                                        >
                                            <TextField
                                                value={
                                                    policyData.AccessoriesValue
                                                        .NonElectricalValue
                                                }
                                                onChange={handleOptionalChange}
                                                fullWidth
                                                variant="standard"
                                                inputProps={{ maxLength: 6 }}
                                                autoComplete="nope"
                                                label="Non Electrical Accessories Price"
                                                pattern="[0-9]"
                                                name="NonElectricalValue"
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                            />
                                        </Grid>
                                    </>
                                )}
                            {/* {vehicleData.FuelType != 'CNG' && vehicleData.FuelType != 'PETROL/CNG' && */}
                            {vehicleData.IsBifuel_Co_Fitted != 1 &&
                                vehicleData.FuelType != 'ELECTRIC' && (
                                    <Grid xs={12} md={3} id="divBiFuelValue">
                                        <TextField
                                            value={
                                                policyData.AccessoriesValue
                                                    .BiFuelValue
                                            }
                                            onChange={handleOptionalChange}
                                            fullWidth
                                            variant="standard"
                                            inputProps={{ maxLength: 6 }}
                                            autoComplete="nope"
                                            label="BiFuel Kit Price"
                                            pattern="[0-9]"
                                            name="BiFuelValue"
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                        />
                                    </Grid>
                                )}
                            <Grid xs={12} md={3} id="divGeoExtnsn">
                                <InputLabel id="ddlgeographical_label">
                                    Geographical Extension
                                </InputLabel>
                                <FormControl fullWidth>
                                    <Select
                                        variant="standard"
                                        labelId="ddlgeographical_label"
                                        multiple
                                        value={policyData.GeoArea}
                                        name="GeoArea"
                                        onChange={handleOptionalChange}
                                        renderValue={(selected) => (
                                            <Stack direction={'row'}>
                                                {selected.map((value) => (
                                                    <Chip
                                                        key={value}
                                                        label={
                                                            setter.geoarea[
                                                                value - 1
                                                            ]
                                                                .GeographicalAreaName
                                                        }
                                                        onDelete={() =>
                                                            setPolicyData({
                                                                ...policyData, //current state value
                                                                ['GeoArea']:
                                                                    policyData.GeoArea.filter(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item !==
                                                                            value
                                                                    )
                                                                //update state value
                                                            })
                                                        }
                                                        deleteIcon={
                                                            <CancelIcon
                                                                name="GeoArea"
                                                                onMouseDown={(
                                                                    event
                                                                ) =>
                                                                    event.stopPropagation()
                                                                }
                                                            />
                                                        }
                                                    />
                                                ))}
                                            </Stack>
                                        )}
                                    >
                                        {setter.geoarea?.map(
                                            (geoval, geoindex) => (
                                                <MenuItem
                                                    key={geoindex}
                                                    value={
                                                        geoval[
                                                        'GeographicalAreaId'
                                                        ]
                                                    }
                                                >
                                                    {
                                                        geoval[
                                                        'GeographicalAreaName'
                                                        ]
                                                    }
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            {!sendPolicyData.isSAOD ? (
                                <>
                                    {policyData.PolicyDetails.ProposalType ==
                                        'I' ? (
                                        <>
                                            <Grid
                                                item
                                                // rowSpacing={6}
                                                // columnSpacing={8}
                                                // sx={{ mt: 3 }}
                                                xs={12}
                                                md={3}
                                            >
                                                <div id="divCPATenure">
                                                    <FormControl fullWidth>
                                                        <FormInputSelect
                                                            control={
                                                                controls.control
                                                            }
                                                            name="CPATenure"
                                                            onChangeFn={
                                                                handleOptionalChange
                                                            }
                                                            label="CPA Tenure (Year)"
                                                            LIST={CPATenureList}
                                                            TEXT="cpavalues"
                                                            VALUE="cpavalues"
                                                            className="requiredField"
                                                        />
                                                    </FormControl>
                                                </div>
                                            </Grid>
                                            {optionalDetails.CPATenure == 0 &&
                                                policyData.PolicyDetails
                                                    .ProposalType == 'I' && (
                                                    <Grid
                                                        xs={12}
                                                        md={3}
                                                        className="requiredField"
                                                    >
                                                        <div id="divCPAWaiver">
                                                            <FormControl
                                                                fullWidth
                                                            >
                                                                <FormInputSelect
                                                                    control={
                                                                        controls.control
                                                                    }
                                                                    name="CPAReason"
                                                                    shrink={
                                                                        true
                                                                    }
                                                                    onChangeFn={(
                                                                        e
                                                                    ) => {
                                                                        setPolicyData(
                                                                            {
                                                                                ...policyData,
                                                                                ['CPAReason']:
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                            }
                                                                        )
                                                                    }}
                                                                    label="CPA Waiver Reason"
                                                                    LIST={
                                                                        cpaWaiverReasonList
                                                                    }
                                                                    TEXT="CPAReason"
                                                                    VALUE="CPAReasonCode"
                                                                />
                                                            </FormControl>
                                                        </div>
                                                    </Grid>
                                                )}
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </>
                            ) : (
                                <></>
                            )}
                            {(!sendPolicyData.isSAOD ||
                                (getOD_TPTenures(
                                    policyData.Renew.PREV_COVERTYPE_ID
                                )[1] > 0 &&
                                    policyData.Renew.RENEWAL_TYPE == '1' &&
                                    policyData.PolicyDetails.CoverTypeId ==
                                    0)) && (
                                    <>
                                        <Grid
                                            xs={12}
                                            md={3}
                                            id="divpacoverpaiddriver"
                                        >
                                            <FormInputRadio
                                                onChangeFn={getToggleButtonData}
                                                list={coverToggleObj}
                                                label="PA Cover - Paid Driver"
                                                name="IsPaidDriver"
                                                control={controls.control}
                                            />
                                        </Grid>
                                        <Grid
                                            xs={12}
                                            md={3}
                                            id="divLLforPaidDriver"
                                        >
                                            <FormInputRadio
                                                onChangeFn={getToggleButtonData}
                                                list={coverToggleObj}
                                                label="Legal Liability - Paid Driver"
                                                name="LLPaidDriver"
                                                control={controls.control}
                                                IsDisabled={getOD_TPTenures(policyData.PolicyDetails.CoverTypeId)[1] >=1 }
                                            />
                                        </Grid>
                                    </>
                                )}

                            {((policyData.PolicyDetails.VehClass == 'P' &&
                                !sendPolicyData.isSAOD) ||
                                (policyData.PolicyDetails.VehClass == 'C' &&
                                    vehicleData.VehicleType == 'PCV' &&
                                    vehicleData.SeatingCapacity < 7 &&
                                    !sendPolicyData.isSAOD)) && (
                                    <>
                                        <Grid xs={3} md={3}>
                                            <Grid xs={12}>
                                                <FormInputRadio
                                                    onChangeFn={getToggleButtonData}
                                                    list={coverToggleObj}
                                                    label={
                                                        vehicleData.SeatingCapacity >
                                                            0
                                                            ? 'PA Cover-Unnamed Passenger(' +
                                                            vehicleData.SeatingCapacity +
                                                            ')'
                                                            : 'PA Cover-Unnamed Passenger('
                                                    }
                                                    name="IsUnnamedPassenger"
                                                    control={controls.control}
                                                />
                                            </Grid>
                                        </Grid>

                                        {policyData.PolicyDetails.VehClass !=
                                            'C' && (
                                                <Grid
                                                    xs={12}
                                                    md={3}
                                                    id="divLegalLiability"
                                                >
                                                    <FormControl fullWidth>
                                                        <InputLabel id="ddLLEPC_label">
                                                            Legal Liability - Employees
                                                            other than paid driver
                                                        </InputLabel>
                                                        <Select
                                                            value={
                                                                optionalDetails.OtherEmp
                                                            }
                                                            onChange={
                                                                handleOptionalChange
                                                            }
                                                            variant="standard"
                                                            labelId="ddLLEPC_label"
                                                            name="OtherEmp"
                                                            label="Legal Liability - Employees other than paid driver"
                                                            // disabled={disabledTMIInput}
                                                            disabled={
                                                                policyData.PolicyDetails
                                                                    .VehClass == 'P' &&
                                                                policyData.PolicyDetails
                                                                    .ProposalType == 'C'
                                                            }
                                                        >
                                                            {LLOT_PaidDriver?.map(
                                                                (LLDriver) => (
                                                                    <MenuItem
                                                                        value={LLDriver}
                                                                        key={LLDriver}
                                                                    >
                                                                        {LLDriver}
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            )}
                                    </>
                                )}

                            {optionalDetails.IsUnnamedPassenger == 'true' ||
                                optionalDetails.IsPACleaner == 'true' ||
                                optionalDetails.IsPAConductor == 'true' ||
                                optionalDetails.IsPAHelper == 'true' ||
                                optionalDetails.IsPaidDriver == 'true' ? (
                                <Grid xs={12} md={3}>
                                    <div id="divPACover">
                                        <FormControl fullWidth>
                                            <FormInputSelect
                                                control={controls.control}
                                                name="CoverAmount"
                                                onChangeFn={
                                                    handleOptionalChange
                                                }
                                                label="PA Cover Amount (₹)"
                                                LIST={setter.paunnamedpass}
                                                TEXT="PaUnnamedLabel"
                                                VALUE="PaUnnamedLabel"
                                                className="requiredField"
                                            />
                                        </FormControl>
                                    </div>
                                </Grid>
                            ) : (
                                <></>
                            )}

                            {/* CV Region */}

                            <CVAdditionalCovers
                                {...{
                                    policyData,
                                    getToggleButtonData,
                                    coverToggleObj,
                                    control: controls.control,
                                    optionalDetails,
                                    handleOptionalChange,
                                    LLOT_PaidDriver,
                                    vehicleData,
                                    isSAOD: sendPolicyData.isSAOD,
                                    isSATP: sendPolicyData.isSATP,
                                    prevODTenure: getOD_TPTenures(
                                        policyData.Renew.PREV_COVERTYPE_ID
                                    )[0],
                                    prevTPTenure: getOD_TPTenures(
                                        policyData.Renew.PREV_COVERTYPE_ID
                                    )[1],
                                    TpTenure: getOD_TPTenures(
                                        policyData.Renew.PREV_COVERTYPE_ID
                                    )[1]
                                }}
                            />
                        </Grid>
                        {sendPolicyData.isSAOD &&
                            
                            policyData.PolicyDetails.PolicyType === 'R' && (
                                <Grid xs={12}>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={
                                                        sendPolicyData.biFuelAgreement
                                                    }
                                                    onChange={() => {
                                                        sendPolicyData.setBiFuelAgreement(
                                                            !sendPolicyData.biFuelAgreement
                                                        )
                                                    }}
                                                />
                                            }
                                            label="BiFuel/Geographical Area taken in Previous TP Policy"
                                        />
                                    </FormGroup>
                                </Grid>
                            )}

                        {/*----------Applying Condition On TP  and OD Cover Type Selection*/}
                    </Box>
                </AccordionDetails>
            </Accordion>

            {/* Last Years AddOn Section */}
            {policyData.PolicyDetails.PolicyType === 'R' &&
                policyData.Renew.RENEWAL_TYPE != '2' &&
                policyData.PolicyDetails.CoverTypeId != 2 ? (
                <Accordion
                    defaultExpanded
                    sx={{
                        backgroundColor: 'transparent',
                        border: '0px',
                        boxShadow: '0px 0px 0px'
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel5-content"
                        className="accordianHeading"
                        id="panel5-header"
                    >
                        <svg
                            width="30"
                            height="30"
                            viewBox="0 0 30 30"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect width="30" height="30" rx="15" fill="white" />
                            <path
                                d="M15 10.9424C15.8025 10.9424 16.587 11.1804 17.2544 11.6262C17.9217 12.0721 18.4418 12.7059 18.7489 13.4473C19.056 14.1888 19.1364 15.0047 18.9798 15.7918C18.8232 16.579 18.4368 17.302 17.8693 17.8695C17.3018 18.437 16.5787 18.8235 15.7916 18.98C15.0045 19.1366 14.1886 19.0562 13.4471 18.7491C12.7056 18.442 12.0719 17.9219 11.626 17.2546C11.1801 16.5873 10.9421 15.8028 10.9421 15.0002C10.9433 13.9244 11.3712 12.8929 12.1319 12.1322C12.8927 11.3714 13.9241 10.9435 15 10.9424ZM15 8.75488C13.7647 8.75488 12.5573 9.12116 11.5302 9.80741C10.5032 10.4937 9.70273 11.469 9.23004 12.6102C8.75734 13.7514 8.63367 15.0071 8.87464 16.2186C9.11562 17.4301 9.71043 18.5429 10.5839 19.4163C11.4573 20.2897 12.5701 20.8845 13.7816 21.1255C14.993 21.3665 16.2488 21.2428 17.3899 20.7701C18.5311 20.2974 19.5065 19.4969 20.1927 18.4699C20.879 17.4429 21.2453 16.2354 21.2453 15.0002C21.2453 13.3438 20.5873 11.7553 19.4161 10.5841C18.2448 9.41287 16.6563 8.75488 15 8.75488Z"
                                fill="#8080DA"
                            />
                            <path
                                d="M16.4175 6.6875V7.72656L17.7693 8.28656C18.3592 8.53226 18.9139 8.85518 19.4187 9.24688L20.5803 10.1416L21.4837 9.61875L22.9012 12.0753L22 12.5938L22.1903 14.0419C22.2777 14.6762 22.2777 15.3195 22.1903 15.9538L22 17.4062L22.9012 17.9269L21.4837 20.3812L20.5803 19.8584L19.4187 20.7531C18.9135 21.1425 18.3589 21.4632 17.7693 21.7069L16.4175 22.2669V23.3125H13.5737V22.2669L12.2218 21.7069C11.6354 21.4625 11.0837 21.1419 10.5812 20.7531L9.41966 19.8584L8.51622 20.3812L7.09872 17.9247L7.99997 17.4062L7.80966 15.9581C7.72222 15.3238 7.72222 14.6805 7.80966 14.0462L7.99997 12.5938L7.09872 12.0731L8.51622 9.61875L9.41966 10.1416L10.5812 9.24688C11.0865 8.85748 11.6411 8.53677 12.2306 8.29313L13.5825 7.73313V6.6875H16.4262M17.52 4.5H12.4887L11.395 5.59375V6.27188C10.6269 6.58882 9.90454 7.00666 9.24685 7.51438L8.65622 7.1775L7.16872 7.57781L4.65747 11.9375C4.81278 12.5216 4.90028 12.8475 5.05778 13.4316L5.63966 13.7684C5.52882 14.5916 5.52882 15.4259 5.63966 16.2491L5.05778 16.5859C4.90028 17.17 4.81278 17.4959 4.65747 18.08L7.16872 22.4222L8.65622 22.8225L9.24028 22.4856C9.89798 22.9933 10.6204 23.4112 11.3884 23.7281V24.4062L12.4822 25.5H17.5134L18.6072 24.4062V23.7281C19.3752 23.4112 20.0976 22.9933 20.7553 22.4856L21.3437 22.8225L22.8378 22.4222L25.3425 18.0625C25.1872 17.4784 25.0997 17.1525 24.9422 16.5684L24.3603 16.2316C24.4711 15.4084 24.4711 14.5741 24.3603 13.7509L24.9422 13.4141C25.0997 12.83 25.1872 12.5041 25.3425 11.92L22.8312 7.57781L21.3437 7.1775L20.7531 7.51438C20.0954 7.00666 19.373 6.58882 18.605 6.27188V5.59375L17.5112 4.5H17.52Z"
                                fill="#231F20"
                            />
                        </svg>
                        <span className="AccordianItem ml-3">
                            Last Year Add-Ons
                        </span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box
                            sx={{ flexGrow: '1', padding: '1rem 0' }}
                            id="divIcs"
                        >
                            <Grid container spacing={4}>
                                <Grid xs={12} md={3}>
                                    <FormInputRadio
                                        onChangeFn={getToggleButtonData}
                                        list={coverToggleObj}
                                        label="Nil Depreciation"
                                        name="ZeroDep"
                                        control={controls.control}
                                        IsDisabled={disabledTMIInput}
                                    />
                                </Grid>
                                <Grid xs={12} md={3}>
                                    <FormInputRadio
                                        onChangeFn={getToggleButtonData}
                                        list={coverToggleObj}
                                        label="Return to Invoice"
                                        name="ReturnToInvoice"
                                        control={controls.control}
                                        IsDisabled={disabledTMIInput}
                                    />
                                </Grid>
                                <Grid xs={12} md={3}>
                                    <FormInputRadio
                                        onChangeFn={getToggleButtonData}
                                        list={coverToggleObj}
                                        label="Engine Protect"
                                        name="EngineProtect"
                                        control={controls.control}
                                        IsDisabled={disabledTMIInput}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            ) : (
                <></>
            )}

            {/* Insurance Company Working Section */}
            <Accordion
                expanded={expanded}
                sx={{
                    backgroundColor: 'transparent',
                    border: '0px',
                    boxShadow: '0px 0px 0px',
                    display: 'none'
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon onClick={toggleAccordion} />}
                    aria-controls="panel5-content"
                    className="accordianHeading"
                    id="panel5-header"
                >
                    <div style={{ marginRight: '-5px' }}>
                        <FormGroup>
                            <FormControlLabel
                                onClick={selectAllIC}
                                control={
                                    <Checkbox
                                        sx={{
                                            padding: '2px',
                                            marginLeft: '.8rem'
                                        }}
                                    />
                                }
                                name="selectAll"
                            />
                        </FormGroup>
                    </div>
                    <span className="AccordianItem text-lg">
                        Select Insurance Company
                    </span>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ flexGrow: '1', padding: '1rem 0' }} id="divIcs">
                        <Grid container spacing={6}>
                            {sendPolicyData.icList?.map((ic) => (
                                <Grid xs={6} md={3} lg={2} key={ic['ICId']}>
                                    <div className="flex flex-row items-center border border-gray-200 rounded-lg w-100 ICBox PolicyListing">
                                        <div className="checkIC">
                                            <FormGroup>
                                                <FormControlLabel
                                                    onChange={handleICSelection}
                                                    control={
                                                        <Checkbox
                                                            name="checked"
                                                            value={ic['ICId']}
                                                            checked={true}
                                                        />
                                                    }
                                                    label=""
                                                    sx={{ margin: 0 }}
                                                />
                                            </FormGroup>
                                        </div>
                                        <div className="flex flex-col justify-between p-2 mx-auto leading-normal IC">
                                            <h5 className="mb-1 text-2l font-bold tracking-tight text-gray-900 leading-4 text-center dark:text-white ICName">
                                                <span>{ic['ICName']}</span>
                                            </h5>
                                            <div className="border p-2 rounded w-24 icItem">
                                                <img
                                                    src={
                                                        BasePath +
                                                        '/Images/Product/' +
                                                        ic['LogoPath']
                                                    }
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid xs={3}>
                            <span id="spnIC" className="text-danger"></span>
                        </Grid>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </>
    )
}
export default VehicleDetails
