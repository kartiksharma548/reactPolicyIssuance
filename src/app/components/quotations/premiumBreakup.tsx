import * as React from 'react'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import CloseIcon from '@mui/icons-material/Close'
import icImage from '../../../assets/images/HdfcErgo.jpg'
import Tooltip from '@mui/material/Tooltip';
import {
    Box,
    Grid,
    Button,
    Typography,
    CardContent,
    Card,
    Stack,
    Accordion,
    AccordionActions,
    AccordionSummary,
    AccordionDetails
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import ShareIcon from '@mui/icons-material/Share'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { IProposal } from '../../models/IProposal'
import { useLazyGetProposalDetailsQuery } from '../../redux/rtkQuerySlice/details/proposalDetailsEndPoint'
import {
    createSearchParams,
    useNavigate,
    useSearchParams
} from 'react-router-dom'
import AdditionalCovers from './additionalCovers/additionalCovers'
import VehicleInfo from '../vehicleDetailsData/vehicleDetails'
import { BasePath } from '../../constants/baseURL'
import { fontWeight, maxWidth } from '@mui/system'
import { useEffect, useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import ReactDOMServer from 'react-dom/server'
import html2pdf from 'html2pdf.js'
import { CallPrint } from '../../utils/print'
import { CustomerQuotationNavBar } from '../sideBarContent/topBar'
import { generatePremiumbreakUpPDF } from '../../services/policyServices/quoteService'
import toast, { ToastPosition, Toaster } from 'react-hot-toast'
import { AnyIfEmpty } from 'react-redux'
import { BaseReactAppUrl } from '../../constants/baseURL'
import { QuoteUpdationModel } from '../../models/types/Quotations/quoteUpdationType'
import { saveQuoteProposalForIC } from '../../services/quoteService'
import { useAppDispatch } from '../../hooks/reduxHooks'
import { update } from '../../redux/features/policy/policySlice'
import { decrypt, encrypt } from '../../utils/encryption'
import BackDropLoader from '../common/backDropLoading'

export default function PremiumBreakup({
    quote,
    open,
    setOpen,
    callFromCustomer,
    proposalModel
}: any) {
    const [searchParams] = useSearchParams()
    // const ProposalId: number = parseInt(searchParams.get('ProposalId')) || 0
    let ProposalId: string = searchParams.get('ProposalId').toString() || ''
    ProposalId = decrypt(ProposalId)
    const dispatchStore = useAppDispatch()
    const proposalInfo = {} as IProposal
    proposalInfo.ProposalId = ProposalId
    
const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper')
    const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
        setOpen(true)
        setScroll(scrollType)
    }
    const [showLoading, setShowLoading] = useState(false)
    const navigate = useNavigate()

    const handleClose = () => {
        setOpen(false)
    }

    // useEffect(() => {
    //     //getProposalData(proposalInfo)
    // }, [])

    useEffect(() => { }, [])
    const options = {
        filename: 'Premium Breakup.pdf',
        margin: 1,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }

    const descriptionElementRef = React.useRef<HTMLElement>(null)
    const contentRef = React.useRef(null)

    const printDocument = () => {
        const content = contentRef.current
        html2pdf().set(options).from(content).save()
    }

    //function that will take the inner html and send to server for pdf generation
    const [expanded, setExpanded] = React.useState(true)
    const [expandedOne, setExpandedOne] = React.useState(true)
    const [expandedTwo, setExpandedTwo] = React.useState(true)
    const [expandedThree, setExpandedThree] = React.useState(true)

    const generatePremiumbreakUpPDFFN = async (param: string) => {
        setShowLoading(true)
        setExpanded(true)
        setExpandedOne(true)
        setExpandedTwo(true)
        setExpandedThree(true)
        const ProposalId = quote.ProposalId
        const HTMLString =
            document.getElementsByClassName('PremiumBreakup')[0].innerHTML
        let object = { ProposalId: 0, HTMLString: '', IsSendDownload: '' }
        object.ProposalId = ProposalId
        object.HTMLString = HTMLString
        object.IsSendDownload = param
        const response = await generatePremiumbreakUpPDF(object)
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

    //function that will dwonload the premium breakup pdf on customer browser
    function downloadPDF(pdf: any) {
        const linkSource = `data:application/pdf;base64,${pdf}`
        const downloadLink = document.createElement('a')
        const fileName = 'PremiumBreakup.pdf'

        downloadLink.href = linkSource
        downloadLink.download = fileName
        downloadLink.click()
    }

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

    return (
        <React.Fragment>
            <BackDropLoader openDialog={showLoading} />
            <Dialog
                className="PremiumBreakup"
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                sx={{
                    '& .MuiDialog-container': {
                        '& .MuiPaper-root': {
                            width: '100%',
                            maxWidth: '1088px' // Set your width here
                        }
                    }
                }}
            >
                
                <CustomerQuotationNavBar />
                <DialogTitle
                    id="scroll-dialog-title"
                    className="preview-title"
                    sx={{
                        flexDirection: 'row',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem 2rem 0',
                        fontSize: '1.375rem',
                        fontWeight: '800',
                        position: 'relative'
                    }}
                >
                    Premium Breakup
                    <div className="absolute preview-closeBtnContainer	md:top-[-54px] right-4 md:right-[28xpx]">
                        {' '}
                        <Button
                            onClick={handleClose}
                            sx={{ minWidth: 'auto' }}
                            id="closeHide"
                        >
                            <CloseIcon className="close" />
                        </Button>
                    </div>
                </DialogTitle>

                <DialogContent
                    dividers={scroll === 'paper'}
                    sx={{ border: '0' }}
                    className="preview-dialogContent"
                >
                    <DialogContentText
                        className="preview-dialogContentText"
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        <Box
                            id="printPremBreakup"
                            className="printPremBreakup preview-box"
                            ref={contentRef}
                        >
                            <Grid
                                container
                                spacing={6}
                                className="preview-gridContainer"
                            >
                                <Grid
                                    item
                                    className="preview-gridItem-left"
                                    xs
                                    md={4}
                                    lg={4}
                                    xl={4}
                                    sx={{ paddingTop: '0' }}
                                >
                                    <Card
                                        className="PolicyDetails preview-card"
                                        sx={{
                                            minWidth: '100%',
                                            boxShadow: '0px 0px 0px',
                                            backgroundColor: '#F6FAFE'
                                        }}
                                    >
                                        <CardContent
                                            className="preview-cardContent"
                                            sx={{
                                                padding: '2rem',
                                                margin: '0'
                                            }}
                                        >
                                            <Box
                                                sx={{ flexGrow: '1' }}
                                                className="preview-cardContent-box"
                                            >
                                                <Stack
                                                    className="preview-cardContent-box-stack"
                                                    sx={{
                                                        flexGrow: 1,
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'space-between',
                                                        marginBottom: '1rem'
                                                    }}
                                                >
                                                    <Typography
                                                        className="preview-left-heading"
                                                        variant="h2"
                                                        color="text.secondary"
                                                        sx={{
                                                            fontSize:
                                                                '1.25rem !important',
                                                            fontWeight: '600',
                                                            color: '#333399'
                                                        }}
                                                    >
                                                        Policy Details
                                                    </Typography>
                                                    <Stack
                                                        className="preview-btnContainer"
                                                        sx={{
                                                            flexDirection: 'row'
                                                        }}
                                                    >
                                                        <Button
                                                            className="preview-downloadBtn"
                                                            variant="outlined"
                                                            size="small"
                                                            color="primary"
                                                            sx={{
                                                                marginRight:
                                                                    '.5rem',
                                                                minWidth:
                                                                    'auto',
                                                                padding: '3px',
                                                                border: '1px solid #DDDDDD'
                                                            }}
                                                            onClick={() =>
                                                                generatePremiumbreakUpPDFFN(
                                                                    'download'
                                                                )
                                                            }
                                                        >
                                                            <DownloadIcon
                                                                width={16}
                                                                height={16}
                                                                sx={{
                                                                    fontSize:
                                                                        '1.1rem'
                                                                }}
                                                            />
                                                        </Button>
                                                        <Button
                                                            className="preview-shareBtn"
                                                            variant="outlined"
                                                            size="small"
                                                            color="primary"
                                                            sx={{
                                                                minWidth:
                                                                    'auto',
                                                                padding: '3px',
                                                                border: '1px solid #DDDDDD'
                                                            }}
                                                            onClick={() =>
                                                                generatePremiumbreakUpPDFFN(
                                                                    'send'
                                                                )
                                                            }
                                                        >
                                                            <ShareIcon
                                                                width={16}
                                                                height={16}
                                                                sx={{
                                                                    fontSize:
                                                                        '1.1rem'
                                                                }}
                                                            />
                                                        </Button>
                                                    </Stack>
                                                </Stack>
                                            </Box>

                                            <Stack
                                                className="preview-cardContent-stack"
                                                sx={{
                                                    flexGrow: 1,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    marginBottom: '0.5rem'
                                                }}
                                            >
                                                <div className="ICimg">
                                                    <img
                                                        src={
                                                            BaseReactAppUrl +
                                                            '/Images/Product/' +
                                                            quote[
                                                            'PROD_LOGO_PATH'
                                                            ]
                                                        }
                                                        alt="policy image"
                                                    />
                                                </div>
                                            </Stack>
                                            <Typography className="preview-cardContent-productNameContainer">
                                                <p className=" pt-1 text-base preview-cardContent-productName">
                                                    <b>
                                                        {/* {quote['PRODUCT_NAME']} */}
                                                         {quote['IC_SHORTNAME'] ?? quote['PRODUCT_NAME']}
                                                    </b>
                                                </p>
                                            </Typography>

                                            {proposalModel && (
                                                <div className="pl-[-12px] preview-cardContent-productDetailsContainer">
                                                    <VehicleInfo
                                                        proposalData={
                                                            proposalModel
                                                        }
                                                        QuoteNo={
                                                            quote?.QuotationNo
                                                        }
                                                        quotes={quote}
                                                        callFrom={'PREM'}
                                                    />
                                                </div>
                                            )}
                                            <Box className="preview-cardContent-buyNowBtnContainer">
                                                {callFromCustomer == true ? (
                                                    <></>
                                                ) : (
                                                    <>
                                                        <Button
                                                            fullWidth
                                                            variant="contained"
                                                            sx={{
                                                                textTransform:
                                                                    'capitalize',
                                                                flexDirection:
                                                                    'column',
                                                                marginTop:
                                                                    '1rem'
                                                            }}
                                                            id="buyNowBtn"
                                                            onClick={() => {
                                                                buyNow(quote)
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontSize:
                                                                        '1.375rem',
                                                                    fontWeight:
                                                                        '600',
                                                                    lineHeight:
                                                                        '1'
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        fontWeight:
                                                                            '200'
                                                                    }}
                                                                >
                                                                    ₹
                                                                </span>{' '}
                                                                {
                                                                    quote[
                                                                    'GROSS_PREM'
                                                                    ]
                                                                }
                                                            </Typography>
                                                            <Typography
                                                                sx={{
                                                                    fontSize:
                                                                        '12px',
                                                                    textTransform:
                                                                        'uppercase'
                                                                }}
                                                            >
                                                                Buy Now
                                                            </Typography>
                                                        </Button>
                                                        {proposalModel && proposalModel.Vehicle_Type == 'GCV' ? (
                                                            <Typography
                                                                sx={{
                                                                    fontSize:
                                                                        '12px',
                                                                    textAlign:
                                                                        'center',
                                                                    marginTop:
                                                                        '.5rem'
                                                                }}
                                                            >
                                                                (Incl.{' '}
                                                                {
                                                                    quote[
                                                                    'TOTAL_TPGST_PER'
                                                                    ]
                                                                }
                                                                % of Basic TP + {
                                                                    quote[
                                                                    'TOTAL_ODGST_PER'
                                                                    ]
                                                                }
                                                                % of rest of Premium - ₹{' '}
                                                                {
                                                                    quote[
                                                                    'TOTALGSTPREMIUM'
                                                                    ]
                                                                }
                                                                )
                                                            </Typography>
                                                        ) : (
                                                            <Typography
                                                                sx={{
                                                                    fontSize:
                                                                        '12px',
                                                                    textAlign:
                                                                        'center',
                                                                    marginTop:
                                                                        '.5rem'
                                                                }}
                                                            >
                                                                (Incl.{' '}
                                                                {
                                                                    quote[
                                                                    'TOTALGST_PER'
                                                                    ]
                                                                }
                                                                % GST- ₹{' '}
                                                                {
                                                                    quote[
                                                                    'TOTALGSTPREMIUM'
                                                                    ]
                                                                }
                                                                )
                                                            </Typography>
                                                        )}
                                                    </>
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md
                                    className="preview-gridItem-right"
                                >
                                    <div className="preview-right">
                                        <Accordion
                                            expanded={expanded}
                                            sx={{
                                                backgroundColor: 'transparent',
                                                border: '0px',
                                                boxShadow: '0px 0px 0px'
                                            }}
                                            className="preview-accordian"
                                        >
                                            <AccordionSummary
                                                className="preview-accordian-summary"
                                                sx={{
                                                    backgroundColor: '#FAFAFA',
                                                    padding: '0 1rem',
                                                    color: '#22334F',
                                                    flexDirection: 'row-reverse'
                                                }}
                                                expandIcon={
                                                    <ExpandMoreIcon
                                                        className="preview-accordian-summaryIconWrapper"
                                                        onClick={() =>
                                                            setExpanded(
                                                                !expanded
                                                            )
                                                        }
                                                        sx={{
                                                            background:
                                                                '#DDE6FB',
                                                            color: '#22334F',
                                                            border: '1px solid #C7BEBE',
                                                            borderRadius:
                                                                '1rem',
                                                            fontSize: '1.25rem'
                                                        }}
                                                    />
                                                }
                                                aria-controls="panel1-content"
                                                id="panel1-header"
                                            >
                                                <Grid
                                                    className="preview-accordian-summaryContentContainer"
                                                    container
                                                    sx={{
                                                        flexDirection: 'row',
                                                        display: 'flex',
                                                        justifyContent:
                                                            'space-around'
                                                    }}
                                                >
                                                    <Grid item xs>
                                                        <Typography className="labelHeading preview-accordian-summaryContentLabel">
                                                            {' '}
                                                            Basic Premium (A)
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs="auto">
                                                        <Typography className="priceHeading preview-accordian-summaryContentValue">
                                                            {' '}
                                                            ₹{' '}
                                                            {quote['NET_ODP_A']}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </AccordionSummary>
                                            <AccordionDetails className="preview-breakupDetailsContainer">
                                                {quote['TOTAL_DISC_PREM'] >
                                                    0 && (
                                                        <Box className="BreakupDetails preview-BreakupDetails">
                                                            <Typography className="label preview-BreakupDetailsLabel">
                                                                Vehicle Premium
                                                            </Typography>
                                                            <Tooltip title={`Discount: ${quote['OD_DISCOUNT'] ?? 'No discount info'}%`}  arrow>
                                                                
                                                            <Typography className="value preview-BreakupDetailsValue">
                                                                {' '}
                                                                ₹{' '}
                                                                {
                                                                    quote[
                                                                    'TOTAL_DISC_PREM'
                                                                    ]
                                                                }
                                                            </Typography>
                                                            
                                                            </Tooltip>
                                                        </Box>
                                                    )}
                                                <Box className="BreakupDetails preview-BreakupDetails">
                                                    <Typography className="label preview-BreakupDetailsLabel">
                                                        Non-Electrical
                                                        Accessories (IMT-24)
                                                    </Typography>
                                                    <Typography className="value preview-BreakupDetailsValue">
                                                        {' '}
                                                        ₹{' '}
                                                        {
                                                            quote[
                                                            'BASIC_PREM_NONELECT_ACC'
                                                            ]
                                                        }
                                                    </Typography>
                                                </Box>
                                                <Box className="BreakupDetails preview-BreakupDetails">
                                                    <Typography className="label preview-BreakupDetailsLabel">
                                                        Electrical Accessories
                                                        (IMT-24)
                                                    </Typography>
                                                    <Typography className="value preview-BreakupDetailsValue">
                                                        {' '}
                                                        ₹{' '}
                                                        {
                                                            quote[
                                                            'BASIC_PREM_ELECT_ACC'
                                                            ]
                                                        }
                                                    </Typography>
                                                </Box>
                                                <Box className="BreakupDetails preview-BreakupDetails">
                                                    <Typography className="label preview-BreakupDetailsLabel">
                                                        Bi-Fuel Kit
                                                    </Typography>
                                                    <Typography className="value preview-BreakupDetailsValue">
                                                        {' '}
                                                        ₹{' '}
                                                        {
                                                            quote[
                                                            'BIFUELKIT_PREMIUM'
                                                            ]
                                                        }
                                                    </Typography>
                                                </Box>
                                                <Box className="BreakupDetails preview-BreakupDetails">
                                                    <Typography className="label preview-BreakupDetailsLabel">
                                                        Geo-Graphical Area
                                                        Extension (IMT-1)
                                                    </Typography>
                                                    <Typography className="value preview-BreakupDetailsValue">
                                                        {' '}
                                                        ₹{' '}
                                                        {
                                                            quote[
                                                            'PREM_GEOGRAPH_EXT'
                                                            ]
                                                        }
                                                    </Typography>
                                                </Box>
                                                {quote['IMT23PREMIUM'] > 0 && (
                                                    <Box className="BreakupDetails preview-BreakupDetails">
                                                        <Typography className="label preview-BreakupDetailsLabel">
                                                            IMT-23
                                                        </Typography>
                                                        <Typography className="value preview-BreakupDetailsValue">
                                                            {' '}
                                                            ₹{' '}
                                                            {
                                                                quote[
                                                                'IMT23PREMIUM'
                                                                ]
                                                            }
                                                        </Typography>
                                                    </Box>
                                                )}
                                                {quote['IMT33PREMIUM'] > 0 && (
                                                    <Box className="BreakupDetails preview-BreakupDetails">
                                                        <Typography className="label preview-BreakupDetailsLabel">
                                                            IMT-33
                                                        </Typography>
                                                        <Typography className="value preview-BreakupDetailsValue">
                                                            {' '}
                                                            ₹{' '}
                                                            {
                                                                quote[
                                                                'IMT33PREMIUM'
                                                                ]
                                                            }
                                                        </Typography>
                                                    </Box>
                                                )}
                                                {quote['IMT34PREMIUM'] > 0 && (
                                                    <Box className="BreakupDetails preview-BreakupDetails">
                                                        <Typography className="label preview-BreakupDetailsLabel">
                                                            IMT-34
                                                        </Typography>
                                                        <Typography className="value preview-BreakupDetailsValue">
                                                            {' '}
                                                            ₹{' '}
                                                            {
                                                                quote[
                                                                'IMT34PREMIUM'
                                                                ]
                                                            }
                                                        </Typography>
                                                    </Box>
                                                )}
                                                {quote['OVERTURN_PREMIUM'] >
                                                    0 && (
                                                        <Box className="BreakupDetails preview-BreakupDetails">
                                                            <Typography className="label preview-BreakupDetailsLabel">
                                                                {`OverTurn Premium`}{' '}
                                                            </Typography>
                                                            <Typography className="value preview-BreakupDetailsValue">
                                                                {' '}
                                                                ₹{' '}
                                                                {
                                                                    quote[
                                                                    'OVERTURN_PREMIUM'
                                                                    ]
                                                                }
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                {quote['TRAILER_PREMIUM'] >
                                                    0 && (
                                                        <Box className="BreakupDetails preview-BreakupDetails">
                                                            <Typography className="label preview-BreakupDetailsLabel">
                                                                {`Trailer Premium`}{' '}
                                                            </Typography>
                                                            <Typography className="value preview-BreakupDetailsValue">
                                                                {' '}
                                                                ₹{' '}
                                                                {
                                                                    quote[
                                                                    'TRAILER_PREMIUM'
                                                                    ]
                                                                }
                                                            </Typography>
                                                        </Box>
                                                    )}
                                            </AccordionDetails>
                                        </Accordion>

                                        {quote['AddOnPremium'].length > 0 && (
                                            <Accordion
                                                expanded={expandedOne}
                                                sx={{
                                                    backgroundColor:
                                                        'transparent',
                                                    border: '0px',
                                                    boxShadow: '0px 0px 0px'
                                                }}
                                                className="preview-accordian"
                                            >
                                                <AccordionSummary
                                                    className="preview-accordian-summary"
                                                    sx={{
                                                        backgroundColor:
                                                            '#FAFAFA',
                                                        padding: '0 1rem',
                                                        color: '#22334F',
                                                        flexDirection:
                                                            'row-reverse'
                                                    }}
                                                    expandIcon={
                                                        <ExpandMoreIcon
                                                            className="preview-accordian-summaryIconWrapper"
                                                            onClick={() =>
                                                                setExpandedOne(
                                                                    !expandedOne
                                                                )
                                                            }
                                                            sx={{
                                                                background:
                                                                    '#DDE6FB',
                                                                color: '#22334F',
                                                                border: '1px solid #C7BEBE',
                                                                borderRadius:
                                                                    '1rem',
                                                                fontSize:
                                                                    '1.25rem'
                                                            }}
                                                        />
                                                    }
                                                    aria-controls="panel2-content"
                                                    id="panel2-header"
                                                >
                                                    <Grid
                                                        className="preview-accordian-summaryContentContainer"
                                                        container
                                                        sx={{
                                                            flexDirection:
                                                                'row',
                                                            display: 'flex',
                                                            justifyContent:
                                                                'space-around'
                                                        }}
                                                    >
                                                        <Grid item xs>
                                                            <Typography className="labelHeading preview-accordian-summaryContentLabel">
                                                                Additional
                                                                Covers
                                                                {/*( {quote[
                                                                'AddOnPremiumShow'
                                                            ].map(
                                                                (shortCode) => {
                                                                    return shortCode[
                                                                        'AddOnShortName'
                                                                    ]
                                                                        .split(
                                                                            ','
                                                                        )
                                                                        .map(
                                                                            (
                                                                                x,
                                                                                index
                                                                            ) => {
                                                                                if (
                                                                                    shortCode[
                                                                                        'AddOnShortName'
                                                                                    ].split(
                                                                                        ','
                                                                                    )
                                                                                        .length ==
                                                                                    index +
                                                                                        1
                                                                                ) {
                                                                                    return (
                                                                                        x.split(
                                                                                            ':'
                                                                                        )[0] +
                                                                                        ','
                                                                                    )
                                                                                } else {
                                                                                    return (
                                                                                        x.split(
                                                                                            ':'
                                                                                        )[0] +
                                                                                        ','
                                                                                    )
                                                                                }
                                                                            }
                                                                        )
                                                                }
                                                            )}
                                                            ) */}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs="auto">
                                                            <Typography className="priceHeading preview-accordian-summaryContentValue">
                                                                {' '}
                                                                ₹{' '}
                                                                {quote[
                                                                    'AddOnPremiumShow'
                                                                ].reduce(
                                                                    (
                                                                        total,
                                                                        current
                                                                    ) => {
                                                                        return (
                                                                            current[
                                                                            'ADDON_PREM_AMT'
                                                                            ] +
                                                                            total
                                                                        )
                                                                    },
                                                                    0
                                                                )}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </AccordionSummary>
                                                <AccordionDetails className="preview-breakupDetailsContainer">
                                                    {quote['AddOnPremium'].map(
                                                        (addOn) => {
                                                            return (
                                                                <>
                                                                    <Box className="BreakupDetails preview-BreakupDetails">
                                                                        <Typography className="label preview-BreakupDetailsLabel">
                                                                            {
                                                                                addOn[
                                                                                'AddOnName'
                                                                                ]
                                                                            }
                                                                        </Typography>
                                                                        <Typography className="value preview-BreakupDetailsValue">
                                                                            {' '}
                                                                            ₹{' '}
                                                                            {
                                                                                addOn[
                                                                                'ADDON_PREM_AMT'
                                                                                ]
                                                                            }
                                                                        </Typography>
                                                                    </Box>
                                                                </>
                                                            )
                                                        }
                                                    )}
                                                </AccordionDetails>
                                            </Accordion>
                                        )}

                                        {quote['DISC_TOTAL'] > 0 && (
                                            <Accordion
                                                expanded={expandedTwo}
                                                sx={{
                                                    backgroundColor:
                                                        'transparent',
                                                    border: '0px',
                                                    boxShadow: '0px 0px 0px'
                                                }}
                                                className="preview-accordian"
                                            >
                                                <AccordionSummary
                                                    className="preview-accordian-summary"
                                                    sx={{
                                                        backgroundColor:
                                                            '#FAFAFA',
                                                        padding: '0 1rem',
                                                        color: '#22334F',
                                                        flexDirection:
                                                            'row-reverse'
                                                    }}
                                                    expandIcon={
                                                        <ExpandMoreIcon
                                                            className="preview-accordian-summaryIconWrapper"
                                                            onClick={() =>
                                                                setExpandedTwo(
                                                                    !expandedTwo
                                                                )
                                                            }
                                                            sx={{
                                                                background:
                                                                    '#DDE6FB',
                                                                color: '#22334F',
                                                                border: '1px solid #C7BEBE',
                                                                borderRadius:
                                                                    '1rem',
                                                                fontSize:
                                                                    '1.25rem'
                                                            }}
                                                        />
                                                    }
                                                    aria-controls="panel3-content"
                                                    id="panel3-header"
                                                >
                                                    <Grid
                                                        className="preview-accordian-summaryContentContainer"
                                                        container
                                                        sx={{
                                                            flexDirection:
                                                                'row',
                                                            display: 'flex',
                                                            justifyContent:
                                                                'space-around'
                                                        }}
                                                    >
                                                        <Grid item xs>
                                                            <Typography className="labelHeading preview-accordian-summaryContentLabel">
                                                                Discounts
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs="auto">
                                                            <Typography className="priceHeading preview-accordian-summaryContentValue">
                                                                {' '}
                                                                - ₹{' '}
                                                                {
                                                                    quote[
                                                                    'DISC_TOTAL'
                                                                    ]
                                                                }
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </AccordionSummary>
                                                <AccordionDetails className="preview-breakupDetailsContainer">
                                                    {quote['DISC_VOLUNTRY'] !=
                                                        0 && (
                                                            <Box className="BreakupDetails preview-BreakupDetails">
                                                                <Typography className="label preview-BreakupDetailsLabel">
                                                                    Voluntary Excess
                                                                    (IMT-22A) (₹
                                                                    {
                                                                        quote[
                                                                        'VOLUNTARY_DISC'
                                                                        ]
                                                                    }
                                                                    )
                                                                </Typography>
                                                                <Typography className="value preview-BreakupDetailsValue">
                                                                    ₹{' '}
                                                                    {
                                                                        quote[
                                                                        'DISC_VOLUNTRY'
                                                                        ]
                                                                    }
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    {quote['DISC_ANTITHEFT'] !=
                                                        0 && (
                                                            <Box className="BreakupDetails preview-BreakupDetails">
                                                                <Typography className="label preview-BreakupDetailsLabel">
                                                                    Anti Theft
                                                                    (IMT-10)
                                                                </Typography>
                                                                <Typography className="value preview-BreakupDetailsValue">
                                                                    {' '}
                                                                    ₹{' '}
                                                                    {
                                                                        quote[
                                                                        'DISC_ANTITHEFT'
                                                                        ]
                                                                    }
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    {quote['DISC_AA_MEMB'] !=
                                                        0 && (
                                                            <Box className="BreakupDetails preview-BreakupDetails">
                                                                <Typography className="label preview-BreakupDetailsLabel">
                                                                    AA Membership
                                                                    (IMT-8)
                                                                </Typography>
                                                                <Typography className="value preview-BreakupDetailsValue">
                                                                    {' '}
                                                                    ₹{' '}
                                                                    {
                                                                        quote[
                                                                        'DISC_AA_MEMB'
                                                                        ]
                                                                    }
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    {quote['DISC_NCB_VALUE'] !=
                                                        0 && (
                                                            <Box className="BreakupDetails preview-BreakupDetails">
                                                                <Typography className="label preview-BreakupDetailsLabel">
                                                                    NCB Discount (
                                                                    {
                                                                        quote[
                                                                        'NCB_SLAB_PER'
                                                                        ]
                                                                    }
                                                                    {'%'})
                                                                </Typography>
                                                                <Typography className="value preview-BreakupDetailsValue">
                                                                    {' '}
                                                                    ₹{' '}
                                                                    {
                                                                        quote[
                                                                        'DISC_NCB_VALUE'
                                                                        ]
                                                                    }
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    {quote[
                                                        'HANDICAPPEDDISC_AMT'
                                                    ] != 0 && (
                                                            <Box className="BreakupDetails preview-BreakupDetails">
                                                                <Typography className="label preview-BreakupDetailsLabel">
                                                                    Handicapped (
                                                                    {
                                                                        quote[
                                                                        'HANDICAPPEDDISC_PER'
                                                                        ]
                                                                    }
                                                                    {'%'}) (IMT-12)
                                                                </Typography>
                                                                <Typography className="value preview-BreakupDetailsValue">
                                                                    {' '}
                                                                    ₹{' '}
                                                                    {
                                                                        quote[
                                                                        'HANDICAPPEDDISC_AMT'
                                                                        ]
                                                                    }
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                </AccordionDetails>
                                            </Accordion>
                                        )}
                                        <Accordion
                                            expanded={expandedThree}
                                            sx={{
                                                backgroundColor: 'transparent',
                                                border: '0px',
                                                boxShadow: '0px 0px 0px'
                                            }}
                                            className="preview-accordian"
                                        >
                                            <AccordionSummary
                                                className="preview-accordian-summary"
                                                sx={{
                                                    backgroundColor: '#FAFAFA',
                                                    padding: '0 1rem',
                                                    color: '#22334F',
                                                    flexDirection: 'row-reverse'
                                                }}
                                                expandIcon={
                                                    <ExpandMoreIcon
                                                        className="preview-accordian-summaryIconWrapper"
                                                        onClick={() =>
                                                            setExpandedThree(
                                                                !expandedThree
                                                            )
                                                        }
                                                        sx={{
                                                            background:
                                                                '#DDE6FB',
                                                            color: '#22334F',
                                                            border: '1px solid #C7BEBE',
                                                            borderRadius:
                                                                '1rem',
                                                            fontSize: '1.25rem'
                                                        }}
                                                    />
                                                }
                                                aria-controls="panel4-content"
                                                id="panel4-header"
                                            >
                                                <Grid
                                                    className="preview-accordian-summaryContentContainer"
                                                    container
                                                    sx={{
                                                        flexDirection: 'row',
                                                        display: 'flex',
                                                        justifyContent:
                                                            'space-around'
                                                    }}
                                                >
                                                    <Grid item xs>
                                                        <Typography className="labelHeading preview-accordian-summaryContentLabel">
                                                            Liability Premium
                                                            (B)
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs="auto">
                                                        <Typography className="priceHeading preview-accordian-summaryContentValue">
                                                            {' '}
                                                            ₹{' '}
                                                            {
                                                                quote[
                                                                'NET_LIAB_PREM_B'
                                                                ]
                                                            }
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </AccordionSummary>
                                            <AccordionDetails className="preview-breakupDetailsContainer">
                                                {quote['TPPD_LIAB_PREM'] >
                                                    0 && (
                                                        <Box className="BreakupDetails preview-BreakupDetails">
                                                            <Typography className="label preview-BreakupDetailsLabel">
                                                                Basic Third Party
                                                                Liability Premium
                                                                (Including TPPD)
                                                            </Typography>
                                                            <Typography className="value preview-BreakupDetailsValue">
                                                                {' '}
                                                                ₹{' '}
                                                                {
                                                                    quote[
                                                                    'TPPD_LIAB_PREM'
                                                                    ]
                                                                }
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                {quote['BIFUEL_TP_PREMIUM'] >
                                                    0 && (
                                                        <Box className="BreakupDetails preview-BreakupDetails">
                                                            <Typography className="label preview-BreakupDetailsLabel">
                                                                Third Party
                                                                Liability For
                                                                Bi-Fuel Kit
                                                            </Typography>
                                                            <Typography className="value preview-BreakupDetailsValue">
                                                                {' '}
                                                                ₹{' '}
                                                                {
                                                                    quote[
                                                                    'BIFUEL_TP_PREMIUM'
                                                                    ]
                                                                }
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                {quote[
                                                    'GEOAREAEXT_TP_PREMIUM'
                                                ] > 0 && (
                                                        <Box className="BreakupDetails preview-BreakupDetails">
                                                            <Typography className="label preview-BreakupDetailsLabel">
                                                                Third Party
                                                                Liability For
                                                                Geo-Graphical Area
                                                                Extension (IMT-1)
                                                            </Typography>
                                                            <Typography className="value preview-BreakupDetailsValue">
                                                                {' '}
                                                                ₹{' '}
                                                                {
                                                                    quote[
                                                                    'GEOAREAEXT_TP_PREMIUM'
                                                                    ]
                                                                }
                                                            </Typography>
                                                        </Box>
                                                    )}

                                                {quote['PA_PAID_DRIVER'] >
                                                    0 && (
                                                        <Box className="BreakupDetails preview-BreakupDetails">
                                                            <Typography className="label preview-BreakupDetailsLabel">
                                                                PA Cover For Paid
                                                                Driver (IMT-17) (₹
                                                                {
                                                                    quote[
                                                                    'COVER_AMOUNT'
                                                                    ]
                                                                }
                                                                )
                                                            </Typography>
                                                            <Typography className="value preview-BreakupDetailsValue">
                                                                {' '}
                                                                ₹{' '}
                                                                {
                                                                    quote[
                                                                    'PA_PAID_DRIVER'
                                                                    ]
                                                                }
                                                            </Typography>
                                                        </Box>
                                                    )}

                                                {quote['PA_UNNAMED_PERSON'] >
                                                    0 && (
                                                        <Box className="BreakupDetails preview-BreakupDetails">
                                                            <Typography className="label preview-BreakupDetailsLabel">
                                                                PA Cover
                                                                {`(${quote['COVER_AMOUNT']} per Person) for ${quote['UNNAMED_PER_COUNT']} Persons`}{' '}
                                                                (IMT-16)
                                                            </Typography>
                                                            <Typography className="value preview-BreakupDetailsValue">
                                                                {' '}
                                                                ₹{' '}
                                                                {
                                                                    quote[
                                                                    'PA_UNNAMED_PERSON'
                                                                    ]
                                                                }
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                {quote['PA_CONDUCTOR'] +
                                                    quote['PA_CLEANER'] +
                                                    quote['PA_HELPER'] >
                                                    0 && (
                                                        <Box className="BreakupDetails preview-BreakupDetails">
                                                            <Typography className="label preview-BreakupDetailsLabel">
                                                                {`PA Conductor(${quote['PACONDUCTOR_COUNT']})/Cleaner(${quote['PACLEANER_COUNT']})/Helper(${quote['PAHELPER_COUNT']})`}{' '}
                                                            </Typography>
                                                            <Typography className="value preview-BreakupDetailsValue">
                                                                {' '}
                                                                ₹{' '}
                                                                {quote[
                                                                    'PA_CONDUCTOR'
                                                                ] +
                                                                    quote[
                                                                    'PA_CLEANER'
                                                                    ] +
                                                                    quote[
                                                                    'PA_HELPER'
                                                                    ]}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                {quote['PA_OWNER_DRIVER'] >
                                                    0 && (
                                                        <Box className="BreakupDetails preview-BreakupDetails">
                                                            <Typography className="label preview-BreakupDetailsLabel">
                                                                Compulsory PA Cover
                                                                For Owner Driver
                                                                (IMT-15)
                                                                {quote[
                                                                    'PA_OWNER_DRIVER_COVER_AMT'
                                                                ] > 0 && (
                                                                        <>
                                                                            {`(₹) ${quote['PA_OWNER_DRIVER_COVER_AMT']}`}
                                                                        </>
                                                                    )}
                                                            </Typography>
                                                            <Typography className="value preview-BreakupDetailsValue">
                                                                {' '}
                                                                ₹{' '}
                                                                {
                                                                    quote[
                                                                    'PA_OWNER_DRIVER'
                                                                    ]
                                                                }
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                {quote['LLIAB_PAID_DRIVER'] >
                                                    0 && (
                                                        <Box className="BreakupDetails preview-BreakupDetails">
                                                            <Typography className="label preview-BreakupDetailsLabel">
                                                                Legal Liablility
                                                                Paid Driver (IMT-28)
                                                            </Typography>
                                                            <Typography className="value preview-BreakupDetailsValue">
                                                                {' '}
                                                                ₹{' '}
                                                                {
                                                                    quote[
                                                                    'LLIAB_PAID_DRIVER'
                                                                    ]
                                                                }
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                {quote['LLIAB_EMPLOYEE'] >
                                                    0 && (
                                                        <Box className="BreakupDetails preview-BreakupDetails">
                                                            <Typography className="label preview-BreakupDetailsLabel">
                                                                Legal Liablility
                                                                Employee for
                                                                (IMT-29) (
                                                                {
                                                                    quote[
                                                                    'OTHER_EMP_COUNT'
                                                                    ]
                                                                }{' '}
                                                                Persons)
                                                            </Typography>
                                                            <Typography className="value preview-BreakupDetailsValue">
                                                                {' '}
                                                                ₹{' '}
                                                                {
                                                                    quote[
                                                                    'LLIAB_EMPLOYEE'
                                                                    ]
                                                                }
                                                            </Typography>
                                                        </Box>
                                                    )}

                                                {quote['LLIAB_UNNAMED_PASS'] >
                                                    0 && (
                                                        <Box className="BreakupDetails preview-BreakupDetails">
                                                            <Typography className="label preview-BreakupDetailsLabel">
                                                                Legal Liablility
                                                                Un-named Passenger
                                                            </Typography>
                                                            <Typography className="value preview-BreakupDetailsValue">
                                                                {' '}
                                                                ₹{' '}
                                                                {
                                                                    quote[
                                                                    'LLIAB_UNNAMED_PASS'
                                                                    ]
                                                                }
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                {quote['LLAB_CONDUCTOR'] +
                                                    quote['LLAB_CLEANER'] +
                                                    quote['LLAB_HELPER'] >
                                                    0 && (
                                                        <Box className="BreakupDetails preview-BreakupDetails">
                                                            <Typography className="label preview-BreakupDetailsLabel">
                                                                {`Legal Liability Conductor(${quote['LLCONDUCTOR_COUNT']})/Cleaner(${quote['LLCLEANER_COUNT']})/Helper(${quote['LLHELPER_COUNT']})`}{' '}
                                                            </Typography>
                                                            <Typography className="value preview-BreakupDetailsValue">
                                                                {' '}
                                                                ₹{' '}
                                                                {quote[
                                                                    'LLAB_CONDUCTOR'
                                                                ] +
                                                                    quote[
                                                                    'LLAB_CLEANER'
                                                                    ] +
                                                                    quote[
                                                                    'LLAB_HELPER'
                                                                    ]}
                                                            </Typography>
                                                        </Box>
                                                    )}

                                                {quote['LLAB_NFPP'] > 0 && (
                                                    <Box className="BreakupDetails preview-BreakupDetails">
                                                        <Typography className="label preview-BreakupDetailsLabel">
                                                            {`Legal Liability NFPP(${quote['NFPP_COUNT']})`}{' '}
                                                        </Typography>
                                                        <Typography className="value preview-BreakupDetailsValue">
                                                            {' '}
                                                            ₹{' '}
                                                            {quote['LLAB_NFPP']}
                                                        </Typography>
                                                    </Box>
                                                )}

                                                {quote['TRAILER_TP_PREMIUM'] >
                                                    0 && (
                                                        <Box className="BreakupDetails preview-BreakupDetails">
                                                            <Typography className="label preview-BreakupDetailsLabel">
                                                                {`Trailer TP Premium`}{' '}
                                                            </Typography>
                                                            <Typography className="value preview-BreakupDetailsValue">
                                                                {' '}
                                                                ₹{' '}
                                                                {
                                                                    quote[
                                                                    'TRAILER_TP_PREMIUM'
                                                                    ]
                                                                }
                                                            </Typography>
                                                        </Box>
                                                    )}

                                                {quote['IMT34PREMIUM_TP'] >
                                                    0 && (
                                                        <Box className="BreakupDetails preview-BreakupDetails">
                                                            <Typography className="label preview-BreakupDetailsLabel">
                                                                {`IMT-34`}{' '}
                                                            </Typography>
                                                            <Typography className="value preview-BreakupDetailsValue">
                                                                {' '}
                                                                ₹{' '}
                                                                {
                                                                    quote[
                                                                    'IMT34PREMIUM_TP'
                                                                    ]
                                                                }
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                {/* {quote['TPPD_LIAB_PREM'] > 0 && (
                                                <Box className="BreakupDetails">
                                                    <Typography className="label">
                                                        Legal Liability Premium
                                                    </Typography>
                                                    <Typography className="value">
                                                        {' '}
                                                        ₹{' '}
                                                        {
                                                            quote[
                                                                'TPPD_LIAB_PREM'
                                                            ]
                                                        }
                                                    </Typography>
                                                </Box>
                                            )} */}
                                            </AccordionDetails>
                                        </Accordion>

                                        <Box className="TotalPremium preview-totalPremium ">
                                            <Typography className="label preview-totalPremiumLabel">
                                                Total Premium (A+B)
                                            </Typography>
                                            <Typography className="value preview-totalPremiumValue">
                                                {' '}
                                                ₹ {quote['TOTAL_PREM_A_B']}
                                            </Typography>
                                        </Box>

                                        <Box className="preview-totalPremium preview-grossPremium TotalPremium GrossPremium">
                                            <Typography className="label preview-totalPremiumLabel">
                                                Gross Premium
                                            </Typography>
                                            <Typography
                                                className="value preview-totalPremiumValue"
                                                sx={{
                                                    flexDirection: 'column',
                                                    display: 'flex',
                                                    alignItems: 'self-end'
                                                }}
                                            >
                                                {' '}
                                                <span>
                                                    ₹{quote['GROSS_PREM']}
                                                </span>{' '}
                                                {proposalModel && proposalModel.Vehicle_Type == 'GCV' ? (
                                                    <span className="text-GST preview-textGST">
                                                        +({quote['TOTAL_TPGST_PER']}%) of Basic TP + ({quote['TOTAL_ODGST_PER']}%)
                                                        of rest of Premium
                                                    </span>
                                                ) : (
                                                    <span className="text-GST preview-textGST">
                                                        +({quote['TOTALGST_PER']}%)
                                                        GST
                                                    </span>
                                                )}
                                            </Typography>
                                        </Box>
                                    </div>
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
            <Toaster />
        </React.Fragment >
    )
}
