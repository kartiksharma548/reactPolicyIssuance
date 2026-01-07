import * as React from 'react';
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';

export default function ControlledCheckbox({ callBackFn, value }: any) {
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);

  };

  React.useEffect(() => {
    callBackFn(value, checked);
  }, [checked])

  return (
    <Checkbox sx={{ padding: '0px', marginRight: '5px', boxShadow: '0px 0px 0px', 
    '&.Mui-checked': {
      color: '#22334F', // Change to your desired color
    },
    '& .MuiSvgIcon-root':{width:'.8em', height:'.8em',}
    }}
      checked={checked}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'controlled' }}
      color='info'
    />
  );
}