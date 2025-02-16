import {
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Icon,
} from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import AttachmentReferenceList from "./AttachmentReferenceList";

const UploadButton = styled(Button)(() => ({
  border: "none",
  background: "$dali-blue2",
  display: "flex",
  justifyContent: "flex-start",
  textTransform: "none",
  color: "var(--darkgray)",
  fontSize: "16px",
  height: "50px",
  ":hover": {
    background: "$dali-blue3",
  },
}));

const StyledTextField = styled(TextField)(() => ({
  ".MuiOutlinedInput-root": {
    background: "var(--white)",
    fontSize: "0.875rem",
    height: "30px",
    width: "100%",
  },
}));

const StyledEditBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  justifyContent: "space-between",
  background: "$dali-blue2",
  borderRadius: "2px",
  padding: "0px 10px",
  height: "45px",
}));

const StyledHeadings = styled(Typography)(() => ({
  fontWeight: "bold",
  color: "var(--darkgray)",
}));

const AttachmentsPanel = ({
  handleUploadClick,
  handleListSelected,
  uploadedFiles,
  handleEditClick,
  handleDeleteClick,
  handleFileNameChange,
  handleEditSave,
  handleEditCancel,
  editIndex,
  editFileName,
  initialList,
}: {
  handleUploadClick: () => void;
  handleListSelected: (attachment: string) => void;
  uploadedFiles: File[];
  handleEditClick: (index: number) => void;
  handleDeleteClick: (index: number) => void;
  handleFileNameChange: any;
  handleEditSave: any;
  handleEditCancel: () => void;
  editIndex: any;
  editFileName: any;
  initialList: any;
}) => (
  <Box sx={{ flex: 1, padding: "10px 0px 20px 10px" }}>
    <StyledHeadings>Bijlagen</StyledHeadings>
    <AttachmentReferenceList
      title="Bestaande bijlagen koppelen"
      initialList={initialList}
      onListSelected={handleListSelected}
    />
    <StyledHeadings>Nieuwe bijlagen uploaden</StyledHeadings>
    <Box sx={{ maxHeight: "150px", overflowY: "auto" }}>
      {uploadedFiles.map((file, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "var(--lightgray)",
            marginBottom: "4px",
          }}
        >
          {editIndex === index ? (
            <StyledEditBox>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Icon>
                  <ImageOutlinedIcon />
                </Icon>
                <StyledTextField
                  value={editFileName}
                  onChange={handleFileNameChange}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton onClick={handleEditCancel}>
                  <CloseIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={handleEditSave}>
                  <CheckIcon fontSize="small" />
                </IconButton>
              </Box>
            </StyledEditBox>
          ) : (
            <StyledEditBox>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  width: "25vw",
                }}
              >
                <Icon>
                  <ImageOutlinedIcon />
                </Icon>
                <Typography
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: "var(--darkgray)",
                  }}
                >
                  {file.name}
                </Typography>
              </Box>
              <Box sx={{ display: "flex" }}>
                <IconButton onClick={() => handleEditClick(index)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={() => handleDeleteClick(index)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </StyledEditBox>
          )}
        </Box>
      ))}
    </Box>

    <UploadButton
      variant="outlined"
      fullWidth
      startIcon={<AddIcon />}
      onClick={handleUploadClick}
    >
      Bijlage uploaden
    </UploadButton>
  </Box>
);

export default AttachmentsPanel;
