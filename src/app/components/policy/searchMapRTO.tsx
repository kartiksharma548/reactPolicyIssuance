import * as React from 'react'
import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import Paper, { PaperProps } from '@mui/material/Paper'
import Draggable from 'react-draggable'
import { Box, Grid, Typography } from '@mui/material'
import { FormInputText } from '../../components/common/FormInputs/FormInputText'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MapRTOSchema, mapRTOSchema } from '../../models/schemas/searchMapRTO'
import { FormInputSelect } from '../../components/common/FormInputs/FormInputSelect'
import {
    getActiveStates,
    getActiveCity,
    getPOSCityRTOFromfromCity,
    saveMappedRTOV1
} from '../../services/policyServices/policyService'
import { CitySearchModel, CityRTOModel } from '../../models/PolicyProposalMDL'
import { useAppSelector } from '../../hooks/reduxHooks'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import toast, { ToastPosition, Toaster } from 'react-hot-toast'

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



export default function SearchMapRto({ props }) {
    let rto = props.rto
    let setRTO = props.setRTO
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
    const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('md')
    const [state, setStates] = useState([])
    const [city, setCity] = useState([])

    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )
    const objCitySearchModel = new CitySearchModel()
    const objCityRTOModel = new CityRTOModel()

    const [searchRTO, setSearchRTO] = useState(objCityRTOModel)
    const [mappingData, setMappingData] = useState([])
    const [mappedData, setMappedData] = useState([])
    const [list, setList] = React.useState(rto)
    const [isSearched, setIsSearched] = useState(false)
    const rtoList = React.useRef([])

    const handleClose = () => {
        setIsSearched(false)
        setSearchRTO({ ...objCityRTOModel })
        setMappingData(null)
        reset({ RTO_NAME: '', State: '', City: '' })
        props.setMapRto(false)
    }
    const handleRTOChange = (event: any) => {
        const { target } = event
        const { name, value } = target
        if (name === 'State') {
            setSearchRTO({ ...searchRTO, [name]: value })
            getActiveCityFN(value)
        } else {
            setSearchRTO({ ...searchRTO, [name]: value })
        }
    }
    const getActiveStatesFN = async () => {
        let data = await getActiveStates()
        if (data.status == 200) {
            setStates(data.data.States)
        }
    }
    const getActiveCityFN = async (State: any) => {
        objCitySearchModel.StateId = State
        let cityData = await getActiveCity(objCitySearchModel)
        if (cityData.status === 200) {
            setCity(cityData.data.Cities)
        }
    }
    const handleRTOSelection = (event: any) => {
        let tempRTO = [...mappingData]
        tempRTO.forEach((element) => {
            if (element.RTO_ID == event.target.value) {
                element.checked = !element.checked
            }
        })
        setMappedData(tempRTO)
    }

    const SaveMappedRTO = async () => {
        let data = mappedData
            .filter((id) => id.checked == true)
            .map((e) => e.RTO_ID)
        if(data.length==0){
            
             handleClose()
             return
        }
        objCityRTOModel.rtoName = data.toString()
        objCityRTOModel.DealerId = loginSelector.DealerId
        let isSuccess = await saveMappedRTOV1(objCityRTOModel)
        if (isSuccess.status == 200) {
            if (isSuccess.data.ErrorCode == 1) {
                mappedData.forEach((element, index) => {
                    if (
                        rto.filter((x) => x.RTOId == element.RTO_ID).length <=
                            0 &&
                        element.checked
                    ) {
                        list.push({
                            RTOId: element.RTO_ID,
                            RTOName: element.RTO_NAME,
                            RTONameWithStateCode: element.rtoName
                        })
                    }
                })
                setRTO([...rto, ...list])
                toast.success(isSuccess.data.ErrorMessage)
                setSearchRTO({ ...objCityRTOModel })
                setMappingData(null)
                setList([])
                handleClose()
            } else {
                toast.error(isSuccess.data.ErrorMessage)
                handleClose()
            }
        }
    }

    useEffect(() => {
        getActiveStatesFN()
    }, [])
    const {
        handleSubmit,
        control,
        setFocus,
        register,
        formState: { errors },
        setValue,
        setError,
        reset
    } = useForm<MapRTOSchema>({
        mode: 'all',
        resolver: zodResolver(mapRTOSchema),
        defaultValues: {
            State: 0,
            City: 0,
            RTO_NAME: ''
        }
    })
    const onSubmit: SubmitHandler<MapRTOSchema> = async (data) => {
        
        setIsSearched(true)
        searchRTO.DealerId = loginSelector.DealerId
        searchRTO.RTO_NAME = data.RTO_NAME // ensure this line is present!
    
        let rtodata = await getPOSCityRTOFromfromCity(searchRTO)
        console.log('rtodata:', rtodata)
        if (rtodata.status == 200) {
            const rtos = Object.keys(rtodata.data.Citiesrto).map(
                (key) => rtodata.data.Citiesrto[key]
            )
            if (rtos.length > 0) {
                const currentRTOs = rtodata.data.RTOstring[0]['RTO_STRING']
                    .split(',')
                    .map((x) => {
                        return x.replace(' ', '')
                    })
                rtos.forEach((rtolist) => {
                    if (
                        currentRTOs.indexOf(rtolist['RTO_ID'].toString()) > -1
                    ) {
                        rtolist.checked = true
                        rtolist.disabled = true
                    } else {
                        rtolist.checked = false
                        rtolist.disabled = false
                    }
                })
                rtoList.current = rtos
                setMappingData(rtos)
            } else {
                setMappingData([])
            }
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
    return (
        <>
            <React.Fragment>
                <Dialog
                    fullScreen={fullScreen}
                    fullWidth={true}
                    maxWidth={maxWidth}
                    TransitionComponent={Transition}
                    keepMounted
                    open={props.isMapRtoOpen}
                    PaperComponent={PaperComponent}
                    onClose={handleClose}
                    aria-labelledby="draggable-dialog-title"
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DialogTitle
                            style={{
                                cursor: 'move',
                                backgroundColor: '#d4dfe9'
                            }}
                            id="draggable-dialog-title"
                        >
                            Search RTO
                        </DialogTitle>
                        <IconButton
                            aria-label="close"
                            className="searchRtoCloseBtn"
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
                                <Grid container spacing={6}>
                                    <Grid
                                        item
                                        xs={12}
                                        md={12}
                                        id="IdRegistrationNo"
                                    >
                                        <div className="flex flex-col md:flex-row gap-3">
                                            <Grid item xs={12} md={12}>
                                                <FormInputText
                                                    control={control}
                                                    name="RTO_NAME"
                                                    onChangeFn={handleRTOChange}
                                                    label="RTO Name"
                                                    placeholder="RTO"
                                                    inputProps={{
                                                        maxLength: 50
                                                    }}
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                md={12}
                                                sx={{ margin: '' }}
                                            >
                                                <FormInputSelect
                                                    control={control}
                                                    name="State"
                                                    onChangeFn={handleRTOChange}
                                                    label="State"
                                                    LIST={state}
                                                    TEXT="StateName"
                                                    VALUE="StateId"
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={12}>
                                                <FormInputSelect
                                                    control={control}
                                                    name="City"
                                                    onChangeFn={handleRTOChange}
                                                    label="City"
                                                    LIST={city}
                                                    TEXT="CityName"
                                                    VALUE="CityId"
                                                />
                                            </Grid>
                                        </div>
                                    </Grid>
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

                        {isSearched && mappingData !== null && mappingData.length === 0 && (
                            <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                                <Typography variant="h6" color="text.secondary">
                                    No Records Found!
                                </Typography>
                            </Box>
                        )}

                        {mappingData != null && mappingData.length > 0 ? (
                            <>
                                <DialogContent>
                                    <Grid container>
                                        {mappingData?.map((value, index) => (
                                            <Grid item md={4} xs={12}>
                                                <FormControlLabel
                                                    value={value['RTO_ID']}
                                                    control={
                                                        <Checkbox
                                                            checked={
                                                                value.checked
                                                            }
                                                            disabled={
                                                                value.disabled
                                                            }
                                                            onChange={
                                                                handleRTOSelection
                                                            }
                                                        />
                                                    }
                                                    label={value['RTO_NAME']}
                                                    labelPlacement="end"
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        variant="contained"
                                        onClick={SaveMappedRTO}
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
                    </form>
                </Dialog>
            </React.Fragment>
            <Toaster />
        </>
    )
}
