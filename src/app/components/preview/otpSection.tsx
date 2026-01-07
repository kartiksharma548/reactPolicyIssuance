import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Radio,
    RadioGroup,
    TextField
} from '@mui/material'
import { Stack } from '@mui/system'
import DragNdrop from '../common/FileDragDrop'
import { useRef, useState } from 'react'

function OTPSection({ state, dispatch }: any) {
    const files = useRef<File[]>([])

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'setMandateType', value: e.target.value })
        if (e.target.value == '2')
            dispatch({ type: 'setShowOTPButton', value: false })
        else if (e.target.value == '1')
            dispatch({ type: 'setShowOTPButton', value: true })
    }

    const fileSelected = (file: File[]) => {
        dispatch({ type: 'setMandateFile', value: file[0] })
    }

    return (
        <>
            <Grid item xs={2} mb={2}>
                <FormControl>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        value={state.mandateType}
                        name="radio-buttons-group"
                        onChange={handleOnChange}
                    >
                        <Stack spacing={2} direction={'row'}>
                            <FormControlLabel
                                value="1"
                                control={<Radio />}
                                label="OTP"
                            />
                            {state.showMandateRadio && (
                                <FormControlLabel
                                    value="2"
                                    control={<Radio />}
                                    label="Mandate Form"
                                />
                            )}
                        </Stack>
                    </RadioGroup>
                </FormControl>
            </Grid>

            <Grid item>
                {state.mandateType == '1' && state.showVerifyButton ? (
                    <TextField
                        variant="standard"
                        fullWidth
                        label="Enter OTP"
                        onChange={(e) =>
                            dispatch({
                                type: 'setOTP',
                                value: e.target.value
                            })
                        }
                        inputProps={{ maxLength: 4 }}
                    />
                ) : state.mandateType == '2' ? (
                    <DragNdrop
                        onFilesSelected={fileSelected}
                        width={300}
                        height={100}
                    />
                ) : (
                    <></>
                )}
            </Grid>
        </>
    )
}

export default OTPSection
