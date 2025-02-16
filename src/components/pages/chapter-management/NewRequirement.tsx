import React, { useState } from "react";
import {
  Box,
  Typography,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
  IconButton,
  styled,
  OutlinedInput,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import LinkIcon from '@mui/icons-material/Link';
import { Navigate, useNavigate } from "react-router-dom";


const ModalContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxWidth: "100%",
  backgroundColor: "white",
  // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  borderRadius: "8px",
  overflow: "hidden",
  height: "90vh",
  maxHeight: "100vh",
}));

const Header = styled(Box)(({ theme }) => ({
  backgroundColor: "#4a4a4a",
  color: "white",
  padding: "16px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const Content = styled(Box)(({ theme }) => ({
  padding: "24px",
  height: "calc(90vh - 64px)",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#888",
    borderRadius: "4px",
    "&:hover": {
      background: "#555",
    },
  },
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: "24px",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: "16px",
  color: "#333",
}));

const FormRow = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "16px",
  marginBottom: "16px",
  alignItems: "center",
}));

const FormLabel = styled(Typography)(({ theme }) => ({
  minWidth: "120px",
  color: "#333",
  fontWeight: "500",
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  flex: 1,
  "& .MuiOutlinedInput-root": {
    borderRadius: "4px",
  },
}));

const EditorToolbar = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "8px",
  marginBottom: "8px",
  padding: "8px",
  borderBottom: "1px solid #e0e0e0",
}));

const ToolbarButton = styled(IconButton)(({ theme }) => ({
  padding: "4px",
  color: "#666",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  "& .MuiSelect-select": {
    padding: "8px 14px",
  },
}));

const ConfirmationModalContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "400px",
  padding: "24px",
  backgroundColor: "white",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  borderRadius: "8px",
  textAlign: "center",
}));

const ConfirmationHeader = styled(Box)(({ theme }) => ({
  backgroundColor: "#4a4a4a",
  color: "white",
  padding: "12px",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "18px",
}));

const ConfirmationText = styled(Typography)(({ theme }) => ({
  margin: "16px 0 24px",
  fontSize: "16px",
  color: "#333",
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
}));

const ConfirmButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#4a4a4a",
  color: "white",
  textTransform: "none",
  fontWeight: "bold",
  width: "100px",
  "&:hover": {
    backgroundColor: "#333",
  },
}));

const CancelButton = styled(Button)(({ theme }) => ({
  backgroundColor: "white",
  color: "#4a4a4a",
  textTransform: "none",
  fontWeight: "bold",
  border: "1px solid #4a4a4a",
  width: "100px",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
}));

const FormColumns = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "32px",
}));

const FormColumn = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
}));

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <ConfirmationModalContainer>
        <ConfirmationHeader>Close notification</ConfirmationHeader>
        <ConfirmationText>Are you sure you want to close the screen?</ConfirmationText>
        <ButtonContainer>
          <ConfirmButton onClick={onConfirm}>Yes</ConfirmButton>
          <CancelButton onClick={onClose}>No</CancelButton>
        </ButtonContainer>
      </ConfirmationModalContainer>
    </Modal>
  );
};

const NewRequirement: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [formData, setFormData] = useState({
    chapter: "",
    area: "",
    level: "",
    subject: "",
    residentialArea: "",
    subtopic: "",
    hardness: "",
    description: ""
  });
  const navigate = useNavigate();
  

  const handleClose = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmClose = () => {
    setIsConfirmationOpen(false);
    setOpen(false);
    navigate("/welcomePage");

  };

  const handleCancelClose = () => {
    setIsConfirmationOpen(false);
  };

  const handleChange = (field: string) => (event: any) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleContinue = () => {
    console.log('Form Data:', formData);
  };

  return (
    <>
      <Modal 
        open={open} 
        onClose={handleClose}
        aria-labelledby="new-requirement-modal"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ModalContainer>
          <Header>
            <Typography variant="h6">Linking Attachments and Source References</Typography>
            <IconButton onClick={handleClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Header>
          <Content>
            <FormSection>
              <SectionTitle variant="subtitle1">Location</SectionTitle>
              <FormColumns>
                <FormColumn>
                  <FormRow>
                    <FormLabel>Chapter*</FormLabel>
                    <StyledFormControl>
                      <StyledSelect
                        displayEmpty
                        value={formData.chapter}
                        onChange={handleChange('chapter')}
                        input={<OutlinedInput />}
                      >
                        <MenuItem value="" disabled>Select...</MenuItem>
                        <MenuItem value="1">Chapter 1</MenuItem>
                        <MenuItem value="2">Chapter 2</MenuItem>
                      </StyledSelect>
                    </StyledFormControl>
                  </FormRow>

                  <FormRow>
                    <FormLabel>Area*</FormLabel>
                    <StyledFormControl>
                      <StyledSelect
                        displayEmpty
                        value={formData.area}
                        onChange={handleChange('area')}
                        input={<OutlinedInput />}
                      >
                        <MenuItem value="" disabled>Select...</MenuItem>
                        <MenuItem value="1">Area 1</MenuItem>
                        <MenuItem value="2">Area 2</MenuItem>
                      </StyledSelect>
                    </StyledFormControl>
                  </FormRow>

                  <FormRow>
                    <FormLabel>Level*</FormLabel>
                    <StyledFormControl>
                      <StyledSelect
                        displayEmpty
                        value={formData.level}
                        onChange={handleChange('level')}
                        input={<OutlinedInput />}
                      >
                        <MenuItem value="" disabled>Select...</MenuItem>
                        <MenuItem value="1">Level 1</MenuItem>
                        <MenuItem value="2">Level 2</MenuItem>
                      </StyledSelect>
                    </StyledFormControl>
                  </FormRow>

                  <FormRow>
                    <FormLabel>Subject*</FormLabel>
                    <StyledFormControl>
                      <StyledSelect
                        displayEmpty
                        value={formData.subject}
                        onChange={handleChange('subject')}
                        input={<OutlinedInput />}
                      >
                        <MenuItem value="" disabled>Select...</MenuItem>
                        <MenuItem value="1">Subject 1</MenuItem>
                        <MenuItem value="2">Subject 2</MenuItem>
                      </StyledSelect>
                    </StyledFormControl>
                  </FormRow>
                </FormColumn>

                <FormColumn>
                  <FormRow>
                    <FormLabel>Residential Area*</FormLabel>
                    <StyledFormControl>
                      <StyledSelect
                        displayEmpty
                        value={formData.residentialArea}
                        onChange={handleChange('residentialArea')}
                        input={<OutlinedInput />}
                      >
                        <MenuItem value="" disabled>Select...</MenuItem>
                        <MenuItem value="1">Residential Area 1</MenuItem>
                        <MenuItem value="2">Residential Area 2</MenuItem>
                      </StyledSelect>
                    </StyledFormControl>
                  </FormRow>

                  <FormRow>
                    <FormLabel>Subtopic*</FormLabel>
                    <StyledFormControl>
                      <StyledSelect
                        displayEmpty
                        value={formData.subtopic}
                        onChange={handleChange('subtopic')}
                        input={<OutlinedInput />}
                      >
                        <MenuItem value="" disabled>Select...</MenuItem>
                        <MenuItem value="1">Subtopic 1</MenuItem>
                        <MenuItem value="2">Subtopic 2</MenuItem>
                      </StyledSelect>
                    </StyledFormControl>
                  </FormRow>

                  <FormRow>
                    <FormLabel>Hardness*</FormLabel>
                    <StyledFormControl>
                      <StyledSelect
                        displayEmpty
                        value={formData.hardness}
                        onChange={handleChange('hardness')}
                        input={<OutlinedInput />}
                      >
                        <MenuItem value="" disabled>Select...</MenuItem>
                        <MenuItem value="hard">Hard</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="soft">Soft</MenuItem>
                      </StyledSelect>
                    </StyledFormControl>
                  </FormRow>
                </FormColumn>
              </FormColumns>
            </FormSection>

            <FormSection>
              <SectionTitle variant="subtitle1">Description</SectionTitle>
              <EditorToolbar>
                <ToolbarButton size="small">
                  <FormatBoldIcon fontSize="small" />
                </ToolbarButton>
                <ToolbarButton size="small">
                  <FormatItalicIcon fontSize="small" />
                </ToolbarButton>
                <ToolbarButton size="small">
                  <FormatUnderlinedIcon fontSize="small" />
                </ToolbarButton>
                <Box sx={{ borderRight: "1px solid #e0e0e0", mx: 1 }} />
                <ToolbarButton size="small">
                  <FormatListBulletedIcon fontSize="small" />
                </ToolbarButton>
                <ToolbarButton size="small">
                  <FormatListNumberedIcon fontSize="small" />
                </ToolbarButton>
                <Box sx={{ borderRight: "1px solid #e0e0e0", mx: 1 }} />
                <ToolbarButton size="small">
                  <FormatAlignLeftIcon fontSize="small" />
                </ToolbarButton>
                <ToolbarButton size="small">
                  <FormatAlignCenterIcon fontSize="small" />
                </ToolbarButton>
                <ToolbarButton size="small">
                  <FormatAlignRightIcon fontSize="small" />
                </ToolbarButton>
                <Box sx={{ borderRight: "1px solid #e0e0e0", mx: 1 }} />
                <ToolbarButton size="small">
                  <LinkIcon fontSize="small" />
                </ToolbarButton>
              </EditorToolbar>
              <TextField
                multiline
                rows={4}
                fullWidth
                placeholder="Add a description"
                variant="outlined"
                value={formData.description}
                onChange={handleChange('description')}
              />
            </FormSection>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleContinue}
                sx={{
                  backgroundColor: "#d64b4b",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#b73e3e",
                  },
                  textTransform: "none",
                  minWidth: "120px",
                }}
              >
                Continue
              </Button>
            </Box>
          </Content>
        </ModalContainer>
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={handleCancelClose}
        onConfirm={handleConfirmClose}
      />
    </>
  );
};

export default NewRequirement;
