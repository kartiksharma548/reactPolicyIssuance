import * as React from 'react'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import { Grid } from '@mui/material'

export default function QuoteSkeleton() {
    return (
        <Grid container columnSpacing={2} pb={3}>
            <Grid item xs={1}>
                <Skeleton
                    variant="rectangular"
                    animation="wave"
                    height={80}
                    sx={{ borderRadius: '5px' }}
                />
            </Grid>
            <Grid item xs={9}>
                <Skeleton
                    variant="rectangular"
                    animation="wave"
                    height={80}
                    sx={{ borderRadius: '5px' }}
                />
            </Grid>
            <Grid item xs={2}>
                <Skeleton
                    variant="rectangular"
                    animation="wave"
                    height={80}
                    sx={{ borderRadius: '5px' }}
                />
            </Grid>
        </Grid>
    )
}
