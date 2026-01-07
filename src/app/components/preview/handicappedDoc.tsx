import { Badge, Grid } from '@mui/material'
import DragNdrop from '../common/FileDragDrop'
import { FormInputFile } from '../common/FormInputs/FormInputFile'

function HandicappedDoc({ control, reset }: any) {
    const fileSelected = (file: File[]) => {
        //dispatch({ type: 'setMandateFile', value: file[0] })
    }

    return (
        <>
            <Grid container pt={4} border={1}>
                <Grid xs={4}>
                    <Badge
                        badgeContent={'Handicapped Registration Document'}
                        color="error"
                    >
                        <FormInputFile
                            control={control}
                            name="H1"
                            onChangeFn={fileSelected}
                            reset={reset}
                        />
                    </Badge>
                </Grid>
                <Grid xs={4}>
                    <Badge
                        badgeContent={'Handicapped Govt. Document'}
                        color="error"
                    >
                        <FormInputFile
                            control={control}
                            name="H2"
                            onChangeFn={fileSelected}
                            reset={reset}
                        />
                    </Badge>
                </Grid>
            </Grid>
        </>
    )
}

export default HandicappedDoc
