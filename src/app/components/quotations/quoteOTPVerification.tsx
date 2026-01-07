import React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Grid, Box, Typography } from '@mui/material'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ValidateCustomerConsent } from '../../models/PolicyProposalMDL'
import { Button } from '@mui/material'
import toast, { ToastPosition, Toaster } from 'react-hot-toast'
import { validateVerificationOTP } from '../../../app/services/quoteService'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    ValidateCCFOTPSchemaType,
    validateCCFOTPSchema
} from '../../models/schemas/validateCCFOTPSchema'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { HARD_CODE_VALUE } from '../../constants/hardCode'
import { FormInputText } from '../../components/common/FormInputs/FormInputText'

function QuoteOTPVerification({ params }) {
    const cancelButtonRef = useRef(null)
    let open = params.open
    let setOpen = params.setOpen
    let Proposal_ID = params.ProposalId

    //#region OTP Timer Logic
    const Ref = useRef(null)
    const [timer, setTimer] = useState('00:00')
    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date())
        const seconds = Math.floor((total / 1000) % 60)
        const minutes = Math.floor((total / 1000 / 60) % 60)
        return { total, minutes, seconds }
    }
    const startTimer = (e) => {
        let { total, minutes, seconds } = getTimeRemaining(e)
        if (total >= 0) {
            // update the timer
            // check if less than 10 then we need to
            // add '0' at the beginning of the variable
            setTimer(
                (minutes > 9 ? minutes : '0' + minutes) +
                    ':' +
                    (seconds > 9 ? seconds : '0' + seconds)
            )
        } else {
            params.setTimerComplete(true)
        }
    }
    const clearTimer = (e) => {
        // If you adjust it you should also need to
        // adjust the Endtime formula we are about
        // to code next
        setTimer('00:' + HARD_CODE_VALUE.timerDurationInSec)

        // If you try to remove this line the
        // updating of timer Variable will be
        // after 1000ms or 1sec
        if (Ref.current) clearInterval(Ref.current)
        const id = setInterval(() => {
            startTimer(e)
        }, 1000)
        Ref.current = id
    }
    const getDeadTime = () => {
        let deadline = new Date()
        // This is where you need to adjust if
        // you entend to add more time
        deadline.setSeconds(
            deadline.getSeconds() + HARD_CODE_VALUE.timerDurationInSec
        )
        return deadline
    }
    //#endregion

    //#region OTP Resend Logic
    const ResendOTP = () => {
        params.confirmQuotes()
        clearTimer(getDeadTime())
    }
    //#endregion

    //#region OTP Verification & Validation Part
    const objValidateOTP = new ValidateCustomerConsent()
    const [otpDetails, setOTPDetails] = useState(objValidateOTP)
    const handleOTPChange = (event: any) => {
        const { target } = event
        const { maxLength, name, value } = target
        setOTPDetails({ ...otpDetails, [name]: value })

        const [fieldName, fieldIndex] = event.target.id.split('-')
        let fieldIntIndex = parseInt(fieldIndex, 10)

        // Check if no of char in field == maxlength
        if (value.length >= maxLength) {
            // It should not be last input field
            if (fieldIntIndex < 4) {
                // Get the next input field using it's name
                const nextfield = document.querySelector(
                    `input[id=Digit-${fieldIntIndex + 1}]`
                )
                // If found, focus the next field
                if (nextfield !== null) {
                    nextfield.focus()
                }
            }
        }
    }

    const closeOTPPopUp = () => {
        params.setTimerComplete(false)
        reset({ Digit1: '', Digit2: '', Digit3: '', Digit4: '' })
        setOTPDetails({
            ...otpDetails,
            ...{ Digit1: 0, Digit2: 0, Digit3: 0, Digit4: 0 }
        })
        setOpen(false)
    }
    const {
        handleSubmit,
        control,
        setFocus,
        register,
        formState: { errors },
        setValue,
        setError,
        reset
    } = useForm<ValidateCCFOTPSchemaType>({
        mode: 'all',
        resolver: zodResolver(validateCCFOTPSchema)
    })
    const onSubmit: SubmitHandler<ValidateCCFOTPSchemaType> = async (data) => {
        otpDetails.ProposalId = Proposal_ID
        otpDetails.Otp =
            otpDetails.Digit1 +
            otpDetails.Digit2 +
            otpDetails.Digit3 +
            otpDetails.Digit4

        let status = await validateVerificationOTP(otpDetails)
        if (status.Flag === 1) {
            reset({ Digit1: '', Digit2: '', Digit3: '', Digit4: '' })
            setOTPDetails({
                ...otpDetails,
                ...{ Digit1: 0, Digit2: 0, Digit3: 0, Digit4: 0 }
            })
            setOpen(false)
            toast.success(status.Message)
        } else if (status.Flag == 0) {
            reset({ Digit1: '', Digit2: '', Digit3: '', Digit4: '' })
            setOTPDetails({
                ...otpDetails,
                ...{ Digit1: 0, Digit2: 0, Digit3: 0, Digit4: 0 }
            })
            setOpen(true)
            toast.error(status.Message)
        }
    }
    useEffect(() => {
        const firstError = Object.keys(errors).reduce((field, a) => {
            return !!errors[field] ? field : a
        }, null)
        console.log(control._fields[firstError])
        if (firstError) {
            ;(
                document.querySelector(
                    `input[name="${firstError}"]`
                ) as HTMLInputElement | null
            )?.focus()
        }
    }, [errors, setFocus])

    useEffect(() => {
        clearTimer(getDeadTime())
    }, [open])
    //#endregion

    return (
        <>
            <Transition.Root show={open} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    initialFocus={cancelButtonRef}
                    static
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
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="bg-white ">
                                            <div className="sm:flex sm:items-start">
                                                <div className=" text-center  sm:mt-0 sm:text-left">
                                                    <Dialog.Title className="text-base flex mb-0 px-5 pt-4 pb-2 justify-between font-semibold leading-6 text-gray-900 VerificationText">
                                                        <Typography>
                                                            &nbsp;
                                                        </Typography>
                                                        <span className="text-left sm:ml-12 sm:mt-0 sm:text-left">
                                                            <Button
                                                                color="error"
                                                                onClick={
                                                                    closeOTPPopUp
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
                                                    <div className="mt-0 px-9">
                                                        <Typography
                                                            sx={{
                                                                fontSize:
                                                                    '1.3rem',
                                                                fontWeight:
                                                                    '500'
                                                            }}
                                                        >
                                                            OTP Verification
                                                        </Typography>
                                                        <p className="text-sm mt-4 text-gray-500">
                                                            Enter OTP
                                                        </p>
                                                    </div>
                                                    <Box
                                                        sx={{
                                                            flexGrow: '1',
                                                            padding: '0rem 36px'
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
                                                                md={3}
                                                            >
                                                                <FormInputText
                                                                    control={
                                                                        control
                                                                    }
                                                                    name="Digit1"
                                                                    id="Digit-1"
                                                                    onChangeFn={
                                                                        handleOTPChange
                                                                    }
                                                                    label=""
                                                                    placeholder="0"
                                                                    inputProps={{
                                                                        maxLength: 1
                                                                    }}
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
                                                                    name="Digit2"
                                                                    id="Digit-2"
                                                                    onChangeFn={
                                                                        handleOTPChange
                                                                    }
                                                                    label=""
                                                                    placeholder="0"
                                                                    inputProps={{
                                                                        maxLength: 1
                                                                    }}
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
                                                                    name="Digit3"
                                                                    id="Digit-3"
                                                                    onChangeFn={
                                                                        handleOTPChange
                                                                    }
                                                                    label=""
                                                                    placeholder="0"
                                                                    inputProps={{
                                                                        maxLength: 1
                                                                    }}
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
                                                                    name="Digit4"
                                                                    id="Digit-4"
                                                                    onChangeFn={
                                                                        handleOTPChange
                                                                    }
                                                                    label=""
                                                                    placeholder="0"
                                                                    inputProps={{
                                                                        maxLength: 1
                                                                    }}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                        <Grid
                                                            container
                                                            spacing={2}
                                                            sx={{
                                                                mt: 0.5,
                                                                display: 'flex',
                                                                alignItems:
                                                                    'center'
                                                            }}
                                                        >
                                                            <Grid
                                                                item
                                                                xs={4}
                                                                md={3}
                                                            >
                                                                <p className="my-4 text-[#898E96] ">
                                                                    {timer}
                                                                </p>
                                                            </Grid>
                                                            {params.timerComplete && (
                                                                <Grid
                                                                    item
                                                                    xs={8}
                                                                    md={9}
                                                                    sx={{
                                                                        textAlign:
                                                                            'right'
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        variant="body2"
                                                                        color="textSecondary"
                                                                    >
                                                                        Didn't
                                                                        Receive
                                                                        OTP ?
                                                                        <Button
                                                                            onClick={
                                                                                ResendOTP
                                                                            }
                                                                        >
                                                                            Resend
                                                                        </Button>
                                                                    </Typography>
                                                                </Grid>
                                                            )}
                                                        </Grid>
                                                    </Box>
                                                </div>
                                            </div>
                                            <div className="pt-0 pr-9 pb-9 pl-9">
                                                <Box textAlign="left">
                                                    <Button
                                                        variant="contained"
                                                        type="submit"
                                                    >
                                                        Submit OTP
                                                    </Button>
                                                </Box>
                                            </div>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}
export default QuoteOTPVerification
