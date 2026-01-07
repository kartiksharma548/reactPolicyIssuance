import {
    Button,
    Checkbox,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Tooltip,
    Typography
} from '@mui/material'
import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table'
import { useMemo, useReducer, useRef, useState } from 'react'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import EditIcon from '@mui/icons-material/Edit'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { AuthModel } from '../../redux/features/auth/authInterface'
import {
    APDPayment,
    sendPayLinkToCustomer,
    updateConsentDate,
    updatePaymentMode,
    CancelProposal
} from '../../services/policyServices/paymentService'
import ConfirmDialog from '../common/confirmDialog'
import { useNavigate } from 'react-router-dom'
import { IProposal } from '../../models/IProposal'
import { update } from '../../redux/features/payment/paymentDataSlice'
import { ProposalInputModel } from '../../models/PolicyProposalMDL'
import { createPolicy } from '../../services/policyServices/policyService'
import BackDropLoader from '../../components/common/backDropLoading'

function ProposalPaymentList({
    proposalPaymentList,
    paymentMode,
    setPaymentDataList,
    paymentModesMappingList,
    getPaymentList
}: any) {
    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )

    const [paymentButtonDisabled, setPaymentButtonDisabled] = useState(false)

    const navigate = useNavigate()
    const dispatchStore = useAppDispatch()
    const [showLoading, setShowLoading] = useState(false)

    function reducer(state: any, action: any) {
        switch (action.type) {
            case 'setDialog':
                return {
                    ...state,
                    dialogProps: { ...action.value }
                }
        }
    }

    const onConfirmDialogClose = async (action: boolean, data: any) => {
        if (action) {
            if (data != null && data['CallFrom'] == 'CANCEL') {
                const {
                    CoverType,
                    PROPOSAL_ID,
                    ProposalId,
                    ICProductId,
                    PaymentModeId,
                    UpdatedPaymentMode
                } = data

                let orderModel: OrderModel_Type = {
                    ProductID: ICProductId,
                    ProposalID: ProposalId,
                    TransactionType: 'P',
                    PG_Type: 'HDFC'
                }

                let resultProposalCancel = await CancelProposal(orderModel)
                dispatch({
                    type: 'setDialog',
                    value: {
                        ...state.dialogProps,
                        ['open']: true,
                        ['title']: 'Message',
                        ['content']: resultProposalCancel,
                        data: null,
                        dialogType: 'alert',
                        onClose: onConfirmDialogClose
                    }
                })
                return;
            } else {
                dispatch({
                    type: 'setDialog',
                    value: {
                        ...state.dialogProps,
                        ['open']: false
                    }
                })
            }

            await getPaymentList()
            return;
        } else {
            dispatch({
                type: 'setDialog',
                value: {
                    ...state.dialogProps,
                    ['open']: false
                }
            })
        }
    }

    const [state, dispatch] = useReducer(reducer, {
        dialogProps: {
            open: false,
            content: '',
            title: '',
            data: {},
            onClose: onConfirmDialogClose,
            dialogType: 'alert'
        }
    })
    const [sorting, setSorting] = useState<SortingState>([])

    type MapPaymentModes = {
        Payment: PaymentModeType[]
        PRODUCT_ID: number
    }

    const mappedPaymentModes = useRef<MapPaymentModes[]>([])
    paymentModesMappingList.forEach((payment) => {
        debugger;
        let availablePaymentModes = payment['PaymentModeForRenewPolicy']
            .split(',')
            .map((x: string) => {
                return x.replace(' ', '')
            })

        let newPaymentModes = paymentMode.filter((x) => {
            return availablePaymentModes.indexOf(x.PAYMENT_MODE_CODE) > -1
        })

        let mapPaymentMode: MapPaymentModes = {
            Payment: newPaymentModes,
            PRODUCT_ID: payment.Product_ID
        }

        mappedPaymentModes.current.push(mapPaymentMode)
    })

    proposalPaymentList.forEach((row) => {
        mappedPaymentModes.current.forEach((payMode) => {
            if (row['ICProductId'] == payMode['PRODUCT_ID']) {
                row['MappedPaymentModes'] = payMode.Payment
            }
        })
    })

    const createPolicyFn = async (cell: any) => {
        setShowLoading(true)
        const { ProposalId, ICServiceEnabled, ConsentType, ICProductId } =
            cell.row.original

        let obj: ProposalInputModel = {
            Bulk_Proposal_IDs: ProposalId,
            ICServiceEnabled: ICServiceEnabled,
            ConsentType: ConsentType,
            IC: ICProductId
        }

        let status = await createPolicy(obj)
        setShowLoading(false)
        if (status.status == 200) {
            if (status.data['ErrorCode'] == 1) {
                window.open(status.data['ErrorMessage'])
            } else if (status.data['ErrorCode'] != 1) {
                dispatch({
                    type: 'setDialog',
                    value: {
                        ...state.dialogProps,
                        ['open']: true,
                        ['title']: 'Success',
                        ['content']: status.data['ErrorMessage'],
                        data: null,
                        dialogType: 'alert'
                    }
                })

                getPaymentList()
            }
        }
        // if (status != null) {
        //     dispatch({
        //         type: 'setDialog',
        //         value: {
        //             ...state.dialogProps,
        //             ['open']: true,
        //             ['title']: 'Message',
        //             ['content']: status['ErrorMessage'],
        //             data: null,
        //             dialogType: 'alert'
        //         }
        //     })
        // }
    }

    const calculateHeaders = () => {
        return [
            {
                header: 'Proposal No.',
                accessorKey: 'ProposalNo'
            },
            // {
            //     header: 'IC Proposal No.',
            //     accessorKey: 'ICProposalNo'
            // },
            {
                header: 'Chassis No.',
                accessorKey: 'ChassisNo'
            },
            {
                header: 'Registration No.',
                accessorKey: 'VEH_REGIST_NO'
            },
            {
                header: 'Proposal Date',
                accessorKey: 'ProposalDate'
            },
            {
                header: 'Proposal Type',
                accessorKey: 'ProposalType'
            },
            {
                header: 'Proposer Name',
                accessorKey: 'InsuredName'
            },
            {
                header: 'Premium (Rs.)',
                accessorKey: 'Premium'
            },
            {
                header: 'Payment Mode',

                cell: (cell: any) => {
                    return (
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={cell.row.original['UpdatedPaymentMode']}
                            disabled={
                                cell.row.original['ISPAYMENT_DONE'] ==
                                    'Payment has been done' &&
                                cell.row.original['Action'] == 0
                            }
                            onChange={(event) => {
                                let tempArr = [...proposalPaymentList]

                                tempArr[cell.row.index]['UpdatedPaymentMode'] =
                                    event.target.value

                                if (event.target.value == 'G')
                                    tempArr[cell.row.index][
                                        'ShowBulkCheckbox'
                                    ] = true
                                else {
                                    tempArr[cell.row.index][
                                        'ShowBulkCheckbox'
                                    ] = false
                                    tempArr[cell.row.index][
                                        'BulkPaymentChecked'
                                    ] = false
                                    tempArr[cell.row.index]['ShowPayButton'] =
                                        true
                                }

                                setPaymentDataList(tempArr)
                            }}
                            fullWidth
                            label="Status"
                            variant="standard"
                            inputProps={{
                                readOnly: true
                            }}
                            style={{ fontSize: '14px' }}
                        >
                            {/* <MenuItem value="">
                                <em>--Select--</em>
                            </MenuItem> */}
                            {cell.row.original['MappedPaymentModes'].map(
                                (mode: any) => {
                                    return (
                                        <MenuItem
                                            key={mode['PAYMENT_MODE_CODE']}
                                            value={mode['PAYMENT_MODE_CODE']}
                                        >
                                            {mode['PAYMENT_MODE']}
                                        </MenuItem>
                                    )
                                }
                            )}
                        </Select>
                    )
                }
            },
            {
                header: 'Action',
                cell: (cell: any) => {
                    return createActionMessage(cell)
                }
            },
            {
                header: 'Cancel Proposal',
                cell: (cell: any) => {
                    return createActionCancelProposal(cell)
                }
            },
            {
                header: 'Bulk Payment',
                cell: (cell: any) => {
                    return createBulkAction(cell)
                }
            }
        ]
    }

    const columns = useMemo(() => calculateHeaders(), [proposalPaymentList])
    const createActionMessage = (cell: any) => {
        let { original: data } = cell.row

        if (
            data['ISPAYMENT_DONE'] == 'Payment has been done' &&
            data['Action'] == 1
        ) {
            return (
                <Button
                    sx={{
                        padding: '0px',
                        minWidth: 'auto',
                        textTransform: 'capitalize',
                        textDecoration: 'underline'
                    }}
                    className="mt-2"
                    onClick={() => createPolicyFn(cell)}
                >
                    Create Policy
                </Button>
            )
        } else if (
            data['ISPAYMENT_DONE'] == 'Payment has been done' &&
            data['Action'] == 0
        ) {
            return (
                <Typography className="text-rose-900">
                    {data['ISPAYMENT_DONE']}
                </Typography>
            )
        } else if (data['ISPAYMENT_DONE'] != '0') {
            return (
                <Typography className="text-rose-900">
                    {data['ISPAYMENT_DONE']}
                </Typography>
            )
        } else if (data['Rejected_Remarks'] != '') {
            return (
                <>
                    <Button variant="contained" onClick={() => payment(data)}>
                        Pay
                    </Button>
                    <Typography className="text-rose-900">
                        {' '}
                        <b>Rejection Massage:</b> {data['Rejected_Remarks']}{' '}
                    </Typography>
                </>
            )
        } else if (
            data['IsPayBtnDisable'] == 1 &&
            data['UpdatedPaymentMode'] == 'P'
        ) {
            return (
                <Tooltip title="Link send to customer Email/Mobile No for payment.">
                    <Button variant="contained">Pay</Button>
                </Tooltip>
            )
        } else if (
            data['IsPayBtnDisable'] == 1 &&
            data['UpdatedPaymentMode'] == 'G'
        ) {
            return (
                <Tooltip title="Payment Request already processed.">
                    <Button variant="contained">Pay</Button>
                </Tooltip>
            )
        } else if (
            data['IsPayBtnDisable'] == 2 &&
            data['UpdatedPaymentMode'] == 'P'
        ) {
            return (
                <Tooltip title="Please try after 5 minutes.">
                    <Button variant="contained">Pay</Button>
                </Tooltip>
            )
        } else {
            if (data['ShowPayButton']) {
                return (
                    <Button variant="contained" onClick={() => payment(data)}>
                        Pay
                    </Button>
                )
            } else return <></>
        }
    }

    const createActionCancelProposal = (cell: any) => {
        let { original: data } = cell.row

        if (
            data['ISPAYMENT_DONE'] != 'Payment has been done' &&
            data['Action'] == 0
        ) {
            return (
                <Button variant="contained" onClick={() => CancelProp(data)}>
                    Cancel
                </Button>
            )
        } else {
            if (data['ShowPayButton']) {
                return <></>
            }
        }
    }

    const createBulkAction = (cell: any) => {
        let { original: data } = cell.row

        if (
            data['ISPAYMENT_DONE'] == '0' &&
            data['IsBulkPaymentDisable'] == 0 &&
            data['UpdatedPaymentMode'] == 'G'
        ) {
            return (
                <Checkbox
                    size="small"
                    checked={data['BulkPaymentChecked']}
                    onChange={(event) => {
                        let tempArr = [...proposalPaymentList]

                        tempArr[cell.row.index]['ShowPayButton'] =
                            !event.target.checked

                        tempArr[cell.row.index]['BulkPaymentChecked'] =
                            event.target.checked

                        setPaymentDataList(tempArr)
                    }}
                />
            )
        } else if (data['IsBulkPaymentDisable'] == 1) {
            return (
                <Typography className="text-rose-900">
                    Bulk payment is disabled for this IC.
                </Typography>
            )
        } else {
            return <></>
        }
    }

    const payment = async (data: any) => {
        let paymentData: any = {
            ChassisNo: data['ChassisNo'],
            ProposalNo: data['ProposalNo'],
            InsProposalNo: data['ICProposalNo'],
            PaymentMode: data['PaymentModeId'],
        
            Premium: data['Premium'],
            DealerCode: data['DealerCode'],
            ProductId: data['ICProductId'],
            DealerId: data['DealerId'],
            ProposalId: data['ProposalId'],
            IsBulk: false,
            UserId: loginSelector.UserId,
            ICServiceEnabled: data['ICServiceEnabled'],
            ConsentType: data['ConsentType'],
            ProductName: data['ProductName'],
            InsuredName: data['InsuredName'],
            MMV: data['ModelVariant'],
            REGNo: data['VEH_REGIST_NO'],
            APDBalance: data['APD_Balance'],
            Payment_Time: data['Payment_Time']
 
        }
        dispatchStore(update(paymentData))
        navigate('/policyPayment')
    }

    // const payment = async (data: any) => {
    //     const {
    //         CoverType,
    //         PROPOSAL_ID,
    //         ProposalId,
    //         ICProductId,
    //         PaymentModeId,
    //         UpdatedPaymentMode
    //     } = data
    //     if (PaymentModeId != UpdatedPaymentMode) {
    //         let obj = {
    //             ProposalID: ProposalId,
    //             PaymentModeCode: PaymentModeId,
    //             UpdatedPaymentModeCode: UpdatedPaymentMode,
    //             DealerID: loginSelector.DealerId
    //         }

    //         let result = await updatePaymentMode(obj)
    //     }

    //     if (UpdatedPaymentMode == 'P') {
    //         let orderModel: OrderModel_Type = {
    //             ProductID: ICProductId,
    //             ProposalID: ProposalId,
    //             TransactionType: 'P',
    //             PG_Type: 'HDFC'
    //         }

    //         let resultPayLink = await sendPayLinkToCustomer(orderModel)
    //         dispatch({
    //             type: 'setDialog',
    //             value: {
    //                 ...state.dialogProps,
    //                 ['open']: true,
    //                 ['title']: 'Message',
    //                 ['content']: resultPayLink,
    //                 data: null,
    //                 dialogType: 'alert'
    //             }
    //         })

    //         getPaymentList()

    //         // const proposalInfo = {} as IProposal
    //         // proposalInfo.Bulk_Proposal_IDs = ProposalId
    //         // let resultConsent = await updateConsentDate(proposalInfo)
    //         // if (
    //         //     resultPayLink['Response']['STATUS'] != null &&
    //         //     resultPayLink['Response']['STATUS'].toString().toUpperCase() !=
    //         //         'FAILED'
    //         // ) {

    //         // }
    //     } else if (UpdatedPaymentMode == 'A') {
    //         let orderModel: OrderModel_Type = {
    //             ProposalId: ProposalId,
    //             UserID: loginSelector.UserId,
    //             DealerID: loginSelector.DealerId,
    //             TotalAmt: data['Premium'],
    //             ProductID: ICProductId,
    //             ChassisNo: data['ChassisNo'],
    //             ICServiceEnabled: data['ICServiceEnabled'],
    //             ConsentType: data['ConsentType']
    //         }

    //         let APDstatus = await APDPayment(orderModel)
    //         if (APDstatus.status == 200) {
    //             if (APDstatus.data['ErrorCode'] == 1) {
    //                 window.open(APDstatus.data['ErrorMessage'])
    //             } else if (APDstatus.data['ErrorCode'] != 1) {
    //                 dispatch({
    //                     type: 'setDialog',
    //                     value: {
    //                         ...state.dialogProps,
    //                         ['open']: true,
    //                         ['title']: 'Success',
    //                         ['content']: APDstatus.data['ErrorMessage'],
    //                         data: null,
    //                         dialogType: 'alert'
    //                     }
    //                 })

    //                 getPaymentList()
    //             }
    //         }
    //     } else {
    //         if (UpdatedPaymentMode == 'I' && CoverType == 'L') {
    //             dispatch({
    //                 type: 'setDialog',
    //                 value: {
    //                     ...state.dialogProps,
    //                     ['open']: true,
    //                     ['title']: 'Message',
    //                     ['content']:
    //                         'You can not issue Liability only policy through cheque option.',
    //                     data: null,
    //                     dialogType: 'alert'
    //                 }
    //             })
    //         } else {
    //             let paymentData: any = {
    //                 ChassisNo: data['ChassisNo'],
    //                 VisofProposalNo: data['ProposalNo'],
    //                 InsProposalNo: data['ICProposalNo'],
    //                 PaymentMode: data['UpdatedPaymentMode'],
    //                 Premium: data['Premium'],
    //                 DealerCode: data['DealerCode'],
    //                 ProductId: data['ICProductId'],
    //                 DealerId: data['DealerId'],
    //                 ProposalId: ProposalId,
    //                 IsBulk: false,
    //                 UserId: loginSelector.UserId,
    //                 ICServiceEnabled: data['ICServiceEnabled'],
    //                 ConsentType: data['ConsentType']
    //             }
    //             dispatchStore(update(paymentData))
    //             navigate('/policyPayment')
    //         }
    //     }
    // }

    const CancelProp = async (data: any) => {
        dispatch({
            type: 'setDialog',
            value: {
                ...state.dialogProps,
                ['open']: true,
                ['title']: 'Message',
                ['content']:
                    'Do you want to cancel this proposal ? Please confirm!',
                data: { ...data, ['CallFrom']: 'CANCEL' },
                dialogType: 'confirm'
            }
        })
    }

    const data: any = []
    const table = useReactTable({
        state: {
            sorting
        },

        columns,
        data: proposalPaymentList,

        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        getPaginationRowModel: getPaginationRowModel()
    })

    const handleBulkPayment = () => {
        let bulkPaymentCheckedList = proposalPaymentList.filter(
            (p: any) => p['BulkPaymentChecked']
        )

        if (bulkPaymentCheckedList.length < 2) {
            dispatch({
                type: 'setDialog',
                value: {
                    ...state.dialogProps,
                    ['open']: true,
                    ['title']: 'Message',
                    ['content']:
                        'Please Select Atleast two Proposal For Bulk Payment.',
                    data: null,
                    dialogType: 'alert'
                }
            })
            return
        } else {
            let icSet = new Set()
            let PMSet = new Set()
            let OEMSet = new Set()
            bulkPaymentCheckedList.forEach((element: any) => {
                icSet.add(element['ICProductId'])
                PMSet.add(element['PaymentModeId'])
                OEMSet.add(element['OEM_ID'])
            })

            if (icSet.size > 1 || PMSet.size > 1 || OEMSet.size > 1) {
                dispatch({
                    type: 'setDialog',
                    value: {
                        ...state.dialogProps,
                        ['open']: true,
                        ['title']: 'Message',
                        ['content']:
                            'Selected Proposals are from Different IC or Payment Mode or OEM.',
                        data: null,
                        dialogType: 'alert'
                    }
                })
                getPaymentList()
                return
            }
        }

        let data = bulkPaymentCheckedList[0]
        let totalPremium = bulkPaymentCheckedList.reduce(
            (total: number, y: any) => {
                return total + y['Premium']
            },
            0
        )
        let paymentData: any = {
            ChassisNo: data['ChassisNo'],
            VisofProposalNo: data['ProposalNo'],
            InsProposalNo: data['ICProposalNo'],
            PaymentMode: data['UpdatedPaymentMode'],
            Premium: totalPremium,
            DealerCode: data['DealerCode'],
            ProductId: data['ICProductId'],
            DealerId: data['DealerId'],
            ProposalId: bulkPaymentCheckedList
                .map((x: any) => x['ProposalId'])
                .join(','),
            IsBulk: true,
            UserId: loginSelector.UserId
        }
        dispatchStore(update(paymentData))
        navigate('/policyPayment')
    }
    return (
        <>
            <ConfirmDialog {...state.dialogProps} />
            <Paper
                sx={{
                    backgroundColor: '#fff',
                    padding: '.5rem',
                    borderRadius: '1rem',
                    marginBottom: '1rem'
                }}
            >
                <Stack
                    alignItems={'center'}
                    style={{ overflow: 'auto', display: 'block' }}
                >
                    <table className=" table-auto border-collapse border-slate-400 w-full customTable">
                        <thead className="bg-current">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className="border-slate-300 text-white cursor-pointer"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}

                                            {
                                                {
                                                    asc: <ArrowUpwardIcon />,
                                                    desc: <ArrowDownwardIcon />
                                                }[header.column.getIsSorted()]
                                            }
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="border-slate-300">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Stack>
            </Paper>
            <Stack direction={'row'} justifyContent={'center'}>
                <Button onClick={handleBulkPayment} variant="contained">
                    Bulk Payment
                </Button>
            </Stack>
            <Stack direction={'row'} pt={5} justifyContent={'center'}>
                <Button
                    disabled={!table.getCanPreviousPage()}
                    endIcon={<ArrowBackIosIcon />}
                    onClick={() => table.previousPage()}
                ></Button>
                <Typography>
                    {table.getPageCount() > 0
                        ? table.options.state.pagination.pageIndex + 1
                        : 0}
                    /{table.getPageCount()}
                </Typography>
                <Button
                    disabled={!table.getCanNextPage()}
                    endIcon={<ArrowForwardIosIcon />}
                    onClick={() => table.nextPage()}
                ></Button>
            </Stack>
        </>
    )
}
export default ProposalPaymentList
