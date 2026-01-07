import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'
import { IProposalModel } from '../../models/IProposalModel'

const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        •
    </Box>
)

export default function ChangeIDV({ proposalData, getQuote, setIDV }: any) {
    const [isDivVisible, setDivVisibility] = useState(false)
    const [price, setPrice] = useState({ MinPrice: 0, MaxPrice: 0 })
    const [idv, setIdv] = useState<number>(proposalData?.IDV || 0)

    const toggleDivVisibility = () => {
        setDivVisibility(!isDivVisible)
    }
    useEffect(() => {
        let priceObj = {
            MinPrice: proposalData.MinPrice,
            MaxPrice: proposalData.MaxPrice
        }
        if (proposalData.PolicyType == 'N') {
            setIDV(proposalData?.IDV || 0)
            priceObj = {
                MinPrice: proposalData.IDV,
                MaxPrice: proposalData.IDV
            }
            // proposalData.MinPrice = proposalData.IDV
            // proposalData.MaxPrice = proposalData.IDV
        } else setIDV(proposalData?.IDV || 0)

        setPrice({ ...price, ...priceObj })
    }, [proposalData])

    const handleChange = (_: Event, newValue: number | number[]) => {
        setIdv(newValue as number)
        setIDV(newValue as number)
    }

    return (
        <Card
            sx={{
                minWidth: '100%',
                backgroundColor: '#F6FAFE',
                borderRadius: '8px',
                boxShadow: '0px 0px 0px'
            }}
        >
            <CardContent>
                <Typography
                    variant="h2"
                    color="text.secondary"
                    sx={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#22334F'
                    }}
                    gutterBottom
                >
                    Customized Vehicle (
                    {proposalData.PolicyType == 'N' ? 'Price' : 'IDV'})
                </Typography>
                <Typography sx={{ fontSize: 11 }}>
                    Maximum amount the customer can claim in case of total
                    damage/theft
                </Typography>
                <Typography variant="body2">
                    <div className="setIDV" onClick={toggleDivVisibility}>
                        <span className="text1">
                            {proposalData.PolicyType === 'R'
                                ? 'IDV'
                                : proposalData.PolicyType == 'N'
                                    ? 'Ex-Showroom Price'
                                    : 'IDV'}

                        </span>
                        <span className="text2 flex items-center">
                            ₹{' '}
                            <span id="Invest10" className="mx-1">
                                {idv}
                            </span>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M11.7166 5.23204C11.858 5.08339 12.049 5 12.248 5C12.4471 5 12.6381 5.08339 12.7795 5.23204C12.8493 5.30503 12.9048 5.39204 12.9427 5.48799C12.9805 5.58395 13 5.68694 13 5.79097C13 5.895 12.9805 5.99799 12.9427 5.99799C12.9048 5.99799 12.8493 5.99799 12.7795 5.99799L8.53202 10.7683C8.39026 10.9168 8.19913 11 8 11C7.80087 11 7.60974 10.9168 7.46798 10.7683L3.22049 6.34991C3.15065 6.27691 3.0952 6.18991 3.05735 6.09395C3.01949 5.99799 3 5.895 3 5.79097C3 5.68694 3.01949 5.58395 3.05735 5.48799C3.0952 5.39204 3.15065 5.30503 3.22049 5.23204C3.36192 5.08339 3.55292 5 3.75197 5C3.95101 5 4.14201 5.08339 4.28345 5.23204L8.00163 8.8556L11.7166 5.23204Z"
                                    fill="#22334F"
                                />
                            </svg>
                        </span>
                    </div>
                </Typography>

                {isDivVisible && (
                    <Box>
                        <Slider
                            value={idv}
                            min={price.MinPrice}
                            max={price.MaxPrice}
                            aria-label="Default"
                            valueLabelDisplay="auto"
                            onChange={handleChange}
                        />
                        <Typography>
                            <div className="flex flex-row items-center justify-between minmaxvalue">
                                <p className="flex gap-1 flex-col">
                                    <span className="text-sm">
                                        ₹ {price.MinPrice}
                                    </span>
                                    <span className="text-xs">
                                        Minimum Cover
                                    </span>
                                </p>
                                <p className="flex flex-col gap-1 text-right">
                                    <span className="text-sm">
                                        ₹ {price.MaxPrice}
                                    </span>
                                    <span className="text-xs">
                                        Maximum Cover
                                    </span>
                                </p>
                            </div>
                        </Typography>
                    </Box>
                )}

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: '.5rem', borderRadius: '8px' }}
                    onClick={getQuote}
                >
                    <span className="mr-2">Update Quote</span>
                    <svg
                        width="14"
                        height="15"
                        viewBox="0 0 14 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M0.898443 8.3939L10.9341 8.3939L6.54965 12.7783C6.19926 13.1287 6.19926 13.7037 6.54965 14.0541C6.90005 14.4045 7.46607 14.4045 7.81646 14.0541L13.7372 8.13335C14.0876 7.78296 14.0876 7.21694 13.7372 6.86655L7.81646 0.945802C7.46607 0.595408 6.90005 0.595408 6.54965 0.945802C6.19926 1.2962 6.19926 1.86222 6.54965 2.21261L10.9341 6.59701L0.898443 6.59701C0.4043 6.59701 0 7.00131 0 7.49546C0 7.9896 0.4043 8.3939 0.898443 8.3939Z"
                            fill="white"
                        />
                    </svg>
                </Button>
            </CardContent>
        </Card>
    )
}
