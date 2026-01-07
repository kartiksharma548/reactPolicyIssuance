import * as React from 'react'
import {
    Checkbox,
    Chip,
    Divider,
    Drawer,
    FormControl,
    SwipeableDrawer,
    Button,
    Box,
    List,
    ListItem,
    ListItemButton,
    FormControlLabel,
    FormGroup,
    Stack,
    TextField,
    Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import CheckedIcon from '@mui/material/'
import common from '../../../utils/common'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import { AdditionalCoversType } from '../../../models/types/Quotations/additionalCovers'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DoneIcon from '@mui/icons-material/Done'
import ChangeIDV from '../../../components/idv/ChangeIDV'
import VehicleInfo from '../../../components/vehicleDetailsData/vehicleDetails'
import Addons from '../../addOns/addOnComponent'

type Anchor = 'right'

function AdditionalCovers({
    setDiscounts,
    setStateDrawer,
    stateDrawer,
    updateQuote,
    proposalModel,
    props,
    setCheckedAddons,
    // open={showSuggestedAddons}
    setOpen,
    showAddons,
    setSelectedPackage,
    AdditionalCoverSlide
}: any) {
    const [checkState, setCheckState] = useState<AdditionalCoversType>({
        Electrical: {
            checked: proposalModel.ElectricalAmount > 0 ? true : false,
            validation: '',
            value: proposalModel.ElectricalAmount
        },
        NonElectrical: {
            checked: proposalModel.NElectricalAmount > 0 ? true : false,
            validation: '',
            value: proposalModel.NElectricalAmount
        },
        BiFuel: {
            checked: proposalModel.BiFuelAmount > 0 ? true : false,
            validation: '',
            value: proposalModel.BiFuelAmount
        },
        AntiTheft: {
            checked: proposalModel.IsAntiTheft,
            validation: '',
            value: 0
        },
        AA: { checked: proposalModel.IsAA, validation: '', value: 0 },
        VoluntaryExcess: {
            checked: proposalModel.VoluntaryDisc > 0 ? true : false,
            validation: '',
            value: proposalModel.VoluntaryDisc
        }
    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (
            !isNaN(parseInt(event.target.value.slice(-1), 10)) ||
            !common.isNotNullOrEmpty(event.target.value)
        ) {
            setCheckState({
                ...checkState,
                [event.target.name]: {
                    ...checkState[event.target.name],
                    ['value']: event.target.value
                }
            })
        }
    }

    useEffect(() => {
        setDiscounts(checkState)
    }, [checkState])

    // Left Drawer

    const toggleDrawer = (open: boolean) => {
        setStateDrawer(open)
    }

    const updateCovers = () => {
        let tempState = { ...checkState }
        let errorCount = 0
        if (
            tempState.Electrical.checked &&
            tempState.Electrical.value.toString() == ''
        ) {
            tempState.Electrical.validation =
                'Please enter Electrical accessories amount.'
            errorCount = errorCount + 1
        } else if (
            tempState.Electrical.checked == false &&
            tempState.Electrical.value != '' &&
            tempState.Electrical.value != 0
        ) {
            tempState.Electrical.value = 0
            setCheckState({
                ...checkState,
                ['Electrical']: {
                    ...checkState['Electrical'],
                    ['value']: 0
                }
            })
        } else {
            errorCount = errorCount - 1
            tempState.Electrical.validation = ''
        }

        if (
            tempState.NonElectrical.checked &&
            tempState.NonElectrical.value.toString() == ''
        ) {
            errorCount = errorCount + 1
            tempState.NonElectrical.validation =
                'Please enter Non-Electrical accessories amount.'
        } else if (
            tempState.NonElectrical.checked == false &&
            tempState.NonElectrical.value != '' &&
            tempState.NonElectrical.value != 0
        ) {
            tempState.NonElectrical.value = 0
            setCheckState({
                ...checkState,
                ['NonElectrical']: {
                    ...checkState['NonElectrical'],
                    ['value']: 0
                }
            })
        } else {
            errorCount = errorCount - 1
            tempState.NonElectrical.validation = ''
        }

        if (
            tempState.VoluntaryExcess.checked &&
            tempState.VoluntaryExcess.value == 0
        ) {
            errorCount = errorCount + 1
            tempState.VoluntaryExcess.validation =
                'Please choose Voluntary Excess.'
        } else {
            errorCount = errorCount - 1
            tempState.VoluntaryExcess.validation = ''
        }

        if (
            tempState.BiFuel.checked &&
            tempState.BiFuel.value.toString() == ''
        ) {
            tempState.BiFuel.validation = 'Please enter BiFuel amount.'
            errorCount = errorCount + 1
        } else if (
            tempState.BiFuel.checked == false &&
            tempState.BiFuel.value != '' &&
            tempState.BiFuel.value != 0
        ) {
            tempState.BiFuel.value = 0
            setCheckState({
                ...checkState,
                ['BiFuel']: {
                    ...checkState['BiFuel'],
                    ['value']: 0
                }
            })
        } else {
            errorCount = errorCount - 1
            tempState.BiFuel.validation = ''
        }

        setCheckState(tempState)
        if (errorCount <= 0) {
            toggleDrawer(false)
            updateQuote()
            setDiscounts(checkState)
        }
    }

    const list = (anchor: Anchor) => (
        <div
            className="w-[300px] md:w-[400] p-[1rem] md:p-[2rem] pb-[1rem] "
            role="presentation"
        >
            <List>
                <Typography variant="h6" sx={{ marginBottom: '1rem' }}>
                    Choose Additional Covers
                </Typography>
                <FormGroup>
                    {proposalModel.CoverType?.split('+')[0]?.split(' ')[0] !=
                        '0' && (
                        <>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        sx={{ borderRadius: '2px' }}
                                        checked={checkState.Electrical.checked}
                                        onChange={() => {
                                            setCheckState({
                                                ...checkState,
                                                ['Electrical']: {
                                                    ...checkState.Electrical,
                                                    ['checked']:
                                                        !checkState.Electrical
                                                            .checked
                                                }
                                            })
                                        }}
                                    />
                                }
                                label="Electrical Accessories"
                            />
                            {checkState.Electrical.checked && (
                                <>
                                    <TextField
                                        onChange={handleChange}
                                        value={checkState.Electrical.value}
                                        name="Electrical"
                                        id="standard-basic"
                                        hidden={!checkState.Electrical.checked}
                                        variant="standard"
                                    />
                                    <span className="text-red-600">
                                        {checkState.Electrical.validation}
                                    </span>
                                </>
                            )}
                            <Divider />
                            <FormControlLabel
                                sx={{ marginTop: '.5rem' }}
                                control={
                                    <Checkbox
                                        sx={{ borderRadius: '2px' }}
                                        checked={
                                            checkState.NonElectrical.checked
                                        }
                                        onChange={() => {
                                            setCheckState({
                                                ...checkState,
                                                ['NonElectrical']: {
                                                    ...checkState.NonElectrical,
                                                    ['checked']:
                                                        !checkState
                                                            .NonElectrical
                                                            .checked
                                                }
                                            })
                                        }}
                                    />
                                }
                                label="Non-Electrical Accessories"
                            />
                            {checkState.NonElectrical.checked && (
                                <>
                                    <TextField
                                        onChange={handleChange}
                                        id="standard-basic"
                                        name="NonElectrical"
                                        value={checkState.NonElectrical.value}
                                        hidden={
                                            !checkState.NonElectrical.checked
                                        }
                                        variant="standard"
                                    />
                                    <span className="text-red-600">
                                        {checkState.NonElectrical.validation}
                                    </span>
                                </>
                            )}
                            <Divider />
                            {proposalModel.FuelType != 'ELECTRIC' && (
                                <FormControlLabel
                                    sx={{ marginTop: '.5rem' }}
                                    control={
                                        <Checkbox
                                            sx={{ borderRadius: '2px' }}
                                            checked={checkState.BiFuel.checked}
                                            onChange={() => {
                                                setCheckState({
                                                    ...checkState,
                                                    ['BiFuel']: {
                                                        ...checkState.BiFuel,
                                                        ['checked']:
                                                            !checkState.BiFuel
                                                                .checked
                                                    }
                                                })
                                            }}
                                        />
                                    }
                                    label="BiFuel Kit"
                                />
                            )}

                            {checkState.BiFuel.checked && (
                                <>
                                    <TextField
                                        onChange={handleChange}
                                        id="standard-basic"
                                        name="BiFuel"
                                        value={checkState.BiFuel.value}
                                        hidden={!checkState.BiFuel.checked}
                                        variant="standard"
                                    />
                                    <span className="text-red-600">
                                        {checkState.BiFuel.validation}
                                    </span>
                                </>
                            )}
                            <Divider />
                        </>
                    )}

                    <FormControlLabel
                        sx={{ marginTop: '.5rem' }}
                        control={
                            <Checkbox
                                sx={{ borderRadius: '2px' }}
                                checked={checkState.AntiTheft.checked}
                                onChange={() => {
                                    setCheckState({
                                        ...checkState,
                                        ['AntiTheft']: {
                                            ...checkState.AntiTheft,
                                            ['checked']:
                                                !checkState.AntiTheft.checked
                                        }
                                    })
                                }}
                            />
                        }
                        label="Anti Theft"
                    />
                    {/* {
                      checkState.AntiTheft.checked && <TextField onChange={handleChange} id="standard-basic" name="AntiTheft" hidden={!checkState.AntiTheft.checked} variant="standard" />
                  } */}

                    <Divider />
                    {proposalModel.VEHICLE_CLASS == 'P' && (
                        <>
                            <FormControlLabel
                                sx={{ marginTop: '.5rem' }}
                                control={
                                    <Checkbox
                                        sx={{ borderRadius: '2px' }}
                                        checked={checkState.AA.checked}
                                        onChange={() => {
                                            setCheckState({
                                                ...checkState,
                                                ['AA']: {
                                                    ...checkState.AA,
                                                    ['checked']:
                                                        !checkState.AA.checked
                                                }
                                            })
                                        }}
                                    />
                                }
                                label="AA Membership"
                            />

                            <Divider />
                            <FormControlLabel
                                sx={{ marginTop: '.5rem' }}
                                control={
                                    <Checkbox
                                        sx={{ borderRadius: '2px' }}
                                        checked={
                                            checkState.VoluntaryExcess.checked
                                        }
                                        onChange={() => {
                                            setCheckState({
                                                ...checkState,
                                                ['VoluntaryExcess']: {
                                                    ...checkState.VoluntaryExcess,
                                                    ['checked']:
                                                        !checkState
                                                            .VoluntaryExcess
                                                            .checked
                                                }
                                            })
                                        }}
                                    />
                                }
                                label={'Voluntary Excess'}
                            />
                            <span className="text-red-600">
                                {checkState.VoluntaryExcess.validation}
                            </span>
                            <Typography fontSize={12} marginBottom={3}>
                                You pay the voluntary excess on top of the
                                compulsory excess, which is set by your insurer.
                            </Typography>
                            {checkState.VoluntaryExcess.checked && (
                                <Stack direction={'row'} spacing={1}>
                                    <Chip
                                        onClick={() =>
                                            setCheckState({
                                                ...checkState,
                                                ['VoluntaryExcess']: {
                                                    ...checkState.VoluntaryExcess,
                                                    ['value']: 2500
                                                }
                                            })
                                        }
                                        variant="outlined"
                                        label={'2500'}
                                        style={{
                                            backgroundColor:
                                                checkState.VoluntaryExcess
                                                    .value == 2500
                                                    ? '#88bfc0'
                                                    : ''
                                        }}
                                        className={
                                            'hover:bg-cyan-200 hover:cursor-pointer '
                                        }
                                        color="primary"
                                    />

                                    <Chip
                                        onClick={() =>
                                            setCheckState({
                                                ...checkState,
                                                ['VoluntaryExcess']: {
                                                    ...checkState.VoluntaryExcess,
                                                    ['value']: 5000
                                                }
                                            })
                                        }
                                        variant="outlined"
                                        style={{
                                            backgroundColor:
                                                checkState.VoluntaryExcess
                                                    .value == 5000
                                                    ? '#88bfc0'
                                                    : ''
                                        }}
                                        className={
                                            'hover:bg-cyan-200 hover:cursor-pointer '
                                        }
                                        label={'5000'}
                                        color="primary"
                                    />

                                    <Chip
                                        onClick={() =>
                                            setCheckState({
                                                ...checkState,
                                                ['VoluntaryExcess']: {
                                                    ...checkState.VoluntaryExcess,
                                                    ['value']: 7500
                                                }
                                            })
                                        }
                                        variant="outlined"
                                        style={{
                                            backgroundColor:
                                                checkState.VoluntaryExcess
                                                    .value == 7500
                                                    ? '#88bfc0'
                                                    : ''
                                        }}
                                        className={
                                            'hover:bg-cyan-200 hover:cursor-pointer '
                                        }
                                        label={'7500'}
                                        color="primary"
                                    />

                                    <Chip
                                        onClick={() =>
                                            setCheckState({
                                                ...checkState,
                                                ['VoluntaryExcess']: {
                                                    ...checkState.VoluntaryExcess,
                                                    ['value']: 15000
                                                }
                                            })
                                        }
                                        variant="outlined"
                                        style={{
                                            backgroundColor:
                                                checkState.VoluntaryExcess
                                                    .value == 15000
                                                    ? '#88bfc0'
                                                    : ''
                                        }}
                                        className={
                                            'hover:bg-cyan-200 hover:cursor-pointer '
                                        }
                                        label={'15000'}
                                        color="primary"
                                    />
                                </Stack>
                            )}
                        </>
                    )}
                    <Button
                        variant="contained"
                        startIcon={<DoneIcon />}
                        sx={{ marginTop: '1rem', borderRadius: '8px' }}
                        onClick={updateCovers}
                    >
                        Update
                    </Button>
                </FormGroup>
            </List>
        </div>
    )

    return (
        <React.Fragment>
            <SwipeableDrawer
                anchor={'right'}
                open={stateDrawer}
                onClose={() => toggleDrawer(false)}
                onOpen={() => toggleDrawer(true)}
            >
                {AdditionalCoverSlide && list('right')}

                {showAddons && (
                    <div className="block md:hidden h-full">
                        <div
                            className="w-[300px] md:w-[400] p-[1rem] h-full md:p-[2rem] pb-[1rem] "
                            role="presentation"
                        >
                            <List className="h-full">
                                <Typography
                                    variant="h6"
                                    sx={{
                                        marginBottom: '1rem',
                                        height: '100%'
                                    }}
                                >
                                    <Addons
                                        height={'true'}
                                        proposalModel={proposalModel}
                                        props={props}
                                        setCheckedAddons={setCheckedAddons}
                                        // open={showSuggestedAddons}
                                        setOpen={setOpen}
                                        setSelectedPackage={setSelectedPackage}
                                    />
                                </Typography>
                            </List>
                        </div>
                    </div>
                )}
            </SwipeableDrawer>
        </React.Fragment>
    )
}

export default AdditionalCovers
