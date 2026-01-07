import { FormHelperText, TextField } from '@mui/material'
import { Controller } from 'react-hook-form'
import common from '../../../utils/common'

export function FormInputNumber(props: any) {
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
                            //helperText={error ? error.message : null}
                            value={value}
                            onChange={(e) => {
                                if (
                                    !isNaN(
                                        parseInt(e.target.value.slice(-1), 10)
                                    ) ||
                                    !common.isNotNullOrEmpty(e.target.value)
                                ) {
                                    onChange(e.target.value)
                                    onChangeFn(e)
                                } else {
                                    let currentValue = e.target.value
                                    e.target.value = e.target.value.substring(
                                        0,
                                        e.target.value.length - 1
                                    )
                                    onChange(e.target.value)
                                    onChangeFn(e)
                                }
                            }}
                            variant="standard"
                            placeholder={label}
                            {...props}
                            InputLabelProps={{
                                shrink: true
                            }}
                            className={props.className}
                        />
                        {error ? (
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
