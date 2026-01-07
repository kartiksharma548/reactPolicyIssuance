import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Checkbox,
    FormControlLabel,
    FormGroup,
    TextField,
    Button
} from '@mui/material'
import * as React from 'react'
import { AddOnMDL } from '../../models/AddonMDL'
import { useEffect, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { BasePath } from '../../constants/baseURL'
import common from '../../utils/common'
import toast, { ToastPosition, Toaster } from 'react-hot-toast'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import TmiSuggestion from '../quotations/tmisuggestion'
import SuggestedAddOns from '../quotations/addOns/suggestedAddons'

function Addons({
    props,
    setCheckedAddons,
    proposalModel,
    setSelectedPackage,
    setOpen,
    height
}: any) {
    let tempAddOns = JSON.parse(JSON.stringify(props)) as AddOnMDL[]
    const [showTmiSuggestion, setShowTmiSuggestion] = React.useState(false)
    // tempAddOns = tempAddOns.forEach((x) => {
    //     return (x.isChecked = false)
    // })

    useEffect(() => {
        // let checkingSelectedAddons = [...tempAddOns]
        // if (proposalModel != null && proposalModel.SelectedAddon.length > 0) {
        //     checkingSelectedAddons.forEach((x) => {
        //         if (
        //             proposalModel.SelectedAddon.split(',').indexOf(
        //                 x.AddOnTypeId.toString()
        //             ) > -1
        //         ) {
        //             if (x.AddOnType == 'RTI') {
        //                 x.IsCoverValue = true

        //                 x.CoverValue = proposalModel.RTI_Amount
        //             }
        //             if (x.AddOnType == 'EMI') {
        //                 x.IsCoverValue = true
        //                 x.CoverValue = proposalModel.EMI_Amount
        //             }

        //             x.isChecked = true
        //         }
        //         //else {
        //         //     x.isChecked = false
        //         // }
        //     })
        // }

        setAddons(tempAddOns)
        setCheckedAddons(tempAddOns)
    }, [proposalModel, props])

    const [expanded, setExpanded] = useState(true)
    const [AddOns, setAddons] = useState(tempAddOns)

    const handleAddOnChange = (addon: AddOnMDL, index: number) => {
        let newAddons = JSON.parse(JSON.stringify(AddOns)) as AddOnMDL[]
        newAddons[index].isChecked = !newAddons[index].isChecked
        if (newAddons[index].isChecked) {
            if (
                newAddons[index].AddOnType == 'RTI' ||
                newAddons[index].AddOnType == 'EMI'
            )
                newAddons[index].IsCoverValue = true
            if (newAddons[index].AddOnType == 'RTI')
                newAddons[index].CoverValue =parseInt((
                    parseInt(proposalModel.ExShowroomPrice) +
                    (proposalModel.ExShowroomPrice * 10) / 100
                )).toString()
            else newAddons[index].CoverValue = ''
        } else {
            newAddons[index].IsCoverValue = false
            newAddons[index].CoverValue = ''
        }

        setAddons(newAddons)
        setCheckedAddons(newAddons)
        //setSelectedPackage(null)
    }

    const handleTextChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        addon: AddOnMDL,
        index: number
    ) => {
        if (
            !isNaN(parseInt(event.target.value.slice(-1), 10)) ||
            !common.isNotNullOrEmpty(event.target.value)
        ) {
            let newAddons = JSON.parse(JSON.stringify(AddOns)) as AddOnMDL[]
            newAddons[index].CoverValue = event.target.value

            if (addon['AddOnType'] == 'RTI') {
                if (proposalModel.IDV < parseInt(event.target.value)) {
                    return
                }
            }

            setAddons(newAddons)
            setCheckedAddons(newAddons)
        }
    }

    //Clear All Addon function
    const deselectAddon = () => {
        let tempAddOnsDeselect = JSON.parse(JSON.stringify(props)) as AddOnMDL[]
        tempAddOnsDeselect.forEach((element) => {
           if(!element.IsDisabled) element.isChecked = false
            
            element.IsCoverValue = false
            element.CoverValue = ''
        })
        setAddons(tempAddOnsDeselect)
        setCheckedAddons(tempAddOnsDeselect)
        setAddons(tempAddOnsDeselect)
    }
    //const [showSuggestedAddons, setShowSuggestedAddons] = useState(false)
    const openSuggestedAddonsFn = () => {
        setOpen(true)
    }

    return (
        <>
            <Accordion
                className='AddonListTooltip-container'
                // className=" overflow-auto"
                expanded={expanded}
                onChange={() => {
                    setExpanded(!expanded)
                }}
                sx={{
                    backgroundColor: 'transparent',
                    border: '0px',
                    boxShadow: '0px 0px 0px'
                }}
            >
                <AccordionSummary
                    className="accordianHeading addOnHeading"
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <span className="AccordianItem">Addon Covers</span>
                </AccordionSummary>
                <AccordionDetails className="">
                    <FormGroup>
                        <div className="flex justifty-between gap-[3px] items-center">
                            <p
                                onClick={() => {
                                    openSuggestedAddonsFn()
                                }}
                                className="w-full text-[#22334F] text-[8px] xl:text-xs py-2 md:py-3 !px-2 !md:px-4 bg-[#ECF0F4] my-1 rounded-lg cursor-pointer"
                            >
                                TMIBASL Suggested Addon Packages
                            </p>

                            {showTmiSuggestion && (
                                <TmiSuggestion
                                    open={showTmiSuggestion}
                                    setOpen={setShowTmiSuggestion}
                                />
                            )}
                            {AddOns.filter((x) => x.isChecked).length > 0 && (
                                <div>
                                    <Button
                                        onClick={deselectAddon}
                                        color="error"
                                        style={{
                                            textTransform: 'capitalize',
                                            // fontSize: '10px'
                                        }}
                                        className='text-[8px] xl:text-[10px] !py-2 !px-2 !md:px-4 !my-1'
                                        startIcon={
                                            <ClearOutlinedIcon
                                                style={{
                                                    height: '12px',
                                                    width: '12px'
                                                }}
                                            />
                                        }
                                    >
                                        Clear
                                    </Button>
                                </div>
                            )}
                        </div>

                        {AddOns?.map((addOn, index) => {
                            return (
                                <div
                                    className="flex flex-row items-center gap-2"
                                    key={addOn.AddOnType + index}
                                >
                                    <div className='flex flex-row basis-5/6'>
                                        <FormControlLabel
                                            key={index}
                                            control={
                                                <Checkbox
                                                    checked={addOn.isChecked}
                                                    onChange={() =>
                                                        handleAddOnChange(
                                                            addOn,
                                                            index
                                                        )
                                                    }
                                                    disabled={addOn.IsDisabled}
                                                />
                                            }
                                            className={'text-balance' + (addOn.IsCoverValue ? 'basis-1/2' : '')}
                                            // label={addOn.AddOnName}
                                            label={
                                                <span style={{ fontSize: 14, lineHeight: '18px' }}>
                                                    {addOn.AddOnName}
                                                </span>
                                            }
                                        />

                                        {addOn.IsCoverValue && (
                                            <TextField
                                                id={addOn.AddOnType + '_Value'}
                                                size="small"
                                                value={addOn.CoverValue}
                                                disabled={addOn.AddOnType == 'RTI'}
                                                variant="outlined"
                                                onChange={(e) =>
                                                    handleTextChange(
                                                        e,
                                                        addOn,
                                                        index
                                                    )
                                                }
                                                className='w-3/5'
                                            />
                                        )}
                                    </div>

                                    <div className="flex justify-center tooltip basis-2/12">
                                        <img
                                            src={
                                                BasePath +
                                                '/Images/info-icon.jpg'
                                            }
                                        />
                                        <div className="tooltiptext ">
                                            <div className="">
                                                {/* <p className="text-[10px] font-medium">
                                                    {addOn.AddOnName}
                                                </p> */}
                                                <p className="text-[10px]">
                                                    {addOn.AddOnDescription}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </FormGroup>
                </AccordionDetails>
            </Accordion>

            <Toaster />
        </>
    )
}

export default Addons
