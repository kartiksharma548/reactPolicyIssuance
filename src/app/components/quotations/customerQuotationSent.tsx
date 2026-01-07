import * as React from 'react'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import BasicDatePicker from '../../components/common/datepicker'
import SearchIcon from '@mui/icons-material/Search'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import {
    Box,
    Container,
    Grid,
    Stack,
    TextField,
    Paper,
    Button,
    Chip,
} from '@mui/material'

const StyledTableHead = styled(TableHead)(({ theme }) => ({
    '& th:first-child': {
        borderTopLeftRadius: '12px',
        borderBottomLeftRadius: 'your-first-child-border-radius',
    },
    '& th:last-child': {
        borderTopRightRadius: '12px',
        borderBottomRightRadius: 'your-last-child-border-radius',
    },
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#22334F',
        color: theme.palette.common.white,
        padding: '8px 12px',
    },

    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        padding: '8px 12px',
    },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}))

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number
) {
    return { name, calories, fat, carbs, protein }
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
]

export default function CustomerQuoteSent() {
    return (
        <Container maxWidth="xl" sx={{ mb: 4 }}>
            <div className="box-header with-border">
                <h1 className="box-title flex items-center my-2">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M20 11.0005H6.82998L9.70998 8.12047C10.1 7.73047 10.1 7.10047 9.70998 6.71047C9.31998 6.32047 8.68998 6.32047 8.29998 6.71047L3.70998 11.3005C3.31998 11.6905 3.31998 12.3205 3.70998 12.7105L8.29998 17.3005C8.68998 17.6905 9.31998 17.6905 9.70998 17.3005C10.1 16.9105 10.1 16.2805 9.70998 15.8905L6.82998 13.0005H20C20.55 13.0005 21 12.5505 21 12.0005C21 11.4505 20.55 11.0005 20 11.0005Z"
                            fill="#22334F"
                        />
                    </svg>
                    <span className="ml-2">Customer Quotation Sent</span>
                </h1>
            </div>
            <Box
                sx={{
                    flexGrow: '1',
                    flexDirection: 'row',
                    width: '100%',
                    padding: '1rem 0',
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <BasicDatePicker
                            id="Quotationfromdate"
                            name="Quotationfromdate"
                            placeholder="Enter Quotation Created Date From"
                            label="Quotation Created Date From"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <BasicDatePicker
                            id="Quotationtodate"
                            name="Quotationtodate"
                            placeholder="Enter Quotation Created Date To"
                            autoComplete="off"
                            readOnly={true}
                            variant="standard"
                            fullWidth
                            label="Quotation Created Date To"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            variant="standard"
                            placeholder="First Name"
                            id="Firstname"
                            name="FIRST_NAME"
                            label="First Name"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            variant="standard"
                            placeholder="Middle Name"
                            id="Middlename"
                            name="MIDDLE_NAME"
                            label="Middle Name"
                        />
                    </Grid>
                    <Stack
                        spacing={2}
                        direction="row"
                        className="flex mx-auto my-4"
                    >
                        <Button
                            color="primary"
                            size="medium"
                            variant="contained"
                            startIcon={<SearchIcon />}
                        >
                            Search
                        </Button>
                        <Button
                            color="primary"
                            size="medium"
                            variant="contained"
                            startIcon={<RestartAltIcon />}
                        >
                            Reset
                        </Button>
                    </Stack>
                </Grid>
            </Box>

            <Stack
                sx={{
                    backgroundColor: '#f0f0f0',
                    padding: '1rem',
                    borderRadius: '1rem',
                }}
            >
                <Paper
                    sx={{
                        backgroundColor: '#fff',
                        padding: '.5rem',
                        borderRadius: '1rem',
                        marginBottom: '1rem',
                    }}
                >
                    <table className="table-auto border-collapse border-slate-400 w-full customTable">
                        <thead className="bg-current">
                            <tr>
                                <th className="border-slate-300 text-white">
                                    Sr.No.
                                </th>
                                <th className="border-slate-300 text-white">
                                    Quote No.
                                </th>
                                <th className="border-slate-300 text-white">
                                    Inrured Name
                                </th>
                                <th className="border-slate-300 text-white">
                                    Chassis No
                                </th>
                                <th className="border-slate-300 text-white">
                                    Created Date & Time
                                </th>
                                <th className="border-slate-300 text-white">
                                    Quote Selected
                                </th>
                                <th className="border-slate-300 text-white">
                                    Insurance Company
                                </th>
                                <th className="border-slate-300 text-white">
                                    Remarks
                                </th>
                                <th className="border-slate-300 text-white">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border-slate-300">1</td>
                                <td className="border-slate-300">QT8897</td>
                                <td className="border-slate-300">Rajat</td>
                                <td className="border-slate-300">CH787979</td>
                                <td className="border-slate-300">
                                    <Chip
                                        label="Yes"
                                        size="small"
                                        color="success"
                                        variant="outlined"
                                    />
                                </td>
                                <td className="border-slate-300">
                                    20/02/2023 10:05 AM
                                </td>
                                <td className="border-slate-300">HDFC Ergo</td>
                                <td className="border-slate-300">-</td>
                                <td className="border-slate-300">
                                    <Button variant="outlined" size="small">
                                        Create Proposal
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td className="border-slate-300">2</td>
                                <td className="border-slate-300">QT8897</td>
                                <td className="border-slate-300">Rajat</td>
                                <td className="border-slate-300">CH787979</td>
                                <td className="border-slate-300">
                                    <Chip
                                        label="Rejected"
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            color: '#F44141',
                                            borderColor: '#F44141',
                                        }}
                                    />
                                </td>
                                <td className="border-slate-300">
                                    20/02/2023 10:05 AM
                                </td>
                                <td className="border-slate-300">-</td>
                                <td className="border-slate-300">
                                    I got better
                                </td>
                                <td className="border-slate-300">-</td>
                            </tr>
                            <tr>
                                <td className="border-slate-300">3</td>
                                <td className="border-slate-300">QT8897</td>
                                <td className="border-slate-300">Rajat</td>
                                <td className="border-slate-300">CH787979</td>
                                <td className="border-slate-300">
                                    <Chip
                                        label="Pending"
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            color: '#00AF91',
                                            borderColor: '#00AF91',
                                        }}
                                    />
                                </td>
                                <td className="border-slate-300">
                                    20/02/2023 10:05 AM
                                </td>
                                <td className="border-slate-300">-</td>
                                <td className="border-slate-300">-</td>
                                <td className="border-slate-300">
                                    <Button variant="contained" size="small">
                                        Resend
                                    </Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Paper>

                <TableContainer
                    component={Paper}
                    sx={{
                        backgroundColor: '#fff',
                        padding: '.5rem',
                        borderRadius: '1rem',
                    }}
                >
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <StyledTableHead>
                            <TableRow>
                                <StyledTableCell>
                                    Dessert (100g serving)
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    Calories
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    Fat&nbsp;(g)
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    Carbs&nbsp;(g)
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    Protein&nbsp;(g)
                                </StyledTableCell>
                            </TableRow>
                        </StyledTableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <StyledTableRow key={row.name}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.name}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {row.calories}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {row.fat}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {row.carbs}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {row.protein}
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Stack>
        </Container>
    )
}
