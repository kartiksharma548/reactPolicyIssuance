import { Badge, Grid } from '@mui/material'
import DragNdrop from '../common/FileDragDrop'
import { FormInputFile } from '../common/FormInputs/FormInputFile'

function NcbDoc({ control, reset }: any) {
    const fileSelected = (file: File[]) => {
        //dispatch({ type: 'setMandateFile', value: file[0] })
    }

    return (
        <>
            <Grid container pt={4} border={1}>
                <Grid xs={4}>
                    <Badge badgeContent={'NCB Certificate'} color="error">
                        <FormInputFile
                            control={control}
                            name="NCBCertificate"
                            onChangeFn={fileSelected}
                            reset={reset}
                        />
                    </Badge>
                </Grid>
            </Grid>
        </>
    )
}

export default NcbDoc
