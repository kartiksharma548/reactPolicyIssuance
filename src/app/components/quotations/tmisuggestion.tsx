import * as React from 'react'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import CloseIcon from '@mui/icons-material/Close'
import icImage from '../../../assets/images/HdfcErgo.jpg'
import logo from "../../../assets/images/Tata-Logo.png"
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
import { useSearchParams } from 'react-router-dom'
import AdditionalCovers from './additionalCovers/additionalCovers'
import VehicleInfo from '../vehicleDetailsData/vehicleDetails'
import { BasePath } from '../../constants/baseURL'
import { fontWeight, maxWidth } from '@mui/system'
import { useEffect } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import ReactDOMServer from 'react-dom/server'
import html2pdf from 'html2pdf.js'
import { CallPrint } from '../../utils/print'
import {CustomerQuotationNavBar} from '../sideBarContent/topBar'

export default function TmiSuggestion({
    open,
    setOpen
}: any) {

    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper')

    const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
        setOpen(true)
        setScroll(scrollType)
    }

    const handleClose = () => {
        setOpen(false)
    }


    return (
        <React.Fragment>
            <Dialog
                className="PremiumBreakup"
                // maxWidth={'xl'}
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
               
                <DialogTitle
                    id="scroll-dialog-title"
                    sx={{
                        flexDirection: 'row',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem 2rem 0',
                        fontSize: '1.375rem',
                        fontWeight: '800'
                    }}
                >
                   
                    <Button style={
                        {
                            marginLeft:"auto"
                        }
                    } onClick={handleClose} sx={{ minWidth: 'auto' }}>
                        <CloseIcon className="close" />
                    </Button>
                </DialogTitle>

                <div className="flex justify-center mb-3 items-center">
                    <span>
                        <img src={logo} alt="logo" className="TataLogo" style={{margin:"auto"}} />
                    </span>
                </div>
                <p className='md:text-xl text-[12px] text-[#22334F] font-semibold	 text-center mb-3'>TMIBASL Popular Addon Packages for Age Bracket 0-5 Yrs.</p>
                <DialogContent
                    dividers={scroll === 'paper'}
                    sx={{ border: '0' }}
                >
                    <DialogContentText
                        id="scroll-dialog-description"
                        tabIndex={-1}
                    >
                        <Box id="printPremBreakup">
                            <Grid container spacing={0}>
                                <Grid
                                    item
                                    xs
                                    md={4}
                                    lg={4}
                                    xl={4}
                                    sx={{ paddingTop: '0', marginTop:'25px' }}
                                >
                                    <Card
                                        className="PolicyDetails"
                                        sx={{
                                            boxShadow: 'none',
                                            border: '1px solid #DDD',
                                            background: '#FFF',
                                            borderRadius:'0px',
                                            borderTop: '6px solid #1F81B9'
                                        }}
                                    >
                                        <CardContent
                                               sx={{
                                                padding: '1rem',
                                                margin: '0'
                                            }}
                                        >
                                            <Box sx={{ flexGrow: '1' }}>
                                                <Stack
                                                    sx={{
                                                        flexGrow: 1,
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'space-between',
                                                        marginBottom: '1rem'
                                                    }}
                                                >
                                                 <div className='flex flex-col w-full  gap-4'>
                                                    <p className='text-[#1F81B9] border rounded-[20px] border-[#1F81B9] py-[6] px-[32px] mx-auto'>Basic</p>
                                                    <p className='flex items-center text-[#22334F] text-sm gap-1'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                        <path d="M2.66663 9.21899L5.99996 12.5523L13.3333 5.21899" stroke="#23C565" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                                        <span>Nil Depreciation</span>
                                                        <img
                                            src={
                                                BasePath +
                                                '/Images/info-icon.jpg'
                                            }
                                        />
                                                        </p>

                                                   <div className=' mx-auto'> <Button variant="contained">Select</Button></div>
                                                 </div>
                                                </Stack>
                                            </Box>

                                           

                                          
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid
                                    item
                                    xs
                                    md={4}
                                    lg={4}
                                    xl={4}
                                    sx={{ paddingTop: '0' }}
                                >
                                    <Card
                                        className="PolicyDetails"
                                        sx={{
                                            boxShadow: 'none',
                                            border: '1px solid #DDD',
                                            background: '#FFF',
                                            borderRadius:'0px',
                                            borderTop: '6px solid #D0A610'
                                        }}
                                    >
                                        <CardContent
                                            sx={{
                                                padding: '1rem',
                                                margin: '0'
                                            }}
                                        >
                                            <Box sx={{ flexGrow: '1' }}>
                                                <Stack
                                                    sx={{
                                                        flexGrow: 1,
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'space-between',
                                                        marginBottom: '1rem'
                                                    }}
                                                >
                                                  <div className='flex flex-col w-full  gap-4'>
                                                    <p className='text-[#D0A610] border rounded-[20px] border-[#D0A610] py-[6] px-[32px] mx-auto'>Suggested</p>
                                                    <p className='flex items-center text-[#22334F] text-sm gap-1'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
<path d="M2.66663 9.21899L5.99996 12.5523L13.3333 5.21899" stroke="#23C565" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                                                        <span>Nil Depreciation</span>
                                                        <img
                                            src={
                                                BasePath +
                                                '/Images/info-icon.jpg'
                                            }
                                        />
                                                        </p>

                                                   <div className=' mx-auto'> <Button variant="contained">Select</Button></div>
                                                 </div>
                                                </Stack>
                                            </Box>

                                           

                                          
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid
                                    item
                                    xs
                                    md={4}
                                    lg={4}
                                    xl={4}
                                    sx={{ paddingTop: '0', marginTop:'25px' }}
                                >
                                    <Card
                                        className="PolicyDetails"
                                        sx={{
                                            boxShadow: 'none',
                                            border: '1px solid #DDD',
                                            background: '#FFF',
                                            borderRadius:'0px',
                                            borderTop: '6px solid #FF8383'
                                        }}
                                    >
                                        <CardContent
                                            sx={{
                                                padding: '1rem',
                                                margin: '0'
                                            }}
                                        >
                                            <Box sx={{ flexGrow: '1', padding:0 }}>
                                                <Stack
                                                    sx={{
                                                        flexGrow: 1,
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'space-between',
                                                        marginBottom: '1rem'
                                                    }}
                                                >
                                                  <div className='flex flex-col w-full  gap-4'>
                                                    <p className='text-[#FF8383] border rounded-[20px] border-[#FF8383] py-[6] px-[32px] mx-auto'>Popular</p>
                                                    <p className='flex items-center text-[#22334F] text-sm gap-1'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
<path d="M2.66663 9.21899L5.99996 12.5523L13.3333 5.21899" stroke="#23C565" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                                                        <span>Nil Depreciation</span></p>

                                                   <div className=' mx-auto'> <Button variant="contained">Select</Button></div>
                                                 </div>
                                                </Stack>
                                            </Box>

                                           

                                          
                                        </CardContent>
                                    </Card>
                                </Grid>
                            
                            </Grid>
                        </Box>
                    </DialogContentText>
                </DialogContent>
             
            </Dialog>
        </React.Fragment>
    )
}
