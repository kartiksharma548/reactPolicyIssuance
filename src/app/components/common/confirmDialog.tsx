import {
    Dialog,
    DialogTitle,
    DialogContent,
    RadioGroup,
    FormControlLabel,
    Radio,
    DialogActions,
    Button,
    Typography,
} from '@mui/material'
import { indigo } from '@mui/material/colors'

function ConfirmDialog(props: DialogProps) {
    const { content, title, open, onClose, data, dialogType } = props

    const handleOkCancel = (action: boolean) => {
        onClose(action, data)
    }

    return (
        <>
            <Dialog
                sx={{ '& .MuiDialog-paper': { width: '60%' } }}
                maxWidth="xs"
                open={open}
            >
                <DialogTitle
                    sx={{ backgroundColor: '#5f45a7', color: 'white' }}
                >
                    {title}
                </DialogTitle>
                <DialogContent dividers>
                    <Typography
                        dangerouslySetInnerHTML={{ __html: content }}
                    ></Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        variant="contained"
                        color="primary"
                        onClick={() => handleOkCancel(true)}
                    >
                        Ok
                    </Button>
                    {dialogType == 'confirm' && (
                        <Button
                            color="error"
                            variant="contained"
                            onClick={() => handleOkCancel(false)}
                        >
                            Cancel
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ConfirmDialog
