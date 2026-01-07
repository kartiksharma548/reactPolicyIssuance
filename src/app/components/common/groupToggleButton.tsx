import * as React from 'react'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { InputLabel } from '@mui/material'

export default function CustomToggleButton({
    value = '',
    defaultSelected,
    toggleButton,
    options,
    label,
    name
}) {
    let data = options
    const arrayOfDataList = Object.keys(data).map((key) => data[key])
    const [selectedValue, setSelectedValue] = React.useState(false)
    const [select, setSelected] = React.useState<string | null>(value)

    const handleChange = (
        _event: React.MouseEvent<HTMLElement>,
        newValue: string,
        event: React.MouseEvent<HTMLElement>,
        newSelectedValue: string | null
    ) => {
        if (newSelectedValue !== null) {
            setSelected(newValue)
        }
        setSelectedValue(newValue)
    }
    React.useEffect(() => {
        toggleButton(selectedValue, name, options)
    }, [selectedValue])

    return (
        <>
            <InputLabel htmlFor="" className="mb-1">
                {label}
            </InputLabel>
            <ToggleButtonGroup
                color="primary"
                value={value || defaultSelected}
                exclusive
                aria-label="Platform"
                sx={{
                    borderRadius: '8px',
                    backgroundColor: '#FAFAFA',
                    padding: '2px',
                    height: '34px'
                }}
                defaultValue={defaultSelected}
                onChange={handleChange}
            >
                {arrayOfDataList.map((val, i) => {
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
                        >
                            {val['label']}
                        </ToggleButton>
                    )
                })}
            </ToggleButtonGroup>
        </>
    )
}
