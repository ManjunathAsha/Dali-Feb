import { Box, styled, Typography, IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { ReactNode } from "react";
import { COLORS } from '../../constants/colors';


const ModalBox = styled(Box)(({ theme }) => ({
  position: "relative",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95vw",
  height: "90vh",
  backgroundColor: COLORS.base.white,
  display: "flex",
  flexDirection: "column",
  borderRadius: "4px",
  outline: "none",
  '@media (max-width: 600px)': {
    width: "100vw",
    height: "100vh",
  },
}));

const HeaderBox = styled(Box)({
  position: "fixed",
  width: "100%",
  background: COLORS.base.darkgray,
  color: COLORS.base.white,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  zIndex: 1,
});

const TitleText = styled(Typography)({
  fontSize: "16px",
  fontWeight: "bold",
 marginLeft:'8px',
  color: COLORS.base.white,
});

const ContentBox = styled(Box)({
  maxHeight: "95vh",
  overflowY: "auto",
  overflowX: "hidden",
  marginTop: "56px",
  padding: "16px",
  backgroundColor: COLORS.base.fade,
});

interface CustomModalHeaderProps {
  isOpen: boolean;
  handleClose: () => void;
  title: string;
  children: ReactNode;
}

const CustomModalHeader: React.FC<CustomModalHeaderProps> = ({
  isOpen,
  handleClose,
  title,
  children,
}) => {
  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleClose]);

  return (
    <Modal 
      open={isOpen} 
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <ModalBox role="dialog" aria-modal="true">
        <HeaderBox>
          <TitleText variant="h6" id="modal-title">
            {title}
          </TitleText>
          <IconButton 
            onClick={handleClose}
            aria-label="Close modal"
            sx={{
              color: COLORS.base.white,
              '&:hover': {
                backgroundColor: COLORS.base.red,
              },
              '&:focus': {
                outline: `2px solid ${COLORS.base.white}`,
                outlineOffset: '2px',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </HeaderBox>
        <ContentBox id="modal-description">
          {children}
        </ContentBox>
      </ModalBox>
    </Modal>
  );
};
export default CustomModalHeader;
