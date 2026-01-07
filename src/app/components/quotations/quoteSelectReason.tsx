import {
    Grid,
    Box,
    TextField,
    Select,
    Typography,
    Divider
} from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'

function QuoteSelectReason({ sendQuoteSelect }) {
    let sendQuoteConsentOTP = sendQuoteSelect.sendQuoteConsentOTP
    let setSendQuoteConsentOTP = sendQuoteSelect.setSendQuoteConsentOTP

    const QuoteConsent = (event: any) => {
        const { target } = event
        const { name, value } = target
        setSendQuoteConsentOTP({ ...sendQuoteConsentOTP, [name]: value })
    }
    return (
        <>
            <Box sx={{ flexGrow: '1', padding: '1.5rem 1.5rem .5rem 1.7rem' }}>
                <Grid container spacing={6} xs={12}>
                    <Grid xs={12} md={12}>
                        <small>
                            Note: Star rating is based on claim settlement
                            ratio.
                        </small>
                    </Grid>
                </Grid>
            </Box>
            <Divider />
            <Box sx={{ flexGrow: '1', padding: '1rem 1rem .5rem 1.7rem' }}>
                <Grid container spacing={6} xs={12} sx={{ mt: 1 }}>
                    <Grid xs={12} md={5}>
                        <FormControl>
                            <FormLabel></FormLabel>
                            <RadioGroup
                                onChange={QuoteConsent}
                                value={sendQuoteConsentOTP.ProductId}
                                name="ProductId"
                                row
                            >
                                <FormControlLabel
                                    style={{ fontSize: 11 }}
                                    value="1000"
                                    control={<Radio defaultChecked={false} />}
                                    label={
                                        <Typography
                                            style={{ fontSize: '0.775rem' }}
                                            color="textSecondary"
                                        >
                                            I am not interested in any of the
                                            above options
                                        </Typography>
                                    }
                                />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid xs={12} md={4}>
                        <FormControl
                            variant="standard"
                            fullWidth
                            sx={{ px: 4 }}
                        >
                            <Select
                                onChange={QuoteConsent}
                                inputProps={{ 'aria-label': 'Without label' }}
                                value={sendQuoteConsentOTP.Reason}
                                name="Reason"
                                labelId="reason-label"
                                displayEmpty
                            >
                                <MenuItem value={''}>
                                    --Select Reason--
                                </MenuItem>
                                <MenuItem
                                    value={
                                        'My preferred insurer is not in above list'
                                    }
                                >
                                    My preferred insurer is not in above list
                                </MenuItem>
                                <MenuItem value={'Premium is too high'}>
                                    Premium is too high
                                </MenuItem>
                                <MenuItem value={'I will decide later on'}>
                                    I will decide later on
                                </MenuItem>
                                <MenuItem value={'Others'}>Others</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid xs={12} md={3}>
                        <TextField
                            onChange={QuoteConsent}
                            inputProps={{ maxLength: 50 }}
                            value={sendQuoteConsentOTP.Remarks}
                            name="Remarks"
                            placeholder="Enter Remarks"
                            variant="standard"
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}
export default QuoteSelectReason
