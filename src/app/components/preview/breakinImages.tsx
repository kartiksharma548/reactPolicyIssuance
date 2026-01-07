
import { Badge, Grid } from '@mui/material'
import DragNdrop from '../common/FileDragDrop'
import { FormInputFile } from '../common/FormInputs/FormInputFile'
import FormInputDate from '../../components/common/FormInputs/FormInputDate'
import { useEffect, useReducer, useContext, useState } from 'react'
import dayjs from 'dayjs'
import { FormInputTime } from '../common/FormInputs/FormInputTime'

function Breakin({ control, reset }: any) {
    const fileSelected = (file: File[]) => {
        //dispatch({ type: 'setMandateFile', value: file[0] })
    }

    const [disabledTMIInput, setTMIInput] = useState(false)
    const gateDate = new Date()
    const yesterday = new Date(gateDate)
    yesterday.setDate(gateDate.getDate() - 1)
    const [insdate, setInsdate] = useState(dayjs());//useState('')

    const getSelectedDate = (Data: any, Name: any, nestedObject: any) => {}

    const getSelectedTime = (Data: any, Name: any, nestedObject: any) => {
   
        console.log()
   }

    return (
        <>
            <Grid container pt={4} border={1}>
                <Grid item xs={4}>
                    <Badge badgeContent={'Front Image'} color="error">
                        <FormInputFile
                            control={control}
                            name="Front"
                            onChangeFn={fileSelected}
                            reset={reset}
                        />
                    </Badge>
                </Grid>
                <Grid item xs={4}>
                    <Badge badgeContent={'Rear Image'} color="error">
                        <FormInputFile
                            control={control}
                            name="Rear"
                            onChangeFn={fileSelected}
                            reset={reset}
                        />
                    </Badge>
                </Grid>
                <Grid item xs={4}>
                    <Badge badgeContent={'Left Image'} color="error">
                        <FormInputFile
                            control={control}
                            name="Left"
                            onChangeFn={fileSelected}
                            reset={reset}
                        />
                    </Badge>
                </Grid>
                <Grid item xs={4}>
                    <Badge badgeContent={'Right Image'} color="error">
                        <FormInputFile
                            control={control}
                            name="Right"
                            onChangeFn={fileSelected}
                            reset={reset}
                        />
                    </Badge>
                </Grid>
                <Grid item xs={4}>
                    <Badge badgeContent={'Chassis Number/Plate'} color="error">
                        <FormInputFile
                            control={control}
                            name="Chassis"
                            onChangeFn={fileSelected}
                            reset={reset}
                        />
                    </Badge>
                </Grid>
                <Grid item xs={4}>
                    <Badge badgeContent={'Odometer Reading'} color="error">
                        <FormInputFile
                            control={control}
                            name="Odometer"
                            onChangeFn={fileSelected}
                            reset={reset}
                        />
                    </Badge>
                </Grid>
                <Grid item xs={4}>
                    <Badge badgeContent={'Inspection Report'} color="error">
                        <FormInputFile
                            control={control}
                            name="Inspection"
                            onChangeFn={fileSelected}
                            reset={reset}
                        />
                    </Badge>
                </Grid>
                <Grid item xs={4}>
                    <Badge badgeContent={'RC Copy'} color="error">
                        <FormInputFile
                            control={control}
                            name="RCCopy"
                            onChangeFn={fileSelected}
                            reset={reset}
                        />
                    </Badge>
                </Grid>
                <Grid item xs={4}>
                    <Badge badgeContent={'Chassis Trace'} color="error">
                        <FormInputFile
                            control={control}
                            name="ChassisTrace"
                            onChangeFn={fileSelected}
                            reset={reset}
                        />
                    </Badge>
                </Grid>
                <Grid item xs={4}>
                    <Badge badgeContent={'Under Chassis Image'} color="error">
                        <FormInputFile
                            control={control}
                            name="UnderChassisImage"
                            onChangeFn={fileSelected}
                            reset={reset}
                        />
                    </Badge>
                </Grid>

                <Grid item xs={4}>
                    <Badge badgeContent={'Engine Image'} color="error">
                        <FormInputFile
                            control={control}
                            name="EngineImage"
                            onChangeFn={fileSelected}
                            reset={reset}
                        />
                    </Badge>
                </Grid>
            </Grid>

            {/* <Grid container pt={6} border={0}>
                <Grid item xs={6} md={4} className="requiredField">
                    <FormInputDate
                        control={control}
                        name="InspectionDate"
                        label="Inspection Date"
                        disabled={false}
                        minDate={dayjs(yesterday)}
                        maxDate={dayjs(gateDate)}
                        inputFormat="DD/MM/YYYY"
                        onChangeFn={getSelectedDate}
                        value={insdate}
                    />
                </Grid>
                <Grid item xs={6} md={4} className="requiredField">
                    <FormInputTime
                        control={control}
                        name="InspectionTime"
                        label="Inspection Time"
                        onChangeFn={getSelectedTime}
                        value={insdate}
                    />
                </Grid>
            </Grid> */
            <Grid container pt={6} border={0} spacing={2} alignItems="center">
  <Grid item xs={12} md={4} className="requiredField" sx={{ display: 'flex', flexDirection: 'column' }}>
    <FormInputDate
      control={control}
      name="InspectionDate"
      label="Inspection Date"
      disabled={false}
      minDate={dayjs(yesterday)}
      maxDate={dayjs(gateDate)}
      inputFormat="DD/MM/YYYY"
      onChangeFn={getSelectedDate}
      value={insdate}
    />
  </Grid>
  <Grid item xs={12} md={4} className="requiredField" sx={{ display: 'flex', flexDirection: 'column' }}>
    <FormInputTime
      control={control}
      name="InspectionTime"
      label="Inspection Time"
      onChangeFn={getSelectedTime}
      value={insdate}
    />
  </Grid>
</Grid>
            }
        </>
    )
}

export default Breakin