import { Badge, Grid } from '@mui/material'
import DragNdrop from '../common/FileDragDrop'
import { FormInputFile } from '../common/FormInputs/FormInputFile'

function ChassisDiscountDoc({ control, reset }: any) {
    const fileSelected = (file: File[]) => {
        //dispatch({ type: 'setMandateFile', value: file[0] })
    }

    return (
        <>
            <Grid container pt={4} border={1}>
                <Grid xs={4}>
                    <Badge
                        badgeContent={'Chassis Discount Approval'}
                        color="error"
                    >
                        <FormInputFile
                            control={control}
                            name="ChassisDiscountImage"
                            onChangeFn={fileSelected}
                            reset={reset}
                        />
                    </Badge>
                </Grid>
            </Grid>
        </>
    )
}

export default ChassisDiscountDoc
