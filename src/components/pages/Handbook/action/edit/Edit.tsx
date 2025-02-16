import React, { useState } from "react";
import { Box, Typography, FormControl, Select, MenuItem } from "@mui/material";
import { styled } from "@mui/system";
import Grid from "@mui/material/Grid2";
import ReactQuill from "react-quill";
import AttachmentsPanel from "./AttachmentsPanel";
import ReferencesPanel from "./ReferencesPanel";
import LocationPanel from "../../common/LocationPanel";
import PrimaryButton from "../../../../utils/PrimaryButton";
import CustomModalHeader from "../../../../utils/CustomModalHeader";

interface EditProps {
  isEdit: boolean;
  setEdit: (value: boolean) => void;
}

const initialList = [
  "04.01 Traffic tiles shark tooth A4 Portrait.pdf",
  "04.02 Cycle path paved with roller layer A4 Standing.pdf",
  "04.03 Cycle path paved with stretcher layer A4 Standing.pdf",
  "04.03 Cycle path paved with stretcher layer A4 Standing.pdf",
  "04.03 Cycle path paved with stretcher layer A4 Standing.pdf",
  "04.03 Cycle path paved with stretcher layer A4 Standing.pdf",
  "04.03 Cycle path paved with stretcher layer A4 Standing.pdf",
];

const rows = [
  { label: "Hoofdstuk", value: "Planproces" },
  { label: "Niveau", value: "Stedenbouwkundig niveau" },
  { label: "Woonkern", value: "Alle kernen" },
  { label: "Gebied", value: "Alle gebieden" },
  { label: "Onderwerp", value: "Fase Inrichtingsplan" },
  { label: "Subonderwerp", value: "Beheerplan" },
];

const StyledHeadings = styled(Typography)(() => ({
  fontWeight: "bold",
  color: "var(--darkgray)",
}));

const Edit: React.FC<EditProps> = ({ isEdit, setEdit }) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editFileName, setEditFileName] = useState<string>("");
  const [sourceReferences, setSourceReferences] = useState<{
    isActive: boolean;
    uploadList: { url: string; description: string }[];
  }>({
    isActive: false,
    uploadList: [],
  });
  const [newUrl, setNewUrl] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editorContent, setEditorContent] = useState("");

  const handleClose = () => {
    setEdit(!isEdit);
  };

  const handleUploadClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*,application/pdf";

    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement | null;
      if (target?.files?.[0]) {
        const file = target.files[0];
        setUploadedFiles([file, ...uploadedFiles]);
      }
    };

    fileInput.click();
  };

  const handleLinkClick = () => {
    setSourceReferences({ ...sourceReferences, isActive: true });
  };
  const handleEditClick = (index: number) => {
    setEditIndex(index);
    setEditFileName(uploadedFiles[index].name);
  };

  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditFileName(event.target.value);
  };

  const handleEditSave = () => {
    if (editIndex !== null) {
      const updatedFiles = [...uploadedFiles];
      const fileToEdit = updatedFiles[editIndex];
      const renamedFile = new File([fileToEdit], editFileName, {
        type: fileToEdit.type,
      });

      updatedFiles[editIndex] = renamedFile;
      setUploadedFiles(updatedFiles);
      setEditIndex(null);
      setEditFileName("");
    }
  };

  const handleEditCancel = () => {
    setEditIndex(null);
    setEditFileName("");
  };

  const handleDeleteClick = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
  };

  const handleAddingLink = (url: string, description: string) => {
    setSourceReferences((prev) => ({
      ...prev,
      isActive: false,
      uploadList: [...prev.uploadList, { url: url, description: description }],
    }));
    setNewUrl("");
    setNewDescription("");
  };

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  return (
    <CustomModalHeader
      isOpen={isEdit}
      handleClose={handleClose}
      title="Eis verwijderen"
    >
      <Grid container spacing={1} sx={{ background: "var(--lightgray)" }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={2} size={{ xs: 12, md: 9 }}>
            <AttachmentsPanel
              handleUploadClick={handleUploadClick}
              handleListSelected={(file) => console.log("Selected file:", file)}
              uploadedFiles={uploadedFiles}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              handleFileNameChange={handleFileNameChange}
              handleEditSave={handleEditSave}
              handleEditCancel={handleEditCancel}
              editIndex={editIndex}
              editFileName={editFileName}
              initialList={initialList}
            />
            <ReferencesPanel
              sourceReferences={sourceReferences}
              handleLinkClick={handleLinkClick}
              setSourceReferences={setSourceReferences}
              handleAddingLink={handleAddingLink}
              newUrl={newUrl}
              newDescription={newDescription}
              setNewDescription={setNewDescription}
              setNewUrl={setNewUrl}
              initialList={initialList}
            />
          </Grid>

          <StyledHeadings sx={{ paddingLeft: "10px" }}>Hardheid</StyledHeadings>
          <FormControl
            fullWidth
            margin="none"
            sx={{ padding: "10px 0px 10px 10px", background: "var(--white)" }}
          >
            <Select sx={{ width: "200px" }} size="small">
              <MenuItem value="Richtlijn">Richtlijn</MenuItem>
              <MenuItem value="Verplicht">Verplicht</MenuItem>
            </Select>
          </FormControl>
          <StyledHeadings sx={{ padding: "20px 0px 0px 10px" }}>
            Omschrijving
          </StyledHeadings>
          <Box sx={{ height: "150px", paddingRight: 1 }}>
            <ReactQuill
              style={{ height: "150px", width: "100%", padding: "8px 10px" }}
              value={editorContent}
              className="custom-quill"
              onChange={handleEditorChange}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 8,
              mb: 5,
              justifyContent: "flex-end",
            }}
          >
            <PrimaryButton theme="dark" label="Wijzigingen opslaan" />
            <PrimaryButton
              theme="dark"
              label="Wijzigingen doorsturen voor publicatie"
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <LocationPanel rows={rows} />
        </Grid>
      </Grid>
    </CustomModalHeader>
  );
};

export default Edit;
