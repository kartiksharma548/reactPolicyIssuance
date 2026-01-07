import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Controller } from 'react-hook-form'
import common from '../../../utils/common'

export function FormInputAutocomplete(props:any){
    const { control, name, label,variant,placeholder, onChangeFn, VALUE, TEXT, LIST } = props
    const options = LIST?.map((option) => {
        const firstLetter = option[TEXT][0].toUpperCase();
        return {
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
            ...option,
        };
    });
    return (
        <Controller
            name={name}
            control={control}
            render={({
                field: { onChange, value, ref, ...field },
                fieldState: { error }
            }) => (
                <Autocomplete
                    value={value}
                    {...props}
                    onChange={(e) => {
                        onChange(e.target.value)
                        onChangeFn(e)
                    }}
                    id="grouped-demo"
                    options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                    groupBy={(option) => option.firstLetter}
                    getOptionLabel={(option) => option[TEXT] ? option[TEXT] : ""}
                    // getOptionLabel={(option) =>
                    //     typeof option === "string" ? option[TEXT] : option[TEXT].label
                    // }
                    //getOptionLabel={[{title:'a', name: 'a'}, {title:'b', name: 'b'}]}
                    sx={{ width: 300 }}
                    renderInput={(props) =>
                        <TextField  
                            label={label}
                            placeholder={placeholder}
                            variant={variant}
                            {...props}
                        />
                    }
                />
            )}
        />
    )
}