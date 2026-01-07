import { useEffect, useState } from 'react'
import * as React from 'react'
import { IProposal } from '../../../models/IProposal'
import { getAddonPackages } from '../../../services/policyServices/quoteService'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { Box, Paper, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import common from '../../../utils/common'
import CloseIcon from '@mui/icons-material/Close'
import logo from '../../../../assets/images/Tata-Logo.png'
import { Grid, CardContent, Card } from '@mui/material'
import { BasePath } from '../../../constants/baseURL'

const SuggestedAddOns = ({
    ProposalId,
    open,
    setOpen,
    proposalModel,
    addOns,
    setAddons,
    setAddonsRef,
    selectedPackage,
    setSelectedPackage
}: any) => {
    const [addonPkgs, setAddonPkgs] = useState<AddonPackage[]>([])

    type ADDON = {
        ADDON_NAMES: string
        ADDON_DESC: string
    }

    type AddonPackage = {
        PACKAGE_NAME: string
        ADDON_NAMES: ADDON[]
        PACKAGE_IDs: string
        GridStyle: string
    }
    useEffect(() => {
        getAddonPackagesFn()
    }, [])

    useEffect(() => {
        checkSelectedAddonPkgs(addonPkgs)
    }, [open])
    const getAddonPackagesFn = async () => {
        let proposal = {} as IProposal
        proposal.ProposalId = ProposalId

        let data = await getAddonPackages(proposal)
        setAgeBracket(data[0]['AGE_BRACKET'])
        calculateAddonPackages(data)
    }

    const [ageBracket, setAgeBracket] = useState('')

    const calculateAddonPackages = (addonPkgs: AddOnPackageType[]) => {
        let objectPackage = {
            PACKAGE_NAME: '',
            ADDON: [],
            PACKAGE_IDs: '',
            GridStyle: '',
            CardStyle: '',
            CardContentStyle: '',
            BoxStyle: '',
            StackStyle: '',
            ButtonClass: ''
        }

        let AddonPackageArr: AddonPackage[] = []

        addonPkgs.forEach((pkg) => {
            objectPackage = {
                PACKAGE_NAME: '',
                ADDON: [],
                PACKAGE_IDs: '',
                GridStyle: '',
                CardStyle: '',
                CardContentStyle: '',
                BoxStyle: '',
                StackStyle: '',
                ButtonClass: ''
            }
            objectPackage.PACKAGE_NAME = pkg.PACKAGE_NAME.replace('\r\n', '')
            objectPackage.PACKAGE_IDs = pkg.ADDON_TYPE
            objectPackage.GridStyle = pkg.GridStyle
            objectPackage.CardStyle = pkg.CardStyle
            objectPackage.CardContentStyle = pkg.CardContentStyle
            objectPackage.BoxStyle = pkg.BoxStyle
            objectPackage.StackStyle = pkg.StackStyle
            objectPackage.ButtonClass = pkg.ButtonClass
            let addonPkgIds = pkg.ADDON_TYPE.split(',')

            addonPkgIds.forEach((pkgIds) => {
                for (let index = 0; index < addOns.length; index++) {
                    const addOn = addOns[index]
                    if (
                        addOn.AddOnTypeId.toString() ==
                        pkgIds.replace('\r\n', '')
                    ) {
                        let obj = {
                            ADDON_NAMES: addOn.AddOnName,
                            ADDON_DESC: addOn.AddOnDescription
                        }
                        objectPackage.ADDON.push(obj)
                        break
                    }
                }
            })

            AddonPackageArr.push(objectPackage)
        })

        setAddonPkgs(AddonPackageArr)
        checkSelectedAddonPkgs(AddonPackageArr)
    }

    const checkSelectedAddonPkgs = (addonPkgsArr: AddonPackage[]) => {
        if (
            common.isNotNullOrEmpty(addonPkgsArr) &&
            common.isNotNullOrEmpty(addOns)
        ) {
            let checkedAddons = addOns
                .filter((x) => x.isChecked)
                .map((y) => {
                    return y.AddOnTypeId
                })
                .sort((a: any, b: any) => {
                    return a - b
                })
                .join(',')

            let selectedPkg: number = null

            addonPkgsArr.forEach((pkg, index) => {
                let pkgIds = pkg['PACKAGE_IDs']
                    .split(',')
                    .sort((a: any, b: any) => {
                        return a - b
                    })
                    .join(',')
                    .replace('\r\n', '')

                if (checkedAddons == pkgIds) selectedPkg = index
            })

            setSelectedPackage(selectedPkg)
        }
    }
    const handleClose = () => {
        setOpen(false)
    }

    const selectAddonPackage = (addonPkgIds: string, index: number) => {
        let addonPkgIdsArr = addonPkgIds.split(',')

        let tempAddons = [...addOns]

        tempAddons = tempAddons.map((x) => {
           if(!x.IsDisabled) x.isChecked = false
            x.IsCoverValue = false
            x.CoverValue = ''
            return x
        })

      

        addonPkgIdsArr.forEach((pkgIds) => {
            for (let index = 0; index < tempAddons.length; index++) {
                const addOn = tempAddons[index]
                if (
                    addOn.AddOnTypeId.toString() == pkgIds.replace('\r\n', '')
                ) {
                    if (addOn.AddOnType == 'RTI') {
                        addOn.IsCoverValue = true

                        addOn.CoverValue = parseInt((
                    parseInt(proposalModel.ExShowroomPrice) +
                    (proposalModel.ExShowroomPrice * 10) / 100
                )).toString()
                    }
                    if (addOn.AddOnType == 'EMI') {
                        addOn.IsCoverValue = true
                    }
                    addOn.isChecked = true
                    break
                }
            }
        })

        setAddonsRef(tempAddons)
        setAddons(tempAddons)
        setSelectedPackage(index)
        handleClose()
    }
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper')
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            className='popularAddonPackages-container'
            scroll={scroll}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{
                '& .MuiDialog-container': {
                    '& .MuiPaper-root': {
                        width: '100%',
                        maxWidth: '1088px', // Set your width here
                        overflow: "visible",
                    }
                }
            }}
        >
            <Paper>
                <DialogTitle
                    id="scroll-dialog-title"
                    sx={{
                        flexDirection: 'row',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0rem 0',
                        fontSize: '1.375rem',
                        fontWeight: '800'
                    }}
                >
                    <Button
                        style={{
                            marginLeft: 'auto'
                        }}
                        onClick={handleClose}
                        sx={{ minWidth: 'auto' }}
                    >
                        <CloseIcon className="close" />
                    </Button>
                </DialogTitle>
                <div className="flex justify-center mb-3 items-center">
                    <span>
                        <img
                            src={logo}
                            alt="logo"
                            className="TataLogo w-[90%] md:w-[100%]"
                            style={{ margin: 'auto' }}
                        />
                    </span>
                </div>
                
                {
                    addonPkgs.length>0 ? 
                    <>    <p className="md:text-xl px-2 md:px-0 text-[16px] text-[#22334F] font-semibold	 text-center mb-3">
                    Popular Addon Packages for Age Bracket {ageBracket} yrs.
                </p>
                    <DialogContent>
                    <DialogContentText
                        id="scroll-dialog-description"
                        tabIndex={-1}
                    >
                        <Box id="printPremBreakup">
                            <Grid container spacing={0}>
                                {addonPkgs.map((pkgs, pkgIndex) => {
                                    return (
                                        <Grid
                                            item
                                            xs
                                            md={4}
                                            lg={4}
                                            xl={4}
                                            sx={JSON.parse(pkgs?.GridStyle)}
                                        >
                                            <Card
                                                className="PolicyDetails"
                                                style={JSON.parse(
                                                    pkgs?.CardStyle
                                                )}
                                            >
                                                <div
                                                    className="h-full"
                                                    style={JSON.parse(
                                                        pkgs?.CardContentStyle
                                                    )}
                                                >
                                                    <div
                                                        style={JSON.parse(
                                                            pkgs?.BoxStyle
                                                        )}
                                                        className="h-full"
                                                    >
                                                        <div
                                                            style={JSON.parse(
                                                                pkgs?.StackStyle
                                                            )}
                                                            className="h-full"
                                                        >
                                                            <div className="h-full flex flex-col w-full  gap-4">
                                                                <p
                                                                    className={
                                                                        pkgs.ButtonClass
                                                                    }
                                                                >
                                                                    {
                                                                        pkgs.PACKAGE_NAME
                                                                    }
                                                                </p>
                                                                <p className="flex items-center text-[#22334F] text-sm gap-1">
                                                                    <span>
                                                                        {pkgs?.ADDON.map(
                                                                            (
                                                                                addOn,
                                                                                index
                                                                            ) => {
                                                                                return (
                                                                                    <p className="flex items-center justify-between mb-1 ">
                                                                                        <div className='flex  w-10/12'>
                                                                                            <span className='w-1/5'>
                                                                                                <svg
                                                                                                    width="16"
                                                                                                    height="17"
                                                                                                    viewBox="0 0 16 17"
                                                                                                    fill="none"
                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                >
                                                                                                    <g id="ok_svgrepo.com">
                                                                                                        <path
                                                                                                            id="Vector"
                                                                                                            d="M2.66666 9.21875L6 12.5521L13.3333 5.21875"
                                                                                                            stroke="#23C565"
                                                                                                            stroke-width="1.5"
                                                                                                            stroke-linecap="round"
                                                                                                            stroke-linejoin="round"
                                                                                                        />
                                                                                                    </g>
                                                                                                </svg>
                                                                                            </span>
                                                                                            <span className='w-4/5'>
                                                                                                {
                                                                                                    addOn.ADDON_NAMES
                                                                                                }
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className="flex justify-center tooltip ">
                                                                                            <img
                                                                                                src={
                                                                                                    BasePath +
                                                                                                    '/Images/info-icon.jpg'
                                                                                                }
                                                                                            />
                                                                                            <div className="tooltiptext ">
                                                                                                <p className="text-[10px]">
                                                                                                    {
                                                                                                        addOn.ADDON_DESC
                                                                                                    }
                                                                                                </p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </p>
                                                                                )
                                                                            }
                                                                        )}
                                                                    </span>
                                                                </p>
                                                                <div className="mt-auto flex items-start mx-auto">
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => {
                                                                            selectAddonPackage(
                                                                                pkgs.PACKAGE_IDs,
                                                                                pkgIndex
                                                                            )
                                                                        }}
                                                                        disabled={
                                                                            selectedPackage ==
                                                                            pkgIndex
                                                                        }
                                                                    >
                                                                        {' '}
                                                                        {selectedPackage ==
                                                                            pkgIndex
                                                                            ? 'Selected'
                                                                            : 'Select'}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </Box>

                       
                    </DialogContentText>
                </DialogContent></>:<><p className="md:text-xl px-2 md:px-0 text-[16px] text-[#22334F] font-semibold	 text-center mb-3">
                   No Addon Packages are found
                </p></>
                }
                
            </Paper>
        </Dialog>
    )
}

export default SuggestedAddOns
