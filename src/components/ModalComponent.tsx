import { Modal, Box, Typography, Button, Fade, } from "@mui/material";
import type { JSX } from "react";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface ModalProps {
    open: boolean;
    message: string;
    onClose: () => void;
}

function ModalComponent({ open, message, onClose }: ModalProps): JSX.Element {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="success-modal-title"
            aria-describedby="success-modal-description"
            >
            <Fade in={open}>    
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
                outline: "none",
               }}>
               <CheckCircleOutlineIcon  sx={{ fontSize: "50px", color:"var(--primary-color)" }} />  
                <Typography id="success-modal-title" variant="h6" sx={{ fontWeight: "bold" , textAlign: "center"}}>
                {message}
                </Typography>
                <Button
                    onClick={onClose}
                    variant="contained"
                    fullWidth
                    sx={{
                        backgroundColor: "var(--primary-color)",
                        color: "#fff",
                        marginTop: "20px"
                    }}>
                    OK
                </Button>
            </Box>
            </Fade>
            </Modal>
    )
}   
export default ModalComponent;