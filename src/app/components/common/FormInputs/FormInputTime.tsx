import { InputLabel, FormHelperText, TextField, Stack } from '@mui/material'
import { Controller } from 'react-hook-form'
import common from '../../../utils/common'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker'
import dayjs, { Dayjs } from 'dayjs'
import { useState, useEffect } from 'react'



export function FormInputTime(props: any) {
    const { control, name, label, onChangeFn, ...rest } = props;
    const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs(new Date()));

    const currentTime = dayjs(); 
    const previousDayTime = dayjs().subtract(1, 'day'); 

    return (
        <Controller
            name={name}
            control={control}
            render={({
                field: { onChange, value, ref, ...field },
                fieldState: { error }
            }) => (
                <>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack sx={{ height: '100%' }}>
                          
                            <InputLabel sx={{ mb: 1 }}>{label}</InputLabel>

                            <MobileTimePicker
                                label="" 
                                value={value}
                                onChange={(e) => {
                                    onChange(e);
                                    if (onChangeFn) onChangeFn(e);
                                }}
                                {...field}
                                {...rest} 
                                minTime={previousDayTime.startOf('day')}  
                                maxTime={currentTime} 
                                className="CustomDatePicker w-100"
                            />
                        </Stack>
                    </LocalizationProvider>

                    {common.isNotNullOrEmpty(error) && (
                        <FormHelperText sx={{ color: 'red' }}>
                            {error.message}
                        </FormHelperText>
                    )}
                </>
            )}
        />
    );
}
