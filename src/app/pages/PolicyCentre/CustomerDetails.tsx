import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { PolicyPageContext } from './Policy'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Select from '@mui/material/Select'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'
import { getSalutation } from '../../services/policyServices/policyService'
import { FormInputText } from '../../components/common/FormInputs/FormInputText'
import { FormInputNumber } from '../../components/common/FormInputs/FormInputNumber'
import { checkDupMobileEmail } from '../../services/policyServices/policyService'
import toast from 'react-hot-toast'
import { FormInputSelect } from '../../components/common/FormInputs/FormInputSelect'
import { HARD_CODE_VALUE, companySalutation } from '../../constants/hardCode'
import { TextField } from '@mui/material'
import { useAppSelector } from '../../hooks/reduxHooks'

function CustomerDetails({ sendDataToParent, controls, resets }) {
    const customerDetails = sendDataToParent.customerDetails
    let setCustomerDetails = sendDataToParent.setCustomerDetails
    let disabledTMIInput = sendDataToParent.disabledTMIInput
    let IsVisofSameDealer = sendDataToParent.IsVisofSameDealer

    const [salutation, setSalutation] = useState([])
    const encryptedMobEmail = useAppSelector<boolean>(
        (state: any) => state.encryptedMobEmail
    )

    const handleCustomerChange = (event: any) => {
        const { target } = event;
        const { name, value } = target;
      
        setCustomerDetails({ ...customerDetails, [name]: value })
    }
    useEffect(() => {
        getSalutationFN()
    }, [])

    const getSalutationFN = async () => {
        let Obj = {}
        let salutation = await getSalutation(Obj)
        if (salutation.status === 200) {
            setSalutation(salutation.data)
        }
    }

    //const { cpa, proposer } = useContext(PolicyPageContext);
    const ProposerTypeVal =
        sendDataToParent.policyData.PolicyDetails.ProposalType

    //#region Duplicate Mobile/Email validation
    const checkDuplicacyOnEmailMobile = async (event: any) => {
        let { name } = event.target

        if (name == 'MOB_NO' || name == 'ALT_MOBILE_NO') {
            if (
                customerDetails[name]
                    .split('')
                    .every((x) => x == customerDetails[name][0])
            ) {
                setCustomerDetails({
                    ...customerDetails,
                    [name]: ''
                })
                resets.reset({
                    ...controls.control._formValues,

                    [name]: ''
                })

                return
            }
        }

        let objData = {
            ProposerDetails: {},
            VehicleDetails:{}
        }
        debugger;
        objData.ProposerDetails.PROPOSAL_TYPE = ProposerTypeVal
        objData.ProposerDetails.MOB_NO = customerDetails.MOB_NO
        objData.ProposerDetails.ALT_MOBILE_NO = customerDetails.ALT_MOBILE_NO
        objData.ProposerDetails.EMAIL = customerDetails.EMAIL
        objData.VehicleDetails.CHASSIS_NO=sendDataToParent.policyData.VehicleDetails.ChassisNo;
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
            } else if (result.ErrorCode == 1 && result.Param2 == 1) {
                resets.reset({
                    ...controls.control._formValues,
                    ['EMAIL']: '',
                    ['MOB_NO']: ''
                })
                setCustomerDetails({
                    ...customerDetails,
                    ['EMAIL']: '',
                    ['MOB_NO']: ''
                })
                toast.error('Policy Exists with same Mobile No. & Email Id.')
            } else if (result.Param1 == '1' && result.Param2 == 1) {
                resets.reset({
                    ...controls.control._formValues,
                    ['EMAIL']: '',
                    ['ALT_MOBILE_NO']: ''
                })
                setCustomerDetails({
                    ...customerDetails,
                    ['EMAIL']: '',
                    ['ALT_MOBILE_NO']: ''
                })
                toast.error(
                    'Policy Exists with same Alternate Mobile No. & Email Id.'
                )
            } else if (result.ErrorCode == 1 && result.Param2 == 0) {
                resets.reset({
                    ...controls.control._formValues,
                    ['MOB_NO']: ''
                })
                setCustomerDetails({ ...customerDetails, ['MOB_NO']: '' })
                toast.error('Policy Exists with same Mobile No.')
            } else if (
                result.ErrorCode == 0 &&
                result.Param1 == '1' &&
                result.Param2 == 0
            ) {
                resets.reset({
                    ...controls.control._formValues,
                    ['ALT_MOBILE_NO']: ''
                })
                setCustomerDetails({
                    ...customerDetails,
                    ['ALT_MOBILE_NO']: ''
                })
                toast.error('Policy Exists with same Alternate Mobile No.')
            } else if (
                result.ErrorCode == 0 &&
                result.Param1 == '0' &&
                result.Param2 == 1
            ) {
                resets.reset({ ...controls.control._formValues, ['EMAIL']: '' })
                setCustomerDetails({ ...customerDetails, ['EMAIL']: '' })
                toast.error('Policy Exists with same Email Id')
            }
        }
    }
    //#endregion

    return (
        <>
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
                    aria-controls="panel1-content"
                    className="accordianHeading"
                    id="panel1-header"
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
                    <span className="AccordianItem ml-3 text-lg">
                        {ProposerTypeVal == 'I' ||
                        ProposerTypeVal == '' ||
                        ProposerTypeVal == null ? (
                            <>Customer Details</>
                        ) : (
                            <>Company Details</>
                        )}
                    </span>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ flexGrow: '1' }} pt={2}>
                        {ProposerTypeVal == 'I' ||
                        ProposerTypeVal == '' ||
                        ProposerTypeVal == null ? (
                            <>
                                <Grid
                                    container
                                    rowSpacing={6}
                                    columnSpacing={8}
                                    sx={{ mt: 0 }}
                                >
                                    <Grid xs={12} md={3}>
                                        <FormControl fullWidth>
                                            <FormInputSelect
                                                control={controls.control}
                                                name="SALUTATION"
                                                onChangeFn={
                                                    handleCustomerChange
                                                }
                                                label="Salutation"
                                                LIST={salutation}
                                                TEXT="SalutationName"
                                                VALUE="SalutationName"
                                                className="requiredField"
                                                disabled={disabledTMIInput}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                            />
                                            {/* <Select
                                                disabled={disabledTMIInput}
                                                name='SALUTATION'
                                                value={customerDetails.SALUTATION}
                                                onChange={handleCustomerChange}
                                                variant="standard"
                                                labelId="ddlSALUTATION_label"
                                            >
                                                <MenuItem value={0} >
                                                    <span className="text-sm"> Select Salutation </span>
                                                </MenuItem>
                                                {salutation.map((salutationVal, index) => (
                                                    <MenuItem key={index} value={salutationVal["SalutationName"].toUpperCase()}>{salutationVal["SalutationName"]}</MenuItem >
                                                ))}
                                            </Select> */}
                                        </FormControl>
                                    </Grid>
                                    <Grid
                                        xs={12}
                                        md={3}
                                        className="requiredField"
                                    >
                                        <FormInputText
                                            name="FIRST_NAME"
                                            control={controls.control}
                                            onChangeFn={handleCustomerChange}
                                            label="First Name"
                                            inputProps={{
                                                style: {
                                                    textTransform: 'uppercase'
                                                },
                                                maxLength: 50
                                            }}
                                            autoComplete="nope"
                                            disabled={disabledTMIInput}
                                            className="requiredField"
                                        />
                                    </Grid>
                                    <Grid xs={12} md={3}>
                                        <FormInputText
                                            name="MIDDLE_NAME"
                                            control={controls.control}
                                            onChangeFn={handleCustomerChange}
                                            label="Middle Name"
                                            inputProps={{
                                                style: {
                                                    textTransform: 'uppercase'
                                                },
                                                maxLength: 50
                                            }}
                                            autoComplete="nope"
                                            disabled={disabledTMIInput}
                                        />
                                    </Grid>
                                    <Grid xs={12} md={3}>
                                        <FormInputText
                                            name="LAST_NAME"
                                            control={controls.control}
                                            onChangeFn={handleCustomerChange}
                                            label="Last Name"
                                            inputProps={{
                                                style: {
                                                    textTransform: 'uppercase'
                                                },
                                                maxLength: 50
                                            }}
                                            autoComplete="nope"
                                            disabled={disabledTMIInput}
                                        />
                                    </Grid>
                                </Grid>
                            </>
                        ) : (
                            <Grid
                                container
                                rowSpacing={6}
                                columnSpacing={8}
                                sx={{ mt: 0 }}
                            >
                                <Grid xs={12} md={3}>
                                    <FormControl fullWidth>
                                        <FormInputSelect
                                            control={controls.control}
                                            name="COMPANY_SALUTATION"
                                            onChangeFn={handleCustomerChange}
                                            label="Company Salutation"
                                            LIST={companySalutation}
                                            TEXT="SalutationName"
                                            VALUE="SalutationValue"
                                            className="requiredField"
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                            disabled={disabledTMIInput}
                                        />
                                        {/* <InputLabel id="ddlSALUTATION_label">Company Salutation</InputLabel>
                                        <Select
                                            value={customerDetails.COMPANY_SALUTATION}
                                            variant="standard" labelId="ddlcompsalutation_label" name='COMPANY_SALUTATION' label="Salutation"
                                            onChange={handleCustomerChange}
                                            disabled={disabledTMIInput}
                                        >
                                            <MenuItem value={0}><span className="text-sm"> Select Salutation </span></MenuItem>
                                            <MenuItem value={'Lessee'}>Lessee</MenuItem>
                                            <MenuItem value={'M/S'}>M/S</MenuItem>
                                            <MenuItem value={'THE'}>THE</MenuItem>
                                        </Select> */}
                                    </FormControl>
                                </Grid>
                                <Grid xs={12} md={9}>
                                    <FormInputText
                                        control={controls.control}
                                        name="COMPANY_NAME"
                                        onChangeFn={handleCustomerChange}
                                        label="Company Name"
                                        inputProps={{
                                            style: {
                                                textTransform: 'uppercase'
                                            },
                                            maxLength: 100
                                        }}
                                        placeholder="Company Name"
                                        autoComplete="nope"
                                        disabled={disabledTMIInput}
                                        className="requiredField"
                                    />
                                </Grid>
                            </Grid>
                        )}
                        <Grid
                            container
                            rowSpacing={6}
                            columnSpacing={8}
                            sx={{ mt: 3 }}
                        >
                            <Grid xs={12} md={3} className="requiredField">
                                {!encryptedMobEmail ? (
                                    <FormInputText
                                        control={controls.control}
                                        name="EMAIL"
                                        onChangeFn={handleCustomerChange}
                                        label="Email Id"
                                        inputProps={{
                                            style: {
                                                textTransform: 'uppercase'
                                            },
                                            maxLength: 50
                                        }}
                                        placeholder="your_email@gmail.com"
                                        autoComplete="nope"
                                     
                                        onBlur={checkDuplicacyOnEmailMobile}
                                        className="requiredField"
                                    />
                                ) : (
                                    <TextField
                                        name="EMAIL"
                                        label="Email Id"
                                        inputProps={{
                                            style: {
                                                textTransform: 'uppercase'
                                            },
                                            maxLength: 50
                                        }}
                                        value={customerDetails.ENCRYPTED_EMAIL}
                                        variant="standard"
                                        placeholder="your_email@gmail.com"
                                        autoComplete="nope"
                                        
                                        className="requiredField"
                                    />
                                )}
                            </Grid>
                            <Grid xs={12} md={3} className="requiredField">
                                {!encryptedMobEmail ? (
                                    <FormInputNumber
                                        control={controls.control}
                                        name="MOB_NO"
                                        onChangeFn={handleCustomerChange}
                                        label="Mobile No"
                                        inputProps={{ maxLength: 10 }}
                                        placeholder="9999999999"
                                        autoComplete="nope"
                                        
                                        onBlur={checkDuplicacyOnEmailMobile}
                                        className="requiredField"
                                    />
                                ) : (
                                    <TextField
                                        name="MOB_NO"
                                        label="Mobile No"
                                        value={customerDetails.ENCRYPTED_MOB_NO}
                                        variant="standard"
                                        inputProps={{ maxLength: 10 }}
                                        placeholder="9999999999"
                                        autoComplete="nope"
                                       
                                        className="requiredField"
                                    />
                                )}
                            </Grid>
                            <Grid xs={12} md={3}>
                                <FormInputNumber
                                    control={controls.control}
                                    name="ALT_MOBILE_NO"
                                    onChangeFn={handleCustomerChange}
                                    label="Alternate Mobile No."
                                    placeholder="9999999999"
                                    autoComplete="nope"
                                    inputProps={{ maxLength: 10 }}
                                    // disabled={disabledTMIInput}
                                    onBlur={checkDuplicacyOnEmailMobile}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </>
    )
}

export default CustomerDetails
