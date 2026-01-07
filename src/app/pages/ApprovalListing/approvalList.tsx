import {
    Button,
    Container,
    Grid,
    Paper,
    Stack,
    TextField,
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

import { useState } from 'react'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import EditIcon from '@mui/icons-material/Edit'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../hooks/reduxHooks'
import { AuthModel } from '../../redux/features/auth/authInterface'
import {
    checkICServiceValidation,
    updateHOProposalStatus
} from '../../services/policyServices/proposerService'
import ConfirmDialog from '../../components/common/confirmDialog'

function ApprovalList({ approvalList, refresh }: any) {
    const [sorting, setSorting] = useState<SortingState>([])
    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )
    const onConfirmDialogClose = async (action: boolean, data: any) => {
        if (data == null || data == undefined) {
            setDialog({
                ...dialog,
                ['open']: false
            })

            return
        }
        if (!action) {
            setDialog({ ...dialog, ['open']: false })
            return
        }

        let result = await updateHOProposalStatus(data)
        if (result.Status != '') {
            setDialog({
                ...dialog,
                ['open']: true,
                dialogType: 'alert',
                data: null,
                content: 'Proposal has been ' + result.Status,
                title: 'Message'
            })
            refresh()
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

    const navigate = useNavigate()
    const ApproveReject = async (
        approvalData: BreakinMDLType,
        action: string
    ) => {
        if (approvalData.BreakinTypeId == 0) {
            let obj: ProposalOTPInputModel = {
                ICServiceEnabled:
                    approvalData.IsProposalServiceActive.toString(),
                ProposalId: approvalData.Proposal_Id as number,
                ProductId: approvalData.PRODUCT_ID,
                userid: loginSelector.UserId,
                Gridhtml: ''
            }

            let ICServiceStatus = await checkICServiceValidation(obj)
            if (ICServiceStatus['ErrorCode'] != 1) {
                setDialog({
                    ...dialog,
                    ['open']: true,
                    ['title']: 'Failed',
                    ['content']: ICServiceStatus['ErrorMessage'],
                    data: null,
                    dialogType: 'alert'
                })
                return
            }
        }

        let dataObject: BreakinStatusUpdateMDL = {
            User_ID: loginSelector.UserId,
            Status: action == 'R' ? 2 : 1,
            Remarks: '',
            Proposal_Id: approvalData['Proposal_Id'],
            ApprovalType: 'HO'
        }

        let msgContent = action == 'R' ? 'Reject' : 'Approve'

        setDialog({
            ...dialog,
            ['open']: true,
            ['title']: 'Confirmation',
            ['content']:
                'Are you sure you want to ' + msgContent + ' this Proposal ?',
            data: dataObject,
            dialogType: 'confirm'
        })
    }
    const columns = [
        {
            header: 'Proposal No.',
            accessorKey: 'Proposal_No'
        },
        {
            header: 'Chassis No.',
            accessorKey: 'Chassis_No'
        },
        {
            header: 'Proposal Date',
            accessorKey: 'Proposal_Date'
        },
        {
            header: 'Insured',
            accessorKey: 'Insured'
        },
        {
            header: 'Insurance Company',
            accessorKey: 'Insurance_Company'
        },
        {
            header: 'Approval Status',
            accessorKey: 'Status'
        },
        {
            header: 'Action',
            accessorKey: 'action',
            cell: (cell: any) => {
                return createActionMessage(cell)
            }
        }
    ]

    const createActionMessage = (cell: any) => {
        let { original: data } = cell.row

        if (data['Status'].toUpperCase() == 'PENDING') {
            return (
                <Stack direction={'row'} spacing={2}>
                    <Button
                        variant="contained"
                        onClick={() => ApproveReject(data, 'A')}
                    >
                        Approve
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => ApproveReject(data, 'R')}
                    >
                        Reject
                    </Button>
                </Stack>
            )
        } else {
            return <></>
        }
    }
    const data: any = []
    const table = useReactTable({
        state: {
            sorting
        },

        columns,
        data: approvalList,

        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        getPaginationRowModel: getPaginationRowModel()
    })
    return (
        <>
            <ConfirmDialog {...dialog} />
            <Paper
                sx={{
                    backgroundColor: '#fff',
                    padding: '.5rem',
                    borderRadius: '1rem',
                    marginBottom: '1rem'
                }}
            >
                <Stack alignItems={'center'}>
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
                <Button
                    disabled={!table.getCanPreviousPage()}
                    endIcon={<ArrowBackIosIcon />}
                    onClick={() => table.previousPage()}
                ></Button>
                <Typography>
                    {table.options.state.pagination.pageIndex + 1}/
                    {table.getPageCount()}
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

export default ApprovalList
