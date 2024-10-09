import { useState } from "react";
import { Box, styled, Typography } from "@mui/material";
import ReactQuill from "react-quill";
import Grid from "@mui/material/Grid2";
import LocationPanel from "../common/LocationPanel";
import CustomModalHeader from "../../../utils/CustomModalHeader";
import PrimaryButton from "../../../utils/PrimaryButton";

const rows = [
  { label: "Hoofdstuk", value: "Planproces" },
  { label: "Niveau", value: "Stedenbouwkundig niveau" },
  { label: "Woonkern", value: "Alle kernen" },
  { label: "Gebied", value: "Alle gebieden" },
  { label: "Onderwerp", value: "Fase Inrichtingsplan" },
  { label: "Subonderwerp", value: "Beheerplan" },
];

interface ShareProps {
  isShare: boolean;
  setShare: (value: boolean) => void;
}

const StyledHeadings = styled(Typography)({
  padding: "8px 12px",
  background: "var(--lightgray)",
  fontWeight: "bold",
  color: "var(--darkgray)",
});

function Share({ isShare, setShare }: ShareProps) {
  const [editorContent, setEditorContent] = useState("");

  const handleClose = () => {
    setShare(!isShare);
  };

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  return (
    <CustomModalHeader
      isOpen={isShare}
      handleClose={handleClose}
      title="Eis verwijderen"
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <StyledHeadings>Informatie</StyledHeadings>
          <Typography sx={{ p: "0px 15px" }}>
            U staat op het punt om de geselecteerde eis door te sturen voor
            verwijdering bij de volgende publicatie. Geef hieronder aan wat
            hiervoor de reden is.
          </Typography>
          <StyledHeadings>Bericht</StyledHeadings>
          <Box sx={{ height: "350px", p: 2 }}>
            <ReactQuill
              style={{ height: "300px", width: "100%" }}
              value={editorContent}
              className="custom-quill"
              onChange={handleEditorChange}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
            <PrimaryButton label="Versturen en laten publiceren" theme="dark" />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <LocationPanel rows={rows} />
        </Grid>
      </Grid>
    </CustomModalHeader>
  );
}

export default Share;
