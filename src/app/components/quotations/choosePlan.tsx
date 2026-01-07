import React, { useState } from 'react'
import {
    Box,
    Button,
    Typography,
    CardContent,
    Card,
    Stack,
    Grid,
    Paper,
    Badge
} from '@mui/material'
import { IProposalModel } from '../../models/IProposalModel'
import CompareIcon from '@mui/icons-material/Compare'
import { RowSelection } from '@tanstack/react-table'
import CloseIcon from '@mui/icons-material/Close'
import icImage from '../../../assets/images/HdfcErgo.jpg'
import { BasePath } from '../../constants/baseURL'

const ChoosePlan = (props: any) => {
    const { setOpenPopup, state, dispatch } = props

    // const toggleContentVisibility = () => {
    //     setContentVisibility(!isContentVisible)
    // }

    return (
        <div>
            {state.openCompareBottom && (
                <div className="Planchoosebox modalWidth">
                    <Grid
                        sx={{
                            display: 'flex',
                            overflow: 'auto',
                            paddingTop: '15px',
                            paddingBottom: '15px'
                        }}
                    >
                        {state.checkedQuotations.map((IC: any) => {
                            return (
                                <Grid
                                    // xs={3}
                                    sx={{ marginRight: '2rem' }}
                                    className="ICI_temBox"
                                    key={IC['PRODUCTID']}
                                    style={{
                                        maxWidth: 'auto'
                                    }}
                                >
                                    <CloseIcon
                                        className="close cursor-pointer"
                                        onClick={() =>
                                            dispatch({
                                                type: 'setCheckedQuotations',
                                                value: {
                                                    quote: IC,
                                                    check: false
                                                }
                                            })
                                        }
                                    />
                                    <div
                                        sx={{
                                            textAlign: 'center',
                                            display: 'flex',
                                            alignItems: 'center',
                                            flexDirection: 'column',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <img
                                            src={
                                                BasePath +
                                                '/Images/Product/' +
                                                IC['PROD_LOGO_PATH']
                                            }
                                            alt="IC Image"
                                        />
                                        <Typography
                                            sx={{
                                                fontSize: '12px',
                                                color: '#22334F',
                                                width: '100px',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {IC['PRODUCT_NAME']}
                                        </Typography>
                                    </div>
                                </Grid>
                            )
                        })}

                        <div className="hidden md:block">
                            <Grid
                                sx={{
                                    flexDirection: 'column',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    paddingRight: '24px'
                                }}
                            >
                                <Badge
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right'
                                    }}
                                    badgeContent={
                                        state.checkedQuotations.length
                                    }
                                    color="primary"
                                    borderColor="#3679BE"
                                >
                                    <Button
                                        variant="contained"
                                        startIcon={<CompareIcon />}
                                        sx={{
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                            width: '100%',
                                            textTransform: 'capitalize',
                                            marginBottom: '.5rem'
                                        }}
                                        onClick={() => setOpenPopup(true)}
                                        disabled={
                                            state.checkedQuotations.length < 2
                                        }
                                    >
                                        Compare
                                    </Button>
                                </Badge>
                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        dispatch({
                                            type: 'setCheckedQuotationsEmpty'
                                        })
                                    }
                                    sx={{
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        maxWidth: '100%',
                                        color: '#22334F',
                                        textTransform: 'capitalize'
                                    }}
                                >
                                    Clear All
                                </Button>
                            </Grid>
                        </div>
                    </Grid>
                    <div className="block mt-4 md:hidden">
                        <Grid
                            sx={{
                                flexDirection: 'column',
                                display: 'flex',
                                justifyContent: 'center',
                                paddingRight: '24px'
                            }}
                        >
                            <Badge
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right'
                                }}
                                badgeContent={state.checkedQuotations.length}
                                color="primary"
                                borderColor="#3679BE"
                            >
                                <Button
                                    variant="contained"
                                    startIcon={<CompareIcon />}
                                    sx={{
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        width: '100%',
                                        textTransform: 'capitalize',
                                        marginBottom: '.5rem'
                                    }}
                                    onClick={() => setOpenPopup(true)}
                                >
                                    Compare
                                </Button>
                            </Badge>
                            <Button
                                variant="outlined"
                                onClick={() =>
                                    dispatch({
                                        type: 'setCheckedQuotationsEmpty'
                                    })
                                }
                                sx={{
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    maxWidth: '100%',
                                    color: '#22334F',
                                    textTransform: 'capitalize'
                                }}
                            >
                                Clear All
                            </Button>
                        </Grid>
                    </div>
                </div>
            )}
            {/* <Button href="#text-buttons" onClick={toggleContentVisibility} startIcon={<CompareIcon />} sx={{ borderRadius: '8px', fontSize:'12px',  background: '#ECF0F4', minWidth: 'auto',  color: '#22334F',  textTransform:'capitalize', }}>
            Compare
        </Button> */}
        </div>
    )
}

export default ChoosePlan
