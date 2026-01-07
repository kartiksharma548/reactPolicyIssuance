import * as React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import {
    Checkbox,
    Divider,
    FormControlLabel,
    Grid,
    Stack,
    Paper
} from '@mui/material'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { blue } from '@mui/material/colors'
import ControlledCheckbox from '../common/standaloneCheckbox'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { update } from '../../redux/features/policy/policySlice'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { QuoteUpdationModel } from '../../models/types/Quotations/quoteUpdationType'
import { saveQuoteProposalForIC } from '../../services/quoteService'
import { styled } from '@mui/material/styles'
import PremiumBreakup from './premiumBreakup'
import { BasePath } from '../../constants/baseURL'
import { AuthModel } from '../../redux/features/auth/authInterface'
import { useMemo } from 'react'
import VerifiedIcon from '@mui/icons-material/Verified'
import WifiIcon from '@mui/icons-material/Wifi'
import WifiOffIcon from '@mui/icons-material/WifiOff'
import { encrypt } from '../../utils/encryption'

export default function QuoteGrid({
    quote,
    state,
    dispatch,
    ProposalId,
    proposalModel,
    set,
    set1,
    callFromCustomer,
    addOns,
    isPreferredQuote
}: any) {
    const dispatchStore = useAppDispatch()
    const navigate = useNavigate()
    const [showPremBreakup, setShowPremBreakup] = React.useState(false)
    const [toggleProvidedAddon, setToggleProvidedAddon] = React.useState(true)
    const [toggleNotProvidedAddon, setToggleNotProvidedAddon] =
        React.useState(true)
    const [providedAddonLength, setProvidedAddonLength] = React.useState(2)
    const [notProvidedAddonLength, setNotProvidedAddonLength] =
        React.useState(2)

    function handleICCheckedChange(quote: any, check: boolean): void {
        dispatch({ type: 'setCheckedQuotations', value: { quote, check } })
    }
    const handleICSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        set1({ ...set, [event.target.name]: event.target.value })
    }

    let checked: boolean
    checked =
        state.checkedQuotations.findIndex(
            (x: any) => x.PRODUCTID == quote['PRODUCTID']
        ) > -1
            ? true
            : false
    async function buyNow(quote: any) {
        let quoteModel: QuoteUpdationModel = {
            ProposalId: ProposalId,
            IC: quote['PRODUCTID']
        }

        let { ErrorCode } = await saveQuoteProposalForIC(quoteModel)
        if (ErrorCode == 1) {
            let obj = {
                ProposalId: ProposalId,
                SelectedIC: quote['PRODUCTID']
            }

            dispatchStore(update(obj))

            navigate({
                pathname: '/ProposerDetails/',
                search: createSearchParams({
                    ProposalId: encrypt(ProposalId.toString())
                }).toString()
            })
        }
    }

    const [isShowBuyButton, setShowBuyButton] = React.useState(callFromCustomer)

    const calculateNotProvidedAddons = () => {
        const checkedAddons = addOns?.filter((x) => {
            return x.isChecked
        })
        const addOnProvided =
            quote['AddOnPremium'].length > 0 ? quote['AddOnPremium'] : []

        if (addOnProvided.length > 1) {
            setNotProvidedAddonLength(0)
        }

        let addOnNotProvided = []

        if (addOnProvided?.length > 0) {
            checkedAddons?.forEach((element) => {
                if (
                    addOnProvided?.findIndex(
                        (x) => x.FK_LKP_ADDON_TYPE == element.AddOnTypeId
                    ) < 0
                ) {
                    addOnNotProvided.push(element.AddOnName)
                }
            })
        } else if (checkedAddons?.length > 0 && addOnProvided?.length == 0) {
            checkedAddons?.forEach((element) => {
                addOnNotProvided.push(element.AddOnName)
            })
        }

        return addOnNotProvided
    }

    const cachedCalculation = useMemo(() => {
        return calculateNotProvidedAddons()
    }, [addOns, quote])

    const addOnsNotProvided = cachedCalculation
    const calculateAddonsProvidedChange = (length) => {
        setToggleProvidedAddon(!toggleProvidedAddon)
        setProvidedAddonLength(length)
    }

    const calculateAddonsNotProvidedChange = (length) => {
        setToggleNotProvidedAddon(!toggleNotProvidedAddon)
        if (quote['AddOnPremium'].length > 1 && length == 2 && !toggleNotProvidedAddon) length = 0
        else length = addOnsNotProvided.length
        setNotProvidedAddonLength(length)
    }
    const card = (
        <Box sx={{ width: '100%', flexGrow: 1 }} className="GridView">
            <Stack direction="column" spacing={8}>
                <Grid item className="IC">
                    {callFromCustomer && (
                        <div className="flex flex-col items-left radiofixedButton">
                            <RadioGroup
                                row
                                aria-labelledby="not-interested"
                                name="ProductId"
                                id="ProductId"
                                value={set.ProductId}
                                onChange={handleICSelection}
                            >
                                <FormControlLabel
                                    style={{ fontSize: 11 }}
                                    value={quote['PRODUCTID']}
                                    control={<Radio />}
                                    label=""
                                />
                            </RadioGroup>
                        </div>
                    )}
                    <div className="absolute top-0 p-2 w-full">
                        <div className="flex justify-between items-center">
                            {!callFromCustomer && isPreferredQuote && (
                                <VerifiedIcon />
                            )}
                            {!callFromCustomer &&
                                (quote.IsOnlineQuote == 1 ? (
                                    <span
                                        className="right-0"
                                        style={{
                                            marginLeft: 'auto',
                                            color: 'blue',
                                            paddingRight: '5px'
                                        }}
                                    >
                                        <WifiIcon />
                                    </span>
                                ) : (
                                    <span
                                        className="right-0"
                                        style={{
                                            marginLeft: 'auto',
                                            color: 'red',
                                            paddingRight: '5px'
                                        }}
                                    >
                                        <WifiOffIcon />
                                    </span>
                                ))}
                        </div>
                    </div>
                    {/* <div className="flex flex-row items-left absolute top-0 left-0 p-1">
                        {isPreferredQuote && <VerifiedIcon />}
                        </div> */}
                    <div className="flex gap-2 flex-col items-center mt-1.5">
                        <div className="imageBox">
                            <Box
                                component="img"
                                p={2}
                                borderColor={blue}
                                src={
                                    BasePath +
                                    '/Images/Product/' +
                                    quote['PROD_LOGO_PATH']
                                }
                            />
                        </div>
                        <span className="ICName !text-[14px] mt-[4px]">
                            {/* {quote['PRODUCT_NAME']} */}
                            {quote['IC_SHORTNAME'] ?? quote['PRODUCT_NAME']}
                        </span>
                        <Box
                            sx={{
                                flexDirection: 'row',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {/* <span>
                                <svg
                                    width="89"
                                    height="16"
                                    viewBox="0 0 89 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g clipPath="url(#clip0_1516_15373)">
                                        <path
                                            d="M8.49999 11.5135L11.2667 13.1868C11.7733 13.4935 12.3933 13.0402 12.26 12.4668L11.5267 9.32017L13.9733 7.20017C14.42 6.8135 14.18 6.08017 13.5933 6.0335L10.3733 5.76017L9.11332 2.78684C8.88665 2.24684 8.11332 2.24684 7.88665 2.78684L6.62665 5.7535L3.40665 6.02684C2.81999 6.0735 2.57999 6.80684 3.02665 7.1935L5.47332 9.3135L4.73999 12.4602C4.60665 13.0335 5.22665 13.4868 5.73332 13.1802L8.49999 11.5135Z"
                                            fill="#EAC541"
                                        />
                                    </g>
                                    <g clipPath="url(#clip1_1516_15373)">
                                        <path
                                            d="M26.5 11.5135L29.2667 13.1868C29.7733 13.4935 30.3933 13.0402 30.26 12.4668L29.5267 9.32017L31.9733 7.20017C32.42 6.8135 32.18 6.08017 31.5933 6.0335L28.3733 5.76017L27.1133 2.78684C26.8867 2.24684 26.1133 2.24684 25.8867 2.78684L24.6267 5.7535L21.4067 6.02684C20.82 6.0735 20.58 6.80684 21.0267 7.1935L23.4733 9.3135L22.74 12.4602C22.6067 13.0335 23.2267 13.4868 23.7333 13.1802L26.5 11.5135Z"
                                            fill="#EAC541"
                                        />
                                    </g>
                                    <g clipPath="url(#clip2_1516_15373)">
                                        <path
                                            d="M44.5 11.5135L47.2667 13.1868C47.7733 13.4935 48.3933 13.0402 48.26 12.4668L47.5267 9.32017L49.9733 7.20017C50.42 6.8135 50.18 6.08017 49.5933 6.0335L46.3733 5.76017L45.1133 2.78684C44.8867 2.24684 44.1133 2.24684 43.8867 2.78684L42.6267 5.7535L39.4067 6.02684C38.82 6.0735 38.58 6.80684 39.0267 7.1935L41.4733 9.3135L40.74 12.4602C40.6067 13.0335 41.2267 13.4868 41.7333 13.1802L44.5 11.5135Z"
                                            fill="#EAC541"
                                        />
                                    </g>
                                    <g clipPath="url(#clip3_1516_15373)">
                                        <path
                                            d="M62.5 11.5135L65.2667 13.1868C65.7733 13.4935 66.3933 13.0402 66.26 12.4668L65.5267 9.32017L67.9733 7.20017C68.42 6.8135 68.18 6.08017 67.5933 6.0335L64.3733 5.76017L63.1133 2.78684C62.8867 2.24684 62.1133 2.24684 61.8867 2.78684L60.6267 5.7535L57.4067 6.02684C56.82 6.0735 56.58 6.80684 57.0267 7.1935L59.4733 9.3135L58.74 12.4602C58.6067 13.0335 59.2267 13.4868 59.7333 13.1802L62.5 11.5135Z"
                                            fill="#EAC541"
                                        />
                                    </g>
                                    <g clipPath="url(#clip4_1516_15373)">
                                        <path
                                            d="M85.6 6.02667L82.3733 5.74667L81.1133 2.78C80.8867 2.24 80.1133 2.24 79.8867 2.78L78.6267 5.75333L75.4067 6.02667C74.82 6.07333 74.58 6.80667 75.0267 7.19333L77.4733 9.31333L76.74 12.46C76.6067 13.0333 77.2267 13.4867 77.7333 13.18L80.5 11.5133L83.2667 13.1867C83.7733 13.4933 84.3933 13.04 84.26 12.4667L83.5267 9.31333L85.9733 7.19333C86.42 6.80667 86.1867 6.07333 85.6 6.02667ZM80.5 10.2667V4.06667L81.64 6.76L84.56 7.01333L82.3467 8.93333L83.0133 11.7867L80.5 10.2667Z"
                                            fill="#EAC541"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1516_15373">
                                            <rect
                                                width="16"
                                                height="16"
                                                fill="white"
                                                transform="translate(0.5)"
                                            />
                                        </clipPath>
                                        <clipPath id="clip1_1516_15373">
                                            <rect
                                                width="16"
                                                height="16"
                                                fill="white"
                                                transform="translate(18.5)"
                                            />
                                        </clipPath>
                                        <clipPath id="clip2_1516_15373">
                                            <rect
                                                width="16"
                                                height="16"
                                                fill="white"
                                                transform="translate(36.5)"
                                            />
                                        </clipPath>
                                        <clipPath id="clip3_1516_15373">
                                            <rect
                                                width="16"
                                                height="16"
                                                fill="white"
                                                transform="translate(54.5)"
                                            />
                                        </clipPath>
                                        <clipPath id="clip4_1516_15373">
                                            <rect
                                                width="16"
                                                height="16"
                                                fill="white"
                                                transform="translate(72.5)"
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </span> */}
                            {/* <span className="StarRatings ml-1 font-semibold	">
                                (Ratings 4.7/5.0)
                            </span> */}
                        </Box>
                    </div>
                    <Stack direction="column" alignItems="center">
                        <Stack sx={{ flexGrow: '1' }}>
                            <Stack
                                sx={{
                                    flexGrow: 1,
                                    flexDirection: 'row',
                                    marginTop: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <span className="flex flex-row items-center pr-1">
                                    {showPremBreakup && (
                                        <PremiumBreakup
                                            quote={quote}
                                            open={showPremBreakup}
                                            setOpen={setShowPremBreakup}
                                            callFromCustomer={isShowBuyButton}
                                            proposalModel={proposalModel}
                                        />
                                    )}
                                </span>

                                <span
                                    className="flex flex-row items-center pl-1 cursor-pointer"
                                >
                                    <svg
                                        width="14"
                                        height="15"
                                        viewBox="0 0 14 15"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g clipPath="url(#clip0_1516_15285)">
                                            <path
                                                d="M12.25 1.78904C12.1742 1.78904 12.0983 1.8182 12.0458 1.87654L11.585 2.33737C11.4683 2.45404 11.2875 2.45404 11.1708 2.33737L10.71 1.87654C10.5933 1.75987 10.4125 1.75987 10.2958 1.87654L9.835 2.33737C9.71833 2.45404 9.5375 2.45404 9.42083 2.33737L8.96 1.87654C8.84333 1.75987 8.6625 1.75987 8.54583 1.87654L8.085 2.33737C7.96833 2.45404 7.7875 2.45404 7.67083 2.33737L7.21 1.87654C7.09333 1.75987 6.9125 1.75987 6.79583 1.87654L6.335 2.33737C6.21833 2.45404 6.0375 2.45404 5.92083 2.33737L5.45417 1.8707C5.3375 1.75404 5.15667 1.75404 5.04 1.8707L4.57917 2.33737C4.4625 2.45404 4.28167 2.45404 4.165 2.33737L3.70417 1.8707C3.5875 1.75404 3.40667 1.75404 3.29 1.8707L2.82917 2.33737C2.7125 2.45404 2.53167 2.45404 2.415 2.33737L1.95417 1.8707C1.90167 1.8182 1.82583 1.78904 1.75 1.78904V13.2165C1.82583 13.2165 1.90167 13.1874 1.95417 13.129L2.415 12.6682C2.53167 12.5515 2.7125 12.5515 2.82917 12.6682L3.29 13.129C3.40667 13.2457 3.5875 13.2457 3.70417 13.129L4.165 12.6682C4.28167 12.5515 4.4625 12.5515 4.57917 12.6682L5.04 13.129C5.15667 13.2457 5.3375 13.2457 5.45417 13.129L5.915 12.6682C6.03167 12.5515 6.2125 12.5515 6.32917 12.6682L6.79 13.129C6.90667 13.2457 7.0875 13.2457 7.20417 13.129L7.665 12.6682C7.78167 12.5515 7.9625 12.5515 8.07917 12.6682L8.54 13.129C8.65667 13.2457 8.8375 13.2457 8.95417 13.129L9.415 12.6682C9.53167 12.5515 9.7125 12.5515 9.82917 12.6682L10.29 13.129C10.4067 13.2457 10.5875 13.2457 10.7042 13.129L11.165 12.6682C11.2817 12.5515 11.4625 12.5515 11.5792 12.6682L12.04 13.129C12.0983 13.1874 12.1742 13.2165 12.2442 13.2165V1.78904H12.25ZM9.91667 10.4165H4.08333C3.7625 10.4165 3.5 10.154 3.5 9.8332C3.5 9.51237 3.7625 9.24987 4.08333 9.24987H9.91667C10.2375 9.24987 10.5 9.51237 10.5 9.8332C10.5 10.154 10.2375 10.4165 9.91667 10.4165ZM9.91667 8.0832H4.08333C3.7625 8.0832 3.5 7.8207 3.5 7.49987C3.5 7.17904 3.7625 6.91654 4.08333 6.91654H9.91667C10.2375 6.91654 10.5 7.17904 10.5 7.49987C10.5 7.8207 10.2375 8.0832 9.91667 8.0832ZM9.91667 5.74987H4.08333C3.7625 5.74987 3.5 5.48737 3.5 5.16654C3.5 4.8457 3.7625 4.5832 4.08333 4.5832H9.91667C10.2375 4.5832 10.5 4.8457 10.5 5.16654C10.5 5.48737 10.2375 5.74987 9.91667 5.74987Z"
                                                fill="#22334F"
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_1516_15285">
                                                <rect
                                                    width="14"
                                                    height="14"
                                                    fill="white"
                                                    transform="translate(0 0.5)"
                                                />
                                            </clipPath>
                                        </defs>
                                    </svg>

                                    <span
                                        className="text-sm ml-1 underline"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setShowPremBreakup(true)
                                        }}
                                    >
                                        Premium Breakup
                                    </span>
                                    {showPremBreakup && (
                                        <PremiumBreakup
                                            quote={quote}
                                            open={showPremBreakup}
                                            setOpen={setShowPremBreakup}
                                            callFromCustomer={isShowBuyButton}
                                            proposalModel={proposalModel}
                                        />
                                    )}
                                </span>
                            </Stack>
                            <Stack
                                sx={{ flexGrow: 1, flexDirection: 'column' }}
                            >
                                {callFromCustomer == true ||
                                    proposalModel?.IsSendQuoteEnable == 1 ? (
                                    <>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                marginTop: '10px',
                                                borderRadius: '8px'
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <Stack
                                                alignItems="center"
                                                padding="3px 0"
                                            >
                                                {/* <label className="text-xl font-bold text-white">
                                                    <span>&#8377;</span>{' '}
                                                    {quote['GROSS_PREM']}{' '}
                                                </label>
                                                <label className="text-sm  text-white leading-4 pl-2">
                                                    {' '}
                                                </label> */}
                                                <div className="flex flex-col quotation-buynow-btn">
                                                    <div>
                                                        <label className="text-xl font-semibold text-white">
                                                            <span className="font-normal">
                                                                &#8377;
                                                            </span>{' '}
                                                            {
                                                                quote[
                                                                'GROSS_PREM'
                                                                ]
                                                            }{' '}
                                                        </label>
                                                        <label className="text-sm text-white leading-4 pl-2">
                                                            {' '}
                                                        </label>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-light text-white leading-4 pl-2">
                                                            {/* <span>BUY NOW</span> */}
                                                        </label>
                                                    </div>
                                                </div>
                                            </Stack>
                                        </Button>
                                        {proposalModel && proposalModel.Vehicle_Type == 'GCV' ? (
                                            <p className="text-sm gstText text-center mt-2">
                                                (Incl. {quote['TOTAL_TPGST_PER']}% of Basic TP + {quote['TOTAL_ODGST_PER']}% of rest of Premium-{' '}
                                                <span>&#8377;</span>
                                                <span>
                                                    {quote['TOTALGSTPREMIUM']}
                                                </span>
                                                )
                                            </p>
                                        ) : (
                                            <p className="text-sm gstText text-center mt-2">
                                                (Incl. {quote['TOTALGST_PER']}% GST-{' '}
                                                <span>&#8377;</span>
                                                <span>
                                                    {quote['TOTALGSTPREMIUM']}
                                                </span>
                                                )
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                marginTop: '10px',
                                                borderRadius: '8px'
                                            }}
                                            className="cursor-pointer"
                                            onClick={() => buyNow(quote)}
                                        >
                                            <Stack
                                                alignItems="center"
                                                padding="6px 0"
                                            >
                                                {/* <label className="text-xl font-semibold text-white">
                                                    <span className="font-normal">&#8377;</span>{' '}
                                                    {quote['GROSS_PREM']}{' '}
                                                </label>
                                                <label className="text-sm font-light text-white leading-4 pl-2">
                                                    {' '}
                                                    Buy Now{' '}
                                                </label> */}
                                                <div className="flex flex-col quotation-buynow-btn">
                                                    <div>
                                                        <label className="text-xl font-semibold text-white">
                                                            <span className="font-normal">
                                                                &#8377;
                                                            </span>{' '}
                                                            {
                                                                quote[
                                                                'GROSS_PREM'
                                                                ]
                                                            }{' '}
                                                        </label>
                                                        <label className="text-sm text-white leading-4 pl-2">
                                                            {' '}
                                                        </label>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-light text-white leading-4 pl-2">
                                                            <span>BUY NOW</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </Stack>
                                        </Button>
                                        {proposalModel && proposalModel.Vehicle_Type == 'GCV' ? (
                                            <p className="text-sm gstText text-center mt-2">
                                                (Incl. {quote['TOTAL_TPGST_PER']}% of Basic TP + {quote['TOTAL_ODGST_PER']}% of rest of Premium-{' '}
                                                <span>&#8377;</span>
                                                <span>
                                                    {quote['TOTALGSTPREMIUM']}
                                                </span>
                                                )
                                            </p>
                                        ) : (
                                            <p className="text-sm gstText text-center mt-2">
                                                (Incl. {quote['TOTALGST_PER']}% GST-{' '}
                                                <span>&#8377;</span>
                                                <span>
                                                    {quote['TOTALGSTPREMIUM']}
                                                </span>
                                                )
                                            </p>
                                        )}
                                    </>
                                )}
                            </Stack>
                            <Stack>
                                <label className="font-semibold"></label>
                                <label className="flex font-semibold my-2 items-center justify-center">
                                    <>
                                        <span className="pr-2">
                                            <svg
                                                width="20"
                                                height="21"
                                                viewBox="0 0 20 21"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <g clipPath="url(#clip0_1516_15292)">
                                                    <path
                                                        d="M17.7417 5.40817L9.40833 13.7415C9.08333 14.0665 8.55833 14.0665 8.23333 13.7415L5.875 11.3832C5.55 11.0582 5.55 10.5332 5.875 10.2082C6.2 9.88317 6.725 9.88317 7.05 10.2082L8.81667 11.9748L16.5583 4.23317C16.8833 3.90817 17.4083 3.90817 17.7333 4.23317C18.0667 4.55817 18.0667 5.08317 17.7417 5.40817ZM10 17.1665C6.075 17.1665 2.93333 13.7582 3.375 9.74983C3.7 6.8165 5.975 4.40817 8.88333 3.92483C10.3917 3.67483 11.825 3.9415 13.0417 4.57483C13.3667 4.7415 13.7583 4.68317 14.0167 4.42483C14.4167 4.02483 14.3167 3.34983 13.8167 3.0915C12.5917 2.4665 11.2083 2.12483 9.73333 2.1665C5.45 2.29983 1.89167 5.78317 1.675 10.0582C1.43333 14.8665 5.25 18.8332 10 18.8332C11 18.8332 11.95 18.6582 12.8417 18.3332C13.4083 18.1248 13.5667 17.3915 13.1333 16.9582C12.9083 16.7332 12.5667 16.6498 12.2667 16.7665C11.5583 17.0248 10.7917 17.1665 10 17.1665ZM15.8333 12.9998H14.1667C13.7083 12.9998 13.3333 13.3748 13.3333 13.8332C13.3333 14.2915 13.7083 14.6665 14.1667 14.6665H15.8333V16.3332C15.8333 16.7915 16.2083 17.1665 16.6667 17.1665C17.125 17.1665 17.5 16.7915 17.5 16.3332V14.6665H19.1667C19.625 14.6665 20 14.2915 20 13.8332C20 13.3748 19.625 12.9998 19.1667 12.9998H17.5V11.3332C17.5 10.8748 17.125 10.4998 16.6667 10.4998C16.2083 10.4998 15.8333 10.8748 15.8333 11.3332V12.9998Z"
                                                        fill="#23C565"
                                                    />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_1516_15292">
                                                        <rect
                                                            width="20"
                                                            height="20"
                                                            fill="white"
                                                            transform="translate(0 0.5)"
                                                        />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </span>
                                        <span>
                                            {addOns?.filter((x) => {
                                                return x.isChecked
                                            }).length > 0
                                                ? `Addons - Offered(${quote['AddOnPremium'].length})/Not Offered(${addOnsNotProvided.length})`
                                                : 'Selected Addons'}{' '}
                                        </span>{' '}
                                        {/* <span>
                                            ({quote['AddOnPremium'].length})
                                        </span> */}
                                    </>
                                </label>

                                {quote['AddOnPremium'].map(
                                    (addOn: any, index: number) => {
                                        if (index < providedAddonLength) {
                                            return (
                                                <>
                                                    <Stack
                                                        direction={'row'}
                                                        alignItems={'center'}
                                                    >
                                                        <Typography className="text-sm whitespace-nowrap pr-2">
                                                            {addOn['AddOnName']}
                                                        </Typography>
                                                        <hr
                                                            style={{
                                                                width: '100%',
                                                                backgroundColor:
                                                                    'rgb(89 143 193)'
                                                            }}
                                                        />
                                                        <Typography className="font-semibold text-sm whitespace-nowrap pl-2">
                                                            {
                                                                addOn[
                                                                'ADDON_PREM_AMT'
                                                                ]
                                                            }
                                                        </Typography>
                                                    </Stack>
                                                </>
                                            )
                                        }
                                    }
                                )}

                                {/* {quote['AddOnPremium'].length > 2 && (
                                    <p className="text-right">
                                        {toggleProvidedAddon ? (
                                            <a className="underline text-sm MorelessBtn cursor-pointer">
                                                +{' '}
                                                <span
                                                    className=""
                                                    onClick={() => {
                                                        calculateAddonsProvidedChange(
                                                            quote[
                                                                'AddOnPremium'
                                                            ].length
                                                        )
                                                    }}
                                                >
                                                    More
                                                </span>
                                            </a>
                                        ) : (
                                            <a className="underline text-sm MorelessBtn cursor-pointer">
                                                -{' '}
                                                <span
                                                    className=""
                                                    onClick={() => {
                                                        calculateAddonsProvidedChange(
                                                            2
                                                        )
                                                    }}
                                                >
                                                    Less
                                                </span>
                                            </a>
                                        )}
                                    </p>
                                )} */}
                            </Stack>
                            <Stack spacing={2} pt={2}>
                                {addOnsNotProvided.length > 0 && (
                                    <>
                                        {/* <span className="NoAddon flex self-center">
                                            <span className="pr-2">
                                                <svg
                                                    width="20"
                                                    height="18"
                                                    viewBox="0 0 20 18"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M13.8546 9.43912C13.3466 9.43912 12.931 9.85476 12.931 10.3628V15.1842C12.931 15.6922 12.5153 16.1078 12.0073 16.1078H2.77092C2.26292 16.1078 1.84728 15.6922 1.84728 15.1842V5.74456C1.84728 5.23655 2.26292 4.82092 2.77092 4.82092H7.38913C7.89713 4.82092 8.31277 4.40528 8.31277 3.89727C8.31277 3.38927 7.89713 2.97363 7.38913 2.97363H1.84728C0.831277 2.97363 0 3.80491 0 4.82092V15.9046C0 16.9206 0.831277 17.7519 1.84728 17.7519H12.931C13.947 17.7519 14.7783 16.9206 14.7783 15.9046V10.3628C14.7783 9.85476 14.3626 9.43912 13.8546 9.43912Z"
                                                        fill="#FF8383"
                                                    />
                                                    <path
                                                        d="M10.1601 6.66797H4.61828C4.11028 6.66797 3.69464 7.08361 3.69464 7.59161C3.69464 8.09961 4.11028 8.51525 4.61828 8.51525H10.1601C10.6681 8.51525 11.0838 8.09961 11.0838 7.59161C11.0838 7.08361 10.6681 6.66797 10.1601 6.66797Z"
                                                        fill="#FF8383"
                                                    />
                                                    <path
                                                        d="M10.1601 9.43945H4.61828C4.11028 9.43945 3.69464 9.85509 3.69464 10.3631C3.69464 10.8711 4.11028 11.2867 4.61828 11.2867H10.1601C10.6681 11.2867 11.0838 10.8711 11.0838 10.3631C11.0838 9.85509 10.6681 9.43945 10.1601 9.43945Z"
                                                        fill="#FF8383"
                                                    />
                                                    <path
                                                        d="M10.1601 12.21H4.61828C4.11028 12.21 3.69464 12.6256 3.69464 13.1336C3.69464 13.6416 4.11028 14.0572 4.61828 14.0572H10.1601C10.6681 14.0572 11.0838 13.6416 11.0838 13.1336C11.0838 12.6256 10.6681 12.21 10.1601 12.21Z"
                                                        fill="#FF8383"
                                                    />
                                                    <path
                                                        d="M16.1009 2.84714L14.7816 4.16643L13.4623 2.84714C13.1096 2.49446 12.5349 2.49446 12.1822 2.84714L12.1626 2.86674C11.8034 3.22595 11.8034 3.80069 12.1561 4.15337L13.4754 5.47266L12.1626 6.78541C11.8099 7.13809 11.8099 7.71283 12.1561 8.07205C12.1626 8.07858 12.1692 8.08511 12.1757 8.09164C12.5349 8.45085 13.1096 8.45085 13.4688 8.09164L14.7816 6.77888L16.0944 8.09164C16.447 8.44432 17.0283 8.45085 17.381 8.08511C17.3875 8.07858 17.3941 8.07205 17.4006 8.06551C17.7533 7.71283 17.7533 7.13809 17.4006 6.78541L16.0878 5.47266L17.4071 4.15337C17.7598 3.80069 17.7598 3.22595 17.4071 2.87327L17.381 2.84714C17.0283 2.49446 16.4536 2.49446 16.1009 2.84714Z"
                                                        fill="#FF8383"
                                                    />
                                                </svg>
                                            </span>
                                            <span className="flex font-semibold">
                                                {' '}
                                                AddOns Not Provided(
                                                {addOnsNotProvided.length})
                                            </span>
                                        </span> */}
                                        <Stack spacing={1}>
                                            {addOnsNotProvided.map(
                                                (addOn: any, index: number) => {
                                                    if (
                                                        index <
                                                        notProvidedAddonLength
                                                    ) {
                                                        return (
                                                            <Typography
                                                                fontSize={12}
                                                                sx={{
                                                                    textDecoration:
                                                                        'line-through',
                                                                    opacity: "0.6"
                                                                }}
                                                            >
                                                                {addOn}
                                                            </Typography>
                                                        )
                                                    }
                                                }
                                            )}
                                        </Stack>
                                    </>
                                )}
                            </Stack>
                            <Stack spacing={2} pt={1} className="lg:!hidden">
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    color="secondary"
                                    sx={{
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        boxShadow: '0px 0px 0px',
                                        border: '1px solid #ddd',
                                        textTransform: 'capitalize',
                                        '&:hover': {
                                            backgroundColor: '#fafafa', // specify the hover color for info button
                                            boxShadow: '0px 0px 0px'
                                        }
                                    }}
                                    className="!flex !justify-center !items-center"
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                sx={{
                                                    padding: '0px',
                                                    marginRight: '5px',
                                                    boxShadow: '0px 0px 0px',
                                                    '&.Mui-checked': {
                                                        color: '#22334F' // Change to your desired color
                                                    },
                                                    '& .MuiSvgIcon-root': {
                                                        width: '.8em',
                                                        height: '.8em'
                                                    }
                                                }}
                                                checked={checked}
                                                onChange={(e) =>
                                                    handleICCheckedChange(
                                                        quote,
                                                        e.target.checked
                                                    )
                                                }
                                                inputProps={{
                                                    'aria-label': 'controlled'
                                                }}
                                                color="info"
                                            />
                                        }
                                        label="Compare"
                                    />
                                </Button>
                            </Stack>
                            <Stack
                                spacing={2}
                                direction="row"
                                useFlexGap
                                className="mt-2"
                            >
                                {addOnsNotProvided.length +
                                    quote['AddOnPremium'].length >
                                    2 &&
                                    (toggleNotProvidedAddon ? (
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            color="success"
                                            sx={{
                                                border: '2px solid #23C565'
                                            }}
                                            onClick={() => {
                                                calculateAddonsNotProvidedChange(
                                                    addOnsNotProvided.length
                                                )
                                                calculateAddonsProvidedChange(
                                                    quote['AddOnPremium'].length
                                                )
                                            }}
                                        >
                                            <p className="text-right">
                                                <a className="text-sm MorelessBtn cursor-pointer">
                                                    +{' '}
                                                    <span className="underline">
                                                        More
                                                    </span>
                                                </a>
                                            </p>
                                        </Button>
                                    ) : (
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            color="success"
                                            sx={{
                                                border: '2px solid #23C565'
                                            }}
                                            onClick={() => {
                                                calculateAddonsNotProvidedChange(
                                                    2
                                                )
                                                calculateAddonsProvidedChange(2)
                                            }}
                                        >
                                            <p className="text-right">
                                                <a className="text-sm MorelessBtn cursor-pointer">
                                                    -{' '}
                                                    <span className="underline">
                                                        Less
                                                    </span>
                                                </a>
                                            </p>
                                        </Button>
                                    ))}

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    color="secondary"
                                    className="compareButton !hidden lg:!block"
                                    sx={{
                                        borderRadius: '8px',
                                        boxShadow: '0px 0px 0px',
                                        border: '1px solid #ddd',
                                        textTransform: 'capitalize',
                                        '&:hover': {
                                            backgroundColor: '#fafafa', // specify the hover color for info button
                                            boxShadow: '0px 0px 0px'
                                        }
                                    }}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                className="!flex !justify-center !items-center"
                                                sx={{
                                                    padding: '0px',
                                                    marginRight: '5px',
                                                    boxShadow: '0px 0px 0px',
                                                    '&.Mui-checked': {
                                                        color: '#22334F' // Change to your desired color
                                                    },
                                                    '& .MuiSvgIcon-root': {
                                                        width: '.8em',
                                                        height: '.8em'
                                                    }
                                                }}
                                                checked={checked}
                                                onChange={(e) =>
                                                    handleICCheckedChange(
                                                        quote,
                                                        e.target.checked
                                                    )
                                                }
                                                inputProps={{
                                                    'aria-label': 'controlled'
                                                }}
                                                color="info"
                                            />
                                        }
                                        label="Compare"
                                    />
                                </Button>
                            </Stack>
                        </Stack>
                    </Stack>
                </Grid>
            </Stack>
        </Box>
    )

    return (
        <Card variant="outlined" className="PolicyListing">
            {card}
        </Card>
    )
}
