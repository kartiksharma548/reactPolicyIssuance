import * as React from 'react';
import Typography from '@mui/material/Typography';

interface TitleProps {
  children?: React.ReactNode;
}

export default function Title(props: TitleProps) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom sx={{color:'#000', fontSize:'.875rem', fontWeight:'500'}}>
      {props.children}
    </Typography>
  );
}