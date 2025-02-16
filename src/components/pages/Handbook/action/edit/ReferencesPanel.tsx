import { Box, Typography, IconButton, Button, TextField } from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
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

const StyledHeadings = styled(Typography)(() => ({
  fontWeight: "bold",
  color: "var(--darkgray)",
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

const ReferencesPanel = ({
  sourceReferences,
  handleLinkClick,
  setSourceReferences,
  handleAddingLink,
  newUrl,
  newDescription,
  setNewDescription,
  setNewUrl,
  initialList,
}: {
  sourceReferences: {
    isActive: boolean;
    uploadList: { url: string; description: string }[];
  };
  handleLinkClick: () => void;
  setSourceReferences: (value: any) => void;
  setNewUrl: (value: any) => void;
  setNewDescription: (value: any) => void;
  handleAddingLink: (url: string, description: string) => void;
  newUrl: string;
  newDescription: string;
  initialList: any;
}) => (
  <Box sx={{ flex: 1, padding: "10px 0px 20px 0px" }}>
    <StyledHeadings>Bronverwijzingen</StyledHeadings>
    <AttachmentReferenceList
      title="Bestaande bronverwijzingen koppelen"
      initialList={initialList}
      onListSelected={() => {}}
    />
    <StyledHeadings>Nieuwe bronverwijzingen aanmaken</StyledHeadings>

    <Box sx={{ maxHeight: "150px", overflowY: "auto" }}>
      {sourceReferences.uploadList.map((item, index) => (
        <Box
          sx={{
            key: { index },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "var(--lightgray)",
            marginBottom: "4px",
          }}
        >
          <StyledEditBox>{item.description}</StyledEditBox>
        </Box>
      ))}
    </Box>

    {sourceReferences.isActive ? (
      <Box
        sx={{
          display: "flex",
          gap: 1,
          background: "$dali-blue3",
          height: "50px",
          alignItems: "center",
          justifyContent: "center",
          p: "0px 10px",
        }}
      >
        <StyledTextField
          fullWidth
          variant="outlined"
          placeholder="URL"
          size="small"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
        />
        <StyledTextField
          fullWidth
          variant="outlined"
          placeholder="Omschrijving"
          size="small"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <IconButton
          onClick={() =>
            setSourceReferences({ ...sourceReferences, isActive: false })
          }
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <IconButton>
          <CheckIcon
            fontSize="small"
            onClick={() => handleAddingLink(newUrl, newDescription)}
          />
        </IconButton>
      </Box>
    ) : (
      <UploadButton fullWidth startIcon={<AddIcon />} onClick={handleLinkClick}>
        Bronverwijzing aanmaken
      </UploadButton>
    )}
  </Box>
);

export default ReferencesPanel;
