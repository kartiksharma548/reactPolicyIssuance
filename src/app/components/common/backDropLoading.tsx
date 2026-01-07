import { Backdrop, CircularProgress } from '@mui/material'

function BackDropLoader({ openDialog }: { openDialog: boolean }) {
    return (
        <>
            <Backdrop
                sx={{
                    color: '#fff',
                    // zIndex: (theme) => theme.zIndex.drawer + 1,
                    zIndex:1320,
                }}
                open={openDialog}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    )
}

export default BackDropLoader
