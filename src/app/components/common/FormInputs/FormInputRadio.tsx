import {
    InputLabel,
    TextField,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material'
import { Controller } from 'react-hook-form'
import common from '../../../utils/common'
import { useEffect, useState } from 'react'

export function FormInputRadio(props: any) {
    const { control, name, label, onChangeFn, list, IsDisabled } = props
    const [select, setSelected] = useState<string | null>('')

    // const handleChange = (_event: any) => {
    //     setSelected(_event.target.value)
    // }

    // useEffect(() => {
    //     onChangeFn(select, name)
    // }, [select])

    return (
        <>
            <InputLabel htmlFor="" className="mb-1">
                {label}
            </InputLabel>
            <Controller
                name={name}
                control={control}
                render={({
                    field: { onChange, value, ref, ...field },
                    fieldState: { error }
                }) => (
                    <ToggleButtonGroup
                        color="primary"
                        value={value.toString()}
                        exclusive
                        aria-label="Platform"
                        sx={{
                            borderRadius: '8px',
                            backgroundColor: '#FAFAFA',
                            padding: '2px',
                            height: '34px'
                        }}
                        defaultValue={value.toString()}
                        onChange={(e: any) => {
                            onChange(e.target.value)
                            onChangeFn(e.target.value, name)
                        }}
                    >
                        {list.map((val: any, i: number) => {
                            return (
                                <ToggleButton
                                    value={val['type']}
                                    key={i}
                                    sx={{
                                        borderRadius: '8px',
                                        backgroundColor: '#FAFAFA',
                                        border: '0px',
                                        fontSize: '14px',
                                        padding: '4px 16px',
                                        '&.Mui-selected': {
                                            borderRadius: '8px',
                                            backgroundColor: '#339',
                                            border: '0px',
                                            color: '#fff',
                                            fontSize: '14px',
                                            padding: '4px 16px'
                                        },
                                        '&.MuiToggleButtonGroup-firstButton': {
                                            bordertoprightradius: '8px',
                                            borderbottomrightradius: '8px',
                                            marginLeft: '0px',
                                            borderLeft: '0px'
                                        }
                                    }}
                                    disabled={IsDisabled}
                                >
                                    {val['label']}
                                </ToggleButton>
                            )
                        })}
                    </ToggleButtonGroup>
                )}
            />
        </>
    )
}
