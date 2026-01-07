import { Box, Button, Grid, Stack, Typography } from '@mui/material'

import HandshakeIcon from '../../../../public/Images/D2C/handshake.png'
import HomeIcon from '@mui/icons-material/Home'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'

import { decrypt } from '../../utils/encryption'

export function ThankYouPage() {
    const [searchParams] = useSearchParams()
    const Amount: string = searchParams.get('EncAmount') || ''
    const OrderNo: string = searchParams.get('EncOrder_no') || ''
    const TxnStatus: string = searchParams.get('EncStatus') || ''
    const TxnID: string = searchParams.get('EncPG_Trans_Id') || ''
    const Remarks: string = searchParams.get('EncRemarks') || ''

    const data = [
        { label: 'Order No', value: OrderNo },
        { label: 'Transaction Status', value: TxnStatus },
        { label: 'Transaction Id', value: TxnID },
        { label: 'Transaction Amount', value: Amount },
        { label: 'Remarks', value: Remarks }
    ]
    return (
        <>
            {/* <Header />
      <Box className="margin-0 min-height-90 thankyou-container  ">        
        <Box className="flex items-center justify-center">         
          <Typography variant="h6" component="h6" className="thankyou-heading">
          Thank You for Choosing TMIBASL.
          </Typography>
        </Box>
        <Stack className="fixed bottom-0 w-full ">
          <Footer2 />
          <Footer />
        </Stack>
      </Box> */}

            <Box className="margin-0 thankyou-bg   min-h-screen  flex items-center justify-center pb-16">
                <Stack direction="column" className="items-center px-4">
                    <Box className="w-1/2 flex items-center justify-center">
                        <img src={HandshakeIcon} alt="HandshakeIcon" />
                    </Box>

                    <Typography
                        variant="h3"
                        component="h3"
                        className="font-weight-600 blue-Color margin-t margin-b"
                    >
                        Thank You!
                    </Typography>
                    {/* <Box className="w-1/2 flex items-center justify-center"> */}

                    <Grid container className="customdatatable">
                        <Grid item xs={12}>
                            {data.map((row, index) => (
                                <>
                                    <Grid container className="datatable-row">
                                        <Grid
                                            item
                                            xs={6}
                                            className="datatable-col"
                                        >
                                            {row.label}
                                        </Grid>
                                        <Grid
                                            item
                                            xs={6}
                                            className="datatable-col"
                                        >
                                            {row.value}
                                        </Grid>
                                    </Grid>
                                </>
                            ))}
                        </Grid>
                    </Grid>
                    {/* </Box> */}
                    <br />
                    <Typography
                        variant="h6"
                        component="h6"
                        className="font-weight-500  margin-b text-center"
                    >
                        We look forward to serving you again soon!
                    </Typography>
                </Stack>
            </Box>
        </>
    )
}
