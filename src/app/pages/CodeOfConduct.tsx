import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material'
import { Box, Stack } from '@mui/system'
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks'
import { AuthModel } from '../redux/features/auth/authInterface'
import { BasePath } from '../constants/baseURL'
import { useState } from 'react'
import { update } from '../redux/features/auth/authSlice'
import { updateMispDeclaration } from '../services/masterService/masterService'
import BackDropLoader from '../components/common/backDropLoading'

function CodeOfConduct() {
    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )

    const [showPdf, setShowPdf] = useState(false)
    const [showMsg, setShowMsg] = useState(false)
    const [showButton, setShowButton] = useState(false)
    const [enableAgree, setEnableAgree] = useState(false)
    const dispatch = useAppDispatch()

    const handleClick = async (flag) => {
        if (flag) {
            let data = await updateMispDeclaration(loginSelector.DealerId)
            if (data.status == 200)
                dispatch(
                    update({ ...loginSelector, ['IS_MISP_DECL_SUBMIT']: 1 })
                )
        } else {
            setShowMsg(true)
            setShowPdf(false)
        }
    }

    return (
        <>
            <Box p={4}>
                {showMsg ? (
                    <Typography variant="h2" component="h2">
                        Contact TMIBASL Representative.
                    </Typography>
                ) : (
                    <>
                        {/* <BackDropLoader openDialog={showPdf} /> */}
                        <Stack spacing={4}>
                            <Typography>
                                I {loginSelector.DealerName} hereby confirm as
                                Designated Person of above mentioned entity that
                                we are working as Motor Insurance Service
                                Provider (MISP) of Tata Motors Insurance Broking
                                And Advisory Services Limited (TMIBASL).
                            </Typography>
                            <Typography>
                                {' '}
                                I {loginSelector.DealerName} hereby confirm that
                                I have read and understood the provisions of the
                                MISP Guidelines issued by the Authority and
                                fully conversant with the MISP Code of Conduct
                                envisaged therein.
                            </Typography>
                            <Typography>
                                Please refer{' '}
                                <span
                                    className="underline hover:cursor-pointer hover:text-red-600"
                                    onClick={() => {
                                        setShowPdf(true)
                                        setShowButton(true)
                                    }}
                                    // style={{ color: 'red' }}
                                >
                                    Code of conduct for MISP and its employees &
                                    Section 42 (D) of the Insurance Act, 1938
                                </span>
                            </Typography>
                            <Typography>
                                I {loginSelector.DealerName} confirm that we
                                shall at all times adhere to the provisions of
                                the MISP Guidelines, Circulars, instructions
                                issued by the Authority from time to time.
                            </Typography>
                            <Typography>
                                Further, I {loginSelector.DealerName} solemnly
                                affirm and state that I/ we are not suffering
                                from any disqualifications as mentioned under
                                Section 42 (D) of the Insurance Act, 1938.
                            </Typography>
                            <Typography>
                                I {loginSelector.DealerName} confirm that we are
                                adhering to the Information and Cyber Security
                                Guidelines issued by IRDAI.
                            </Typography>
                            <Typography>
                                I / we {loginSelector.DealerName} hereby provide
                                the details of current account being maintained
                                by us towards receiving distribution fees from
                                TMIBASL for MISP business.
                            </Typography>
                        </Stack>
                        <TableContainer component={Paper}>
                            <Table
                                sx={{ minWidth: 650 }}
                                aria-label="simple table"
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Bank Name.</TableCell>
                                        <TableCell align="right">
                                            Account Number
                                        </TableCell>
                                        <TableCell align="right">
                                            Pan No
                                        </TableCell>
                                        <TableCell align="right">
                                            Location
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="right">
                                            {loginSelector.BANK}
                                        </TableCell>
                                        <TableCell align="right">
                                            {loginSelector.ACC_NO}
                                        </TableCell>
                                        <TableCell align="right">
                                            {loginSelector.PAN}
                                        </TableCell>
                                        <TableCell align="right">
                                            {loginSelector.LOCATION}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {enableAgree && (
                            <Stack direction={'row'} spacing={3}>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        handleClick(true)
                                    }}
                                >
                                    Agree
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        handleClick(false)
                                    }}
                                >
                                    Do Not Agree
                                </Button>
                            </Stack>
                        )}
                    </>
                )}
            </Box>
            {showPdf && (
                <div
                    style={{
                        width: '900px',
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        margin: 'auto',
                        transform: 'translate(-50%, -1%)',
                        paddingTop: '10px',
                        zIndex: '1300'
                    }}
                >
                    <Stack>
                        <span>
                            <Button
                                color="error"
                                sx={{
                                    padding: '0',
                                    minWidth: '0',
                                    float: 'right'
                                }}
                                variant="contained"
                                onClick={() => {
                                    setShowPdf(false)
                                    setEnableAgree(true)
                                }}
                            >
                                Close
                            </Button>
                        </span>

                        <embed
                            src={
                                BasePath +
                                '/COC/MISP_Code_of_conduct_Declaration.pdf'
                            }
                            width="900"
                            height="750"
                            type="application/pdf"
                        />
                    </Stack>
                </div>
            )}
        </>
    )
}

export default CodeOfConduct
