import * as React from 'react'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Grid,
    Paper,
    Stack,
    Table,
    TableCell,
    TableContainer,
    TableRow
} from '@mui/material'
import { blue } from '@mui/material/colors'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { BasePath } from '../../constants/baseURL'
import { useRef } from 'react'
import { CustomerQuotationNavBar } from '../sideBarContent/topBar'
import { generateQuoteComparisonPDF } from '../../services/policyServices/quoteService'
import toast, { ToastPosition, Toaster } from 'react-hot-toast'
import { BaseReactAppUrl } from '../../constants/baseURL'
import DownloadIcon from '@mui/icons-material/Download'
import BackDropLoader from '../common/backDropLoading'
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(8)
    },
    '& .MuiAccordionSummary-root': {
        minHeight: 36,
        height: 36
    },
    '& .MuiAccordionSummary-root.Mui-expanded': {
        minHeight: 36,
        height: 36
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1)
    }
}))

export default function CompareQuotes({
    openPopup,
    setOpenPopup,
    selectedIcs,
    checkedAddons,
    callFromCustomer,
    proposalData
}: any) {
    const handleClose = () => {
        setOpenPopup(false)
    }
    const [showLoading, setShowLoading] = React.useState(false)
    const compareIcs = selectedIcs as Array<any>
    const comparedIcsArray = useRef<number[]>([])
    const [showMore, setShowMore] = React.useState(true)
    const [countState, setCountState] = React.useState({
        PA_COUNT: 0,
        LL_EMP_COUNT: 0,
        PA_AMOUNT: 0
    })

    comparedIcsArray.current = compareIcs.map((x) => {
        return x.PRODUCTID
    })

    const row1 = [
        {
            key: 'Basic Own Damage Premium',
            value: 'TOTAL_DISC_PREM'
        },
        {
            key: 'Electrical Accessories',
            value: 'BASIC_PREM_ELECT_ACC'
        },
        {
            key: 'Non-Electrical Accessories',
            value: 'BASIC_PREM_NONELECT_ACC'
        },
        {
            key: 'Bi-Fuel Kit',
            value: 'BIFUELKIT_PREMIUM'
        },
        {
            key: 'Geo-Graphical Area Extension (IMT-1)',
            value: 'PREM_GEOGRAPH_EXT'
        },
        {
            key: 'IMT 23',
            value: 'IMT23PREMIUM'
        },
        {
            key: 'Net Own Damage Premium',
            value: 'NET_ODP_A'
        }
    ]
    const row2 = [
        {
            key: 'Basic Third Party Liability Premium (Including TPPD)',
            value: 'TPPD_LIAB_PREM'
        },
        {
            key: 'Third Party Liability For Bi-Fuel Kit',
            value: 'BIFUEL_TP_PREMIUM'
        },
        {
            key: 'Third Party Liability For Geo-Graphical Area Extension (IMT-1)',
            value: 'GEOAREAEXT_TP_PREMIUM'
        },
        {
            key: 'PA Cover For Paid Driver',
            value: 'PA_PAID_DRIVER'
        },
        {
            key: 'PA Cover Un-named Passenger',
            value: 'PA_UNNAMED_PERSON'
        },
        {
            key: 'PA Conuctor',
            value: 'PA_CONDUCTOR'
        },
        {
            key: 'PA Cleaner',
            value: 'PA_CLEANER'
        },
        {
            key: 'PA Helper',
            value: 'PA_HELPER'
        },
        {
            key: 'Compulsory PA Cover For Owner Driver',
            value: 'PA_OWNER_DRIVER'
        },
        {
            key: 'Legal Liability Paid Driver',
            value: 'LLIAB_PAID_DRIVER'
        },
        {
            key: 'Legal Liability Employees',
            value: 'LLIAB_EMPLOYEE'
        },
        {
            key: 'Legal Liability Conuctor',
            value: 'LLAB_CONDUCTOR'
        },
        {
            key: 'Legal Liability Cleaner',
            value: 'LLAB_CLEANER'
        },
        {
            key: 'Legal Liability Helper',
            value: 'LLAB_HELPER'
        },
        {
            key: 'Legal Liability NFPP',
            value: 'LLAB_NFPP'
        },
        {
            key: 'Net Liability Premium (B)',
            value: 'NET_LIAB_PREM_B'
        }
    ]

    const row4 = [
        
        {
            key: 'Discount Deductible',
            value: 'DISC_TOTAL'
        },
        {
            key: 'Handicapped Discount',
            value: 'HANDICAPPEDDISC_AMT'
        },
        {
            key: 'AA Membership',
            value: 'DISC_AA_MEMB'
        },
        {
            key: 'Anti Theft (IMT-10)',
            value: 'DISC_ANTITHEFT'
        },
        {
            key: 'Voluntary Excess (IMT-22A)',
            value: 'VOLUNTARY_DISC'
        }
    ]
    const checkAddonProvided = (addonId, IC_ID) => {
        let addonFound = 0

        let addOnPrem = 0

        compareIcs.map((IC) => {
            if (IC['PRODUCTID'] == IC_ID) {
                IC['AddOnPremium'].map((addon) => {
                    if (addon['FK_LKP_ADDON_TYPE'] == addonId) {
                        addonFound = addonFound + 1
                        addOnPrem = addon['ADDON_PREM_AMT']
                    }
                    //else if (addonFound <= 0) {
                    //     addonFound = addonFound - 1
                    // }
                })
            }
        })

        if (addonFound > 0) {
            return <Typography>{addOnPrem}</Typography>
        } else {
            return <CloseIcon sx={{ color: 'red' }} />
        }
    }

    const filterAddons = () => {
        let arr: any[] = []
        checkedAddons.map((addon: any) => {
            if (addon['isChecked'] == true) {
                let obj = {
                    key: '',
                    Premium: [] as any[]
                }

                obj.key = addon['AddOnName']
                compareIcs.map((IC) => {
                    let PremiumObj = {
                        IC: 0,
                        Prem: ''
                    }
                    if (IC['AddOnPremium'].length > 0) {
                        IC['AddOnPremium'].map((ICAddOn: any) => {
                            if (
                                ICAddOn['FK_LKP_ADDON_TYPE'] ==
                                addon['AddOnTypeId']
                            ) {
                                PremiumObj.Prem = ICAddOn['ADDON_PREM_AMT']
                                PremiumObj.IC = IC['PRODUCTID']

                                obj.Premium.push(PremiumObj)
                            }
                        })
                    }
                })
                arr.push(obj)
            }
        })

        return arr
    }

    const row3 = React.useMemo(() => {
        return filterAddons()
    }, [checkedAddons, selectedIcs])

    const renderAddons = () => {
        return checkedAddons.map((row, index) => {
           
                return (
                    <Grid
                        key={index}
                        direction={'row'}
                        container
                        spacing={1}
                        className="gridRow preview-row"
                    >
                        <Grid
                            className="preview-col"
                            item
                            xs
                            sx={{
                                textAlign: 'left',
                                color: '#000',
                                fontWeight: '600'
                            }}
                        >
                            {row['AddOnName']}
                        </Grid>
                        {compareIcs.map((IC) => {
                            return (
                                <>
                                    <Grid
                                        className="preview-col"
                                        item
                                        xs
                                        sx={{
                                            textAlign: 'center'
                                        }}
                                    >
                                        {checkAddonProvided(
                                            row['AddOnTypeId'],
                                            IC['PRODUCTID']
                                        )}
                                    </Grid>
                                </>
                            )
                        })}
                    </Grid>
                )
           
        })
    }
 

    const generateQuoteComparisonPDFFN = async (data: string) => {
        setShowLoading(true)
        const HTMLString = document.getElementsByClassName(
            'compareQuotePrintableArea'
        )[0].innerHTML
        const ProposalId = compareIcs[0].ProposalId
        let object = { ProposalId: 0, HTMLString: '', IsSendDownload: '' }
        object.ProposalId = ProposalId
        object.HTMLString = HTMLString
        object.IsSendDownload = data
        const response = await generateQuoteComparisonPDF(object)
        if (response.status == 200) {
            if (response.data.StatusCode == 1) {
                toast.success(response.data.StatusMessage)
            } else if (response.data.StatusCode == 2) {
                toast.success(response.data.StatusMessage)
                downloadPDF(response.data.PdfInBase64)
            } else {
                toast.error(response.data.StatusMessage)
            }
        }
        setShowLoading(false)
    }
    let QuotationNo = ''

    if (
        selectedIcs != undefined &&
        selectedIcs != null &&
        selectedIcs.length > 0
    ) {
        QuotationNo = selectedIcs[0]['QuotationNo']
    }

    //function that will download the premium breakup pdf on customer browser
    function downloadPDF(pdf: any) {
        const linkSource = `data:application/pdf;base64,${pdf}`
        const downloadLink = document.createElement('a')
        const fileName = 'QuoteComparison.pdf'

        downloadLink.href = linkSource
        downloadLink.download = fileName
        downloadLink.click()
    }

    const getModifiedHeader = (headerObj) => {
        if (compareIcs.length > 0) {
            if (headerObj.value == 'LLIAB_EMPLOYEE')
                return (
                    headerObj.key +
                    ' (' +
                    compareIcs[0]['OTHER_EMP_COUNT'] +
                    ') '
                )
            else if (headerObj.value == 'PA_PAID_DRIVER')
                return (
                    headerObj.key +
                    ' (₹     ' +
                    compareIcs[0]['COVER_AMOUNT'] +
                    ') '
                )
            else if (headerObj.value == 'PA_UNNAMED_PERSON')
                return (
                    headerObj.key +
                    ' (' +
                    compareIcs[0]['UNNAMED_PER_COUNT'] +
                    ') '
                )
            else if (headerObj.value == 'PA_CONDUCTOR')
                return (
                    headerObj.key +
                    ' (' +
                    compareIcs[0]['PACONDUCTOR_COUNT'] +
                    ') '
                )
            else if (headerObj.value == 'PA_CLEANER')
                return (
                    headerObj.key +
                    ' (' +
                    compareIcs[0]['PACLEANER_COUNT'] +
                    ') '
                )
            else if (headerObj.value == 'PA_HELPER')
                return (
                    headerObj.key +
                    ' (' +
                    compareIcs[0]['PAHELPER_COUNT'] +
                    ') '
                )
            else if (headerObj.value == 'LLAB_CONDUCTOR')
                return (
                    headerObj.key +
                    ' (' +
                    compareIcs[0]['LLCONDUCTOR_COUNT'] +
                    ') '
                )
            else if (headerObj.value == 'LLAB_CLEANER')
                return (
                    headerObj.key +
                    ' (' +
                    compareIcs[0]['LLCLEANER_COUNT'] +
                    ') '
                )
            else if (headerObj.value == 'LLAB_HELPER')
                return (
                    headerObj.key +
                    ' (' +
                    compareIcs[0]['LLHELPER_COUNT'] +
                    ') '
                )
            else if (headerObj.value == 'LLAB_NFPP')
                return headerObj.key + ' (' + compareIcs[0]['NFPP_COUNT'] + ') '
            else if (headerObj.value == 'DISC_TOTAL')
                return 'NCB Discount' + ' (' + compareIcs[0]['NCB_SLAB_PER'] + '%) '
            
            else return headerObj.key
        } else return ''
    }
    const toPascalCase = (s: any) => {
        if (!s) return ''
        return s
            .toString()
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase()
            .split(' ')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ')
    }

    React.useEffect(() => {
        // Function to check screen size and set initial state
        const handleResize = () => {
            const isDesktop = window.innerWidth >= 768 // Adjust as per your breakpoint
            setShowMore(isDesktop) // Set initial state based on screen size
        }

        // Call handleResize initially
        handleResize()

        // Add event listener to handle window resize
        window.addEventListener('resize', handleResize)

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])
    return (
        <React.Fragment>
            <BackDropLoader openDialog={showLoading} />
            <BootstrapDialog
                className=""
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={openPopup}
                maxWidth={'xl'}
            >
                <CustomerQuotationNavBar />
                <DialogTitle
                    sx={{ m: 0, p: 8, display: 'flex', paddingBottom: '0' }}
                    id="customized-dialog-title"
                    scroll={'body'}
                >
                    <span>
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect
                                y="32"
                                width="32"
                                height="32"
                                rx="16"
                                transform="rotate(-90 0 32)"
                                fill="#22334F"
                            />
                            <g clip-path="url(#clip0_1516_19207)">
                                <path
                                    d="M14.3333 8.49967H10.1667C9.25 8.49967 8.5 9.24967 8.5 10.1663V21.833C8.5 22.7497 9.25 23.4997 10.1667 23.4997H14.3333V24.333C14.3333 24.7913 14.7083 25.1663 15.1667 25.1663C15.625 25.1663 16 24.7913 16 24.333V7.66634C16 7.20801 15.625 6.83301 15.1667 6.83301C14.7083 6.83301 14.3333 7.20801 14.3333 7.66634V8.49967ZM14.3333 20.9997H10.1667L14.3333 15.9997V20.9997ZM21.8333 8.49967H17.6667V10.1663H21C21.4583 10.1663 21.8333 10.5413 21.8333 10.9997V20.9997L17.6667 15.9997V23.4997H21.8333C22.75 23.4997 23.5 22.7497 23.5 21.833V10.1663C23.5 9.24967 22.75 8.49967 21.8333 8.49967Z"
                                    fill="white"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0_1516_19207">
                                    <rect
                                        width="20"
                                        height="20"
                                        fill="white"
                                        transform="translate(6 6)"
                                    />
                                </clipPath>
                            </defs>
                        </svg>
                    </span>
                    <div className="flex items-center w-full">
                        <span className="ml-2 text-sm md:text-lg">
                            Compare Quotes
                        </span>
                        <div className="flex ml-auto gap-2 items-center">
                            <Button
                                variant="outlined"
                                size="small"
                                color="primary"
                                sx={{
                                    marginRight: '.5rem',
                                    minWidth: 'auto',
                                    padding: '3px',
                                    border: '1px solid #DDDDDD'
                                }}
                                onClick={() =>
                                    generateQuoteComparisonPDFFN('send')
                                }
                            >
                                <svg
                                    className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-uh4ztz-MuiSvgIcon-root"
                                    focusable="false"
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    data-testid="ShareIcon"
                                    width="16"
                                    height="16"
                                >
                                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92"></path>
                                </svg>
                            </Button>

                            <Button
                                className="ml-auto"
                                variant="outlined"
                                size="small"
                                color="primary"
                                sx={{
                                    marginRight: '.5rem',
                                    minWidth: 'auto',
                                    padding: '3px',
                                    border: '1px solid #DDDDDD'
                                }}
                                onClick={() =>
                                    generateQuoteComparisonPDFFN('download')
                                }
                            >
                                <DownloadIcon
                                    width={16}
                                    height={16}
                                    sx={{
                                        fontSize: '1.1rem'
                                    }}
                                />
                            </Button>
                        </div>
                    </div>
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    className="close-quotes"
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500]
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <div className="compareQuotePrintableArea">
                    <div className="preview-body px-8 pt-6 pb-0 cursor-pointer">
                        {proposalData != undefined && (
                            <p
                                className="	 md:h-auto"
                                style={{
                                    textAlign: 'justify',
                                    fontSize: '12px',
                                    position: 'relative'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                                    <Typography
                                        sx={{
                                            fontSize: '12px',
                                            fontWeight: 600,   
                                            color: '#22334F'
                                        }}
                                    >
                                        Customer Name -
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: '13px',
                                            fontWeight: 400,
                                            color: '#22334F'
                                        }}
                                    >
                                        {toPascalCase(
                                            proposalData?.Customer_Name ??
                                               
                                                ''
                                        )}
                                    </Typography>
                                </Box>

                                <p
                                    className="preview-vehicleDetails pt-1 quotation-details flex-wrap"
                                    style={{
                                        height: showMore ? 'auto' : '50px'
                                    }}
                                >
                                    <span className="info-line flex  gap-1">
                                        <b className="font-semibold">IDV - </b>
                                        {proposalData.RENEW_IDV}
                                    </span>
                                    <br className="line-break" />
                                    <span className="separator"> | </span>

                                    <span className="info-line flex  gap-1">
                                        <b className="font-semibold">Make - </b>{' '}
                                        {proposalData.MAKE_NAME}
                                    </span>
                                    <br className="line-break" />
                                    <span className="separator"> | </span>
                                    <span className="info-line flex  gap-1">
                                        <b className="font-semibold">
                                            Model -{' '}
                                        </b>{' '}
                                        {proposalData.Model}
                                    </span>
                                    <br className="line-break" />
                                    <span className="separator"> | </span>
                                    <span className="info-line flex  gap-1">
                                        <b className="font-semibold">
                                            Variant -{' '}
                                        </b>{' '}
                                        {proposalData.Variant}
                                    </span>
                                    <br className="line-break" />
                                    <span className="separator"> | </span>

                                    <span className="info-line flex  gap-1">
                                        <b className="font-semibold">
                                            Policy Type -{' '}
                                        </b>{' '}
                                        {proposalData.PolicyType == 'R'
                                            ? 'Renew'
                                            : 'New'}
                                    </span>
                                    <br className="line-break" />
                                    <span className="separator"> | </span>

                                    <span className="info-line flex  gap-1">
                                        <b className="font-semibold">
                                            Chassis No -{' '}
                                        </b>{' '}
                                        {proposalData.ChassisNo?.toUpperCase()}
                                    </span>
                                    <br className="line-break" />
                                    <span className="separator"> | </span>

                                    <span className="info-line flex  gap-1">
                                        <b className="font-semibold">
                                            {' '}
                                            Invoice Date -
                                        </b>{' '}
                                        {proposalData.InvoiceDate}
                                    </span>
                                    <br className="line-break" />
                                    <span className="separator"> | </span>
                                </p>

                                <div
                                    className="md:block "
                                    style={{
                                        display: showMore ? 'block' : 'none',
                                        height: showMore ? 'auto' : '0px'
                                    }}
                                >
                                    <p className="preview-quotationDetails  quotation-details flex-wrap">
                                        <span className="info-line flex  gap-1">
                                            <b className="font-semibold">
                                                {' '}
                                                Cover Type -
                                            </b>{' '}
                                            {proposalData.CoverType}
                                        </span>
                                        <br className="line-break" />
                                        <span className="separator"> | </span>
                                        <span className="info-line flex  gap-1">
                                            <b className="font-semibold">
                                                Year of Manufacturer -{' '}
                                            </b>
                                            {proposalData.MFGYear}
                                        </span>
                                        <br className="line-break" />
                                        <span className="separator"> | </span>
                                        <span className="info-line flex  gap-1">
                                            <b className="font-semibold">
                                                Quotation No -{' '}
                                            </b>
                                            {QuotationNo}
                                        </span>
                                        <span className="separator"> | </span>{' '}
                                        <br />
                                        <span className="info-line flex  gap-1">
                                            <b className="font-semibold">
                                                Quotation Date -{' '}
                                            </b>
                                            {new Date().toLocaleDateString(
                                                'en',
                                                {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                }
                                            )}
                                        </span>{' '}
                                        <br />
                                    </p>
                                </div>

                                {showMore ? (
                                    <div
                                        style={{}}
                                        className="preview-hideElement flex  showdetails items-center justify-end md:hidden	h-0 md:h-auto"
                                    >
                                        <span
                                            className="flex items-center justify-end gap-1"
                                            onClick={() =>
                                                setShowMore(!showMore)
                                            }
                                        >
                                            {' '}
                                            <span className="text-[22px] font-bold	">
                                                -{' '}
                                            </span>
                                            <span className="underline">
                                                Less Details
                                            </span>{' '}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="preview-hideElement flex items-center showdetails justify-end 	md:hidden">
                                        <span
                                            className="flex items-center justify-end gap-1"
                                            onClick={() =>
                                                setShowMore(!showMore)
                                            }
                                        >
                                            {' '}
                                            <img src="Images/plus-icon.png" />{' '}
                                            <span className="underline">
                                                More Details
                                            </span>{' '}
                                        </span>
                                    </div>
                                )}

                                {/* <p className="pt-1">
                                                    <b className="font-semibold">
                                                        Quotation No :
                                                    </b>{' '}
                                                    {QuotationNo}
                                                </p> */}
                                {/* <p className="pt-1">
                                                    <b className="font-semibold">
                                                        Quotation Date :
                                                    </b>{' '}
                                                    {new Date()
                                                        .toLocaleDateString(
                                                            'en',
                                                            {
                                                                weekday: 'long'
                                                            }
                                                        )
                                                        .substring(0, 3)}{' '}
                                                    {new Date()
                                                        .toLocaleDateString(
                                                            'en',
                                                            {
                                                                month: 'long'
                                                            }
                                                        )
                                                        .substring(0, 3)}
                                                    ,
                                                    {new Date().getDate() + ' '}{' '}
                                                    {new Date().getFullYear()}
                                                </p> */}
                            </p>
                        )}
                    </div>
                    {
                        compareIcs.length>0 && <DialogContent
                        dividers={scroll === 'body'}
                        sx={{ border: '0' }}
                        tabIndex={-1}
                        className="preview-body"
                    >
                        <Grid
                            direction={'row'}
                            container
                            spacing={2}
                            alignItems={'center'}
                            sx={{ marginTop: '.5rem' }}
                        >
                            <div className="container overflow-auto">
                                <div
                                    className="row preview-icListContainer"
                                    style={{
                                        display: 'flex',
                                        gridGap: '5px'
                                    }}
                                >
                                    <Grid
                                        className="preview-icListItem"
                                        item
                                        xs
                                        style={{
                                            display: 'flex',
                                            alignItems: ' center'
                                        }}
                                    >
                                        <Paper
                                            className="preview-icListItemLabelContainer "
                                            style={{
                                                padding: '20px',
                                                textAlign: 'center',
                                                boxShadow: '0px 0px 0px',
                                                display: 'flex',
                                                alignItems: ' center'
                                            }}
                                        >
                                            <Typography
                                                style={{ textAlign: 'justify' }}
                                            >
                                                <p className="preview-textBold text-lg font-bold text-center">
                                                    Comparison Summary
                                                </p>
                                                <p className="preview-textSmall text-[16px] text-center">
                                                    Price are Incl. GST
                                                </p>
                                            </Typography>
                                        </Paper>
                                    </Grid>

                                    {compareIcs.map((IC) => {
                                        return (
                                            <Grid
                                                item
                                                xs
                                                key={IC['PRODUCTID']}
                                                bgcolor={'white'}
                                                className="ICItem preview-icListItem"
                                                component="div"
                                            >
                                                <Paper
                                                    className="preview-icListItemDetailContainer"
                                                    sx={{
                                                        padding: '1rem',
                                                        textAlign: 'center',
                                                        boxShadow:
                                                            '0px 0px 25px 0px rgba(0, 0, 0, 0.10)',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '8px'
                                                    }}
                                                >
                                                    <Box
                                                        component="img"
                                                        p={2}
                                                        borderColor={blue}
                                                        src={
                                                            BaseReactAppUrl +
                                                            '/Images/Product/' +
                                                            IC['PROD_LOGO_PATH']
                                                        }
                                                    />
                                                     <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            textAlign: 'center',
                                                            fontWeight: 600,
                                                            mt: 0.5,
                                                            color: '#22334F',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis'
                                                        }}
                                                    >
                                                        {IC['IC_SHORTNAME'] ??
                                                            IC['PRODUCT_NAME'] ??                                                                                                                   
                                                            ''}
                                                    </Typography>

                                                    {/* <p className="flex items-center justify-center">
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
                                                    </p> */}

                                                    <Typography
                                                        component={'h2'}
                                                        sx={{
                                                            padding: '.5rem 0',
                                                            color: '#000'
                                                        }}
                                                    >
                                                        <span>&#8377;</span>{' '}
                                                        {IC['GROSS_PREM']}
                                                    </Typography>

                                                    {/* <Button
                                            variant="contained"
                                            endIcon={<ArrowForwardIcon />}
                                            sx={{ borderRadius: '8px' }}
                                        >
                                            Buy Now
                                        </Button> */}
                                                </Paper>
                                            </Grid>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="container overflow-auto">
                                <Grid
                                    className="preview-accordianContainer"
                                    item
                                    xs={12}
                                    sx={{ marginTop: '1rem' }}
                                >
                                    <Accordion
                                        className="preview-accordianItem"
                                        sx={{
                                            backgroundColor: 'transparent',
                                            border: '0px',
                                            boxShadow: '0px 0px 0px'
                                        }}
                                        defaultExpanded
                                    >
                                        <AccordionSummary
                                            className="preview-accordianSummary"
                                            sx={{
                                                backgroundColor: '#339',
                                                padding: '0 1rem',
                                                flexDirection: 'row-reverse'
                                            }}
                                            expandIcon={
                                                <ExpandMoreIcon
                                                    className="preview-hideElement"
                                                    sx={{
                                                        color: '#fff',
                                                        border: '1px solid #fff',
                                                        borderRadius: '1rem'
                                                    }}
                                                />
                                            }
                                            aria-controls="panel1-content"
                                            id="panel1-header"
                                        >
                                            <Typography
                                                className="preview-accordianLabel "
                                                color={'white'}
                                                sx={{ marginLeft: '1rem' }}
                                            >
                                                Own Damage Premium (A)
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails className="preview-accordianCollapse">
                                            <Box>
                                                <Grid>
                                                    {row1.map((row, index) => {
                                                        return (
                                                            <Grid
                                                                key={index}
                                                                direction={
                                                                    'row'
                                                                }
                                                                container
                                                                spacing={1}
                                                                className="gridRow preview-row"
                                                            >
                                                                <Grid
                                                                    className="preview-col"
                                                                    item
                                                                    xs
                                                                    sx={{
                                                                        textAlign:
                                                                            'left',
                                                                        color: '#000',
                                                                        fontWeight:
                                                                            '600'
                                                                    }}
                                                                >
                                                                    {getModifiedHeader(
                                                                            row
                                                                        )}
                                                                </Grid>
                                                                {compareIcs.map(
                                                                    (IC) => {
                                                                        return (
                                                                            <Grid
                                                                                className="preview-col"
                                                                                item
                                                                                xs
                                                                                key={
                                                                                    IC[
                                                                                        'PRODUCTID'
                                                                                    ]
                                                                                }
                                                                                sx={{
                                                                                    textAlign:
                                                                                        'center'
                                                                                }}
                                                                            >
                                                                                {
                                                                                    IC[
                                                                                        row
                                                                                            .value
                                                                                    ]
                                                                                }
                                                                            </Grid>
                                                                        )
                                                                    }
                                                                )}
                                                            </Grid>
                                                        )
                                                    })}
                                                </Grid>
                                            </Box>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion
                                        className="preview-accordianItem"
                                        sx={{
                                            backgroundColor: 'transparent',
                                            border: '0px',
                                            boxShadow: '0px 0px 0px'
                                        }}
                                    >
                                        <AccordionSummary
                                            className="preview-accordianSummary"
                                            sx={{
                                                backgroundColor: '#339',
                                                padding: '0 1rem',
                                                flexDirection: 'row-reverse'
                                            }}
                                            expandIcon={
                                                <ExpandMoreIcon
                                                    className="preview-hideElement"
                                                    sx={{
                                                        color: '#fff',
                                                        border: '1px solid #fff',
                                                        borderRadius: '1rem'
                                                    }}
                                                />
                                            }
                                            aria-controls="panel1-content"
                                            id="panel1-header"
                                        >
                                            <Typography
                                                className="preview-accordianLabel"
                                                color={'white'}
                                                bgcolor="primary"
                                                sx={{ marginLeft: '1rem' }}
                                            >
                                                Liability Premium (B)
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails className="preview-accordianCollapse">
                                            <Box>
                                                <Grid>
                                                    {(() => {
                                                        
                                                        const vehClass = String(
                                                            proposalData?.VEHICLE_CLASS ??
                                                                proposalData?.VEHICLE_CLASS ??                                                               
                                                                ''
                                                        )
                                                            .trim()
                                                            .toUpperCase()

                                                        const seatingCapacity = Number(
                                                            proposalData?.SeatingCapacity ??
                                                                proposalData?.SeatingCapacity ??
                                                                0
                                                        )

                                                        
                                                        const conditionalValues = [
                                                            'PA_CONDUCTOR',
                                                            'PA_CLEANER',
                                                            'PA_HELPER',
                                                            'LLAB_CONDUCTOR',
                                                            'LLAB_CLEANER',
                                                            'LLAB_HELPER',
                                                            'LLAB_NFPP'
                                                        ]

                                                        const showConditionalRows =
                                                            vehClass === 'C' ||
                                                            (vehClass === 'P' &&
                                                                seatingCapacity > 7)

                                                        const liabilityRows = showConditionalRows
                                                            ? row2
                                                            : row2.filter(
                                                                  (r) =>
                                                                      !conditionalValues.includes(
                                                                          r.value
                                                                      )
                                                              )

                                                        return liabilityRows.map(
                                                            (row, index) => (
                                                                <Grid
                                                                    key={index}
                                                                    direction={
                                                                        'row'
                                                                    }
                                                                    container
                                                                    spacing={1}
                                                                    className="gridRow preview-row"
                                                                >
                                                                    <Grid
                                                                        className="preview-col"
                                                                        item
                                                                        xs
                                                                        sx={{
                                                                            textAlign:
                                                                                'left',
                                                                           color:
                                                                                '#000',
                                                                            fontWeight:
                                                                                '600'
                                                                        }}
                                                                    >
                                                                        {getModifiedHeader(
                                                                            row
                                                                        )}
                                                                    </Grid>

                                                                    {compareIcs.map(
                                                                        (IC) => (
                                                                            <Grid
                                                                                className="preview-col"
                                                                                item
                                                                                xs
                                                                                key={
                                                                                    IC[
                                                                                        'PRODUCTID'
                                                                                    ]
                                                                                }
                                                                                sx={{
                                                                                    textAlign:
                                                                                        'center'
                                                                                }}
                                                                            >
                                                                                {
                                                                                    IC[
                                                                                        row
                                                                                            .value
                                                                                    ]
                                                                                }
                                                                            </Grid>
                                                                        )
                                                                    )}
                                                                </Grid>
                                                            )
                                                        )
                                                    })()}
                                                </Grid>
                                                                                               
                                            </Box>
                                        </AccordionDetails>
                                    </Accordion>

                                   
                                    <Accordion
                                        className="preview-accordianItem"
                                        sx={{
                                            backgroundColor: 'transparent',
                                            border: '0px',
                                            boxShadow: '0px 0px 0px'
                                        }}
                                    >
                                        <AccordionSummary
                                            className="preview-accordianSummary"
                                            sx={{
                                                backgroundColor: '#339',
                                                padding: '0 1rem',
                                                flexDirection: 'row-reverse'
                                            }}
                                            expandIcon={
                                                <ExpandMoreIcon
                                                    className="preview-hideElement"
                                                    sx={{
                                                        color: '#fff',
                                                        border: '1px solid #fff',
                                                        borderRadius: '1rem'
                                                    }}
                                                />
                                            }
                                            aria-controls="panel1-content"
                                            id="panel1-header"
                                        >
                                            <Typography
                                                className="preview-accordianLabel"
                                                color={'white'}
                                                bgcolor="primary"
                                                sx={{ marginLeft: '1rem' }}
                                            >
                                                Addons
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails className="preview-accordianCollapse">
                                            <Box>
                                                <Grid>{renderAddons()}</Grid>
                                            </Box>
                                        </AccordionDetails>
                                    </Accordion>
                                    
                                    <Accordion
                                        className="preview-accordianItem"
                                        sx={{
                                            backgroundColor: 'transparent',
                                            border: '0px',
                                            boxShadow: '0px 0px 0px'
                                        }}
                                        defaultExpanded
                                    >
                                        <AccordionSummary
                                            className="preview-accordianSummary"
                                            sx={{
                                                backgroundColor: '#339',
                                                padding: '0 1rem',
                                                flexDirection: 'row-reverse'
                                            }}
                                            expandIcon={
                                                <ExpandMoreIcon
                                                    className="preview-hideElement"
                                                    sx={{
                                                        color: '#fff',
                                                        border: '1px solid #fff',
                                                        borderRadius: '1rem'
                                                    }}
                                                />
                                            }
                                            aria-controls="panel1-content"
                                            id="panel1-header"
                                        >
                                            <Typography
                                                className="preview-accordianLabel "
                                                color={'white'}
                                                sx={{ marginLeft: '1rem' }}
                                            >
                                                Discounts
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails className="preview-accordianCollapse">
                                            <Box>
                                                <Grid>
                                                    {row4.map((row, index) => {
                                                        
                                                        return (<>
                                                        {compareIcs[0][row.value]>0?<Grid
                                                                key={index}
                                                                direction={
                                                                    'row'
                                                                }
                                                                container
                                                                spacing={1}
                                                                className="gridRow preview-row"
                                                            >
                                                                <Grid
                                                                    className="preview-col"
                                                                    item
                                                                    xs
                                                                    sx={{
                                                                        textAlign:
                                                                            'left',
                                                                        color: '#000',
                                                                        fontWeight:
                                                                            '600'
                                                                    }}
                                                                >
                                                                    {getModifiedHeader(
                                                                            row
                                                                        )}
                                                                </Grid>
                                                                {compareIcs.map(
                                                                    (IC) => {
                                                                        return (
                                                                            <Grid
                                                                                className="preview-col"
                                                                                item
                                                                                xs
                                                                                key={
                                                                                    IC[
                                                                                        'PRODUCTID'
                                                                                    ]
                                                                                }
                                                                                sx={{
                                                                                    textAlign:
                                                                                        'center'
                                                                                }}
                                                                            >
                                                                                {
                                                                                    IC[
                                                                                        row
                                                                                            .value
                                                                                    ]
                                                                                }
                                                                            </Grid>
                                                                        )
                                                                    }
                                                                )}
                                                            </Grid>:<></>}
                                                        
                                                        </>
                                                            
                                                            
                                                        )
                                                    })}
                                                </Grid>
                                            </Box>
                                        </AccordionDetails>
                                    </Accordion>
                                    
                                </Grid>
                            </div>
                        </Grid>
                    </DialogContent>
                    }
                    
                </div>
            </BootstrapDialog>
            <Toaster />
            <Toaster />
        </React.Fragment>
    )
}
