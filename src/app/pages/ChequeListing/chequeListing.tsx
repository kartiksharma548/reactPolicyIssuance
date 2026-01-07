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
import dayjs, { Dayjs } from 'dayjs'
import { encrypt } from '../../utils/encryption'

function ChequeListing({ chequeList }: any) {
    const [sorting, setSorting] = useState<SortingState>([])

    const navigate = useNavigate()
    const ApproveReject = (chequeData: ChequeModelType) => {
        navigate({
            pathname: '/preview/',
            search: createSearchParams({
                ProposalId: encrypt(chequeData.ProposalID.toString()),
                t: 'C'
            }).toString()
        })
    }
    const columns = [
        {
            header: 'Proposal No.',
            accessorKey: 'ProposalNo'
        },
        {
            header: 'Chassis No.',
            accessorKey: 'ChassisNo'
        },
        {
            header: 'Proposal Date',
            accessorKey: 'ProposalDate'
        },
        {
            header: 'Dealer Name',
            accessorKey: 'DealerName'
        },
        {
            header: 'Proposer Type',
            accessorKey: 'ProposalType'
        },
        {
            header: 'Insured Name',
            accessorKey: 'ProposerName'
        },
        {
            header: 'Customer Contact No.',
            accessorKey: 'CustomerContactNo'
        },
        {
            header: 'Cheque No.',
            accessorKey: 'ChequeNo'
        },
        {
            header: 'Approval Status',
            accessorKey: 'ApprovalStatus'
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

        if (
            dayjs(data['ProposalDate']).isBefore(
                dayjs(dayjs(new Date()).format('MM/DD/YYYY'))
            ) &&
            data['ApprovalStatus'] != 'APPROVED' &&
            data['ApprovalStatus'] != 'REJECTED'
        ) {
            return <Typography>Proposal Expired.</Typography>
        } else if (
            data['ApprovalStatus'] == 'APPROVED' &&
            data['IsPolicyCreated'] == '0'
        ) {
            return (
                <Button variant="contained" onClick={() => ApproveReject(data)}>
                    Re-Approve/Reject
                </Button>
            )
        } else if (data['ApprovalStatus'] == 'REJECTED') {
            return <Typography>{data['Remarks']}</Typography>
        } else if (data['ApprovalStatus'] == 'PENDING') {
            return (
                <Button variant="contained" onClick={() => ApproveReject(data)}>
                    Approve/Reject
                </Button>
            )
        } else {
            return <Typography></Typography>
        }
    }
    const data: any = []
    const table = useReactTable({
        state: {
            sorting
        },

        columns,
        data: chequeList,

        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        getPaginationRowModel: getPaginationRowModel()
    })
    return (
        <>
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

export default ChequeListing
