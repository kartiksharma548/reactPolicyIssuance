import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
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
import { encrypt } from '../../utils/encryption'
import { BaseURL, BaseAppURL } from '../../constants/baseURL'
import { queryCustomerKYC } from '../../services/KYC/kycService'
import BackDropLoader from '../common/backDropLoading'


function KYCStatusListing({ quoteList, refresh }: any) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [showLoading, setShowLoading] = useState(false)

    function onConfirmDialogClose(){

        setDialog({
            ...dialog,
            open: false
        })
    }
    const[dialog,setDialog] = useState({
            open: false,
            content: '',
            title: '',
            data: {},
            onClose: onConfirmDialogClose,
            dialogType: 'alert'
        })

   
    const navigate = useNavigate()
    // const editProposal = (cell: any) => {
    //     let { original: data } = cell.row
    //     navigate({
    //         pathname: '/Quotation/',
    //         search: createSearchParams({
    //             ProposalId: data['PROPOSAL_ID']
    //         }).toString()
    //     })
    // }
    const columns = [
        {
            header: 'Sr.No.',
            accessorKey: 'Srno'
        },
        // {
        //     header: 'Proposal No.',
        //     accessorKey: 'PROPOSAL_NO'
        // },

        {
            header: () => {
                const isEndorsement =
                    quoteList?.[0]?.Trans_TYPE?.toUpperCase() === 'ENDORSEMENT'
                return isEndorsement
                    ? 'Endorsement No. / Proposal No.'
                    : 'Proposal No.'
            },
            accessorKey: 'PROPOSAL_NO',
            
            cell: ({ row }) => {
                const data = row.original
                const isEndorsement = data?.Trans_TYPE?.toUpperCase() === 'ENDORSEMENT'
                return (
                    <span
                        title={
                            isEndorsement && data?.ENDORSEMENT_NO
                                ? `Endorsement No.: ${data.ENDORSEMENT_NO}`
                                : `Proposal No.: ${data?.PROPOSAL_NO}`
                        }
                    >
                        {isEndorsement && data?.ENDORSEMENT_NO
                            ? `${data.ENDORSEMENT_NO} / ${data.PROPOSAL_NO}`
                            : data?.PROPOSAL_NO}
                    </span>
                )
            }
        },

        {
            header: 'KYC REQ NO.',
            accessorKey: 'RESP_VISOF_KYC_REQ_NO'
        },
        {
            header: 'IC KYC No.',
            accessorKey: 'RESP_IC_KYC_NO'
        },
        {
            header: 'Inurance Company',
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
            header: 'Trans Type',
            accessorKey: 'Trans_TYPE'
        },
        {
            header: 'KYC Status',
            accessorKey: 'KYCSTATUS'
        },
        {
            header: 'IC Remarks',
            accessorKey: 'RESP_KYC_REMARK'
        },

        {
            header: 'Action',
            accessorKey: 'action',
            cell: (cell: any) => {
                return createActionButton(cell)
            }
        }
    ]

    const createActionButton = (cell) => {
        let { original: data } = cell.row
        if (
            data['Trans_TYPE'] &&
            data['Trans_TYPE'].toUpperCase() === 'ENDORSEMENT'
        ) {
            return (
                <Button
                    color="primary"
                    size="small"
                    startIcon={<EditIcon />}
                    variant="contained"
                    onClick={() => {
                        const policyId = encrypt(data['FKPOLICY_ID'])
                        const url = `${BaseAppURL}/Endorsement/Endorsement/Index?PolicyId=${policyId}&IsViewSavedEndorsement=true`
                        window.open(url, '_self')
                    }}
                >
                    View Saved Endorsement
                </Button>
            )
        }
        if (data['RESP_KYC_STATUS'] == 3 || data['RESP_KYC_STATUS'] == 1) {
            return (
                <Button
                    color="primary"
                    size="small"
                    startIcon={<EditIcon />}
                    variant="contained"
                    onClick={() =>
                        navigate({
                            pathname: '/Preview/',
                            search: createSearchParams({
                                ProposalId: encrypt(data['PROPOSAL_ID']),
                                t: 'K'
                            }).toString()
                        })
                    }
                >
                    Create Policy
                </Button>
            )
        } 
        else if(data['KYCSTATUS'] == 'REJECTED')
        {
            return <></>
        }
        else {
            return (
                <Button
                    color="primary"
                    size="small"
                    startIcon={<EditIcon />}
                    variant="contained"
                    onClick={()=>{handleKYCStatusOnClick(data)}}
                >
                    Fetch
                </Button>
            )
        }
        return <></>
    }

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
        getPaginationRowModel: getPaginationRowModel()
    })

    const handleKYCStatusOnClick = async (event) => {
        setShowLoading(true);

        try {
            const result = await queryCustomerKYC({
                IC_KYC_No: event.RESP_IC_KYC_NO?.toString() || '',
                FKDealer_ID: 0,
                FKProduct_ID: 0,
                Created_by: 0,
                Created_Date: '',
                Created_Machine_IP: '',
                Proposal_No: '',
                Chassis_No: '',
                RequestTime: '',
                ResponseTime: '',
                VISoF_Program_Name: '',
                VISoF_KYC_Req_No: event.RESP_VISOF_KYC_REQ_NO?.toString() || '',
                ProposerType: '',
                FirstName: '',
                MiddleName: '',
                LastName: '',
                CompanyName: '',
                Gender: '',
                DOB: '',
                DOI: '',
                MobileNo: '',
                Email: '',
                ProposerPAN: '',
                ProposerAadhaarNumber: '',
                ProposerCKYC_No: '',
                Other_Add_FLD1: '',
                Other_Add_FLD2: '',
                Other_Add_FLD3: '',
                Other_Add_FLD4: '',
                Other_Add_FLD5: '',
                Other_Add_FLD6: ''
            });

            setDialog({
                ...dialog,
                open: true,
                title: 'KYC Status',
                content:
                    result?.KYC_Status === 1
                        ? 'KYC Status Fetched Successfully'
                        : `KYC Status is not available for this request. ${result?.KYC_Remarks ? `(${result.KYC_Remarks})` : ''}`
            });

        } catch (error: any) {
            console.error('KYC API error:', error);

            const errorMessage = error?.response?.data || 'Not getting proper KYC Response.';

            setDialog({
                ...dialog,
                open: true,
                title: 'KYC Status',
                content: errorMessage
            });
        } finally {
            setShowLoading(false);
            refresh();
        }
    };

    return (
        <>
            <BackDropLoader openDialog={showLoading} />
            <Box>
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
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext()
                                                      )}

                                                {
                                                    {
                                                        asc: (
                                                            <ArrowUpwardIcon />
                                                        ),
                                                        desc: (
                                                            <ArrowDownwardIcon />
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
            
            <Dialog open={dialog.open} onClose={dialog.onClose}>
            <DialogTitle>{dialog.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{dialog.content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={dialog.onClose} autoFocus>
                OK
                </Button>
            </DialogActions>
            </Dialog>         
        </>
    )
}

export default KYCStatusListing
