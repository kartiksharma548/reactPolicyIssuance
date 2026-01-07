import { useEffect, useRef, useState } from 'react'
import { Grid, Box, Button, InputAdornment, Typography } from '@mui/material'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useAppSelector } from '../../hooks/reduxHooks'
import toast, { ToastPosition, Toaster } from 'react-hot-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { CCFSchemaType, ccfSchema } from '../../models/schemas/sendQuoteSchema'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import PhoneIphoneRoundedIcon from '@mui/icons-material/PhoneIphoneRounded'
import ArrowForward from '@mui/icons-material/ArrowForward'
import { SendCustomerConsent } from '../../models/PolicyProposalMDL'
import {
    sendQuoteToCustomer,
    getCustomerDealerDetails
} from '../../services/quoteService'
import { FormInputText } from '../../components/common/FormInputs/FormInputText'
import { useNavigate } from 'react-router-dom'
import { fontSize } from '@mui/system'
import BackDropLoader from '../common/backDropLoading'
import { AuthModel } from '../../redux/features/auth/authInterface'
import { encrypt } from '../../utils/encryption'

function SendQuotation({ props }) {
    let open = props.open
    let setOpen = props.setOpen
    let Proposal_ID = props.ProposalId

    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )
    const objCustomerDetails = new SendCustomerConsent()
    objCustomerDetails.ProposalId = Proposal_ID

    const navigate = useNavigate()
    const [customerDetails, setSendCustomerDetails] =
        useState(objCustomerDetails)
    const cancelButtonRef = useRef(null)

    const {
        handleSubmit,
        control,
        setFocus,
        register,
        formState: { errors },
        setValue,

        setError,
        reset
    } = useForm<CCFSchemaType>({
        mode: 'all',
        resolver: zodResolver(ccfSchema)
    })

    const closePopUp = () => {
        setOpen(false)
        setSendCustomerDetails(objCustomerDetails)
        reset({ ...control._formValues, ...objCustomerDetails })
    }

    const CustomerData = (event: any) => {
        const { target } = event
        const { name, value } = target
        setSendCustomerDetails({ ...customerDetails, [name]: value })
    }

    const [loading, setLoading] = useState(false)

    const onSubmit: SubmitHandler<CCFSchemaType> = async (data) => {
        customerDetails.ProposalId = Proposal_ID
        customerDetails.DealerId = loginSelector.DealerId
        customerDetails.UserID = loginSelector.UserId
        setLoading(true)
        let status = await sendQuoteToCustomer(customerDetails)
        setLoading(false)
        if (status.Flag === 1) {
            setOpen(false)
            reset({ CustomerEmail: '', CustomerMobileNo: '' })
            setSendCustomerDetails(objCustomerDetails)
            setTimeout(function () {
                navigate({
                    pathname: '/QuoteListing'
                })
            }, 2000)
            toast.success(status.Message)
        } else if (status.Flag === 0) {
            toast.error(status.Message)
            setOpen(false)
            reset({ CustomerEmail: '', CustomerMobileNo: '' })
            setSendCustomerDetails(objCustomerDetails)
        }
    }

    const getCustomerDealerDetailsFN = async () => {
        let data = await getCustomerDealerDetails(objCustomerDetails)
        if (data.status === 200) {
            reset({
                CustomerEmail: data.data.EmailId,
                CustomerMobileNo: data.data.Mobile
            })
            customerDetails.CustomerEmail = data.data.EmailId
            customerDetails.CustomerMobileNo = data.data.Mobile
        }
    }
    useEffect(() => {
        getCustomerDealerDetailsFN()
    }, [open])

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

    return (
        <>
            <BackDropLoader openDialog={loading} />
            <Transition.Root show={open} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    static
                    initialFocus={cancelButtonRef}
                    onClose={() => null}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="bg-white px-5 pb-0 pt-5 sm:p-6 sm:pb-4">
                                            <div className="sm:flex sm:items-start">
                                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                    <Dialog.Title
                                                        as="h3"
                                                        className="text-base flex justify-between  font-semibold leading-6 text-gray-900"
                                                    >
                                                        <Typography>
                                                            &nbsp;
                                                        </Typography>
                                                        <span className="text-left sm:ml-12 sm:mt-0 sm:text-left">
                                                            <Button
                                                                color="error"
                                                                onClick={
                                                                    closePopUp
                                                                }
                                                                sx={{
                                                                    padding:
                                                                        '0',
                                                                    minWidth:
                                                                        '0'
                                                                }}
                                                            >
                                                                <svg
                                                                    width="24"
                                                                    height="24"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <g clip-path="url(#clip0_3277_5646)">
                                                                        <path
                                                                            d="M18.3 5.70973C17.91 5.31973 17.28 5.31973 16.89 5.70973L12 10.5897L7.10997 5.69973C6.71997 5.30973 6.08997 5.30973 5.69997 5.69973C5.30997 6.08973 5.30997 6.71973 5.69997 7.10973L10.59 11.9997L5.69997 16.8897C5.30997 17.2797 5.30997 17.9097 5.69997 18.2997C6.08997 18.6897 6.71997 18.6897 7.10997 18.2997L12 13.4097L16.89 18.2997C17.28 18.6897 17.91 18.6897 18.3 18.2997C18.69 17.9097 18.69 17.2797 18.3 16.8897L13.41 11.9997L18.3 7.10973C18.68 6.72973 18.68 6.08973 18.3 5.70973Z"
                                                                            fill="#22334F"
                                                                        />
                                                                    </g>
                                                                    <defs>
                                                                        <clipPath id="clip0_3277_5646">
                                                                            <rect
                                                                                width="24"
                                                                                height="24"
                                                                                fill="white"
                                                                            />
                                                                        </clipPath>
                                                                    </defs>
                                                                </svg>
                                                            </Button>
                                                        </span>
                                                    </Dialog.Title>
                                                    <div>
                                                        <Typography
                                                            sx={{
                                                                fontSize:
                                                                    '1.2rem',
                                                                fontWeight:
                                                                    '600'
                                                            }}
                                                        >
                                                            Enter Details
                                                        </Typography>
                                                        <p className="text-sm text-gray-500">
                                                            Please mention
                                                            customer Email ID
                                                            and Mobile No.
                                                        </p>
                                                    </div>

                                                    <Box
                                                        sx={{
                                                            flexGrow: '1',
                                                            padding: '0rem 0'
                                                        }}
                                                    >
                                                        <Grid
                                                            container
                                                            spacing={6}
                                                            sx={{ mt: 0.5 }}
                                                        >
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={12}
                                                            >
                                                                <FormInputText
                                                                    control={
                                                                        control
                                                                    }
                                                                    name="CustomerEmail"
                                                                    onChangeFn={
                                                                        CustomerData
                                                                    }
                                                                    label="Email Id"
                                                                    placeholder="email@gmail.com"
                                                                    InputProps={{
                                                                        endAdornment:
                                                                            (
                                                                                <InputAdornment position="end">
                                                                                    <EmailRoundedIcon></EmailRoundedIcon>
                                                                                </InputAdornment>
                                                                            )
                                                                    }}
                                                                    inputProps={{
                                                                        maxLength: 60
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={12}
                                                                sx={{ mt: 1 }}
                                                            >
                                                                <FormInputText
                                                                    control={
                                                                        control
                                                                    }
                                                                    name="CustomerMobileNo"
                                                                    onChangeFn={
                                                                        CustomerData
                                                                    }
                                                                    label="Mobile No."
                                                                    placeholder="7897897890"
                                                                    InputProps={{
                                                                        endAdornment:
                                                                            (
                                                                                <InputAdornment position="end">
                                                                                    <PhoneIphoneRoundedIcon></PhoneIphoneRoundedIcon>
                                                                                </InputAdornment>
                                                                            )
                                                                    }}
                                                                    inputProps={{
                                                                        maxLength: 10
                                                                    }}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Box textAlign="center">
                                                <Button
                                                    variant="contained"
                                                    type="submit"
                                                    sx={{
                                                        margin: '0 0 32px 0',
                                                        ml: 2
                                                    }}
                                                    endIcon={<ArrowForward />}
                                                >
                                                    Send
                                                </Button>
                                            </Box>
                                        </div>
                                    </form>

                                    {/* <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="bg-white ">
                                            <div className="">
                                                <div className="">
                                                    <Dialog.Title 
                                                        as="h3"
                                                        className="text-base flex justify-between px-6 py-4 leading-6 modelheaderBg"
                                                    >
                                                         <Typography
                                                         className="text-white"
                                                            sx={{
                                                                fontSize:
                                                                    '1.2rem',
                                                                fontWeight:
                                                                    '600'
                                                            }}
                                                        >
                                                            Enter Details
                                                        </Typography>
                                                        <span className="text-left sm:ml-12 sm:mt-0 sm:text-left">
                                                            <Button
                                                                color="error"
                                                                onClick={
                                                                    closePopUp
                                                                }
                                                                sx={{
                                                                    padding:
                                                                        '0',
                                                                    minWidth:
                                                                        '0'
                                                                }}
                                                            >
                                                                <svg
                                                                className='modelheaderCloseSvgColor'
                                                                    width="24"
                                                                    height="24"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <g clip-path="url(#clip0_3277_5646)">
                                                                        <path
                                                                            d="M18.3 5.70973C17.91 5.31973 17.28 5.31973 16.89 5.70973L12 10.5897L7.10997 5.69973C6.71997 5.30973 6.08997 5.30973 5.69997 5.69973C5.30997 6.08973 5.30997 6.71973 5.69997 7.10973L10.59 11.9997L5.69997 16.8897C5.30997 17.2797 5.30997 17.9097 5.69997 18.2997C6.08997 18.6897 6.71997 18.6897 7.10997 18.2997L12 13.4097L16.89 18.2997C17.28 18.6897 17.91 18.6897 18.3 18.2997C18.69 17.9097 18.69 17.2797 18.3 16.8897L13.41 11.9997L18.3 7.10973C18.68 6.72973 18.68 6.08973 18.3 5.70973Z"
                                                                            fill="#22334F"
                                                                        />
                                                                    </g>
                                                                    <defs>
                                                                        <clipPath id="clip0_3277_5646">
                                                                            <rect
                                                                                width="24"
                                                                                height="24"
                                                                                fill="white"
                                                                            />
                                                                        </clipPath>
                                                                    </defs>
                                                                </svg>
                                                            </Button>
                                                        </span>
                                                    </Dialog.Title>
                                                    <div className='px-6 pt-4'>                                             
                                                        <p className="text-sm text-gray-500">
                                                            Please mention
                                                            customer Email ID
                                                            and Mobile No.
                                                        </p>
                                                    </div>

                                                    <Box
                                                        sx={{
                                                            flexGrow: '1',
                                                            padding: ' 0 1.5rem '
                                                        }}
                                                    >
                                                        <Grid
                                                            container
                                                            spacing={6}
                                                            sx={{ mt: 0.5 }}
                                                        >
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={12}
                                                            >
                                                                <FormInputText
                                                                    control={
                                                                        control
                                                                    }
                                                                    name="CustomerEmail"
                                                                    onChangeFn={
                                                                        CustomerData
                                                                    }
                                                                    label="Email Id"
                                                                    placeholder="email@gmail.com"
                                                                    InputProps={{
                                                                        endAdornment:
                                                                            (
                                                                                <InputAdornment position="end">
                                                                                    <EmailRoundedIcon></EmailRoundedIcon>
                                                                                </InputAdornment>
                                                                            )
                                                                    }}
                                                                    inputProps={{
                                                                        maxLength: 60
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={12}
                                                                sx={{ mt: 1 }}
                                                            >
                                                                <FormInputText
                                                                    control={
                                                                        control
                                                                    }
                                                                    name="CustomerMobileNo"
                                                                    onChangeFn={
                                                                        CustomerData
                                                                    }
                                                                    label="Mobile No."
                                                                    placeholder="7897897890"
                                                                    InputProps={{
                                                                        endAdornment:
                                                                            (
                                                                                <InputAdornment position="end">
                                                                                    <PhoneIphoneRoundedIcon></PhoneIphoneRoundedIcon>
                                                                                </InputAdornment>
                                                                            )
                                                                    }}
                                                                    inputProps={{
                                                                        maxLength: 10
                                                                    }}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Box textAlign="right" className='px-6 py-4'>
                                                <Button
                                                    variant="contained"
                                                    type="submit"
                                                
                                                    endIcon={<ArrowForward />}
                                                >
                                                    Send
                                                </Button>
                                            </Box>
                                        </div>
                                    </form> */}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}
export default SendQuotation
