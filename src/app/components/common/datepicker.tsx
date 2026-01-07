import * as React from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { Grid } from '@mui/material'
import common from '../../utils/common'

export default function BasicDatePicker({
    min,
    max,
    getDateFromPicker,
    label,
    name,
    defaultValue,
    nestedObject,
    fontSize
}: any) {
    // let d = new Date(),
    //     month = '' + (d.getMonth() + 1),
    //     day = '' + d.getDate(),
    //     year = d.getFullYear()
    // if (month.length < 2) month = '0' + month
    // if (day.length < 2) day = '0' + day
    // let todayDate = ''
    // if (
    //     defaultValue == 'Invalid Date' ||
    //     !common.isNotNullOrEmpty(defaultValue)
    // ) {
    //     defaultValue = dayjs(new Date())
    // } else {
    //     defaultValue = dayjs(defaultValue)
    // }

    // const minDate = () => {
    //     const currentDate = new Date()
    //     const fromDate = currentDate.setDate(currentDate.getDate() - min)
    //     let d = new Date(fromDate),
    //         month = '' + (d.getMonth() + 1),
    //         day = '' + d.getDate(),
    //         year = d.getFullYear()
    //     if (month.length < 2) month = '0' + month
    //     if (day.length < 2) day = '0' + day
    //     const StartDateFrom = [year, month, day].join('-')
    //     return dayjs(StartDateFrom)
    // }

    // const maxDate = () => {
    //     const currentDate = new Date()
    //     const endDate = currentDate.setDate(currentDate.getDate() + max)
    //     let d = new Date(endDate),
    //         month = '' + (d.getMonth() + 1),
    //         day = '' + d.getDate(),
    //         year = d.getFullYear()
    //     if (month.length < 2) month = '0' + month
    //     if (day.length < 2) day = '0' + day
    //     const EndDateTo = [year, month, day].join('-')
    //     return dayjs(EndDateTo)
    // }
    // const [value, setValue] = React.useState<Dayjs | null>(dayjs(defaultValue))

    // React.useEffect(() => {
    //     getDateFromPicker(value, name, nestedObject)
    // }, [value])

    const handleChange = (value) => {
        getDateFromPicker(value, name, nestedObject)
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'MobileDatePicker']}>
                <MobileDatePicker
                    label={label}
                    name={name}
                    maxDate={max}
                    minDate={min}
                    value={defaultValue}
                    sx={{ width: '100%' }}
                    onChange={(newValue) => handleChange(newValue)}
                    closeOnSelect={true}
                    format="DD/MM/YYYY"
                    views={['year', 'month', 'day']}
                    className="CustomDatePicker w-100"
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            InputLabelProps: {
                                sx: {
                                    fontSize: fontSize || '1.2rem',
                                    fontWeight: 500
                                }
                            }
                        },
                        actionBar: {
                            actions: [
                                //   'clear',
                                'today',
                                'cancel'
                            ]
                        }
                    }}
                />
            </DemoContainer>
        </LocalizationProvider>
    )
}
