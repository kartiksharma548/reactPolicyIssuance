import { FormHelperText, InputLabel, Stack } from '@mui/material'
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import dayjs, { Dayjs } from 'dayjs'
import { useState, useEffect } from 'react'
import { Controller } from 'react-hook-form'

function FormInputDate(props: any) {
    const { control, name, label, onChangeFn, nestedObject } = props
    const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs(new Date()))

    // useEffect(() => {

    //     //setValue(dayjs(defaultValue))
    // }, [dateValue])
    return (
        <>
            <Controller
                name={name}
                control={control}
                render={({
                    field: { onChange, value, ref, ...field },
                    fieldState: { error }
                }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer
                            components={['DatePicker', 'MobileDatePicker']}
                            sx={{ borderColor: error ? 'red' : '' }}
                        >
                            <Stack sx={{ width: '100%' }}>
                                <InputLabel id="state-label" {...props}>
                                    {label}
                                </InputLabel>
                                <MobileDatePicker
                                    {...props}
                                    label=""
                                    //name={name}
                                    // maxDate={maxDate()}
                                    // minDate={minDate()}
                                    value={value}
                                    sx={{ width: '100%' }}
                                    onChange={(newValue) => {
                                        onChange(newValue)
                                        onChangeFn(newValue, name, nestedObject)
                                    }}
                                    format="DD/MM/YYYY"
                                    views={['year', 'month', 'day']}
                                    slotProps={{
                                        actionBar: {
                                            actions:
                                                name == 'InvoiceDate' ||
                                                name == 'RegistrationDate'
                                                    ? ['clear', 'cancel']
                                                    : [
                                                          'clear',
                                                          'today',
                                                          'cancel'
                                                      ]
                                        }
                                    }}
                                    className="CustomDatePicker w-100"
                                    closeOnSelect={true}
                                />
                            </Stack>
                        </DemoContainer>
                        {error ? (
                            <FormHelperText sx={{ color: 'red' }}>
                                {error.message}
                            </FormHelperText>
                        ) : (
                            <></>
                        )}
                    </LocalizationProvider>
                )}
            />
        </>
    )
}

export default FormInputDate
