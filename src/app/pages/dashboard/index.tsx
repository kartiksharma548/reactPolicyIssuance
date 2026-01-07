import * as React from 'react'
import { ReactNode, useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Deposits from './Deposits'

import PieChartWithPaddingAngle from './pieCharts'
import DashedLineChart from './lineCharts'
import { Dialog, LinearProgress, Typography } from '@mui/material'
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks'
import { update } from '../../redux/features/menu/menuSlice'
import { AuthModel } from '../../redux/features/auth/authInterface'
import { getDashboardData } from '../../services/dashBoard/dashBoardService'
import BarChartComponent from './barCharts'
import { getMaintainenceMessage } from '../../services/dashBoard/dashBoardService'
import ConfirmDialog from '../../components/common/confirmDialog'
import { any } from 'zod'

export default function Dashboard() {
    const dispatch = useAppDispatch()
    const menuDrawer1 = useAppSelector<boolean>((state: any) => state.menu)
    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )
    useEffect(() => {
        dispatch(update(false))
        getDashBoardDataFn()
        getMaintenanceFn()
    }, [])

    const [dashBoardValue, setDashboardValue] = useState<DashBoardValues_Type>({
        NewPolicy: 0,
        RenewPolicy: 0,
        TotalPolicy: 0,
        ClaimsOpened: 0,
        ClaimsClosed: 0,
        TotalClaims: 0,
        PenetrationPercentage:0,
        PoliciesDue:0,
        PoliciesRenewed:0,
        OD_Prem: 0,
        TP_Prem: 0,
        Total_Prem: 0,
        InsurersCount: [],
        AddOnPenetration: [],
        BusinessPerformance: []
    })

    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Sept',
        'Oct',
        'Nov',
        'Dec'
    ]

    const getDashBoardDataFn = async () => {
        const dashBoardInput: DashBoard_Type = {
            StartDate: '',
            EndDate: '',
            DealerId: loginSelector.DealerId,
            BreakDownType: 'YEARLY',
            BreakDownBy: -1
        }

        const response = await getDashboardData(dashBoardInput)
        if (response != null && response != undefined) {
            const dashBoardData: DashBoardValues_Type = {
                NewPolicy: response.Table[0].NewPolicy,
                RenewPolicy: response.Table[0].RenewPolicy,
                TotalPolicy: response.Table[0].TotalPolicy,
                ClaimsOpened: response.Table[0].ClaimOpened,
                ClaimsClosed: response.Table[0].ClaimClosed,
                TotalClaims: response.Table[0].TotalClaims,
                OD_Prem: response.Table[0].OD_Prem,
                TP_Prem: response.Table[0].TP_Prem,
                Total_Prem: response.Table[0].Total_Prem,
                PenetrationPercentage:response.Table[0].PenetrationPercentage,
                PoliciesDue:response.Table[0].PoliciesDue,
                PoliciesRenewed:response.Table[0].PoliciesRenewed,
                InsurersCount:
                    response.Table1 != null && response.Table1 != undefined
                        ? response.Table1
                        : [],
                AddOnPenetration:
                    response.Table2 != null && response.Table2 != undefined
                        ? response.Table2
                        : [],
                BusinessPerformance:
                    response.Table3 != null && response.Table3 != undefined
                        ? response.Table3
                        : []
            }
            const businessList: Business[] = []
            if (dashBoardData.BusinessPerformance.length > 0) {
                months.forEach((x, index) => {
                    const Premium =
                        dashBoardData.BusinessPerformance.findIndex(
                            (x) => x.MONTH == (index + 1).toString()
                        ) != -1
                            ? dashBoardData.BusinessPerformance[
                                dashBoardData.BusinessPerformance.findIndex(
                                    (x) => x.MONTH == (index + 1).toString()
                                )
                            ].PREMIUM
                            : 0
                    const businessObj: Business = {
                        MONTH: (index + 1).toString(),
                        PREMIUM: Premium,
                        MONTHNAME: x
                    }
                    businessList.push(businessObj)
                })
                dashBoardData.BusinessPerformance = businessList
                // dashBoardData.BusinessPerformance.forEach((x,index)=>{

                // })
            }

            setDashboardValue(dashBoardData)
        }
    }

    const [dialog, setDialog] = useState({
        open: false,
        content: '',
        title: '',
        data: {},
        onClose: onConfirmDialogClose,
        dialogType: 'alert'
    })

    const getMaintenanceFn = async () => {
        const request: any = {
            Action: 1,
            UserId: loginSelector.UserId
        }
        const respMaint = await getMaintainenceMessage(request)
        if (respMaint != null && respMaint != undefined) {
            let date_notify = new Date(respMaint.NotificationDate + ' ' + respMaint.NotificationHours + ':' + respMaint.NotificationMinutes + ':00');
            let date_schedule = new Date(respMaint.MaintenanceDate + ' ' + respMaint.MaintenanceHours + ':' + respMaint.MaintenanceMinutes + ':00');
            let user_readcounter = respMaint.User_Read_Counter;
            let readcounter = respMaint.Read_Counter;
            let datenow = new Date();

            if (user_readcounter < readcounter) {
                if (date_notify <= datenow && date_schedule > datenow) {

                    date_schedule.setMinutes(date_schedule.getMinutes() + respMaint.DowntimeMinutes);
                    let dtTo = new Date(date_schedule);
                    const hours = dtTo.getHours();
                    var minutes = dtTo.getMinutes();
                    if (minutes == 0) {

                    }
                    setDialog({
                        ...dialog,
                        ['open']: true,
                        ['title']: 'Scheduled Maintenance Notification',
                        ['content']:
                            'Please note that the website is under maintenance and will not be available From <b>' + respMaint.MaintenanceDate + ' ' + respMaint.MaintenanceHours + ':' + respMaint.MaintenanceMinutes + '</b> To <b>' + respMaint.MaintenanceDate + ' ' + hours + ':' + minutes + '</b> </br></br>' + respMaint.Message + '</br></br><input type="checkbox" checked={isChecked} disabled /> <span>I have read the above message</span>',
                        data: false,
                        dialogType: 'confirm'
                    })

                }
            }
        }
        else {
        }
    }

    async function onConfirmDialogClose(action: boolean, data: any) {
        if (action) {
            const request: any = {
                Action: 2,
                UserId: loginSelector.UserId
            }
            const resp =await getMaintainenceMessage(request)
        }
        setDialog({
            ...dialog,
            ['open']: false
        })
    }


    const chartSetting = {
        // xAxis: [
        //   {
        //     label: 'rainfall (mm)',
        //   },
        // ],
        width: 500,
        height: 400
    }

    return (
        <>
            <ConfirmDialog {...dialog} />
            <Box>
                <Container maxWidth={false} sx={{ mb: 4 }}>
                    <div className="box-header with-border">
                        <h1 className="box-title flex items-center my-2">
                            <span>Dashboard</span>
                        </h1>
                    </div>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4} lg={3}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    border: '1px solid #DDDDDD',
                                    boxShadow:
                                        '0px 0px 15px 0px rgba(0, 0, 0, 0.10)'
                                }}
                            >
                                <Deposits
                                    title={'Total Policy Created'}
                                    subTitle={dashBoardValue.TotalPolicy}
                                />
                                <Stack direction="row" spacing={2} marginTop={3}>
                                    <Stack
                                        sx={{
                                            flexDirection: 'column',
                                            flexGrow: '1',
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '8px',
                                            padding: '.5rem'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                textTransform: 'uppercase',
                                                fontSize: '12px'
                                            }}
                                        >
                                            New
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontWeight: '600',
                                                fontSize: '12px'
                                            }}
                                        >
                                            {dashBoardValue.NewPolicy}
                                        </Typography>
                                    </Stack>
                                    <Stack
                                        sx={{
                                            flexDirection: 'column',
                                            flexGrow: '1',
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '8px',
                                            padding: '.5rem'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                textTransform: 'uppercase',
                                                fontSize: '12px'
                                            }}
                                        >
                                            Renew
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontWeight: '600',
                                                fontSize: '12px'
                                            }}
                                        >
                                            {dashBoardValue.RenewPolicy}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4} lg={3}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    border: '1px solid #DDDDDD',
                                    boxShadow:
                                        '0px 0px 15px 0px rgba(0, 0, 0, 0.10)'
                                }}
                            >
                                <Deposits
                                    title={'Total Claims'}
                                    subTitle={dashBoardValue.TotalClaims}
                                />
                                <Stack direction="row" spacing={2} marginTop={3}>
                                    <Stack
                                        sx={{
                                            flexDirection: 'column',
                                            flexGrow: '1',
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '8px',
                                            padding: '.5rem'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                textTransform: 'uppercase',
                                                fontSize: '12px'
                                            }}
                                        >
                                            Open
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontWeight: '600',
                                                fontSize: '12px'
                                            }}
                                        >
                                            {dashBoardValue.ClaimsOpened}
                                        </Typography>
                                    </Stack>
                                    <Stack
                                        sx={{
                                            flexDirection: 'column',
                                            flexGrow: '1',
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '8px',
                                            padding: '.5rem'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                textTransform: 'uppercase',
                                                fontSize: '12px'
                                            }}
                                        >
                                            Close
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontWeight: '600',
                                                fontSize: '12px'
                                            }}
                                        >
                                            {dashBoardValue.ClaimsClosed}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4} lg={3}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    border: '1px solid #DDDDDD',
                                    boxShadow:
                                        '0px 0px 15px 0px rgba(0, 0, 0, 0.10)'
                                }}
                            >
                                <Deposits
                                    title={'Policy Retention'}
                                    subTitle={dashBoardValue.PenetrationPercentage}
                                />
                                <Stack direction="row" spacing={2} marginTop={3}>
                                    <Stack
                                        sx={{
                                            flexDirection: 'column',
                                            flexGrow: '1',
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '8px',
                                            padding: '.5rem'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                textTransform: 'uppercase',
                                                fontSize: '12px'
                                            }}
                                        >
                                            Due
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontWeight: '600',
                                                fontSize: '12px'
                                            }}
                                        >
                                            {dashBoardValue.PoliciesDue}
                                        </Typography>
                                    </Stack>
                                    <Stack
                                        sx={{
                                            flexDirection: 'column',
                                            flexGrow: '1',
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '8px',
                                            padding: '.5rem'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                textTransform: 'uppercase',
                                                fontSize: '12px'
                                            }}
                                        >
                                            Conversions
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontWeight: '600',
                                                fontSize: '12px'
                                            }}
                                        >
                                            {dashBoardValue.PoliciesRenewed}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4} lg={3}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    border: '1px solid #DDDDDD',
                                    boxShadow:
                                        '0px 0px 15px 0px rgba(0, 0, 0, 0.10)'
                                }}
                            >
                                <Deposits
                                    title={'Total Net Premium'}
                                    subTitle={dashBoardValue.Total_Prem}
                                />
                                <Stack direction="row" spacing={2} marginTop={3}>
                                    <Stack
                                        sx={{
                                            flexDirection: 'column',
                                            flexGrow: '1',
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '8px',
                                            padding: '.5rem'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                textTransform: 'uppercase',
                                                fontSize: '12px'
                                            }}
                                        >
                                            OD
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontWeight: '600',
                                                fontSize: '12px'
                                            }}
                                        >
                                            {dashBoardValue.OD_Prem}
                                        </Typography>
                                    </Stack>
                                    <Stack
                                        sx={{
                                            flexDirection: 'column',
                                            flexGrow: '1',
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '8px',
                                            padding: '.5rem'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                textTransform: 'uppercase',
                                                fontSize: '12px'
                                            }}
                                        >
                                            TP
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontWeight: '600',
                                                fontSize: '12px'
                                            }}
                                        >
                                            {dashBoardValue.TP_Prem}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Paper>
                        </Grid>
                        {dashBoardValue.BusinessPerformance.length > 0 && (
                            <Grid item xs={12} md={4}>
                                <Paper
                                    className='h-full'
                                    sx={{
                                        p: 2,
                                        // display: 'flex',
                                        // flexDirection: 'row',
                                        borderRadius: '8px',
                                        textAlign: 'left',
                                        border: '1px solid #DDDDDD',
                                        boxShadow:
                                            '0px 0px 0px 0px rgba(0, 0, 0, 0.10)'
                                    }}
                                >
                                    <Box className="flex-grow">
                                        <Typography
                                            sx={{
                                                fontWeight: '600',
                                                fontSize: '12px',
                                                textAlign: 'center'
                                            }}
                                        >
                                            Business Performance
                                        </Typography>
                                        <Stack marginTop={3} className='items-center'>
                                            <BarChartComponent
                                                dataset={
                                                    dashBoardValue.BusinessPerformance
                                                }
                                                // yAxis={[
                                                //     {
                                                //         scaleType: 'band',
                                                //         dataKey: 'PREMIUM'
                                                //     }
                                                // ]}
                                                xAxis={[
                                                    {
                                                        scaleType: 'band',
                                                        dataKey: 'MONTHNAME'
                                                    }
                                                ]}
                                                series={[
                                                    {
                                                        dataKey: 'PREMIUM'
                                                        //label: 'Seoul rainfall',
                                                        //valueFormatter
                                                    }
                                                ]}
                                                {...chartSetting}
                                            />
                                        </Stack>
                                    </Box>

                                    {/* <Orders /> */}
                                </Paper>
                            </Grid>
                        )}

                        {dashBoardValue.AddOnPenetration.length > 0 && (
                            <Grid item xs={12} md={4}>
                                <Paper
                                    className='h-full'
                                    sx={{
                                        p: 2,
                                        // display: 'flex',
                                        // flexDirection: 'row',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        border: '1px solid #DDDDDD',
                                        boxShadow:
                                            '0px 0px 0px 0px rgba(0, 0, 0, 0.10)'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            flexDirection: 'column',
                                            width: '100%'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontWeight: '600',
                                                fontSize: '12px',
                                                textAlign: 'center'
                                            }}
                                        >
                                            Add-On Penetration
                                        </Typography>
                                        <Stack marginTop={3}>
                                            {dashBoardValue.AddOnPenetration.map(
                                                (x, index) => {
                                                    return (
                                                        <>
                                                            <Typography
                                                                sx={{
                                                                    fontSize:
                                                                        '12px',
                                                                    fontWeight:
                                                                        '400',
                                                                    whiteSpace:
                                                                        'nowrap',
                                                                    textAlign:
                                                                        'left'
                                                                }}
                                                            >
                                                                {x.AddonName}
                                                            </Typography>
                                                            <Stack
                                                                direction={'row'}
                                                                alignItems={
                                                                    'center'
                                                                }
                                                            >
                                                                {/* <Box
                                                                component={
                                                                    'div'
                                                                }
                                                                sx={{
                                                                    backgroundColor:
                                                                        'orange',
                                                                    height: '10px',
                                                                    borderRadius:
                                                                        '5px',
                                                                    marginTop:
                                                                        '2px',
                                                                    width: `calc(${x.AddonPercentage}%)`
                                                                }}
                                                            ></Box> */}
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={
                                                                        x.AddonPercentage
                                                                    }
                                                                    sx={{
                                                                        width: '100%',
                                                                        height: '8px',
                                                                        borderRadius:
                                                                            '5px',
                                                                        marginTop:
                                                                            '2px'
                                                                    }}
                                                                    color={
                                                                        [
                                                                            'primary',
                                                                            'secondary'
                                                                        ][
                                                                        Math.ceil(
                                                                            index %
                                                                            2
                                                                        )
                                                                        ]
                                                                    }
                                                                />
                                                                <Typography
                                                                    sx={{
                                                                        fontSize:
                                                                            '14px',
                                                                        fontWeight:
                                                                            '800',
                                                                        whiteSpace:
                                                                            'nowrap'
                                                                    }}
                                                                >
                                                                    {
                                                                        x.AddonPercentage
                                                                    }{' '}
                                                                    %
                                                                </Typography>
                                                            </Stack>

                                                            { }
                                                        </>
                                                    )
                                                }
                                            )}

                                            {/* <BarChartComponent
                                            dataset={
                                                dashBoardValue.AddOnPenetration
                                            }
                                            yAxis={[
                                                {
                                                    scaleType: 'band',
                                                    dataKey: 'AddonName'
                                                }
                                            ]}
                                            series={[
                                                {
                                                    dataKey: 'AddonPercentage'
                                                    // label: 'Add',
                                                    // valueFormatter
                                                }
                                            ]}
                                            layout="horizontal"
                                            {...chartSetting}
                                        /> */}
                                        </Stack>
                                    </Box>
                                </Paper>
                            </Grid>
                        )}
                        {dashBoardValue.InsurersCount.length > 0 && (
                            <Grid item xs={12} md={4}>
                                <Paper
                                    className='h-full'
                                    sx={{
                                        p: 2,
                                        // display: 'flex',
                                        // flexDirection: 'row',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        border: '1px solid #DDDDDD',
                                        boxShadow:
                                            '0px 0px 0px 0px rgba(0, 0, 0, 0.10)'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            flexDirection: 'column',
                                            margin: 'auto'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontWeight: '600',
                                                fontSize: '12px',
                                                textAlign: 'center'
                                            }}
                                        >
                                            Insurer wise breakup(Top 5 ICs)-Policy
                                            Count
                                        </Typography>
                                        <Stack marginTop={3} className='items-center'>
                                            <PieChartWithPaddingAngle
                                                insurerCount={
                                                    dashBoardValue.InsurersCount
                                                }
                                            />
                                        </Stack>
                                    </Box>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </Container>
            </Box>
        </>
    )
}
