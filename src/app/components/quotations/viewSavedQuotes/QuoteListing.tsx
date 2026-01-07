import {
    Box,
    Button,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
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
import { SavedQuoteDetails } from '../../../models/types/Quotations/quoteListType'
import { useState } from 'react'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import EditIcon from '@mui/icons-material/Edit'
import { createSearchParams, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import common from '../../../utils/common'
import ConfirmDialog from '../../common/confirmDialog'
import { editProposalAPI } from '../../../services/policyServices/quoteService'
import { useAppSelector } from '../../../hooks/reduxHooks'
import { AuthModel } from '../../../redux/features/auth/authInterface'
import { encrypt } from '../../../utils/encryption'

function QuoteListing({ quoteList }: { quoteList: SavedQuoteDetails[] }) {
    const [sorting, setSorting] = useState<SortingState>([
        {
            id: 'Srno',
            desc: false
        } // sort by name in descending order by default
        // },

        // {
        //     desc: false,
        //     id: 'PROPOSAL_NO'
        // },
        // {
        //     desc: false,
        //     id: 'QUOTATION_NO'
        // },
        // {
        //     desc: false,
        //     id: 'POLICY_TYPE'
        // },
        // {
        //     desc: false,
        //     id: 'PROPOSER_TYPE'
        // },
        // {
        //     desc: false,
        //     id: 'Proposal_Date'
        // },
        // {
        //     desc: false,
        //     id: 'MMV'
        // },
        // {
        //     desc: false,
        //     id: 'PROPOSAL_NO'
        // },
        // {
        //     desc: false,
        //     id: 'QUOTATION_NO'
        // },
        // {
        //     desc: false,
        //     id: 'POLICY_TYPE'
        // },
        // {
        //     desc: false,
        //     id: 'PROPOSER_TYPE'
        // },
        // {
        //     desc: false,
        //     id: 'Proposal_Date'
        // },
        // {
        //     desc: false,
        //     id: 'MMV'
        // },
        // {
        //     desc: false,
        //     id: 'QuoteStatus'
        // },
        // {
        //     desc: false,
        //     id: 'PRODUCT_NAME'
        // },
        // {
        //     desc: false,
        //     id: 'Name'
        // },
        // {
        //     desc: false,
        //     id: 'CHASSIS_NO'
        // },
        // {
        //     desc: false,
        //     id: 'REG_NO'
        // },
        // {
        //     desc: false,
        //     id: 'Remarks'
        // }
    ])
    const navigate = useNavigate()
    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )
    // const onConfirmDialogClose = async (
    //     action: boolean,
    //     data: number | null
    // ) => {
    //     if (action) {
    //         let response = await editProposalAPI({ ProposalID: data })
    //         if (response == 1) {
    //             navigate({
    //                 pathname: '/Preview/',
    //                 search: createSearchParams({
    //                     ProposalId: data['PROPOSAL_ID']
    //                 }).toString()
    //             })
    //         }
    //     }
    //     setDialog({ ...dialog, ['open']: false })
    // }

    // const [dialog, setDialog] = useState({
    //     open: false,
    //     content: '',
    //     title: '',
    //     data: {},
    //     onClose: onConfirmDialogClose,
    //     dialogType: 'confirm'
    // })

    const editProposal = (cell: any) => {
        let { original: data } = cell.row
        if (dayjs(data.ProposalDate).isBefore(new Date(), 'day')) {
            navigate({
                pathname: '/createPolicy/',
                search: createSearchParams({
                    ProposalId: encrypt(data['PROPOSAL_ID'])
                }).toString()
            })
        } else {
            if (data.PROPOSAL_STAGE == 'PROPOSER_DETAIL') {
                navigate({
                    pathname: '/ProposerDetails/',
                    search: createSearchParams({
                        ProposalId: encrypt(data['PROPOSAL_ID'])
                    }).toString()
                })
            } else if (data.PROPOSAL_STAGE == 'PREVIEW') {
                navigate({
                    pathname: '/Preview/',
                    search: createSearchParams({
                        ProposalId: encrypt(data['PROPOSAL_ID'])
                    }).toString()
                })
            } else {
                if (
                    data.IS_OTP_VERIFIED === true &&
                    data.QUOTE_STATUS != 3 &&
                    data.QUOTE_STATUS != 0
                ) {
                    navigate({
                        pathname: '/ProposerDetails/',
                        search: createSearchParams({
                            ProposalId: encrypt(data['PROPOSAL_ID'])
                        }).toString()
                    })
                } else {
                    navigate({
                        pathname: '/Quotation/',
                        search: createSearchParams({
                            ProposalId: encrypt(data['PROPOSAL_ID'])
                        }).toString()
                    })
                }
            }
        }
    }
    const columns = [
        {
            header: 'Sr.No.',
            accessorKey: 'Srno'
        },
        {
            header: 'Proposal No.',
            accessorKey: 'PROPOSAL_NO'
        },
        {
            header: 'Quotation No.',
            accessorKey: 'QUOTATION_NO'
        },
        {
            header: 'Policy Type',
            accessorKey: 'POLICY_TYPE'
        },
        {
            header: 'Proposer Type',
            accessorKey: 'PROPOSER_TYPE'
        },
        {
            header: 'Proposal Date',
            accessorKey: 'Proposal_Date'
        },
        {
            header: 'Model & Variant',
            accessorKey: 'MMV'
        },
        {
            header: 'Quote Selected',
            accessorKey: 'QuoteStatus',
            cell: (cell: any) => {
                let { original: data } = cell.row
                if (loginSelector.IsSendQuoteEnable == 1) {
                    if (data.QuoteStatus == 2) {
                        return (
                            <label
                                style={{
                                    color: 'lightgreen',
                                    border: '2px solid green',
                                    borderRadius: '5px',
                                    padding: '5px 10px'
                                }}
                            >
                                Yes
                            </label>
                        )
                    } else if (data.QuoteStatus == 3) {
                        return (
                            <label
                                style={{
                                    color: 'red',
                                    border: '2px solid red',
                                    borderRadius: '5px',
                                    padding: '5px 10px'
                                }}
                            >
                                Rejected
                            </label>
                        )
                    } else {
                        return (
                            <label
                                style={{
                                    color: 'darkcyan',
                                    border: '2px solid darkcyan',
                                    borderRadius: '5px',
                                    padding: '5px 10px'
                                }}
                            >
                                Pending
                            </label>
                        )
                    }
                } else {
                    return <label></label>
                }
            }
        },
        {
            header: 'IC Name',
            accessorKey: 'PRODUCT_NAME'
        },
        {
            header: 'Insured Name',
            accessorKey: 'Name'
        },
        {
            header: 'Chassis No.',
            accessorKey: 'CHASSIS_NO'
        },
        {
            header: 'Registration No.',
            accessorKey: 'REG_NO'
        },
        {
            header: 'Remarks',
            accessorKey: 'Remarks'
        },

        {
            header: 'Action',
            accessorKey: 'action',
            cell: (cell: any) => {
                let { original: data } = cell.row
                if (data.QuoteStatus == 2) {
                    return (
                        <Button
                            color="primary"
                            size="small"
                            startIcon={<EditIcon />}
                            variant="contained"
                            onClick={() => editProposal(cell)}
                        >
                            Create Proposal
                        </Button>
                    )
                } else {
                    return (
                        <Button
                            color="primary"
                            size="small"
                            startIcon={<EditIcon />}
                            variant="contained"
                            onClick={() => editProposal(cell)}
                            sx={{
                                width: '110px',
                                height: '50px'
                            }}
                        >
                            Edit
                        </Button>
                    )
                }
            }
        }
    ]

    const data: any = []
    const table = useReactTable({
        state: {
            sorting
        },

        columns,

        data: quoteList,

        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        getPaginationRowModel: getPaginationRowModel(),
        enableSortingRemoval: false
    })

    const [recordCount, setRecordCount] = useState(10)

    const handleChange = (e: any) => {
        setRecordCount(e.target.value)
        table.setPageSize(e.target.value)
    }
    return (
        <>
            {/* <ConfirmDialog {...dialog} /> */}
            <Box>
                <div>
                    <FormControl>
                        <Typography id="demo-simple-select-label">
                            Records Per Page
                        </Typography>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={recordCount}
                            label="Records Per Page"
                            onChange={handleChange}
                        >
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={30}>30</MenuItem>
                            <MenuItem value={40}>40</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <Paper
                    elevation={3}
                    sx={{
                        backgroundColor: '#F0F0F0',
                        padding: '1rem',
                        borderRadius: '1rem',
                        marginBottom: '1rem'
                    }}
                >
                    <Box className="overflow-y-auto p-4 bg-white rounded-lg">
                        <table className=" table-auto border-collapse border-slate-400 w-full  customTable">
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
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext()
                                                      )}

                                                {
                                                    {
                                                        asc: (
                                                            <ArrowDropUpIcon />
                                                        ),
                                                        desc: (
                                                            <ArrowDropDownIcon />
                                                        )
                                                    }[
                                                        header.column.getIsSorted()
                                                    ]
                                                }
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-slate-300"
                                    >
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

export default QuoteListing
