import {
    Dialog,
    DialogTitle,
    IconButton,
    DialogContent,
    DialogContentText,
    Grid,
    DialogActions,
    Button,
    Typography,
    FormControlLabel,
    Checkbox,
    Paper,
    PaperProps,
    Slide,
    TextField
} from '@mui/material'
import { maxWidth, Box } from '@mui/system'
import React, { useState } from 'react'
import { FormInputSelect } from '../common/FormInputs/FormInputSelect'
import { FormInputText } from '../common/FormInputs/FormInputText'
import useMediaQuery from '@mui/material/useMediaQuery'
import { TransitionProps } from '@mui/material/transitions'
import Draggable from 'react-draggable'
import { useTheme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { useAppSelector } from '../../hooks/reduxHooks'
import {
    GetFinanciers,
    SaveFinanciers
} from '../../services/masterService/masterService'
import { AuthModel } from '../../redux/features/auth/authInterface'

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />
})

function PaperComponent(props: PaperProps) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    )
}

export function SearchMapFinanciers({ props }: any) {
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
    const [mappingData, setMappingData] = useState([])
    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )

    const [financierName, setFinancierName] = useState('')

    const [showError, setShowError] = useState(false)

    const handleFinChange = (e: any) => {
        setFinancierName(e.target.value)
        setShowError(false)
    }

    const handleClose = () => {
        setMappingData([])
        setFinancierName('')
        props.setMapFin(false)
    }

    const searchFinanciers = async () => {
        if (financierName == '') {
            setFinancierName('')
            return
        }
        let obj = {
            DealerId: loginSelector.DealerId,
            FinName: financierName
        }
        let result = await GetFinanciers(obj)
        if (result['Financiar'] != null && result['Financiar'].length > 0) {
            let financierData = []
            if (result['Financiarstring'].length > 0) {
                let presentFinanciers =
                    result['Financiarstring'][0]['FIN_STRING'].split(',')

                financierData = result['Financiar'].map((x) => {
                    x.checked = false
                    if (
                        presentFinanciers.indexOf(x['FINANCER_ID'].toString()) >
                        -1
                    )
                        x.checked = true
                    return x
                })
            } else {
                financierData = result['Financiar'].map((x) => {
                    x.checked = false

                    return x
                })
            }
            setMappingData(financierData)
            setShowError(false)
        } else {
            setMappingData([])
            setShowError(true)
        }
    }

    const SaveMappedFin = async () => {
        let finIds = mappingData
            .filter((x) => {
                return x.checked
            })
            .map((x) => {
                return x['FINANCER_ID']
            })
            .join(',')

        let obj = {
            FINANCER_IDs: finIds,
            DealerId: loginSelector.DealerId
        }

        let result = await SaveFinanciers(obj)

        props.GetFinanciers()
        handleClose()
    }

    const handleFinSelection = (event: any, index: any) => {
        let tempRTO = [...mappingData]
        tempRTO[index]['checked'] = event.target.checked

        setMappingData(tempRTO)
    }

    return (
        <>
            <React.Fragment>
                <Dialog
                    fullScreen={fullScreen}
                    //sx={{ width: 'calc(100% + 100px)' }}
                    TransitionComponent={Transition}
                    keepMounted
                    open={props.mapFin}
                    PaperComponent={PaperComponent}
                    PaperProps={{
                        className: 'w-full'
                    }}
                    onClose={handleClose}
                    aria-labelledby="draggable-dialog-title"
                    maxWidth="sm"
                >
                    <DialogTitle
                        style={{ cursor: 'move' }}
                        id="draggable-dialog-title"
                    >
                        Search Financiers
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500]
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent>
                        <DialogContentText></DialogContentText>
                        <Box sx={{ flexGrow: '1', padding: '1rem 1rem' }}>
                            <Grid container>
                                <Grid
                                    item
                                    xs={12}
                                    md={12}
                                    justifyContent={'center'}
                                >
                                    <TextField
                                        name="FIN_NAME"
                                        onChange={handleFinChange}
                                        label="Financier Name"
                                        placeholder="Financier Name"
                                        value={financierName}
                                        className="w-full"
                                    />
                                </Grid>
                                {financierName == '' && (
                                    <Grid
                                        item
                                        xs={12}
                                        md={12}
                                        justifyContent={'center'}
                                    >
                                        <span className="text-red-600">
                                            Please Enter Financier Name To
                                            Search.
                                        </span>
                                    </Grid>
                                )}
                                {showError && financierName != '' && (
                                    <Grid
                                        item
                                        xs={12}
                                        md={12}
                                        justifyContent={'center'}
                                    >
                                        <span className="text-red-600">
                                            No Records Found.
                                        </span>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            autoFocus
                            startIcon={<SearchOutlinedIcon />}
                            onClick={searchFinanciers}
                        >
                            Search
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleClose}
                            color="error"
                            autoFocus
                            startIcon={<CloseOutlinedIcon />}
                        >
                            Close
                        </Button>
                    </DialogActions>
                    {mappingData != null && mappingData.length > 0 ? (
                        <>
                            <DialogContent>
                                <Grid container>
                                    {mappingData?.map((value, index) => (
                                        <Grid item md={4} xs={12}>
                                            <FormControlLabel
                                                value={value['FINANCER_ID']}
                                                control={
                                                    <Checkbox
                                                        onChange={(e: any) =>
                                                            handleFinSelection(
                                                                e,
                                                                index
                                                            )
                                                        }
                                                        checked={value.checked}
                                                        disabled={
                                                            props.financiersList.findIndex(
                                                                (x) =>
                                                                    x[
                                                                        'FinanceId'
                                                                    ] ==
                                                                    value[
                                                                        'FINANCER_ID'
                                                                    ]
                                                            ) > -1
                                                        }
                                                    />
                                                }
                                                label={value['FINANCER_NAME']}
                                                labelPlacement="end"
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    variant="contained"
                                    onClick={SaveMappedFin}
                                    color="primary"
                                    autoFocus
                                    startIcon={<SaveOutlinedIcon />}
                                >
                                    Submit
                                </Button>
                            </DialogActions>
                        </>
                    ) : (
                        <></>
                    )}
                </Dialog>
            </React.Fragment>
        </>
    )
}
