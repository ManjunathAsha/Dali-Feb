import { Box, styled, Typography, IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { ReactNode } from "react";

const ModalBox = styled(Box)({
  position: "relative",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95vw",
  height: "90vh",
  backgroundColor: "var(--white)",
  display: "flex",
  flexDirection: "column",
});

const HeaderBox = styled(Box)({
  position: "fixed",
  width: "100%",
  background: "var(--darkgray)",
  color: "var(--white)",
  display: "flex",
  justifyContent: "space-between",
});

const TitleText = styled(Typography)({
  fontSize: "16px",
  display: "flex",
  alignItems: "center",
  fontWeight: "bold",
  marginLeft: "10px",
});

const ContentBox = styled(Typography)({
  maxHeight: "95vh",
  overflowY: "auto",
  overflowX: "hidden",
  marginTop: "40px",
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
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <ModalBox>
        <HeaderBox>
          <TitleText variant="h6">{title}</TitleText>
          <IconButton onClick={handleClose}>
            <CloseIcon sx={{ color: "var(--white)" }} />
          </IconButton>
        </HeaderBox>
        <ContentBox>{children}</ContentBox>
      </ModalBox>
    </Modal>
  );
};

export default CustomModalHeader;
