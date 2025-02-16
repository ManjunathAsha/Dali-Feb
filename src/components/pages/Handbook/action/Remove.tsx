import { Box, styled, Typography } from "@mui/material";
import ReactQuill from "react-quill";
import { useState } from "react";
import CustomModalHeader from "../../../utils/CustomModalHeader";
import PrimaryButton from "../../../utils/PrimaryButton";

interface RemoveProps {
  isDelete: boolean;
  setDelete: (value: boolean) => void;
}

const StyledHeadings = styled(Typography)({
  padding: "8px 12px",
  background: "var(--lightgray)",
  fontWeight: "bold",
  color: "var(--darkgray)",
});

function Remove({ isDelete, setDelete }: RemoveProps) {
  const [editorContent, setEditorContent] = useState("");

  const handleClose = () => {
    setDelete(!isDelete);
  };

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  return (
    <CustomModalHeader
      isOpen={isDelete}
      handleClose={handleClose}
      title="Eis verwijderen"
    >
      <StyledHeadings>Informatie</StyledHeadings>
      <Typography sx={{ p: "0px 15px" }}>
        U staat op het punt om de geselecteerde eis door te sturen voor
        verwijdering bij de volgende publicatie. Geef hieronder aan wat hiervoor
        de reden is.
      </Typography>
      <StyledHeadings>Bericht</StyledHeadings>
      <Box sx={{ height: "400px", p: 2 }}>
        <ReactQuill
          style={{ height: "300px", width: "100%" }}
          value={editorContent}
          className="custom-quill"
          onChange={handleEditorChange}
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <PrimaryButton label="Verzoek tot verwijderen indienen" theme="dark" />
      </Box>
    </CustomModalHeader>
  );
}

export default Remove;
