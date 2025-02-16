import React, { useState } from "react";
import { Button, Modal, Box, Typography, styled, Paper } from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";

const StyledButton = styled(Button)(() => ({
  backgroundColor: "var(--red)",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "var(--darkred)",
  },
}));

const StyledModal = styled(Modal)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ModalContent = styled(Paper)(() => ({
  padding: "20px",
  width: "400px",
  outline: "none",
}));

const ActionModify: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  return (
    <>
      {/* Button to Open Modal */}
      <StyledButton
        variant="contained"
        color="secondary"
        startIcon={<BuildIcon />}
        onClick={handleOpen}
      >
        <Typography>Acties</Typography>
      </StyledButton>

      {/* Modal */}
      <StyledModal open={isModalOpen} onClose={handleClose}>
        <ModalContent>
          <Typography variant="h6" gutterBottom>
            User Action
          </Typography>
          <Typography variant="body1" gutterBottom>
            This is a modal triggered by the "Acties" button.
          </Typography>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleClose} variant="contained" color="primary">
              Close
            </Button>
          </Box>
        </ModalContent>
      </StyledModal>
    </>
  );
};

export default ActionModify;
