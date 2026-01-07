import { InputLabel, FormHelperText, TextField } from '@mui/material'
import { Controller } from 'react-hook-form'
import common from '../../../utils/common'

export function FormInputText(props: any) {
    const { control, name, label, onChangeFn } = props

    return (
        <Controller
            name={name}
            control={control}
            render={({
                field: { onChange, value, ref, ...field },
                fieldState: { error }
            }) => (
                <>
                    <div>
                        <TextField
                            //error={common.isNotNullOrEmpty(error)}
                            fullWidth
                            //name={name}
                            //helperText={error ? error.message : null}
                            value={value}
                            //label={label}
                            onChange={(e) => {
                                onChange(e.target.value)
                                onChangeFn(e)
                            }}
                            variant="standard"
                            placeholder={label}
                            {...props}
                            InputLabelProps={{
                                shrink: true
                            }}
                            className={props.className}
                        />
                        {common.isNotNullOrEmpty(error) ? (
                            <FormHelperText sx={{ color: 'red' }}>
                                {error.message}
                            </FormHelperText>
                        ) : (
                            <></>
                        )}
                    </div>
                </>
            )}
        />
    )
}
