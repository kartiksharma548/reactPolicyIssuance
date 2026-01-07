import {
    Box,
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
import { SavedQuoteDetails } from '../../models/types/Quotations/quoteListType'
import { ProposalModel } from '../../models/types/Proposal/ProposalModel'


function CancelledProposalListing({ cancelProposalList }: { cancelProposalList: ProposalModel[] }) {
    const [sorting, setSorting] = useState<SortingState>([])

    const navigate = useNavigate()

    const createProposal = (cell: any) => {
        let { original: data } = cell.row

        navigate({
            pathname: '/createPolicy/',
            search: createSearchParams({
                ProposalId: data['ProposalId']
            }).toString()
        })
    }
    
    const columns = [
        {
            header: 'Sr.No.',
            accessorKey: 'SNO'
        },
        {
            header: 'Chassis No.',
            accessorKey: 'ChassisNo'
        },
        {
            header: 'Proposal No.',
            accessorKey: 'ProposalNo'
        },
        {
            header: 'Model & Variant.',
            accessorKey: 'ModelVariantName'
        },
        {
            header: 'Insurance Company',
            accessorKey: 'ICName'
        },
        {
            header: 'Insured Name',
            accessorKey: 'CustomerName'
        },
        {
            header: 'Registration No.',
            accessorKey: 'VehRegistionNo'
        }

        ,{
            header: 'Action',
            accessorKey: 'action',
            cell: (cell: any) => {
                return createActionButton(cell)
            }
        }
    ]

    const createActionButton = (cell) => {
        
            return (
                <Button
                    color="primary"
                    size="small"
                    startIcon={<EditIcon />}
                    variant="contained"
                    onClick={() => createProposal(cell)}
                >
                    Create Proposal
                </Button>
            )
        
        return <></>
    }

    const data: any = []
    const table = useReactTable({
        state: {
            sorting
        },

        columns,
        data: cancelProposalList,

        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        getPaginationRowModel: getPaginationRowModel()
    })
    return (
        <>
        <Box>
            <Paper elevation={3}
                sx={{
                    backgroundColor: '#F0F0F0',
                    padding: '1rem',
                    borderRadius: '1rem',
                    marginBottom: '1rem'
                }}
            >
                <Box className="overflow-y-auto p-4 bg-white rounded-lg">
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
                </Box>
            </Paper>
            </Box>
            <Stack direction={'row'} justifyContent={'center'}>
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

export default CancelledProposalListing
