import {
    Autocomplete,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@mui/material'
import { Controller } from 'react-hook-form'
import common from '../../../utils/common'

export function FormInputSelect(props: any) {
    const { control, name, label, onChangeFn, VALUE, TEXT, LIST } = props

    // const newValueArr = LIST.filter(
    //     (x) => x[VALUE] == control._formValues[name]
    // )

    const getValueObj = (value) => {
        const newValueArr = LIST.filter((x) => x[VALUE] == value)

        return newValueArr[0] || {}
    }

    return (
        <Controller
            name={name}
            control={control}
            render={({
                field: { onChange, value, ref, ...field },
                fieldState: { error }
            }) => (
                <FormControl fullWidth className={props.className}>
                    {/* <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        value={getValueObj(value)}
                        // isOptionEqualToValue
                        // getItemValue={(item) => item[VALUE]}
                        options={LIST}
                        sx={{ width: '100%' }}
                        getOptionLabel={(option) => option[TEXT]}
                        onChange={(e, data) => {
                            onChange(data[VALUE])
                            onChangeFn(e)
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={label}
                                variant="standard"
                            />
                        )}
                    /> */}
                    <InputLabel id="state-label" {...props}>
                        {label}
                    </InputLabel>
                    <Select
                        labelId="state-label"
                        //error={common.isNotNullOrEmpty(error)}
                        fullWidth
                        value={value}
                        {...props}
                        onChange={(e) => {
                            onChange(e.target.value)
                            onChangeFn(e)
                        }}
                        variant="standard"
                    >
                        {name != 'CPATenure' &&
                            name != 'FKVehicleType_ID' &&
                            name != 'TrailerNo' && (
                                <MenuItem value={0}>
                                    <span className="text-sm">
                                        {'--Select ' + label + '--'}
                                    </span>
                                </MenuItem>
                            )}

                        {LIST?.map((drp: any, index: number) => (
                            <MenuItem
                                key={index}
                                value={VALUE != '' ? drp[VALUE] : drp}
                            >
                                {TEXT != '' ? drp[TEXT] : drp.toString()}
                            </MenuItem>
                        ))}
                    </Select>
                    {error ? (
                        <FormHelperText
                            sx={{ color: 'red', marginLeft: '0px' }}
                        >
                            {error.message}
                        </FormHelperText>
                    ) : (
                        <></>
                    )}
                </FormControl>
            )}
        />
    )
}
