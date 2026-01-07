import React, { useState } from 'react'
import {
    Box,
    Button,
    Typography,
    CardContent,
    Card,
    Stack
} from '@mui/material'
import carImage from '../../../assets/images/TataCar.png'
import { IProposalModel } from '../../models/IProposalModel'
import {
    createSearchParams,
    useNavigate,
    useSearchParams
} from 'react-router-dom'
import dayjs from 'dayjs'
import ChangeIDV from '../idv/ChangeIDV'
import common from '../../utils/common'
import { decrypt, encrypt } from '../../utils/encryption'

const VehicleInfo = (props: any) => {
    const [searchParams] = useSearchParams()
    const ProposalId: string = searchParams.get('ProposalId').toString() || ''

    const { proposalData, callFrom, quotes, failedQuote } = props
    //let QuoteNo = quotes?.QuotationNo;
    const [isContentVisible, setContentVisibility] = useState(() => {
        if (callFrom == 'PREM' || props.callFromCustomer) {
            return true
        }
        return false
    })
    const navigate = useNavigate()

    const toggleContentVisibility = () => {
        setContentVisibility(!isContentVisible)
    }

    const handleBackButton = () => {
        navigate({
            pathname: '/createPolicy/',
            search: createSearchParams({
                ProposalId: encrypt(decrypt(ProposalId.toString()))
            }).toString()
        })
    }

    return (
        <Card
            sx={{
                minWidth: '100%',
                boxShadow: '0px 0px 0px',
                background: 'transparent '
            }}
        >
            <div>
                {callFrom != 'PREM' && (
                    <>
                        <Box
                            sx={{
                                flexGrow: '1',
                                paddingBottom: '0',
                                paddingLeft: 0,
                                position: 'relative'
                            }}
                        >
                            <Typography
                                variant="h2"
                                color="text.secondary"
                                sx={{
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#22334F',
                                    marginTop: '12px',
                                    marginBottom: '14px'
                                }}
                                gutterBottom
                            >
                                Verify Vehicle Details
                            </Typography>
                            <Stack
                                sx={{
                                    flexGrow: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: '1rem'
                                }}
                            >
                                <img
                                    src={carImage}
                                    alt="vehicle image"
                                    className="Vehicleimg"
                                />
                                {props.callFromCustomer == true ? (
                                    <></>
                                ) : (
                                    <>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="primary"
                                            sx={{
                                                marginLeft: 'auto',
                                                minWidth: '20px',
                                                height: '30px',
                                                borderRadius: '8px'
                                            }}
                                            onClick={handleBackButton}
                                        >
                                            <svg
                                                width="12"
                                                height="13"
                                                viewBox="0 0 12 13"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M0 10.3741V12.4008C0 12.5874 0.146667 12.7341 0.333333 12.7341H2.36C2.44667 12.7341 2.53333 12.7008 2.59333 12.6341L9.87333 5.36075L7.37333 2.86076L0.1 10.1341C0.0333334 10.2008 0 10.2808 0 10.3741ZM11.8067 3.42742C12.0667 3.16742 12.0667 2.74742 11.8067 2.48742L10.2467 0.927422C9.98667 0.667422 9.56667 0.667422 9.30667 0.927422L8.08667 2.14742L10.5867 4.64742L11.8067 3.42742Z"
                                                    fill="white"
                                                />
                                            </svg>
                                        </Button>
                                    </>
                                )}
                            </Stack>
                        </Box>
                    </>
                )}
                <div className="relative">
                    <Typography sx={{ fontSize: '14px' }}>
                        {proposalData.PolicyType == 'R' &&
                            proposalData.CoverTypeId != 2 && (
                                <p className="pt-1">
                                    <b className="font-semibold">
                                        Previous NCB :
                                    </b>{' '}
                                    {proposalData.PREV_NCB}%
                                </p>
                            )}
                        {proposalData.CoverTypeId != 2 && (
                            <>
                            <p className="pt-1 preview-cardContent-productDetailsItem">
                                <b className="font-semibold">
                                    {' '}
                                    {proposalData.PolicyType == 'R'
                                        ? 'IDV'
                                        : 'Ex-Showroom Price'}{' '}
                                    :
                                </b>{' '}
                                ₹ {proposalData.IDV}
                            </p>
                             <p className="pt-1 preview-cardContent-productDetailsItem">
                                <b className="font-semibold">
                                    {' '}
                                    {proposalData.PolicyType == 'N'
                                        ? 'IDV : ₹' 
                                        : ' '}
                                   
                                </b>
                                {proposalData.PolicyType == 'N'
                                        ?  proposalData.RENEW_IDV
                                        : ' '}
                               
                            </p>
                            </>
                            
                        )}
                    </Typography>
                    {isContentVisible && (
                        <Typography gutterBottom sx={{ fontSize: '14px' }}>
                            <p className="pt-1 preview-cardContent-productDetailsItem">
                                <b className="font-semibold">Make :</b>{' '}
                                {proposalData.MAKE_NAME}
                            </p>
                            <p className="pt-1 preview-cardContent-productDetailsItem">
                                <b className="font-semibold">Model :</b>{' '}
                                {proposalData.Model}
                            </p>
                            <p className="pt-1 preview-cardContent-productDetailsItem">
                                <b className="font-semibold">Variant :</b>{' '}
                                {proposalData.Variant}
                            </p>
                            <p className="pt-1 preview-cardContent-productDetailsItem">
                                <b className="font-semibold">Policy Type :</b>{' '}
                                {proposalData.PolicyType == 'R'
                                    ? 'Renew'
                                    : 'New'}
                            </p>
                            <p className="pt-1 preview-cardContent-productDetailsItem">
                                <b className="font-semibold">Chassis No :</b>{' '}
                                {proposalData.ChassisNo}
                            </p>
                            <p className="pt-1 preview-cardContent-productDetailsItem">
                                <b className="font-semibold">Invoice Date :</b>{' '}
                                {proposalData.InvoiceDate}
                            </p>
                            <p className="pt-1 preview-cardContent-productDetailsItem">
                                <b className="font-semibold">Cover Type :</b>{' '}
                                {proposalData.CoverType}
                            </p>
                            <p className="pt-1 preview-cardContent-productDetailsItem">
                                <b className="font-semibold">
                                    Year of Manufacturer:
                                </b>{' '}
                                {proposalData.MFGYear}
                            </p>
                            {proposalData.PolicyType == 'R' && (
                                <p className="pt-1">
                                    <b className="font-semibold">
                                        Claim Taken on Prev. Policy :
                                    </b>{' '}
                                    {proposalData.ClaimTaken == 1
                                        ? 'Yes'
                                        : 'No'}
                                </p>
                            )}

                            <p className="pt-1 preview-cardContent-productDetailsItem">
                                <b className="font-semibold">Quotation No :</b>{' '}
                                {props.QuoteNo}
                            </p>
                            <p className="pt-1 preview-cardContent-productDetailsItem">
                                <b className="font-semibold">
                                    Quotation Date :
                                </b>{' '}
                                {}
                                {
                                    common.getFormattedDate(
                                        new Date()
                                    ) /* {new Date().getDate()
                                    .toLocaleDateString('en', {
                                        weekday: 'long'
                                    })
                                    .substring(0, 3)}{' '}
                                {new Date()
                                    .toLocaleDateString('en', {
                                        month: 'long'
                                    })
                                    .substring(0, 3)}
                                ,{new Date().getDate() + ' '}{' '}
                                {new Date().getFullYear()} */
                                }
                            </p>

                            <div className="block md:hidden mt-3">
                                {props.proposalModel && (
                                    <ChangeIDV
                                        proposalData={props.proposalModel!}
                                        getQuote={props.GetQuotes}
                                        setIDV={props.setIDV}
                                    />
                                )}
                            </div>
                        </Typography>
                    )}
                </div>
                {callFrom != 'PREM' && (
                    <div className="text-right relative right-0 top-0">
                        <p
                            onClick={toggleContentVisibility}
                            className="mt-2 capitalize	cursor-pointer text-[#1F81B9] text-xs font-medium	"
                        >
                            {isContentVisible ? (
                                <div className="flex items-center justify-end">
                                    <span className="flex items-center justify-end gap-1">
                                        {' '}
                                        <span className="text-[22px] font-bold">
                                            -{' '}
                                        </span>
                                        <span className="underline">
                                            Less Vehicle Details
                                        </span>{' '}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-end	">
                                    <span className="flex items-center justify-end gap-1">
                                        {' '}
                                        <img src="Images/plus-icon.png" />{' '}
                                        <span className="underline">
                                            More Vehicle Details
                                        </span>{' '}
                                    </span>
                                </div>
                            )}
                        </p>
                    </div>
                )}
            </div>
        </Card>
    )
}
export default VehicleInfo
